@echo off
setlocal

echo Nginx Manager Script
echo ====================

:menu
echo.
echo 请选择操作:
echo 1. 启动 Nginx
echo 2. 停止 Nginx
echo 3. 重启 Nginx
echo 4. 重新加载配置
echo 5. 检查配置文件
echo 6. 查看状态
echo 7. 申请 SSL 证书 (需要先安装 Certbot)
echo 8. 退出
echo.

set /p choice=请输入选项 (1-8): 

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto reload
if "%choice%"=="5" goto check
if "%choice%"=="6" goto status
if "%choice%"=="7" goto ssl
if "%choice%"=="8" goto exit

echo 无效选项，请重新选择
goto menu

:start
echo 正在启动 Nginx...
nginx.exe
echo Nginx 启动完成
goto menu

:stop
echo 正在停止 Nginx...
nginx.exe -s stop
echo Nginx 已停止
goto menu

:restart
echo 正在重启 Nginx...
nginx.exe -s reload
timeout /t 2 /nobreak >nul
nginx.exe
echo Nginx 重启完成
goto menu

:reload
echo 正在重新加载 Nginx 配置...
nginx.exe -s reload
echo Nginx 配置重新加载完成
goto menu

:check
echo 正在检查 Nginx 配置文件...
nginx.exe -t
echo 配置检查完成
goto menu

:status
echo 正在检查 Nginx 状态...
tasklist /fi "imagename eq nginx.exe"
echo 状态检查完成
goto menu

:ssl
echo 申请 SSL 证书 (需要先安装 Certbot)...
echo 请确保已安装 Certbot:
echo sudo apt install certbot python3-certbot-nginx
echo.
echo 然后运行:
echo certbot --nginx -d jcstjj.top -d www.jcstjj.top
echo.
echo 设置自动续期:
echo systemctl enable certbot.timer
echo.
pause
goto menu

:exit
echo 感谢使用 Nginx Manager!
exit /b