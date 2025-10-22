import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex items-center justify-between px-4 py-2 bg-white shadow sticky top-0 z-10">
        <div className="text-xl font-bold text-blue-600">
          聚财中法虚拟交易平台
        </div>
      </header>
      
      <main className="flex-1 p-4 space-y-6 mt-16 md:mt-0">
        <h1 className="text-2xl font-bold">欢迎来到虚拟交易平台</h1>
        <p>这是一个基于 React + Vite + Tailwind CSS 的响应式金融交易平台。</p>
      </main>
    </div>
  );
}