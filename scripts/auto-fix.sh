#!/bin/bash

echo "🚀 开始智能部署修复..."

# 项目路径
PROJECT_PATH="/home/administrator/virtual-trading-platform"
CERT_DIR="/home/administrator/ssl"
CERT_KEY="$CERT_DIR/jcstjj.top.key"
CERT_PEM="$CERT_DIR/jcstjj.top.pem"
NGINX_CONF="/etc/nginx/sites-available/jcstjj.top"

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
  # 检查 acme.sh 是否存在
  if command -v ~/.acme.sh/acme.sh &> /dev/null; then
    echo "  尝试申请证书..."
    mkdir -p "$CERT_DIR"
    ~/.acme.sh/acme.sh --issue -d jcstjj.top --standalone
    ~/.acme.sh/acme.sh --install-cert -d jcstjj.top \
      --key-file       "$CERT_KEY" \
      --fullchain-file "$CERT_PEM"
  else
    echo "  未安装 acme.sh，跳过证书申请"
  fi
fi

# 5. 检查 Nginx 配置
echo "🔍 检查 Nginx 配置文件..."
if [[ -f "$NGINX_CONF" ]]; then
  echo "✅ Nginx 配置已存在"
else
  echo "⚠️ 缺少配置，正在创建..."
  sudo mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
  sudo tee "$NGINX_CONF" > /dev/null <<EOF
server {
    listen 443 ssl http2;
    server_name jcstjj.top;

    ssl_certificate     $CERT_PEM;
    ssl_certificate_key $CERT_KEY;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    access_log /var/log/nginx/jcstjj.access.log;
    error_log /var/log/nginx/jcstjj.error.log;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
  sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/jcstjj.top
  sudo nginx -t && sudo systemctl reload nginx
fi

# 6. 健康检查接口
echo "🔍 检查健康接口..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://jcstjj.top/health 2>/dev/null || echo "000")
if [[ "$STATUS" == "200" ]]; then
  echo "✅ 健康检查接口正常"
else
  echo "⚠️ 健康检查异常，返回状态码：$STATUS"
fi

echo "🎯 智能部署修复完成"