import React, { useState, useEffect } from 'react';
import { Header, TabBar } from '../components/ui';
import { useFundList, useFundDetail, useFundNavHistory, useFundInsights } from '../hooks/useApi';

const FundCard = ({ fund, onViewDetail, onViewChart, onViewInsights }) => {
  const getFundManager = (fundId) => {
    const managers = {
      "FUND_K8": "李量",
      "FUND_A1": "张银河",
      "FUND_FIRE": "王萤火",
      "FUND_QUANT": "陈量化",
      "FUND_STABLE": "刘稳健",
      "FUND_GROWTH": "赵成长",
      "FUND_BALANCED": "孙平衡"
    };
    return managers[fundId] || "未知经理";
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-lg">{fund.name}</div>
        <div className="text-red-500 font-bold text-lg">{fund.nav.toFixed(4)}</div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <div>风险等级: {fund.risk_level}</div>
        <div className="text-blue-500">管理人: {getFundManager(fund.fund_id)}</div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mb-3">
        <div>总收益: {fund.total_return.toFixed(2)}%</div>
        <div>最低投资: ¥{fund.min_investment.toLocaleString()}</div>
      </div>
      <div className="flex justify-between">
        <button 
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          onClick={() => onViewDetail(fund.fund_id)}
        >
          查看详情
        </button>
        <button 
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
          onClick={() => onViewChart(fund.fund_id)}
        >
          净值图表
        </button>
        <button 
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
          onClick={() => onViewInsights(fund.fund_id)}
        >
          市场观点
        </button>
      </div>
    </div>
  );
};

const FundDetailModal = ({ fundId, isOpen, onClose, fundDetail }) => {
  const getFundName = (fundId) => {
    const names = {
      "FUND_K8": "聚财日斗K8基金",
      "FUND_A1": "聚财银河A1基金",
      "FUND_FIRE": "聚财幻方萤火基金",
      "FUND_QUANT": "聚财量化基金",
      "FUND_STABLE": "聚财稳健增长基金",
      "FUND_GROWTH": "聚财成长优选基金",
      "FUND_BALANCED": "聚财平衡配置基金"
    };
    return names[fundId] || "未知基金";
  };

  const getFundManager = (fundId) => {
    const managers = {
      "FUND_K8": "李量",
      "FUND_A1": "张银河",
      "FUND_FIRE": "王萤火",
      "FUND_QUANT": "陈量化",
      "FUND_STABLE": "刘稳健",
      "FUND_GROWTH": "赵成长",
      "FUND_BALANCED": "孙平衡"
    };
    return managers[fundId] || "未知经理";
  };

  const getFundStrategy = (fundId) => {
    const strategies = {
      "FUND_K8": "量化多因子对冲",
      "FUND_A1": "宏观对冲策略",
      "FUND_FIRE": "量化选股策略",
      "FUND_QUANT": "指数增强策略",
      "FUND_STABLE": "固定收益策略",
      "FUND_GROWTH": "成长股投资策略",
      "FUND_BALANCED": "股债平衡策略"
    };
    return strategies[fundId] || "未知策略";
  };

  const getFundFeeRate = (fundId) => {
    const feeRates = {
      "FUND_K8": "管理费: 1.5% + 业绩报酬: 20%",
      "FUND_A1": "管理费: 2.0% + 业绩报酬: 25%",
      "FUND_FIRE": "管理费: 1.0% + 业绩报酬: 15%",
      "FUND_QUANT": "管理费: 0.8% + 业绩报酬: 10%",
      "FUND_STABLE": "管理费: 1.2% + 业绩报酬: 8%",
      "FUND_GROWTH": "管理费: 1.8% + 业绩报酬: 15%",
      "FUND_BALANCED": "管理费: 1.5% + 业绩报酬: 12%"
    };
    return feeRates[fundId] || "未知费率";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{getFundName(fundId)}</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">&times;</button>
        </div>
        {fundDetail ? (
          <div>
            <p className="mb-2"><strong>管理人：</strong>{fundDetail.manager || getFundManager(fundId)}</p>
            <p className="mb-2"><strong>策略类型：</strong>{fundDetail.strategy || getFundStrategy(fundId)}</p>
            <p className="mb-2"><strong>费率结构：</strong>{fundDetail.fee_rate || getFundFeeRate(fundId)}</p>
            <p className="mb-4"><strong>开放状态：</strong>{fundDetail.open_status || '开放认购'}</p>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              onClick={onClose}
            >
              关闭
            </button>
          </div>
        ) : (
          <div className="text-center py-4">加载中...</div>
        )}
      </div>
    </div>
  );
};

const FundChart = ({ fundId, isOpen, onClose }) => {
  const { data: navHistory, isLoading, isError } = useFundNavHistory(fundId);
  const [chartInstance, setChartInstance] = useState(null);

  const getFundName = (fundId) => {
    const names = {
      "FUND_K8": "聚财日斗K8基金",
      "FUND_A1": "聚财银河A1基金",
      "FUND_FIRE": "聚财幻方萤火基金",
      "FUND_QUANT": "聚财量化基金",
      "FUND_STABLE": "聚财稳健增长基金",
      "FUND_GROWTH": "聚财成长优选基金",
      "FUND_BALANCED": "聚财平衡配置基金"
    };
    return names[fundId] || "未知基金";
  };

  useEffect(() => {
    if (isOpen && navHistory && navHistory.length > 0) {
      // 这里应该初始化ECharts图表，但由于我们是React组件，需要使用useEffect和ref
      // 暂时显示数据列表
    }
  }, [isOpen, navHistory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{getFundName(fundId)} - 净值走势</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">&times;</button>
        </div>
        {isLoading ? (
          <div className="text-center py-4">加载净值数据中...</div>
        ) : isError ? (
          <div className="text-center py-4 text-red-500">加载净值图表失败</div>
        ) : navHistory && navHistory.length > 0 ? (
          <div>
            <div className="h-64 bg-gray-100 rounded mb-4 flex items-center justify-center">
              {/* 这里应该是ECharts图表容器 */}
              <div>净值图表区域</div>
            </div>
            <div className="text-sm">
              {navHistory.map((item, index) => (
                <div key={index} className="flex justify-between py-1 border-b">
                  <span>{item.date}</span>
                  <span>{item.nav.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">暂无净值数据</div>
        )}
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
};

const FundInsightsModal = ({ fundId, isOpen, onClose, insights }) => {
  const getFundName = (fundId) => {
    const names = {
      "FUND_K8": "聚财日斗K8基金",
      "FUND_A1": "聚财银河A1基金",
      "FUND_FIRE": "聚财幻方萤火基金",
      "FUND_QUANT": "聚财量化基金",
      "FUND_STABLE": "聚财稳健增长基金",
      "FUND_GROWTH": "聚财成长优选基金",
      "FUND_BALANCED": "聚财平衡配置基金"
    };
    return names[fundId] || "未知基金";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{getFundName(fundId)} - 市场观点</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">&times;</button>
        </div>
        {insights && insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((item, index) => (
              <div key={index} className="border rounded p-3">
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">暂无市场观点数据</div>
        )}
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
};

export default function FundsPage() {
  const { data: funds, isLoading, isError } = useFundList();
  const [selectedFundId, setSelectedFundId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [fundDetail, setFundDetail] = useState(null);
  const [insights, setInsights] = useState(null);

  const handleViewDetail = async (fundId) => {
    setSelectedFundId(fundId);
    setShowDetailModal(true);
    
    // 获取基金详情
    try {
      const response = await fetch(`/api/funds/${fundId}/detail`);
      const detail = await response.json();
      setFundDetail(detail);
    } catch (error) {
      console.error('获取基金详情失败:', error);
      setFundDetail(null);
    }
  };

  const handleViewChart = (fundId) => {
    setSelectedFundId(fundId);
    setShowChart(true);
  };

  const handleViewInsights = async (fundId) => {
    setSelectedFundId(fundId);
    setShowInsights(true);
    
    // 获取基金市场观点
    try {
      const response = await fetch(`/api/funds/${fundId}/insights`);
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error('获取基金市场观点失败:', error);
      setInsights([]);
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
        <Header title="私募基金行情" />
        <main className="flex-1 p-4 mt-16">
          <div className="text-red-500 text-center py-8">加载基金数据失败</div>
        </main>
        <TabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      <Header title="私募基金行情" />
      
      <main className="flex-1 p-4 mt-16">
        {isLoading ? (
          <div className="text-center py-8">加载中...</div>
        ) : funds && funds.length > 0 ? (
          <div>
            {funds.map(fund => (
              <FundCard 
                key={fund.fund_id}
                fund={fund}
                onViewDetail={handleViewDetail}
                onViewChart={handleViewChart}
                onViewInsights={handleViewInsights}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">暂无基金数据</div>
        )}
      </main>

      <FundDetailModal 
        fundId={selectedFundId}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        fundDetail={fundDetail}
      />

      <FundChart 
        fundId={selectedFundId}
        isOpen={showChart}
        onClose={() => setShowChart(false)}
      />

      <FundInsightsModal 
        fundId={selectedFundId}
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        insights={insights}
      />

      <TabBar />
    </div>
  );
}