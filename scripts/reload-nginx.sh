#!/bin/bash

echo "🔄 重载 Nginx 配置..."

# 检查 Nginx 是否安装
if ! command -v nginx &> /dev/null; then
  echo "⚠️ 未安装 Nginx"
  exit 1
fi

# 测试配置
nginx -t

if [ $? -eq 0 ]; then
  # 重载配置
  nginx -s reload
  
  if [ $? -eq 0 ]; then
    echo "✅ Nginx 配置重载成功"
  else
    echo "❌ Nginx 配置重载失败"
    exit 1
  fi
else
  echo "❌ Nginx 配置测试失败"
  exit 1
fi