@echo off
echo 正在部署虚拟交易平台到香港Windows服务器...

echo.
echo 1. 停止现有服务...
taskkill /f /im node.exe 2>nul
taskkill /f /im nginx.exe 2>nul

echo.
echo 2. 备份现有配置...
if not exist "backup" mkdir backup
xcopy "config\nginx\nginx\jcstjj.top.conf" "backup\" /Y
xcopy "nginx.conf" "backup\" /Y

echo.
echo 3. 复制新配置...
xcopy "config\nginx\nginx\jcstjj.top.conf" "C:\nginx\conf\" /Y
xcopy "nginx.conf" "C:\nginx\conf\" /Y

echo.
echo 4. 重启Nginx服务...
net stop nginx 2>nul
net start nginx

echo.
echo 5. 启动Node.js服务...
cd /d "C:\Users\Administrator\virtual-trading-platform"
start "" cmd /c "node src/app.js ^& pause"

echo.
echo 部署完成！
echo 管理面板可通过 https://jcstjj.top/admin/panel 访问
echo 请检查服务是否正常运行
pause