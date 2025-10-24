#!/bin/bash

# 设置 Cloudflare API Token
export CF_Token="ygil2YkieHrj0khpA9CYwOCzXZtp_QZr9okYRWQd"

# 设置邮箱（可选）
export CF_Email="guanyu432hz@gmail.com"

# 创建SSL目录（如果不存在）
sudo mkdir -p /etc/nginx/ssl

# 安装 acme.sh（如果尚未安装）
if ! command -v acme.sh &> /dev/null; then
  echo "正在安装 acme.sh..."
  curl https://get.acme.sh | sh
  source ~/.bashrc
fi

# 申请证书
echo "正在申请SSL证书..."
~/.acme.sh/acme.sh --issue --dns dns_cf -d jcstjj.top -d www.jcstjj.top

# 安装证书到指定路径（请根据你的 Nginx 路径调整）
echo "正在安装SSL证书..."
~/.acme.sh/acme.sh --install-cert -d jcstjj.top \
--key-file       /etc/nginx/ssl/jcstjj.top.key \
--fullchain-file /etc/nginx/ssl/jcstjj.top.pem \
--reloadcmd     "nginx -s reload"

echo "SSL证书申请和安装完成！"