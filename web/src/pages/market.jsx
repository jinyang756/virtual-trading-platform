import React, { useState } from 'react';
import { Header, TabBar } from '../components/ui';
import MarketFilter from '../components/MarketFilter';
import Loading from '../components/Loading';
import MarketList from '../components/MarketList';
import MarketChart from '../components/MarketChart';
import { useMarketAssets } from '../hooks/useApi';

export default function MarketPage() {
  const [type, setType] = useState('基金');
  const { assets, isLoading, isError } = useMarketAssets(type);

  if (isError) {
    return (
      <div className="min-h-screen bg-white flex flex-col pb-16 md:pb-0">
        <Header title="行情" />
        <main className="flex-1 p-4 space-y-6 mt-16 md:mt-0">
          <MarketFilter type={type} onChange={setType} />
          <div className="text-red-500">数据加载失败</div>
        </main>
        <TabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-16 md:pb-0">
      <Header title="行情" />

      <main className="flex-1 p-4 space-y-6 mt-16 md:mt-0">
        <MarketFilter type={type} onChange={setType} />
        {isLoading ? <Loading /> : <MarketList data={assets} />}
        <MarketChart data={assets} />
      </main>

      <TabBar />
    </div>
  );
}