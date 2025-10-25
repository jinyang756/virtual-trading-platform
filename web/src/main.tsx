import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './router';
// 导入性能监控
import { performanceMonitor } from './utils/performance';
// 导入性能测试
import './performance-test';

// 标记应用启动时间
performanceMonitor.mark('app-start');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);