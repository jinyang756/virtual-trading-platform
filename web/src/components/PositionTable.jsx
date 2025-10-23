import React from 'react';

export function PositionTable({ data }) {
  // 如果没有提供data属性，则显示空表格
  if (!data || data.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">资产</th>
              <th className="p-2">数量</th>
              <th className="p-2">成本价</th>
              <th className="p-2">当前价</th>
              <th className="p-2">盈亏</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                暂无持仓数据
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">资产</th>
            <th className="p-2">数量</th>
            <th className="p-2">成本价</th>
            <th className="p-2">当前价</th>
            <th className="p-2">盈亏</th>
          </tr>
        </thead>
        <tbody>
          {data.map(pos => (
            <tr key={pos.id} className="border-t">
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