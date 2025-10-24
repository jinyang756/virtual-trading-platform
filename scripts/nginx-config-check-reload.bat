@echo off
setlocal

:: 设置路径
set NGINX_DIR=C:\nginx\nginx-1.24.0

echo Nginx 配置检查和重载脚本
echo ========================

:: 检查Nginx目录是否存在
if not exist "%NGINX_DIR%" (
    echo ❌ 错误: Nginx目录不存在: %NGINX_DIR%
    pause
    exit /b 1
)

:: 测试Nginx配置语法
echo 🔍 正在检查Nginx配置语法...
cd /d "%NGINX_DIR%"
nginx.exe -t

if %errorlevel% neq 0 (
    echo ❌ Nginx配置语法检查失败
    echo 请检查配置文件中的错误
    pause
    exit /b 1
)

echo ✅ Nginx配置语法检查通过

:: 重载Nginx配置
echo 🔄 正在重载Nginx配置...
nginx.exe -s reload

if %errorlevel% equ 0 (
    echo ✅ Nginx配置重载成功
) else (
    echo ❌ Nginx配置重载失败
    pause
    exit /b 1
)

:: 显示Nginx状态
echo.
echo 📊 Nginx进程状态:
tasklist /fi "imagename eq nginx.exe" | findstr "nginx"
if %errorlevel% neq 0 (
    echo Nginx进程未运行
)

echo.
echo 🎉 配置检查和重载完成!

pause