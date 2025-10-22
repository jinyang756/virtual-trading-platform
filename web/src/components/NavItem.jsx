import React from 'react';

const NavItem = ({ label, href = '#' }) => {
  return (
    <a 
      href={href} 
      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 block"
    >
      {label}
    </a>
  );
};

export default NavItem;