import React, { useState } from 'react';
import { Header, TabBar } from '../components/ui';

const OptionCard = ({ option, onViewVolatility, onViewMatrix, onViewGreeks }) => {
  const getOptionName = (id) => {
    const names = {
      "BTC_OPTION": "比特币期权",
      "ETH_OPTION": "以太坊期权",
      "AAPL_OPTION": "苹果期权",
      "GOOGL_OPTION": "谷歌期权"
    };
    return names[id] || id;
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm" data-symbol={option.id}>
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-lg text-orange-500">{getOptionName(option.id)}</div>
        <div className="text-red-500 font-bold text-lg">{option.currentPrice.toFixed(2)}</div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <div>到期日: {option.expiryDate}</div>
        <div>行权价: {option.strikePrice.toFixed(2)}</div>
      </div>
      <div className="flex justify-between mt-3 space-x-2">
        <button 
          className="bg-orange-500 text-white px-2 py-1 rounded text-sm flex-1"
          onClick={() => onViewVolatility(option.id)}
        >
          波动率
        </button>
        <button 
          className="bg-gray-500 text-white px-2 py-1 rounded text-sm flex-1"
          onClick={() => onViewMatrix(option.id)}
        >
          报价表
        </button>
        <button 
          className="bg-gray-500 text-white px-2 py-1 rounded text-sm flex-1"
          onClick={() => onViewGreeks(option.id)}
        >
          希腊值
        </button>
      </div>
    </div>
  );
};

const VolatilityChart = ({ symbol, isOpen, onClose, cycle, setCycle }) => {
  const getOptionName = (id) => {
    const names = {
      "BTC_OPTION": "比特币期权",
      "ETH_OPTION": "以太坊期权",
      "AAPL_OPTION": "苹果期权",
      "GOOGL_OPTION": "谷歌期权"
    };
    return names[id] || id;
  };

  // 生成模拟波动率数据
  const generateMockVolatilityData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // 每分钟一个点
      const volatility = 20 + Math.random() * 10; // 20-30%的波动率
      
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        volatility: volatility
      });
    }
    
    return data;
  };

  const volatilityData = generateMockVolatilityData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{getOptionName(symbol)} - 隐含波动率</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">&times;</button>
        </div>
        
        <div className="flex justify-center mb-4">
          {['1m', '5m', '10m'].map((cycleOption) => (
            <button
              key={cycleOption}
              className={`px-3 py-1 mx-1 rounded text-sm ${
                cycle === cycleOption 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setCycle(cycleOption)}
            >
              {cycleOption === '1m' ? '1分钟' : 
               cycleOption === '5m' ? '5分钟' : '10分钟'}
            </button>
          ))}
        </div>
        
        <div className="h-64 bg-gray-100 rounded mb-4 flex items-center justify-center">
          {/* 这里应该是ECharts图表容器 */}
          <div>波动率图表区域</div>
        </div>
        
        <div className="text-sm max-h-32 overflow-y-auto">
          {volatilityData.map((item, index) => (
            <div key={index} className="flex justify-between py-1 border-b">
              <span>{item.time}</span>
              <span>{item.volatility.toFixed(2)}%</span>
            </div>
          ))}
        </div>
        
        <button 
          className="bg-orange-500 text-white px-4 py-2 rounded w-full mt-4"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
};

const MatrixTable = ({ symbol, isOpen, onClose }) => {
  const getOptionName = (id) => {
    const names = {
      "BTC_OPTION": "比特币期权",
      "ETH_OPTION": "以太坊期权",
      "AAPL_OPTION": "苹果期权",
      "GOOGL_OPTION": "谷歌期权"
    };
    return names[id] || id;
  };

  // 生成模拟T型报价表数据
  const generateMockMatrixData = () => {
    const data = [];
    const baseStrike = 1000;
    
    for (let i = -5; i <= 5; i++) {
      const strikePrice = baseStrike + i * 10;
      const callPrice = Math.max(0, baseStrike - strikePrice + 50 + Math.random() * 20);
      const putPrice = Math.max(0, strikePrice - baseStrike + 50 + Math.random() * 20);
      
      data.push({
        strikePrice: strikePrice,
        callPrice: callPrice,
        putPrice: putPrice,
        callVolume: Math.floor(Math.random() * 1000),
        putVolume: Math.floor(Math.random() * 1000)
      });
    }
    
    return data;
  };

  const matrixData = generateMockMatrixData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{getOptionName(symbol)} - T型报价表</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">&times;</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">行权价</th>
                <th className="p-2 text-green-500">Call价格</th>
                <th className="p-2 text-red-500">Put价格</th>
                <th className="p-2">Call成交量</th>
                <th className="p-2">Put成交量</th>
              </tr>
            </thead>
            <tbody>
              {matrixData.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 text-center">{row.strikePrice.toFixed(2)}</td>
                  <td className="p-2 text-center text-green-500 font-medium">{row.callPrice.toFixed(2)}</td>
                  <td className="p-2 text-center text-red-500 font-medium">{row.putPrice.toFixed(2)}</td>
                  <td className="p-2 text-center">{row.callVolume}</td>
                  <td className="p-2 text-center">{row.putVolume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button 
          className="bg-orange-500 text-white px-4 py-2 rounded w-full mt-4"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
};

const GreekPanel = ({ symbol, isOpen, onClose }) => {
  const getOptionName = (id) => {
    const names = {
      "BTC_OPTION": "比特币期权",
      "ETH_OPTION": "以太坊期权",
      "AAPL_OPTION": "苹果期权",
      "GOOGL_OPTION": "谷歌期权"
    };
    return names[id] || id;
  };

  // 生成模拟希腊值数据
  const generateMockGreekData = () => {
    return {
      delta: 0.5 + (Math.random() - 0.5) * 0.4, // -0.2 到 0.8
      gamma: 0.02 + Math.random() * 0.03, // 0.02 到 0.05
      vega: 0.1 + Math.random() * 0.2, // 0.1 到 0.3
      theta: -0.05 - Math.random() * 0.05 // -0.05 到 -0.1
    };
  };

  const greekData = generateMockGreekData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{getOptionName(symbol)} - 希腊值</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">&times;</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 rounded p-3 text-center">
            <div className="text-orange-500 font-bold text-lg">{greekData.delta.toFixed(2)}</div>
            <div className="text-xs text-gray-600">Delta</div>
          </div>
          <div className="bg-gray-100 rounded p-3 text-center">
            <div className="text-orange-500 font-bold text-lg">{greekData.gamma.toFixed(2)}</div>
            <div className="text-xs text-gray-600">Gamma</div>
          </div>
          <div className="bg-gray-100 rounded p-3 text-center">
            <div className="text-orange-500 font-bold text-lg">{greekData.vega.toFixed(2)}</div>
            <div className="text-xs text-gray-600">Vega</div>
          </div>
          <div className="bg-gray-100 rounded p-3 text-center">
            <div className="text-orange-500 font-bold text-lg">{greekData.theta.toFixed(2)}</div>
            <div className="text-xs text-gray-600">Theta</div>
          </div>
        </div>
        
        <button 
          className="bg-orange-500 text-white px-4 py-2 rounded w-full"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
};

// 模拟API hook
const useOptionList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // 模拟API调用
        setTimeout(() => {
          const mockData = [
            { id: "BTC_OPTION", name: "比特币期权", currentPrice: 35000.50, expiryDate: "2025-12-31", strikePrice: 36000 },
            { id: "ETH_OPTION", name: "以太坊期权", currentPrice: 2800.75, expiryDate: "2025-12-31", strikePrice: 2900 },
            { id: "AAPL_OPTION", name: "苹果期权", currentPrice: 180.25, expiryDate: "2025-12-31", strikePrice: 185 },
            { id: "GOOGL_OPTION", name: "谷歌期权", currentPrice: 150.80, expiryDate: "2025-12-31", strikePrice: 155 }
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

export default function OptionMarketPage() {
  const { data: options, isLoading, isError } = useOptionList();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showVolatility, setShowVolatility] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showGreeks, setShowGreeks] = useState(false);
  const [cycle, setCycle] = useState('1m');

  const handleViewVolatility = (id) => {
    setSelectedOption(id);
    setShowVolatility(true);
    setShowMatrix(false);
    setShowGreeks(false);
  };

  const handleViewMatrix = (id) => {
    setSelectedOption(id);
    setShowMatrix(true);
    setShowVolatility(false);
    setShowGreeks(false);
  };

  const handleViewGreeks = (id) => {
    setSelectedOption(id);
    setShowGreeks(true);
    setShowVolatility(false);
    setShowMatrix(false);
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
        <Header title="期权行情" />
        <main className="flex-1 p-4 mt-16">
          <div className="text-red-500 text-center py-8">加载期权数据失败</div>
        </main>
        <TabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      <Header title="期权行情" />
      
      <main className="flex-1 p-4 mt-16">
        {isLoading ? (
          <div className="text-center py-8">加载中...</div>
        ) : options && options.length > 0 ? (
          <div>
            {options.map(option => (
              <OptionCard 
                key={option.id}
                option={option}
                onViewVolatility={handleViewVolatility}
                onViewMatrix={handleViewMatrix}
                onViewGreeks={handleViewGreeks}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">暂无期权数据</div>
        )}
      </main>

      <VolatilityChart 
        symbol={selectedOption}
        isOpen={showVolatility}
        onClose={() => setShowVolatility(false)}
        cycle={cycle}
        setCycle={setCycle}
      />

      <MatrixTable 
        symbol={selectedOption}
        isOpen={showMatrix}
        onClose={() => setShowMatrix(false)}
      />

      <GreekPanel 
        symbol={selectedOption}
        isOpen={showGreeks}
        onClose={() => setShowGreeks(false)}
      />

      <TabBar />
    </div>
  );
}