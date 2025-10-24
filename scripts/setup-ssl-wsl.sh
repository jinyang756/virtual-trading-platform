#!/bin/bash

# WSL中SSL证书申请脚本
# ====================

# 设置工作目录
SSL_DIR="/mnt/c/ssl-manager"
CERTS_DIR="$SSL_DIR/certs"
LOGS_DIR="$SSL_DIR/logs"

# 创建必要的目录
echo "1. 创建证书存储目录..."
mkdir -p "$CERTS_DIR"
mkdir -p "$LOGS_DIR"

# 设置 Cloudflare API Token
echo "2. 设置Cloudflare API Token..."
export CF_Token="ygil2YkieHrj0khpA9CYwOCzXZtp_QZr9okYRWQd"
export CF_Email="guanyu432hz@gmail.com"

# 安装 acme.sh（如果尚未安装）
echo "3. 检查并安装acme.sh..."
if ! command -v acme.sh &> /dev/null; then
  echo "   正在安装 acme.sh..."
  curl https://get.acme.sh | sh
  source ~/.bashrc
else
  echo "   acme.sh已安装"
fi

# 申请证书
echo "4. 正在申请SSL证书..."
~/.acme.sh/acme.sh --issue --dns dns_cf -d jcstjj.top -d www.jcstjj.top

if [ $? -ne 0 ]; then
  echo "❌ 证书申请失败"
  exit 1
fi

# 安装证书到指定路径
echo "5. 正在安装SSL证书..."
~/.acme.sh/acme.sh --install-cert -d jcstjj.top \
--key-file       "$CERTS_DIR/jcstjj.top.key" \
--fullchain-file "$CERTS_DIR/jcstjj.top.pem" \
--reloadcmd     "echo '证书安装完成，正在重载Nginx...'"

if [ $? -ne 0 ]; then
  echo "❌ 证书安装失败"
  exit 1
fi

# 联动 Nginx 重载
echo "6. 正在重载Nginx配置..."
cd /mnt/c/nginx/nginx-1.24.0
./nginx.exe -t && ./nginx.exe -s reload

if [ $? -ne 0 ]; then
  echo "❌ Nginx重载失败"
  exit 1
fi

# 日志与告警联动（可选）
echo "7. 发送通知..."
echo "$(date) - SSL证书申请成功" >> "$LOGS_DIR/renew.log"

echo "🎉 SSL证书申请和安装完成!"
echo "📄 证书文件位置: $CERTS_DIR"
echo "⏰ 完成时间: $(date)"