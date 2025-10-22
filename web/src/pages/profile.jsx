import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import UserCard from '../components/UserCard';
import FavoritesSection from '../components/FavoritesSection';
import SettingsPanel from '../components/SettingsPanel';
import AccountActions from '../components/AccountActions';

export default function ProfilePage() {
  const [user, setUser] = useState({});

  // 模拟获取用户数据
  useEffect(() => {
    // 模拟API调用
    const fetchUser = async () => {
      // 模拟用户数据
      const mockUser = {
        avatar: 'https://via.placeholder.com/150',
        nickname: '张三',
        phone: '138****8888'
      };
      setUser(mockUser);
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16 md:pb-0">
      <Header title="我的" />

      <main className="flex-1 p-4 space-y-6">
        <UserCard user={user} />
        <FavoritesSection />
        <SettingsPanel />
        <AccountActions />
      </main>

      <TabBar />
    </div>
  );
}