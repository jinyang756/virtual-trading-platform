#!/bin/bash

echo "🔐 续签 SSL 证书..."

# 检查 acme.sh 是否存在
if ! command -v ~/.acme.sh/acme.sh &> /dev/null; then
  echo "⚠️ 未安装 acme.sh"
  exit 1
fi

# 续签证书
echo "正在续签 jcstjj.top 的证书..."
~/.acme.sh/acme.sh --renew -d jcstjj.top --force

if [ $? -eq 0 ]; then
  echo "✅ 证书续签成功"
  
  # 安装证书到指定位置
  CERT_DIR="/home/administrator/ssl"
  mkdir -p "$CERT_DIR"
  
  ~/.acme.sh/acme.sh --install-cert -d jcstjj.top \
    --key-file       "$CERT_DIR/jcstjj.top.key" \
    --fullchain-file "$CERT_DIR/jcstjj.top.pem"
    
  echo "✅ 证书安装完成"
else
  echo "❌ 证书续签失败"
  exit 1
fi