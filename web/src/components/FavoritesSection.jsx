import React from 'react';
import { useUserFavorites } from '../hooks/useApi';
import useUserStore from '../store/user';

export function FavoritesSection() {
  const { user } = useUserStore();
  const { favorites, isLoading, isError } = useUserFavorites(user?.id);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-bold">我的收藏</h3>
        {['基金', '合约', '期权'].map(type => (
          <div key={type}>
            <h4 className="text-sm text-gray-600">{type}</h4>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2].map(i => (
                <div key={i} className="p-2 border rounded min-w-[120px] bg-white animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-bold">我的收藏</h3>
        <div className="text-red-500">收藏数据加载失败</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">我的收藏</h3>
      {Object.keys(favorites).map(type => (
        <div key={type}>
          <h4 className="text-sm text-gray-600">{type}</h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {favorites[type]?.map(item => (
              <div key={item.id} className="p-2 border rounded min-w-[120px] bg-white">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">{item.code}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FavoritesSection;