#!/bin/bash
set -e

echo "=== 带Cloudflare的自动化部署 ==="

# 加载环境变量
if [ -f .env.nginx ]; then
    source .env.nginx
    echo "已加载环境变量"
fi

# 1. 拉取最新代码
echo "1. 拉取最新代码..."
git pull origin main

# 2. 安装依赖
echo "2. 安装依赖..."
npm install
cd web && npm install && cd ..

# 3. 构建前端
echo "3. 构建前端应用..."
cd web && npm run build && cd ..

# 4. 更新PM2服务
echo "4. 更新PM2服务..."
npm run pm2-restart

# 5. 更新Nginx配置
echo "5. 更新Nginx配置..."
sudo cp nginx/jcstjj.top.optimized.conf /etc/nginx/sites-available/jcstjj.top
sudo ln -sf /etc/nginx/sites-available/jcstjj.top /etc/nginx/sites-enabled/

# 6. 测试Nginx配置
echo "6. 测试Nginx配置..."
sudo nginx -t

# 7. 重载Nginx
echo "7. 重载Nginx服务..."
sudo systemctl reload nginx

# 8. Cloudflare缓存清理
echo "8. 清理Cloudflare缓存..."
# 这里可以添加Cloudflare API调用清理缓存

echo "=== 部署完成 ==="
echo "访问地址: https://jcstjj.top"
echo "管理面板: https://jcstjj.top/admin/panel"