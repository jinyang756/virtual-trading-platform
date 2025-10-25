#!/bin/bash

# Qoder 控制台一键启动脚本
echo "=== 虚拟交易平台一键启动 ==="
echo "时间: $(date)"
echo ""

# 设置项目路径
PROJECT_PATH="/mnt/c/qoder/projects/virtual-trading-platform"
cd "$PROJECT_PATH"

echo "1. 安装依赖..."
npm install
echo "✓ 依赖安装完成"
echo ""

echo "2. 启动 PM2 服务..."
if command -v pm2 &> /dev/null; then
    pm2 start ecosystem.config.js
    echo "✓ PM2 服务启动完成"
else
    echo "⚠ PM2 未安装，尝试使用 npm 启动..."
    npm start
fi
echo ""

echo "3. 启动前端开发服务..."
cd web
npm install
# 在后台启动前端服务
npm run dev &
echo "✓ 前端开发服务已在后台启动"
echo ""

echo "4. 检查服务状态..."
cd ..
# 等待服务启动
sleep 5

# 检查健康接口
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health 2>/dev/null || echo "无法连接")
if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✓ 主服务健康检查正常"
else
    echo "⚠ 主服务健康检查异常 (HTTP $HEALTH_CHECK)"
fi

echo ""
echo "=== 启动完成 ==="
echo "主服务地址: http://localhost:3001"
echo "前端开发地址: http://localhost:5173"
echo "健康检查接口: http://localhost:3001/health"