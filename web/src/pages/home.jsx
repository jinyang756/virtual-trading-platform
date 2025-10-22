import React from 'react';
import Header from '../components/Header';
import FundCarousel from '../components/FundCarousel';
import MarketNews from '../components/MarketNews';
import NetValueChart from '../components/NetValueChart';
import TabBar from '../components/TabBar';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16 md:pb-0">
      <Header title="首页" />
      
      <main className="flex-1 p-4 space-y-6 mt-16 md:mt-0">
        <FundCarousel />
        <MarketNews />
        <NetValueChart />
      </main>
      
      <TabBar />
    </div>
  );
};

export default HomePage;