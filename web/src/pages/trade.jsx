import React, { useState } from 'react';
import { Header, TabBar, TradePanel } from '../components/ui';
import PositionTable from '../components/PositionTable';
import TradeTabs from '../components/TradeTabs';
import OrderList from '../components/OrderList';
import DealList from '../components/DealList';
import usePositions from '../hooks/usePositions';
import useUserStore from '../store/user';

export default function TradePage() {
  const { user } = useUserStore();
  const { positions, isLoading, isError } = usePositions(user?.id);
  const [tab, setTab] = useState('持仓');

  return (
    <div className="min-h-screen bg-white flex flex-col pb-16 md:pb-0">
      <Header title="交易" />

      <main className="flex-1 p-4 space-y-6 mt-16 md:mt-0">
        <h2 className="text-lg font-bold">当前持仓</h2>
        {isLoading && <p>加载中...</p>}
        {isError && <p className="text-red-500">加载失败</p>}
        <PositionTable data={positions} />

        <h2 className="text-lg font-bold">下单面板</h2>
        <TradePanel />

        <TradeTabs tab={tab} onChange={setTab} />
        {tab === '委托' && <OrderList />}
        {tab === '成交' && <DealList />}
      </main>

      <TabBar />
    </div>
  );
}