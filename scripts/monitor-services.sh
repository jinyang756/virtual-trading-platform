#!/bin/bash

echo "=== 虚拟交易平台服务监控 ==="
echo "时间: $(date)"
echo ""

echo "1. 检查 PM2 进程状态..."
pm2 list

echo ""
echo "2. 检查端口监听状态..."
echo "  3001端口 (主应用):"
if netstat -an | grep :3001 | grep LISTEN > /dev/null; then
    echo "  ✓ 正在监听"
else
    echo "  ✗ 未监听"
fi

echo "  3002端口 (合约市场):"
if netstat -an | grep :3002 | grep LISTEN > /dev/null; then
    echo "  ✓ 正在监听"
else
    echo "  ✗ 未监听"
fi

echo "  3003端口 (期权市场):"
if netstat -an | grep :3003 | grep LISTEN > /dev/null; then
    echo "  ✓ 正在监听"
else
    echo "  ✗ 未监听"
fi

echo "  80端口 (HTTP):"
if netstat -an | grep :80 | grep LISTEN > /dev/null; then
    echo "  ✓ 正在监听"
else
    echo "  ✗ 未监听"
fi

echo "  443端口 (HTTPS):"
if netstat -an | grep :443 | grep LISTEN > /dev/null; then
    echo "  ✓ 正在监听"
else
    echo "  ✗ 未监听"
fi

echo ""
echo "3. 检查健康接口..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://jcstjj.top/health 2>/dev/null || echo "无法连接")
if [ "$HEALTH_CHECK" = "200" ]; then
    echo "  ✓ 健康检查接口正常 (HTTP 200)"
else
    echo "  ✗ 健康检查接口异常 (HTTP $HEALTH_CHECK)"
fi

echo ""
echo "4. 检查磁盘空间..."
df -h | grep -E '^(文件系统|Filesystem)|/dev/'

echo ""
echo "监控完成。"