import React from 'react';
import Logo from './Logo';
import NavItem from './NavItem';
import SearchBar from './SearchBar';

const Header = ({ title = "聚财中法" }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white shadow sticky top-0 z-10">
      <div className="text-xl font-bold text-blue-600">
        {title}
      </div>
      <div className="hidden md:flex gap-4">
        <NavItem label="首页" href="/" />
        <NavItem label="行情" href="/market" />
        <NavItem label="交易" href="/trade" />
        <NavItem label="我的" href="/profile" />
      </div>
      <SearchBar />
    </div>
  );
};

export default Header;