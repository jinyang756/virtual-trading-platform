import React from 'react';
import './App.css';

function App() {
  // 使用环境变量配置API地址
  const apiBase = import.meta.env.VITE_API_BASE || 'https://api.jcstjj.top';
  const appName = import.meta.env.VITE_APP_NAME || '虚拟交易平台';
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{appName}</h1>
        <p className="text-xl text-gray-300">Virtual Trading Platform</p>
      </header>
      
      <main className="max-w-4xl w-full px-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">欢迎使用虚拟交易平台</h2>
          <p className="text-gray-300 mb-4">
            这是一个基于React、TypeScript和Vite构建的现代化交易平台前端界面。
          </p>
          <p className="text-gray-300 mb-4">
            平台支持多种交易功能，包括合约交易、期权交易和基金投资等。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-900/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">合约交易</h3>
              <p className="text-sm text-gray-300">支持多种合约交易品种</p>
            </div>
            <div className="bg-purple-900/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">期权交易</h3>
              <p className="text-sm text-gray-300">灵活的期权交易策略</p>
            </div>
            <div className="bg-yellow-900/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">基金投资</h3>
              <p className="text-sm text-gray-300">多样化的基金产品</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-400">
            部署状态: <span className="text-green-400">成功</span>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            构建时间: {new Date().toLocaleString('zh-CN')}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            API地址: {apiBase}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            跨域支持: 已配置
          </p>
        </div>
      </main>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2025 虚拟交易平台. 保留所有权利.</p>
      </footer>
    </div>
  );
}

export default App;