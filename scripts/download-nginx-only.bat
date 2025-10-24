@echo off
setlocal

:: 设置路径
set NGINX_BASE_DIR=C:\nginx
set NGINX_DIR=%NGINX_BASE_DIR%\nginx-1.24.0
set NGINX_ZIP=nginx-1.24.0.zip
set NGINX_URL=http://nginx.org/download/nginx-1.24.0.zip

echo Nginx 下载脚本
echo ===============

:: 检查是否已安装Nginx
if exist "%NGINX_DIR%" (
    echo 发现已存在的Nginx安装: %NGINX_DIR%
    echo 无需重新下载
    pause
    exit /b 0
)

:: 创建Nginx目录
echo 正在创建Nginx目录...
mkdir "%NGINX_BASE_DIR%" 2>nul

:: 下载Nginx
echo 🔽 正在下载 Nginx...
powershell -Command "Invoke-WebRequest -Uri '%NGINX_URL%' -OutFile '%NGINX_BASE_DIR%\%NGINX_ZIP%'"

if %errorlevel% neq 0 (
    echo ❌ Nginx下载失败
    pause
    exit /b 1
)

echo ✅ Nginx下载完成: %NGINX_BASE_DIR%\%NGINX_ZIP%
echo.
echo 下一步: 手动解压zip文件到 %NGINX_BASE_DIR% 目录
echo 然后运行 scripts\setup-nginx-service.bat 来安装服务

pause