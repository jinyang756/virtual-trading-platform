import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavItem({ label, to }) {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  // 如果是指向静态页面（.html），使用原生 <a> 以绕过 SPA 路由
  if (typeof to === 'string' && to.endsWith('.html')) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={`px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 block`}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'} block`}
    >
      {label}
    </Link>
  );
}
