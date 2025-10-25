import React, { useState, useEffect } from 'react';
import { Header, TabBar } from '../components/ui';

const ContractCard = ({ contract, onViewChart, onViewOrderbook }) => {
  const getContractName = (symbol) => {
    const names = {
      "SH_FUTURE": "聚财基金上海合约",
      "HK_FUTURE": "聚财基金香港合约",
      "NY_FUTURE": "聚财基金纽约合约",
      "OIL_FUTURE": "原油期货合约",
      "GOLD_FUTURE": "黄金期货合约"
    };
    return names[symbol] || symbol;
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm" data-symbol={contract.symbol}>
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-lg text-blue-600">{getContractName(contract.symbol)}</div>
        <div className="text-red-500 font-bold text-lg">{contract.price.toFixed(2)}</div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <div>杠杆: {contract.leverage}倍</div>
        <div className={contract.change >= 0 ? 'text-green-500' : 'text-red-500'}>
          {contract.change >= 0 ? '+' : ''}{contract.change.toFixed(2)}%
        </div>
      </div>
      <div className="flex justify-between mt-3">
        <button 
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          onClick={() => onViewChart(contract.symbol)}
        >
          K线图
        </button>
        <button 
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
          onClick={() => onViewOrderbook(contract.symbol)}
        >
          买卖盘
        </button>
      </div>
    </div>
  );
};

const ContractChart = ({ symbol, isOpen, onClose, interval, setInterval }) => {
  const getContractName = (symbol) => {
    const names = {
      "SH_FUTURE": "聚财基金上海合约",
      "HK_FUTURE": "聚财基金香港合约",
      "NY_FUTURE": "聚财基金纽约合约",
      "OIL_FUTURE": "原油期货合约",
      "GOLD_FUTURE": "黄金期货合约"
    };
    return names[symbol] || symbol;
  };

  // 模拟K线数据
  const generateMockKlineData = () => {
    const data = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      const price = 1000 + Math.random() * 100;
      data.push({
        timestamp: time.toLocaleDateString(),
        price: price
      });
    }
    return data;
  };

  const klineData = generateMockKlineData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{getContractName(symbol)} - K线图</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">&times;</button>
        </div>
        
        <div className="flex justify-center mb-4">
          {['1d', '1h', '15m', '5m'].map((intervalOption) => (
            <button
              key={intervalOption}
              className={`px-3 py-1 mx-1 rounded text-sm ${
                interval === intervalOption 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setInterval(intervalOption)}
            >
              {intervalOption === '1d' ? '日线' : 
               intervalOption === '1h' ? '1小时' : 
               intervalOption === '15m' ? '15分钟' : '5分钟'}
            </button>
          ))}
        </div>
        
        <div className="h-64 bg-gray-100 rounded mb-4 flex items-center justify-center">
          {/* 这里应该是ECharts图表容器 */}
          <div>K线图表区域</div>
        </div>
        
        <div className="text-sm max-h-32 overflow-y-auto">
          {klineData.map((item, index) => (
            <div key={index} className="flex justify-between py-1 border-b">
              <span>{item.timestamp}</span>
              <span>{item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-4"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
};

const Orderbook = ({ symbol, isOpen, onClose }) => {
  const getContractName = (symbol) => {
    const names = {
      "SH_FUTURE": "聚财基金上海合约",
      "HK_FUTURE": "聚财基金香港合约",
      "NY_FUTURE": "聚财基金纽约合约",
      "OIL_FUTURE": "原油期货合约",
      "GOLD_FUTURE": "黄金期货合约"
    };
    return names[symbol] || symbol;
  };

  // 生成模拟买卖盘数据
  const generateMockOrderbook = () => {
    const lastPrice = 1000 + Math.random() * 100;
    const spread = 0.5 + Math.random() * 2;
    
    const asks = [];
    const bids = [];
    
    for (let i = 0; i < 5; i++) {
      asks.push({
        price: lastPrice + spread * (i + 1),
        volume: Math.floor(Math.random() * 100) + 1
      });
      
      bids.push({
        price: lastPrice - spread * (i + 1),
        volume: Math.floor(Math.random() * 100) + 1
      });
    }
    
    return {
      lastPrice: lastPrice,
      asks: asks.reverse(), // 卖盘按价格从高到低排列
      bids: bids // 买盘按价格从高到低排列
    };
  };

  const orderbookData = generateMockOrderbook();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{getContractName(symbol)} - 五档行情</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">&times;</button>
        </div>
        
        <div className="space-y-1">
          {orderbookData.asks.map((ask, index) => (
            <div key={`ask-${index}`} className="flex justify-between py-1 text-sm">
              <div>卖{5 - index}</div>
              <div className="text-red-500 font-medium">{ask.price.toFixed(2)}</div>
              <div>{ask.volume}</div>
            </div>
          ))}
          
          <div className="flex justify-between py-2 font-bold border-y text-center">
            <div>最新价</div>
            <div>{orderbookData.lastPrice.toFixed(2)}</div>
            <div></div>
          </div>
          
          {orderbookData.bids.map((bid, index) => (
            <div key={`bid-${index}`} className="flex justify-between py-1 text-sm">
              <div>买{index + 1}</div>
              <div className="text-green-500 font-medium">{bid.price.toFixed(2)}</div>
              <div>{bid.volume}</div>
            </div>
          ))}
        </div>
        
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-4"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
};

// 模拟API hook
const useContractList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 模拟API调用
        setTimeout(() => {
          const mockData = [
            { symbol: "SH_FUTURE", name: "聚财基金上海合约", price: 1050.25, leverage: 10, change: 2.5 },
            { symbol: "HK_FUTURE", name: "聚财基金香港合约", price: 980.75, leverage: 20, change: -1.2 },
            { symbol: "NY_FUTURE", name: "聚财基金纽约合约", price: 1200.50, leverage: 15, change: 0.8 },
            { symbol: "OIL_FUTURE", name: "原油期货合约", price: 85.30, leverage: 50, change: 3.1 },
            { symbol: "GOLD_FUTURE", name: "黄金期货合约", price: 1850.75, leverage: 25, change: -0.5 }
          ];
          setData(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return { data, isLoading, isError };
};

export default function ContractMarketPage() {
  const { data: contracts, isLoading, isError } = useContractList();
  const [selectedContract, setSelectedContract] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [showOrderbook, setShowOrderbook] = useState(false);
  const [interval, setInterval] = useState('1d');

  const handleViewChart = (symbol) => {
    setSelectedContract(symbol);
    setShowChart(true);
    setShowOrderbook(false);
  };

  const handleViewOrderbook = (symbol) => {
    setSelectedContract(symbol);
    setShowOrderbook(true);
    setShowChart(false);
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
        <Header title="合约行情" />
        <main className="flex-1 p-4 mt-16">
          <div className="text-red-500 text-center py-8">加载合约数据失败</div>
        </main>
        <TabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      <Header title="合约行情" />
      
      <main className="flex-1 p-4 mt-16">
        {isLoading ? (
          <div className="text-center py-8">加载中...</div>
        ) : contracts && contracts.length > 0 ? (
          <div>
            {contracts.map(contract => (
              <ContractCard 
                key={contract.symbol}
                contract={contract}
                onViewChart={handleViewChart}
                onViewOrderbook={handleViewOrderbook}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">暂无合约数据</div>
        )}
      </main>

      <ContractChart 
        symbol={selectedContract}
        isOpen={showChart}
        onClose={() => setShowChart(false)}
        interval={interval}
        setInterval={setInterval}
      />

      <Orderbook 
        symbol={selectedContract}
        isOpen={showOrderbook}
        onClose={() => setShowOrderbook(false)}
      />

      <TabBar />
    </div>
  );
}