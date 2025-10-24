#!/bin/bash

# 虚拟交易平台 SSL 证书申请脚本
# 域名: zhengzutouzi.com

echo "🚀 开始为 zhengzutouzi.com 申请 SSL 证书..."

# 检查是否已安装 Certbot
if ! command -v certbot &> /dev/null
then
    echo "📦 正在安装 Certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# 申请 SSL 证书
echo "🔐 正在申请 SSL 证书..."
sudo certbot --nginx -d zhengzutouzi.com -d www.zhengzutouzi.com

# 检查证书申请结果
if [ $? -eq 0 ]; then
    echo "✅ SSL 证书申请成功！"
    echo "📝 Certbot 已自动更新 Nginx 配置"
else
    echo "❌ SSL 证书申请失败，请检查错误信息"
    exit 1
fi

# 测试 Nginx 配置
echo "🔍 测试 Nginx 配置..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx 配置测试通过"
    echo "🔄 重新加载 Nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx 重新加载完成"
else
    echo "❌ Nginx 配置测试失败"
    exit 1
fi

echo "🎉 SSL 证书配置完成！"
echo "🌐 您可以通过 https://zhengzutouzi.com 访问平台"