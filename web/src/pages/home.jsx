import React from 'react';
import { Header, TabBar } from '../components/ui';
import FundCarousel from '../components/FundCarousel';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16 md:pb-0">
      <Header title="首页" />
      
      <main className="flex-1 p-4 space-y-6 mt-16 md:mt-0">
        <FundCarousel />
      </main>
      
      <TabBar />
    </div>
  );
};

export default HomePage;