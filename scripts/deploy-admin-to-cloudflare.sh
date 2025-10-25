#!/bin/bash
set -e

echo "=== 部署管理面板到 Cloudflare Pages ==="

# 检查是否安装了wrangler
if ! command -v wrangler &> /dev/null
then
    echo "Wrangler 未安装，正在安装..."
    npm install -g wrangler
fi

# 进入web目录
cd web

# 创建环境变量文件
echo "创建环境变量文件..."
cat > .env.cloudflare << EOF
VITE_API_BASE=https://api.jcstjj.top
EOF

# 使用环境变量文件构建
echo "使用Cloudflare环境变量构建..."
export ENV_FILE=.env.cloudflare
npm run build

# 部署到Cloudflare Pages
echo "部署到Cloudflare Pages..."
# 注意：这需要预先配置wrangler和Cloudflare账户
# wrangler pages deploy dist --project-name=virtual-trading-platform-admin

echo "=== 部署完成 ==="
echo "请确保已在Cloudflare Dashboard中配置了Pages项目"
echo "构建文件位于 dist/ 目录中"