/**
 * 数据导出模块
 * 实现交易数据的导出功能
 */

class DataExport {
  /**
   * 导出交易历史为CSV格式
   * @param {Array} tradeHistory - 交易历史数据
   * @param {string} userId - 用户ID
   * @returns {string} CSV格式的数据
   */
  exportTradeHistoryToCSV(tradeHistory, userId) {
    // CSV头部
    let csvContent = '订单ID,交易品种,交易方向,交易数量,交易价格,交易时间,订单状态\n';
    
    // 添加数据行
    tradeHistory.forEach(trade => {
      csvContent += `${trade.order_id || trade.id},${trade.symbol || trade.asset},${trade.direction || trade.type},${trade.amount || trade.quantity},${trade.price},${trade.order_time || trade.timestamp},${trade.status}\n`;
    });
    
    return csvContent;
  }

  /**
   * 导出持仓数据为CSV格式
   * @param {Array} positions - 持仓数据
   * @param {string} userId - 用户ID
   * @returns {string} CSV格式的数据
   */
  exportPositionsToCSV(positions, userId) {
    // CSV头部
    let csvContent = '交易品种,持仓方向,持仓数量,平均价格,当前价格,浮动盈亏,盈亏比例(%)\n';
    
    // 添加数据行
    positions.forEach(position => {
      csvContent += `${position.symbol},${position.direction},${position.total_amount || position.amount},${position.avg_price},${position.current_price},${position.floating_profit || 0},${position.profit_percent || 0}\n`;
    });
    
    return csvContent;
  }

  /**
   * 导出账户资金明细为CSV格式
   * @param {Array} transactions - 资金明细数据
   * @param {string} userId - 用户ID
   * @returns {string} CSV格式的数据
   */
  exportAccountTransactionsToCSV(transactions, userId) {
    // CSV头部
    let csvContent = '时间,类型,金额,余额,描述\n';
    
    // 添加数据行
    transactions.forEach(transaction => {
      csvContent += `${transaction.timestamp},${transaction.type},${transaction.amount},${transaction.balance},${transaction.description || ''}\n`;
    });
    
    return csvContent;
  }

  /**
   * 导出数据为JSON格式
   * @param {Object} data - 要导出的数据
   * @param {string} dataType - 数据类型
   * @returns {string} JSON格式的数据
   */
  exportToJSON(data, dataType) {
    return JSON.stringify({
      dataType: dataType,
      exportTime: new Date().toISOString(),
      data: data
    }, null, 2);
  }

  /**
   * 导出数据为Excel格式（简化版本，实际项目中可能需要使用专门的库如xlsx）
   * @param {Array} data - 要导出的数据
   * @param {Array} headers - 表头
   * @param {string} sheetName - 工作表名称
   * @returns {string} 简化的Excel格式数据
   */
  exportToExcel(data, headers, sheetName = 'Sheet1') {
    // 这里是一个简化的Excel导出实现
    // 实际项目中建议使用xlsx等专业库
    
    let excelContent = `${sheetName}\n`;
    
    // 添加表头
    excelContent += headers.join('\t') + '\n';
    
    // 添加数据行
    data.forEach(row => {
      const rowValues = headers.map(header => {
        // 处理嵌套对象属性
        if (header.includes('.')) {
          const parts = header.split('.');
          let value = row;
          for (const part of parts) {
            value = value ? value[part] : '';
          }
          return value;
        }
        return row[header] || '';
      });
      excelContent += rowValues.join('\t') + '\n';
    });
    
    return excelContent;
  }

  /**
   * 生成导出文件名
   * @param {string} userId - 用户ID
   * @param {string} dataType - 数据类型
   * @param {string} format - 文件格式
   * @returns {string} 文件名
   */
  generateExportFileName(userId, dataType, format) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    return `trade_data_${userId}_${dataType}_${timestamp}.${format}`;
  }
}

module.exports = DataExport;