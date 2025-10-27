import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      message.error('请先登录');
      navigate(requireAdmin ? '/admin/login' : '/login', {
        state: { from: location.pathname },
      });
      return;
    }

    if (requireAdmin && user?.role !== 'admin') {
      message.error('无权访问');
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate, location, requireAdmin]);

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;