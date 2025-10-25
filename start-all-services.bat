@echo off
echo 正在启动虚拟交易平台所有服务...

echo.
echo 1. 启动PM2应用...
cd /d "C:\Users\Administrator\virtual-trading-platform"
pm2 start config/pm2/ecosystem.config.js

echo.
echo 2. 启动Nginx...
net start nginx

echo.
echo 3. 检查服务状态...
pm2 list

echo.
echo 所有服务已启动完成！
echo 管理面板可通过 https://jcstjj.top/admin/panel 访问
pause