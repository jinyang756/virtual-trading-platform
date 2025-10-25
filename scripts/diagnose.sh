#!/bin/bash

echo "=== Virtual Trading Platform 诊断报告 ==="
echo "时间: $(date)"
echo ""

echo "1. 检查 PM2 中 virtual-trading-platform 服务状态..."
if command -v pm2 &> /dev/null; then
    pm2_status=$(pm2 list | grep virtual-trading-platform)
    if [[ $pm2_status == *"online"* ]]; then
        echo "✓ virtual-trading-platform 服务正在运行"
        echo "  服务详情:"
        pm2 list | grep virtual-trading-platform
    else
        echo "✗ virtual-trading-platform 服务未运行"
        echo "  当前 PM2 进程:"
        pm2 list
    fi
else
    echo "✗ PM2 未安装"
fi
echo ""

echo "2. 检查 3000 端口监听状态..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✓ 3000 端口正在监听"
    echo "  监听详情:"
    lsof -i :3000 | grep LISTEN
else
    echo "✗ 3000 端口未监听"
fi
echo ""

echo "3. 检查 SSL 证书文件..."
KEY_PATH="/home/administrator/ssl/jcstjj.top.key"
PEM_PATH="/home/administrator/ssl/jcstjj.top.pem"

if [ -f "$KEY_PATH" ] && [ -f "$PEM_PATH" ]; then
    echo "✓ SSL 证书文件存在"
    echo "  证书信息:"
    if command -v openssl &> /dev/null; then
        openssl x509 -in "$PEM_PATH" -noout -dates
    else
        echo "  OpenSSL 未安装，无法检查证书有效期"
    fi
else
    echo "✗ SSL 证书文件缺失"
    echo "  KEY 文件存在: $([ -f "$KEY_PATH" ] && echo "是" || echo "否")"
    echo "  PEM 文件存在: $([ -f "$PEM_PATH" ] && echo "是" || echo "否")"
fi
echo ""

echo "4. 检查 Nginx 配置是否包含 jcstjj.top 域名..."
NGINX_CONF="/etc/nginx/sites-enabled/jcstjj.top"
if [ -f "$NGINX_CONF" ]; then
    echo "✓ Nginx 配置文件存在"
    echo "  配置文件路径: $NGINX_CONF"
else
    echo "✗ Nginx 配置文件不存在: $NGINX_CONF"
fi
echo ""

echo "5. 调用健康检查接口..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://jcstjj.top/health 2>/dev/null || echo "无法连接")
if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✓ 健康检查接口正常 (HTTP 200)"
else
    echo "✗ 健康检查接口异常 (HTTP $HEALTH_CHECK)"
fi
echo ""

echo "诊断完成。"