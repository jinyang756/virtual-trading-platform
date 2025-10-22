// 通用UI组件包
class UIComponents {
  /**
   * 创建按钮组件
   * @param {string} text - 按钮文本
   * @param {Object} options - 按钮选项
   * @returns {string} HTML字符串
   */
  static createButton(text, options = {}) {
    const defaultOptions = {
      type: 'button',
      className: 'btn',
      color: 'primary'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    const colorClass = `btn-${mergedOptions.color}`;
    
    return `<button type="${mergedOptions.type}" class="${mergedOptions.className} ${colorClass}">${text}</button>`;
  }

  /**
   * 创建卡片组件
   * @param {string} title - 卡片标题
   * @param {string} content - 卡片内容
   * @param {Object} options - 卡片选项
   * @returns {string} HTML字符串
   */
  static createCard(title, content, options = {}) {
    const defaultOptions = {
      className: 'card'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return `
      <div class="${mergedOptions.className}">
        <div class="card-header">
          <h2>${title}</h2>
        </div>
        <div class="card-body">
          ${content}
        </div>
      </div>
    `;
  }

  /**
   * 创建行情卡片组件
   * @param {Object} marketData - 行情数据
   * @param {Object} options - 组件选项
   * @returns {string} HTML字符串
   */
  static createMarketCard(marketData, options = {}) {
    const defaultOptions = {
      className: 'market-card',
      showChange: true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    const changeClass = marketData.change >= 0 ? 'positive' : 'negative';
    const changeText = marketData.change >= 0 ? `+${marketData.change.toFixed(2)}` : marketData.change.toFixed(2);
    
    return `
      <div class="${mergedOptions.className}">
        <div class="market-header">
          <div class="market-name">${marketData.name}</div>
          <div class="market-price">${marketData.price.toFixed(2)}</div>
        </div>
        ${mergedOptions.showChange ? `
          <div class="market-details">
            <div>杠杆: ${marketData.leverage}倍</div>
            <div class="market-change ${changeClass}">${changeText}%</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * 创建加载指示器
   * @param {Object} options - 选项
   * @returns {string} HTML字符串
   */
  static createLoadingIndicator(options = {}) {
    const defaultOptions = {
      text: '加载中...',
      className: 'loading'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return `<div class="${mergedOptions.className}">${mergedOptions.text}</div>`;
  }

  /**
   * 创建错误提示
   * @param {string} message - 错误消息
   * @param {Object} options - 选项
   * @returns {string} HTML字符串
   */
  static createErrorAlert(message, options = {}) {
    const defaultOptions = {
      className: 'error'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return `<div class="${mergedOptions.className}">${message}</div>`;
  }
}

module.exports = UIComponents;