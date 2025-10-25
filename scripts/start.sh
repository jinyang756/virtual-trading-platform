#!/bin/bash

echo "🚀 启动服务..."

# 项目路径
PROJECT_PATH="/home/administrator/virtual-trading-platform"

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null; then
  echo "⚠️ 未检测到 PM2"
  exit 1
fi

# 启动服务
cd "$PROJECT_PATH" && pm2 start src/index.js --name virtual-trading-platform

if [ $? -eq 0 ]; then
  echo "✅ 服务启动成功"
else
  echo "❌ 服务启动失败"
  exit 1
fi