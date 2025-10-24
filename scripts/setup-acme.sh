#!/bin/bash

# === 基础信息 ===
DOMAIN="jcstjj.top"
SUBDOMAIN="www.jcstjj.top"
CERT_DIR="/mnt/c/ssl-manager/certs"
CF_KEY="YOUR_GLOBAL_API_KEY"  # 需要替换为实际的全局API密钥
CF_EMAIL="guanyu432hz@gmail.com"
ACME_SH_PATH="$HOME/.acme.sh/acme.sh"

# === 安装 acme.sh ===
echo "📥 安装 acme.sh..."
curl https://get.acme.sh | sh
source ~/.bashrc

# === 设置 Cloudflare API 凭据 ===
export CF_Key="$CF_KEY"
export CF_Email="$CF_EMAIL"

# === 验证环境变量 ===
echo "🔍 验证环境变量..."
echo "CF_Key: ${CF_Key:0:5}**********${CF_Key: -5}"  # 显示部分密钥以确认设置
echo "CF_Email: $CF_Email"

# === 设置默认CA为Let's Encrypt ===
echo "🔧 设置默认CA为Let's Encrypt..."
$ACME_SH_PATH --set-default-ca --server letsencrypt

# === 注册账户 ===
echo "👤 注册账户..."
$ACME_SH_PATH --register-account -m "$CF_EMAIL" --debug

# === 申请证书 ===
echo "🔐 正在申请 SSL 证书..."
$ACME_SH_PATH --issue --dns dns_cf -d "$DOMAIN" -d "$SUBDOMAIN" --debug 2>&1

# === 安装证书到指定目录 ===
echo "📦 安装证书到 $CERT_DIR..."
mkdir -p "$CERT_DIR"
$ACME_SH_PATH --install-cert -d "$DOMAIN" \
--key-file "$CERT_DIR/$DOMAIN.key" \
--fullchain-file "$CERT_DIR/$DOMAIN.pem" \
--reloadcmd "powershell.exe -Command 'Start-Process nginx.exe -ArgumentList \"-s reload\" -WorkingDirectory \"C:\\nginx\\nginx-1.24.0\"'"

# === 完成提示 ===
echo "✅ SSL 证书申请与安装完成！"
echo "📁 证书路径：$CERT_DIR"

# === 验证证书是否存在 ===
if [ -f "$CERT_DIR/$DOMAIN.key" ] && [ -f "$CERT_DIR/$DOMAIN.pem" ] && [ -s "$CERT_DIR/$DOMAIN.pem" ]; then
    echo "🎉 证书文件已成功创建！"
else
    echo "❌ 证书文件创建失败，请检查错误信息。"
fi