import React from 'react';
import { FundCard } from './ui';
import { useRecommendedFunds } from '../hooks/useApi';

const FundCarousel = () => {
  const { funds, isLoading, isError } = useRecommendedFunds();

  if (isLoading) {
    return <div className="space-y-2">
      <h2 className="text-lg font-bold">推荐基金</h2>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>;
  }

  if (isError) {
    return <div className="space-y-2">
      <h2 className="text-lg font-bold">推荐基金</h2>
      <div className="text-red-500">加载失败</div>
    </div>;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">推荐基金</h2>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {funds.map(fund => (
          <FundCard 
            key={fund.id} 
            name={fund.name} 
            nav={fund.nav || fund.price} 
            change={fund.changePercent || fund.change} 
          />
        ))}
      </div>
    </div>
  );
};

export default FundCarousel;