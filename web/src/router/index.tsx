import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
// 布局组件
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
// 页面组件
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import TradeManagement from '../pages/admin/TradeManagement';
import FundManagement from '../pages/admin/FundManagement';
import RealtimeDashboard from '../pages/admin/RealtimeDashboard';
import Trading from '../pages/Trading';
import HomePage from '../pages/HomePage';

// 权限控制组件
const ProtectedRoute = ({ children, requiredRole = 'user' }: { children: React.ReactNode; requiredRole?: string }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'trading', element: <Trading /> },
    ]
  },
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'trades', element: <TradeManagement /> },
      { path: 'funds', element: <FundManagement /> },
      { path: 'realtime', element: <RealtimeDashboard /> },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}