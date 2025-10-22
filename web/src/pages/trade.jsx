import React, { useState } from 'react';
import { Header, TabBar, TradePanel } from '../components/ui';
import PositionTable from '../components/PositionTable';
import TradeTabs from '../components/TradeTabs';
import OrderList from '../components/OrderList';
import DealList from '../components/DealList';

export default function TradePage() {
  const [tab, setTab] = useState('持仓');

  return (
    <div className="min-h-screen bg-white flex flex-col pb-16 md:pb-0">
      <Header title="交易" />

      <main className="flex-1 p-4 space-y-6 mt-16 md:mt-0">
        <PositionTable />
        <TradePanel />
        <TradeTabs tab={tab} onChange={setTab} />
        {tab === '委托' && <OrderList />}
        {tab === '成交' && <DealList />}
      </main>

      <TabBar />
    </div>
  );
}