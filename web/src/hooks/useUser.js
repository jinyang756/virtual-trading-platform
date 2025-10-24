import { useState, useEffect } from 'react';

/**
 * 用户权限Hook
 * 管理用户信息、角色和权限
 */
export const useUser = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 获取用户信息
   */
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 从localStorage获取用户信息
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUser(user);
        
        // 获取用户角色和权限
        await fetchUserRolesAndPermissions(user.id);
      }
    } catch (err) {
      console.error('获取用户信息失败:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取用户角色和权限
   * @param {string} userId - 用户ID
   */
  const fetchUserRolesAndPermissions = async (userId) => {
    try {
      // 这里应该调用后端API获取用户角色和权限
      // 暂时使用模拟数据
      const mockRoles = ['admin']; // 模拟管理员角色
      const mockPermissions = [
        'view_fund',
        'edit_fund',
        'export_report',
        'manage_users',
        'view_contract',
        'trade_contract',
        'view_option',
        'trade_option',
        'view_portfolio',
        'manage_portfolio'
      ];
      
      setRoles(mockRoles);
      setPermissions(mockPermissions);
      
      // 实际实现应该如下：
      /*
      // 获取用户角色
      const rolesResponse = await fetch(`/api/user/${userId}/roles`);
      const rolesData = await rolesResponse.json();
      setRoles(rolesData.roles || []);
      
      // 获取用户权限
      const permissionsResponse = await fetch(`/api/user/${userId}/permissions`);
      const permissionsData = await permissionsResponse.json();
      setPermissions(permissionsData.permissions || []);
      */
    } catch (err) {
      console.error('获取用户角色和权限失败:', err);
      setError(err.message);
    }
  };

  /**
   * 用户登录
   * @param {object} userData - 用户数据
   */
  const login = async (userData) => {
    try {
      // 保存用户信息到localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // 获取用户角色和权限
      await fetchUserRolesAndPermissions(userData.id);
      
      return { success: true };
    } catch (err) {
      console.error('登录失败:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * 用户登出
   */
  const logout = () => {
    // 清除localStorage中的用户信息
    localStorage.removeItem('user');
    
    // 清除状态
    setUser(null);
    setRoles([]);
    setPermissions([]);
  };

  /**
   * 检查用户是否拥有指定权限
   * @param {string} permission - 权限ID
   * @returns {boolean} 是否拥有权限
   */
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  /**
   * 检查用户是否拥有指定角色
   * @param {string} role - 角色ID
   * @returns {boolean} 是否拥有角色
   */
  const hasRole = (role) => {
    return roles.includes(role);
  };

  // 组件挂载时获取用户信息
  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    roles,
    permissions,
    loading,
    error,
    login,
    logout,
    hasPermission,
    hasRole
  };
};

export default useUser;