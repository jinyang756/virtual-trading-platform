@echo off
setlocal

:: 设置路径
set NGINX_DIR=C:\nginx\nginx-1.24.0

echo 一键部署脚本 (Nginx + SSL + 服务启动)
echo ======================================

:: 步骤1: 部署Nginx配置
echo 步骤1: 部署Nginx配置...
call scripts\nginx-deploy-and-start.bat

if %errorlevel% neq 0 (
    echo ❌ Nginx部署失败
    pause
    exit /b 1
)

:: 步骤2: 申请SSL证书
echo 步骤2: 申请SSL证书...
echo 请确保已安装Certbot:
echo 1. 访问 https://certbot.eff.org/instructions?ws=nginx&os=windows
echo 2. 下载并安装Windows版本的Certbot
echo 3. 按任意键继续申请证书...
pause

:: 检查Certbot是否已安装
certbot --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Certbot未安装，请先安装Certbot
    pause
    exit /b 1
)

echo 正在申请SSL证书...
certbot --nginx -d jcstjj.top -d www.jcstjj.top

if %errorlevel% equ 0 (
    echo ✅ SSL证书申请成功
) else (
    echo ❌ SSL证书申请失败
    pause
    exit /b 1
)

:: 步骤3: 重新启动Nginx以应用SSL配置
echo 步骤3: 重新启动Nginx以应用SSL配置...
cd /d "%NGINX_DIR%"
nginx.exe -s reload

if %errorlevel% equ 0 (
    echo ✅ Nginx重新加载成功
) else (
    echo ❌ Nginx重新加载失败
    pause
    exit /b 1
)

:: 步骤4: 设置自动续期
echo 步骤4: 设置SSL证书自动续期...
echo 请手动设置Windows计划任务来定期运行:
echo certbot renew --quiet
echo 或者使用Windows服务方式设置自动续期

echo.
echo 🎉 一键部署完成!
echo.
echo 🌐 访问测试:
echo HTTP:  http://jcstjj.top 或 http://www.jcstjj.top
echo HTTPS: https://jcstjj.top 或 https://www.jcstjj.top
echo.

echo 📝 管理命令:
echo 启动Nginx: nginx.exe
echo 停止Nginx: nginx.exe -s stop
echo 重载配置: nginx.exe -s reload
echo 使用 scripts\nginx-manager.bat 可以更方便地管理Nginx

pause