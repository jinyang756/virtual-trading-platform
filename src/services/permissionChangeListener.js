/**
 * 权限变更监听器
 * 监听权限系统中的变更事件并触发联动任务流
 */

const PermissionChangeSync = require('../../scripts/permission-change-sync');

class PermissionChangeListener {
  constructor() {
    this.sync = new PermissionChangeSync();
  }

  /**
   * 监听角色权限变更事件
   * @param {object} eventData - 事件数据
   */
  async onRolePermissionUpdated(eventData) {
    console.log('🔍 检测到角色权限变更事件:', eventData);
    
    try {
      // 触发权限变更联动任务流
      await this.sync.executeTaskFlow(eventData);
      
      console.log('✅ 角色权限变更处理完成');
    } catch (error) {
      console.error('❌ 处理角色权限变更事件失败:', error.message);
    }
  }

  /**
   * 监听用户角色变更事件
   * @param {object} eventData - 事件数据
   */
  async onUserRoleUpdated(eventData) {
    console.log('🔍 检测到用户角色变更事件:', eventData);
    
    try {
      // 可以在这里添加用户角色变更的特殊处理逻辑
      // 例如：清除用户权限缓存、发送通知等
      
      console.log('✅ 用户角色变更处理完成');
    } catch (error) {
      console.error('❌ 处理用户角色变更事件失败:', error.message);
    }
  }

  /**
   * 监听权限创建事件
   * @param {object} eventData - 事件数据
   */
  async onPermissionCreated(eventData) {
    console.log('🔍 检测到权限创建事件:', eventData);
    
    try {
      // 可以在这里添加权限创建的特殊处理逻辑
      // 例如：更新权限文档、发送通知等
      
      console.log('✅ 权限创建处理完成');
    } catch (error) {
      console.error('❌ 处理权限创建事件失败:', error.message);
    }
  }

  /**
   * 监听角色创建事件
   * @param {object} eventData - 事件数据
   */
  async onRoleCreated(eventData) {
    console.log('🔍 检测到角色创建事件:', eventData);
    
    try {
      // 可以在这里添加角色创建的特殊处理逻辑
      // 例如：初始化角色权限、发送通知等
      
      console.log('✅ 角色创建处理完成');
    } catch (error) {
      console.error('❌ 处理角色创建事件失败:', error.message);
    }
  }
}

// 导出单例实例
module.exports = new PermissionChangeListener();