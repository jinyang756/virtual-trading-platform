#!/bin/bash

echo "🧹 清理 web/src/pages 中的 HTML 文件..."
rm -v web/src/pages/*.html

echo "🧹 清理 public/mobile 中的重复文件..."
rm -rv public/mobile/*

echo "📦 安装统一 Tailwind CSS 版本..."
npm install tailwindcss@4.1.15

echo "🔧 升级 Vite 插件..."
npm install @vitejs/plugin-react@4.0.3

echo "✅ 清理完成，请运行 npm run dev 验证效果"