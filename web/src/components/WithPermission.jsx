import React from 'react';
import { useUser } from '../hooks/useUser';

/**
 * 权限控制组件
 * 根据用户权限控制组件显示/隐藏
 * 
 * @param {string} permission - 需要的权限ID
 * @param {ReactNode} children - 子组件
 * @param {ReactNode} fallback - 无权限时显示的内容（可选）
 */
const WithPermission = ({ permission, children, fallback = null }) => {
  const { permissions, loading } = useUser();
  
  // 如果还在加载用户信息，显示空内容
  if (loading) {
    return null;
  }
  
  // 检查用户是否拥有指定权限
  const hasPermission = permissions && permissions.includes(permission);
  
  // 根据权限结果显示内容或后备内容
  return hasPermission ? children : fallback;
};

/**
 * 角色控制组件
 * 根据用户角色控制组件显示/隐藏
 * 
 * @param {string|array} roles - 需要的角色ID或角色ID数组
 * @param {ReactNode} children - 子组件
 * @param {ReactNode} fallback - 无权限时显示的内容（可选）
 */
const WithRole = ({ roles, children, fallback = null }) => {
  const { roles: userRoles, loading } = useUser();
  
  // 如果还在加载用户信息，显示空内容
  if (loading) {
    return null;
  }
  
  // 检查用户是否拥有指定角色
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  const hasRole = userRoles && requiredRoles.some(role => userRoles.includes(role));
  
  // 根据角色结果显示内容或后备内容
  return hasRole ? children : fallback;
};

/**
 * 权限按钮组件
 * 根据权限控制按钮显示/隐藏
 * 
 * @param {string} permission - 需要的权限ID
 * @param {object} props - 按钮属性
 */
const PermissionButton = ({ permission, children, ...props }) => {
  const { permissions, loading } = useUser();
  
  // 如果还在加载用户信息，不显示按钮
  if (loading) {
    return null;
  }
  
  // 检查用户是否拥有指定权限
  const hasPermission = permissions && permissions.includes(permission);
  
  // 如果有权限则显示按钮，否则不显示
  return hasPermission ? (
    <button {...props}>
      {children}
    </button>
  ) : null;
};

/**
 * 权限链接组件
 * 根据权限控制链接显示/隐藏
 * 
 * @param {string} permission - 需要的权限ID
 * @param {object} props - 链接属性
 */
const PermissionLink = ({ permission, children, ...props }) => {
  const { permissions, loading } = useUser();
  
  // 如果还在加载用户信息，不显示链接
  if (loading) {
    return null;
  }
  
  // 检查用户是否拥有指定权限
  const hasPermission = permissions && permissions.includes(permission);
  
  // 如果有权限则显示链接，否则不显示
  return hasPermission ? (
    <a {...props}>
      {children}
    </a>
  ) : null;
};

export {
  WithPermission,
  WithRole,
  PermissionButton,
  PermissionLink
};