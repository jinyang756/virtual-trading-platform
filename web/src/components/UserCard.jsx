import React from 'react';
import { useUserProfile } from '../hooks/useApi';
import useUserStore from '../store/user';

export function UserCard() {
  const { user: currentUser } = useUserStore();
  const { user, isLoading, isError } = useUserProfile(currentUser?.id);

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded shadow animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded shadow">
        <div className="text-red-500">用户信息加载失败</div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded shadow">
      <img 
        src={user.avatar || 'https://via.placeholder.com/150'} 
        alt="avatar" 
        className="w-16 h-16 rounded-full" 
      />
      <div>
        <h2 className="text-lg font-bold">{user.nickname || '用户'}</h2>
        <p className="text-sm text-gray-500">{user.phone || '未绑定手机号'}</p>
      </div>
    </div>
  );
}

export default UserCard;