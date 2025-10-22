import React from 'react';

export function AccountActions() {
  const handleLogout = () => {
    // 处理退出登录逻辑
    console.log('退出登录');
    // 这里应该调用API退出登录
    // fetch('/api/user/logout', { method: 'POST' });
  };

  return (
    <div className="space-y-2">
      <button className="w-full bg-white py-3 rounded shadow text-left px-4">修改密码</button>
      <button 
        onClick={handleLogout}
        className="w-full bg-white py-3 rounded shadow text-left px-4 text-red-500"
      >
        退出登录
      </button>
      <p className="text-center text-xs text-gray-400">版本号 v1.0.0</p>
    </div>
  );
}

export default AccountActions;