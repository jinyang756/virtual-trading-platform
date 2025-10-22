import React from 'react';
import { useUserPositions } from '../hooks/useApi';
import useUserStore from '../store/user';

export function PositionTable() {
  const { user } = useUserStore();
  const { positions, isLoading, isError } = useUserPositions(user?.id);

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">名称</th>
              <th className="text-left p-2">数量</th>
              <th className="text-left p-2">成本价</th>
              <th className="text-left p-2">当前价</th>
              <th className="text-left p-2">盈亏</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map(i => (
              <tr key={i} className="border-b animate-pulse">
                <td className="p-2"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">持仓数据加载失败</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">名称</th>
            <th className="text-left p-2">数量</th>
            <th className="text-left p-2">成本价</th>
            <th className="text-left p-2">当前价</th>
            <th className="text-left p-2">盈亏</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(pos => (
            <tr key={pos.id} className="border-b">
              <td className="p-2">{pos.name}</td>
              <td className="p-2">{pos.amount}</td>
              <td className="p-2">{pos.cost}</td>
              <td className="p-2">{pos.price}</td>
              <td className={`p-2 ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {pos.pnl >= 0 ? '+' : ''}{pos.pnl}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PositionTable;