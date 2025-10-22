import React, { useState, useEffect } from 'react';
import { Header, TabBar, UserCard } from '../components/ui';
import FavoritesSection from '../components/FavoritesSection';
import SettingsPanel from '../components/SettingsPanel';
import AccountActions from '../components/AccountActions';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16 md:pb-0">
      <Header title="我的" />

      <main className="flex-1 p-4 space-y-6">
        <UserCard />
        <FavoritesSection />
        <SettingsPanel />
        <AccountActions />
      </main>

      <TabBar />
    </div>
  );
}
