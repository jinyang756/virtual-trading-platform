#!/bin/bash

echo "🚀 开始智能部署修复（无sudo权限版）..."

# 项目路径
PROJECT_PATH="/home/administrator/virtual-trading-platform"
CERT_DIR="/home/administrator/ssl"
CERT_KEY="$CERT_DIR/jcstjj.top.key"
CERT_PEM="$CERT_DIR/jcstjj.top.pem"

# 1. 检查并安装 PM2
echo "🔍 检查 PM2..."
if ! command -v pm2 &> /dev/null; then
  echo "⚠️ 未检测到 PM2，正在安装..."
  npm install -g pm2
else
  echo "✅ PM2 已安装"
fi

# 2. 检查 Node 服务是否运行
echo "🔍 检查 Node 服务状态..."
if ! pm2 list | grep -q virtual-trading-platform; then
  echo "⚠️ 服务未启动，尝试启动..."
  cd "$PROJECT_PATH" && npm install && pm2 start src/index.js --name virtual-trading-platform
else
  echo "✅ 服务已在运行"
fi

# 3. 检查端口监听
echo "🔍 检查 3000 端口监听..."
if ! netstat -tuln | grep -q ":3000 "; then
  echo "⚠️ 未监听 3000 端口，请确认服务是否启动成功"
else
  echo "✅ 端口监听正常"
fi

# 4. 检查 SSL 证书
echo "🔍 检查 SSL 证书文件..."
if [[ -f "$CERT_KEY" && -f "$CERT_PEM" ]]; then
  echo "✅ 证书文件存在"
  # 检查证书是否即将过期
  if command -v openssl &> /dev/null; then
    EXPIRE_DATE=$(openssl x509 -in "$CERT_PEM" -noout -enddate | cut -d= -f2)
    echo "  证书过期时间: $EXPIRE_DATE"
  fi
else
  echo "⚠️ 缺少证书文件"
fi

# 5. 健康检查接口
echo "🔍 检查健康接口..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://jcstjj.top/health 2>/dev/null || echo "000")
if [[ "$STATUS" == "200" ]]; then
  echo "✅ 健康检查接口正常"
else
  echo "⚠️ 健康检查异常，返回状态码：$STATUS"
fi

echo "🎯 智能部署修复完成"