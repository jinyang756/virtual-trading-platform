import React from 'react';
import { Logo, NavItem, SearchBar } from '.';

const Header = ({ title = "聚财中法" }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white shadow sticky top-0 z-10">
      <div className="text-xl font-bold text-blue-600">
        {title}
      </div>
      <div className="hidden md:flex gap-4 items-center">
        <NavItem label="首页" to="/home" />
        <NavItem label="基金" to="/funds" />
        <NavItem label="合约" to="/contract-market" />
        <NavItem label="期权" to="/option-market" />
        <NavItem label="我的" to="/profile" />
        {/* 法务与联系 */}
        <span className="h-6 w-px bg-gray-300 mx-2" />
        <NavItem label="服务条款" to="/terms.html" />
        <NavItem label="隐私政策" to="/privacy.html" />
        <NavItem label="风险提示" to="/risk.html" />
        <NavItem label="联系我们" to="/contact.html" />
      </div>
      <SearchBar />
    </div>
  );
};

export default Header;
