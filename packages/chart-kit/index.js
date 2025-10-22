// 图表组件包
class ChartKit {
  /**
   * 创建K线图配置
   * @param {Array} data - 图表数据
   * @param {Object} options - 图表选项
   * @returns {Object} ECharts配置对象
   */
  static createKLineChart(data, options = {}) {
    const defaultOptions = {
      title: 'K线图',
      showArea: true,
      color: '#165DFF' // 合约主题色
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return {
      title: {
        text: mergedOptions.title,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const date = params[0].axisValue;
          const price = params[0].data;
          return `${date}<br/>价格: ${price.toFixed(2)}`;
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.date || item.time)
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: function (value) {
            return value.toFixed(2);
          }
        }
      },
      series: [{
        name: '价格',
        type: 'line',
        data: data.map(item => item.price || item.value),
        smooth: true,
        lineStyle: {
          color: mergedOptions.color
        },
        itemStyle: {
          color: mergedOptions.color
        },
        areaStyle: mergedOptions.showArea ? {
          color: `${mergedOptions.color}20` // 添加透明度
        } : undefined
      }]
    };
  }

  /**
   * 创建波动率图表配置
   * @param {Array} data - 图表数据
   * @param {Object} options - 图表选项
   * @returns {Object} ECharts配置对象
   */
  static createVolatilityChart(data, options = {}) {
    const defaultOptions = {
      title: '波动率图表',
      color: '#FF7D00' // 期权主题色
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return {
      title: {
        text: mergedOptions.title,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const time = params[0].axisValue;
          const volatility = params[0].data;
          return `${time}<br/>波动率: ${volatility.toFixed(2)}%`;
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.time)
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function (value) {
            return value.toFixed(1) + '%';
          }
        }
      },
      series: [{
        name: '隐含波动率',
        type: 'line',
        data: data.map(item => item.volatility),
        smooth: true,
        lineStyle: {
          color: mergedOptions.color
        },
        itemStyle: {
          color: mergedOptions.color
        },
        areaStyle: {
          color: `${mergedOptions.color}20` // 添加透明度
        }
      }]
    };
  }

  /**
   * 创建T型报价表数据
   * @param {Array} data - 报价数据
   * @returns {Array} 格式化后的表格数据
   */
  static createOptionMatrixData(data) {
    return data.map(row => ({
      strikePrice: row.strikePrice,
      callPrice: row.callPrice,
      putPrice: row.putPrice,
      callVolume: row.callVolume,
      putVolume: row.putVolume
    }));
  }
}

module.exports = ChartKit;