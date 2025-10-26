import React from 'react';
import AssetOverview from '../components/dashboard/AssetOverview';
import MarketTrends from '../components/dashboard/MarketTrends';
import OptionsRecommendations from '../components/dashboard/OptionsRecommendations';
import FundProducts from '../components/dashboard/FundProducts';
import AIAssistant from '../components/dashboard/AIAssistant';

const TradingDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 顶部资产总览 */}
      <AssetOverview />

      {/* 中部两列：市场趋势 + 推荐 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketTrends />
        </div>
        <div className="lg:col-span-1">
          <OptionsRecommendations />
        </div>
      </div>

      {/* 底部两列：基金产品 + AI助手 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FundProducts />
        <AIAssistant />
      </div>
    </div>
  );
};

export default TradingDashboard;
