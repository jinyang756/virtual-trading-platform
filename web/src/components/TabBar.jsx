import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ChartBarIcon, ArrowsRightLeftIcon, UserIcon } from '@heroicons/react/24/outline';

const TabBar = () => {
  const tabs = [
    { name: '首页', icon: HomeIcon, href: '/home' },
    { name: '行情', icon: ChartBarIcon, href: '/market' },
    { name: '交易', icon: ArrowsRightLeftIcon, href: '/trade' },
    { name: '我的', icon: UserIcon, href: '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4">
        {tabs.map((tab, index) => (
          <Link
            key={index}
            to={tab.href}
            className="flex flex-col items-center justify-center py-2 px-1 text-gray-500 hover:text-blue-600"
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{tab.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TabBar;