/**
 * 交易提醒模块
 * 实现交易相关的提醒功能
 */

class TradeAlert {
  constructor() {
    // 存储所有设置的提醒
    this.alerts = new Map();
    // 存储用户的通知设置
    this.userNotifications = new Map();
  }

  /**
   * 设置价格提醒
   * @param {string} userId - 用户ID
   * @param {string} symbol - 交易品种
   * @param {string} alertType - 提醒类型 (priceAbove/priceBelow)
   * @param {number} alertPrice - 提醒价格
   * @param {string} message - 提醒消息
   * @returns {string} 提醒ID
   */
  setPriceAlert(userId, symbol, alertType, alertPrice, message) {
    const alertId = this._generateAlertId();
    const alert = {
      alertId,
      userId,
      symbol,
      alertType,
      alertPrice,
      message,
      status: 'active', // active, triggered, disabled
      createdAt: new Date()
    };
    
    this.alerts.set(alertId, alert);
    return alertId;
  }

  /**
   * 设置持仓盈亏提醒
   * @param {string} userId - 用户ID
   * @param {string} symbol - 交易品种
   * @param {string} direction - 持仓方向
   * @param {number} profitThreshold - 盈利阈值（百分比）
   * @param {number} lossThreshold - 亏损阈值（百分比）
   * @returns {string} 提醒ID
   */
  setPositionAlert(userId, symbol, direction, profitThreshold, lossThreshold) {
    const alertId = this._generateAlertId();
    const alert = {
      alertId,
      userId,
      symbol,
      direction,
      profitThreshold,
      lossThreshold,
      type: 'position',
      status: 'active',
      createdAt: new Date()
    };
    
    this.alerts.set(alertId, alert);
    return alertId;
  }

  /**
   * 检查是否触发价格提醒
   * @param {string} symbol - 交易品种
   * @param {number} currentPrice - 当前价格
   * @returns {Array} 触发的提醒列表
   */
  checkPriceAlerts(symbol, currentPrice) {
    const triggeredAlerts = [];
    
    for (const [alertId, alert] of this.alerts.entries()) {
      if (alert.symbol === symbol && alert.status === 'active' && !alert.type) {
        let shouldTrigger = false;
        
        // 价格高于提醒价格时触发
        if (alert.alertType === 'priceAbove' && currentPrice >= alert.alertPrice) {
          shouldTrigger = true;
        }
        // 价格低于提醒价格时触发
        else if (alert.alertType === 'priceBelow' && currentPrice <= alert.alertPrice) {
          shouldTrigger = true;
        }
        
        if (shouldTrigger) {
          alert.status = 'triggered';
          triggeredAlerts.push({ ...alert });
          
          // 发送通知
          this._sendNotification(alert.userId, alert.message);
        }
      }
    }
    
    return triggeredAlerts;
  }

  /**
   * 检查是否触发持仓提醒
   * @param {string} userId - 用户ID
   * @param {string} symbol - 交易品种
   * @param {string} direction - 持仓方向
   * @param {number} entryPrice - 入场价格
   * @param {number} currentPrice - 当前价格
   * @returns {Array} 触发的提醒列表
   */
  checkPositionAlerts(userId, symbol, direction, entryPrice, currentPrice) {
    const triggeredAlerts = [];
    
    for (const [alertId, alert] of this.alerts.entries()) {
      if (alert.userId === userId && 
          alert.symbol === symbol && 
          alert.direction === direction && 
          alert.type === 'position' && 
          alert.status === 'active') {
        
        let shouldTrigger = false;
        let profitPercent = 0;
        let message = '';
        
        // 计算盈亏百分比
        if (direction === 'buy') {
          profitPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
        } else {
          profitPercent = ((entryPrice - currentPrice) / entryPrice) * 100;
        }
        
        // 检查是否达到盈利阈值
        if (profitPercent >= alert.profitThreshold) {
          shouldTrigger = true;
          message = `持仓盈利达到${profitPercent.toFixed(2)}%，已超过设定阈值${alert.profitThreshold}%`;
        }
        // 检查是否达到亏损阈值
        else if (profitPercent <= -Math.abs(alert.lossThreshold)) {
          shouldTrigger = true;
          message = `持仓亏损达到${Math.abs(profitPercent).toFixed(2)}%，已超过设定阈值${alert.lossThreshold}%`;
        }
        
        if (shouldTrigger) {
          alert.status = 'triggered';
          triggeredAlerts.push({ ...alert, profitPercent });
          
          // 发送通知
          this._sendNotification(userId, message);
        }
      }
    }
    
    return triggeredAlerts;
  }

  /**
   * 获取用户的所有提醒
   * @param {string} userId - 用户ID
   * @returns {Array} 提醒列表
   */
  getUserAlerts(userId) {
    const userAlerts = [];
    
    for (const alert of this.alerts.values()) {
      if (alert.userId === userId) {
        userAlerts.push({ ...alert });
      }
    }
    
    return userAlerts;
  }

  /**
   * 禁用提醒
   * @param {string} alertId - 提醒ID
   * @returns {boolean} 是否成功禁用
   */
  disableAlert(alertId) {
    const alert = this.alerts.get(alertId);
    if (!alert) {
      return false;
    }
    
    alert.status = 'disabled';
    return true;
  }

  /**
   * 设置用户通知偏好
   * @param {string} userId - 用户ID
   * @param {Object} preferences - 通知偏好设置
   */
  setUserNotificationPreferences(userId, preferences) {
    this.userNotifications.set(userId, {
      email: preferences.email || false,
      sms: preferences.sms || false,
      push: preferences.push || true, // 默认开启推送通知
      updatedAt: new Date()
    });
  }

  /**
   * 获取用户通知偏好
   * @param {string} userId - 用户ID
   * @returns {Object} 通知偏好设置
   */
  getUserNotificationPreferences(userId) {
    return this.userNotifications.get(userId) || {
      email: false,
      sms: false,
      push: true
    };
  }

  /**
   * 发送通知
   * @param {string} userId - 用户ID
   * @param {string} message - 通知消息
   */
  _sendNotification(userId, message) {
    const preferences = this.getUserNotificationPreferences(userId);
    
    // 这里应该集成实际的通知服务
    console.log(`[通知] 用户${userId}: ${message}`);
    
    // 如果用户开启了推送通知
    if (preferences.push) {
      // 实际项目中这里会调用推送通知服务
      console.log(`[推送通知] 发送给用户${userId}: ${message}`);
    }
    
    // 如果用户开启了邮件通知
    if (preferences.email) {
      // 实际项目中这里会调用邮件服务
      console.log(`[邮件通知] 发送给用户${userId}: ${message}`);
    }
    
    // 如果用户开启了短信通知
    if (preferences.sms) {
      // 实际项目中这里会调用短信服务
      console.log(`[短信通知] 发送给用户${userId}: ${message}`);
    }
  }

  /**
   * 生成提醒ID
   * @returns {string} 提醒ID
   */
  _generateAlertId() {
    return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = TradeAlert;