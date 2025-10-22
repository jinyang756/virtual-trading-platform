import React from 'react';
import FundCard from './FundCard';

const FundCarousel = () => {
  // Mock data for fund cards
  const funds = [
    { id: 1, name: "全球增长基金", nav: "12.34", change: "+1.5%" },
    { id: 2, name: "医疗保健基金", nav: "10.25", change: "-0.4%" },
    { id: 3, name: "中国机会基金", nav: "8.90", change: "+2.3%" },
    { id: 4, name: "科技先锋基金", nav: "15.67", change: "+3.2%" },
    { id: 5, name: "稳健收益基金", nav: "9.87", change: "+0.8%" }
  ];

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">推荐基金</h2>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {funds.map(fund => (
          <FundCard key={fund.id} name={fund.name} nav={fund.nav} change={fund.change} />
        ))}
      </div>
    </div>
  );
};

export default FundCarousel;