import React from 'react';

const MarketNews = () => {
  // Mock data for market news
  const news = [
    "📈 全球市场震荡，基金经理建议关注新兴市场",
    "🧠 AI主题基金净值突破新高",
    "📊 合约市场成交量创月内新高",
    "💰 央行释放流动性，市场预期乐观",
    "🌍 地缘政治影响，避险资产受青睐"
  ];

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">市场快讯</h2>
      <ul className="space-y-1 text-sm text-gray-700">
        {news.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarketNews;