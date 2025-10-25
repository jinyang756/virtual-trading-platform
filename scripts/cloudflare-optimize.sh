#!/bin/bash
echo "=== Cloudflare 优化配置 ==="

# 1. 下载Cloudflare IP列表
echo "1. 下载Cloudflare IP列表..."
curl -s https://www.cloudflare.com/ips-v4 -o /tmp/cf-ips-v4
curl -s https://www.cloudflare.com/ips-v6 -o /tmp/cf-ips-v6

# 2. 生成Nginx Cloudflare配置片段
echo "2. 生成Cloudflare IP配置..."
cat > /tmp/cf-nginx.conf << EOF
# Cloudflare IP 配置 (自动生成)
$(awk '{print "set_real_ip_from " $0 ";"}' /tmp/cf-ips-v4)
$(awk '{print "set_real_ip_from " $0 ";"}' /tmp/cf-ips-v6)
real_ip_header CF-Connecting-IP;
EOF

# 3. 更新Nginx配置
echo "3. 更新Nginx配置..."
# 这里可以添加自动替换配置文件的逻辑

# 4. 重启Nginx服务
echo "4. 重启Nginx服务..."
sudo systemctl restart nginx

echo "=== Cloudflare 优化配置完成 ==="