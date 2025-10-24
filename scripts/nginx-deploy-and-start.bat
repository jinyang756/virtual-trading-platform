@echo off
setlocal

:: 设置路径
set NGINX_DIR=C:\nginx\nginx-1.24.0

echo Nginx 部署和启动脚本
echo ====================

:: 检查Nginx目录是否存在
if not exist "%NGINX_DIR%" (
    echo ❌ 错误: Nginx目录不存在: %NGINX_DIR%
    echo 请先安装Nginx
    pause
    exit /b 1
)

:: 检查配置文件是否存在
if not exist "%NGINX_DIR%\conf\nginx.conf" (
    echo ❌ 错误: nginx.conf文件不存在
    echo 正在复制配置文件...
    copy "nginx.conf" "%NGINX_DIR%\conf\nginx.conf"
)

if not exist "%NGINX_DIR%\conf\jcstjj.top.conf" (
    echo ❌ 错误: jcstjj.top.conf文件不存在
    echo 正在复制配置文件...
    copy "nginx\jcstjj.top.conf" "%NGINX_DIR%\conf\jcstjj.top.conf"
)

:: 测试Nginx配置
echo 🔍 正在测试Nginx配置...
cd /d "%NGINX_DIR%"
nginx.exe -t

if %errorlevel% neq 0 (
    echo ❌ Nginx配置测试失败
    pause
    exit /b 1
)

echo ✅ Nginx配置测试通过

:: 检查Nginx是否已在运行
tasklist /fi "imagename eq nginx.exe" | findstr "nginx.exe" >nul
if %errorlevel% equ 0 (
    echo 🔁 Nginx已在运行，正在重新加载配置...
    nginx.exe -s reload
    if %errorlevel% equ 0 (
        echo ✅ Nginx配置重新加载成功
    ) else (
        echo ❌ Nginx配置重新加载失败
    )
) else (
    echo 🚀 正在启动Nginx...
    nginx.exe
    if %errorlevel% equ 0 (
        echo ✅ Nginx启动成功
    ) else (
        echo ❌ Nginx启动失败
    )
)

echo.
echo 📊 Nginx状态检查:
tasklist /fi "imagename eq nginx.exe"
echo.
echo 🌐 访问测试:
echo 请在浏览器中访问 http://jcstjj.top 或 http://www.jcstjj.top
echo.

echo 📝 下一步:
echo 1. 运行 scripts\setup-ssl.bat 来申请SSL证书
echo 2. 使用 scripts\nginx-manager.bat 来管理Nginx服务

pause