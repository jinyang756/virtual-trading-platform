/**
 * 市场趋势预测模型
 */

const { executeQuery } = require('../database/connection');

class MarketPrediction {
  // 基于移动平均线的简单趋势预测
  static async movingAveragePrediction(symbol, periods = [5, 10, 20]) {
    const query = `
      SELECT 
        timestamp,
        price
      FROM market_data 
      WHERE symbol = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `;
    
    try {
      const results = await executeQuery(query, [symbol, Math.max(...periods)]);
      
      if (results.length < Math.max(...periods)) {
        return {
          trend: 'insufficient_data',
          confidence: 0,
          prediction: '数据不足'
        };
      }
      
      // 计算各周期移动平均线
      const mas = {};
      for (const period of periods) {
        const prices = results.slice(0, period).map(r => r.price);
        mas[period] = prices.reduce((sum, price) => sum + price, 0) / period;
      }
      
      // 简单趋势判断
      let trend = 'neutral';
      let confidence = 0;
      let prediction = '';
      
      if (mas[5] > mas[10] && mas[10] > mas[20]) {
        trend = 'bullish';
        confidence = 0.7;
        prediction = '看涨趋势';
      } else if (mas[5] < mas[10] && mas[10] < mas[20]) {
        trend = 'bearish';
        confidence = 0.7;
        prediction = '看跌趋势';
      } else {
        trend = 'neutral';
        confidence = 0.3;
        prediction = '震荡趋势';
      }
      
      return {
        trend: trend,
        confidence: parseFloat(confidence.toFixed(2)),
        prediction: prediction,
        moving_averages: mas
      };
    } catch (error) {
      throw error;
    }
  }

  // 基于RSI的超买超卖预测
  static async rsiPrediction(symbol, period = 14) {
    const query = `
      SELECT 
        timestamp,
        price
      FROM market_data 
      WHERE symbol = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `;
    
    try {
      const results = await executeQuery(query, [symbol, period + 1]);
      
      if (results.length < period + 1) {
        return {
          rsi: null,
          signal: 'insufficient_data',
          prediction: '数据不足'
        };
      }
      
      // 计算价格变化
      const changes = [];
      for (let i = 0; i < period; i++) {
        const change = results[i].price - results[i + 1].price;
        changes.push(change);
      }
      
      // 计算平均涨幅和跌幅
      const gains = changes.filter(change => change > 0);
      const losses = changes.filter(change => change < 0).map(loss => Math.abs(loss));
      
      const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period;
      const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period;
      
      // 计算RSI
      if (avgLoss === 0) {
        return {
          rsi: 100,
          signal: 'overbought',
          prediction: '超买'
        };
      }
      
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      
      // RSI信号判断
      let signal = 'neutral';
      let prediction = '';
      
      if (rsi > 70) {
        signal = 'overbought';
        prediction = '超买，可能回调';
      } else if (rsi < 30) {
        signal = 'oversold';
        prediction = '超卖，可能反弹';
      } else {
        signal = 'neutral';
        prediction = '正常区间';
      }
      
      return {
        rsi: parseFloat(rsi.toFixed(2)),
        signal: signal,
        prediction: prediction
      };
    } catch (error) {
      throw error;
    }
  }

  // 获取资产价格波动率
  static async getPriceVolatility(symbol, days = 30) {
    const query = `
      SELECT 
        price
      FROM market_data 
      WHERE symbol = ? 
      ORDER BY timestamp DESC
      LIMIT ?
    `;
    
    try {
      const results = await executeQuery(query, [symbol, days]);
      
      if (results.length < 2) {
        return {
          volatility: 0,
          annualized_volatility: 0
        };
      }
      
      // 计算收益率
      const returns = [];
      for (let i = 0; i < results.length - 1; i++) {
        const returnRate = (results[i].price - results[i + 1].price) / results[i + 1].price;
        returns.push(returnRate);
      }
      
      // 计算平均收益率
      const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
      
      // 计算方差
      const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
      
      // 计算波动率
      const volatility = Math.sqrt(variance);
      const annualizedVolatility = volatility * Math.sqrt(252); // 年化波动率
      
      return {
        volatility: parseFloat(volatility.toFixed(4)),
        annualized_volatility: parseFloat(annualizedVolatility.toFixed(4))
      };
    } catch (error) {
      throw error;
    }
  }

  // 综合预测分析
  static async getComprehensivePrediction(symbol) {
    try {
      const maPrediction = await this.movingAveragePrediction(symbol);
      const rsiPrediction = await this.rsiPrediction(symbol);
      const volatility = await this.getPriceVolatility(symbol);
      
      // 综合信号
      let overallSignal = 'neutral';
      let confidence = 0;
      let recommendation = '';
      
      // 基于多个指标的综合判断
      if (maPrediction.trend === 'bullish' && rsiPrediction.signal !== 'overbought') {
        overallSignal = 'buy';
        confidence = 0.7;
        recommendation = '建议买入';
      } else if (maPrediction.trend === 'bearish' && rsiPrediction.signal !== 'oversold') {
        overallSignal = 'sell';
        confidence = 0.7;
        recommendation = '建议卖出';
      } else {
        overallSignal = 'hold';
        confidence = 0.4;
        recommendation = '建议持有';
      }
      
      return {
        symbol: symbol,
        timestamp: new Date(),
        moving_average: maPrediction,
        rsi: rsiPrediction,
        volatility: volatility,
        overall_signal: overallSignal,
        confidence: parseFloat(confidence.toFixed(2)),
        recommendation: recommendation
      };
    } catch (error) {
      throw error;
    }
  }

  // 获取多个资产的预测对比
  static async getPredictionComparison(symbols) {
    const predictions = [];
    
    for (const symbol of symbols) {
      try {
        const prediction = await this.getComprehensivePrediction(symbol);
        predictions.push(prediction);
      } catch (error) {
        console.error(`获取${symbol}预测失败:`, error.message);
      }
    }
    
    // 按置信度排序
    predictions.sort((a, b) => b.confidence - a.confidence);
    
    return predictions;
  }
}

module.exports = MarketPrediction;