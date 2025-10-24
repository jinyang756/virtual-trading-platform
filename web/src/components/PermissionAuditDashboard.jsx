import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';

/**
 * 权限审计仪表盘
 * 展示权限变更记录、角色分布、权限使用频率等信息
 */
const PermissionAuditDashboard = () => {
  const { hasPermission } = useUser();
  const [auditData, setAuditData] = useState({
    recentChanges: [],
    roleDistribution: {},
    permissionUsage: []
  });
  const [loading, setLoading] = useState(true);

  // 模拟获取审计数据
  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        // 模拟数据
        const mockData = {
          recentChanges: [
            { id: 1, role: 'admin', permission: 'export_report', action: 'added', timestamp: '2025-10-24 18:11' },
            { id: 2, role: 'operator', permission: 'view_contract', action: 'added', timestamp: '2025-10-23 15:30' },
            { id: 3, role: 'investor', permission: 'view_portfolio', action: 'removed', timestamp: '2025-10-22 10:45' }
          ],
          roleDistribution: {
            admin: 3,
            operator: 15,
            investor: 120
          },
          permissionUsage: [
            { permission: 'view_fund', count: 1250 },
            { permission: 'edit_fund', count: 42 },
            { permission: 'export_report', count: 18 },
            { permission: 'manage_users', count: 25 },
            { permission: 'view_contract', count: 890 }
          ]
        };
        
        setAuditData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('获取审计数据失败:', error);
        setLoading(false);
      }
    };

    // 检查用户是否有权限查看审计仪表盘
    if (hasPermission('view_audit_dashboard')) {
      fetchAuditData();
    }
  }, [hasPermission]);

  // 如果用户没有权限，不显示仪表盘
  if (!hasPermission('view_audit_dashboard')) {
    return null;
  }

  // 如果还在加载，显示加载状态
  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">权限审计仪表盘</h2>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">权限审计仪表盘</h2>
      
      {/* 最近变更记录 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">最近30天权限变更记录</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">权限</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditData.recentChanges.map((change) => (
                <tr key={change.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {change.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{change.permission}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      change.action === 'added' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {change.action === 'added' ? '新增' : '移除'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{change.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 角色分布 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">角色分布</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(auditData.roleDistribution).map(([role, count]) => (
            <div key={role} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 font-bold">{count}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">{role}</h4>
                  <p className="text-sm text-gray-500">用户数量</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 权限使用频率 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">权限使用频率</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">权限</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">使用次数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">占比</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditData.permissionUsage.map((usage, index) => {
                const maxCount = Math.max(...auditData.permissionUsage.map(u => u.count));
                const percentage = Math.round((usage.count / maxCount) * 100);
                
                return (
                  <tr key={usage.permission}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usage.permission}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usage.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PermissionAuditDashboard;