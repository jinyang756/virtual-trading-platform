import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavItem({ label, to }) {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'} block`}
    >
      {label}
    </Link>
  );
}