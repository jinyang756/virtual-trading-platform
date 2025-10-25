#!/bin/bash

echo "🔄 重启服务..."

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null; then
  echo "⚠️ 未检测到 PM2"
  exit 1
fi

# 重启服务
pm2 restart virtual-trading-platform

if [ $? -eq 0 ]; then
  echo "✅ 服务重启成功"
else
  echo "❌ 服务重启失败"
  exit 1
fi