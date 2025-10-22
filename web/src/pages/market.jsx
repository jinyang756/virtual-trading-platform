import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import MarketFilter from '../components/MarketFilter';
import Loading from '../components/Loading';
import MarketList from '../components/MarketList';
import MarketChart from '../components/MarketChart';

export default function MarketPage() {
  const [type, setType] = useState('基金');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 获取数据
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 根据类型确定API端点
      let endpoint = '';
      switch(type) {
        case '基金':
          endpoint = '/api/funds';
          break;
        case '合约':
          endpoint = '/api/contracts';
          break;
        case '期权':
          endpoint = '/api/options';
          break;
        default:
          endpoint = '/api/funds';
      }
      
      // 调用API获取数据
      const response = await axios.get(endpoint);
      setData(response.data);
    } catch (error) {
      console.error('获取数据失败:', error);
      // 如果API调用失败，使用模拟数据
      let mockData = [];
      switch(type) {
        case '基金':
          mockData = [
            { id: '1', name: '全球增长基金', nav: 12.34, changePercent: 1.5 },
            { id: '2', name: '医疗保健基金', nav: 10.25, changePercent: -0.4 },
            { id: '3', name: '中国机会基金', nav: 8.90, changePercent: 2.3 },
            { id: '4', name: '科技先锋基金', nav: 15.67, changePercent: 3.2 },
            { id: '5', name: '稳健收益基金', nav: 9.87, changePercent: 0.8 },
            { id: '6', name: '新兴市场基金', nav: 11.56, changePercent: -1.2 }
          ];
          break;
        case '合约':
          mockData = [
            { id: '1', name: 'BTC永续合约', nav: 35000, changePercent: 2.5 },
            { id: '2', name: 'ETH季度合约', nav: 2800, changePercent: -1.8 },
            { id: '3', name: 'BNB合约', nav: 320, changePercent: 0.9 },
            { id: '4', name: 'SOL合约', nav: 120, changePercent: 5.3 }
          ];
          break;
        case '期权':
          mockData = [
            { id: '1', name: 'BTC看涨期权', nav: 1200, changePercent: 3.2 },
            { id: '2', name: 'ETH看跌期权', nav: 80, changePercent: -2.1 },
            { id: '3', name: 'AAPL期权', nav: 150, changePercent: 1.7 },
            { id: '4', name: 'TSLA期权', nav: 220, changePercent: -0.5 }
          ];
          break;
        default:
          mockData = [];
      }
      setData(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  // 当类型改变时获取数据
  useEffect(() => {
    fetchData();
  }, [type]);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-16 md:pb-0">
      <Header title="行情" />

      <main className="flex-1 p-4 space-y-6 mt-16 md:mt-0">
        <MarketFilter type={type} onChange={setType} />
        {isLoading ? <Loading /> : <MarketList data={data} />}
        <MarketChart data={data} />
      </main>

      <TabBar />
    </div>
  );
}