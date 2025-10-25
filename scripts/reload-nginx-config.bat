@echo off
setlocal

:: 设置路径
set NGINX_DIR=C:\nginx\nginx-1.24.0

echo 重新加载Nginx配置
echo ==================

:: 检查Nginx目录是否存在
if not exist "%NGINX_DIR%" (
    echo ❌ 错误: Nginx目录不存在: %NGINX_DIR%
    echo 请先安装Nginx
    pause
    exit /b 1
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

:: 重新加载Nginx配置
echo 🔄 正在重新加载Nginx配置...
nginx.exe -s reload

if %errorlevel% equ 0 (
    echo ✅ Nginx配置重新加载成功
) else (
    echo ❌ Nginx配置重新加载失败
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
echo 🎉 配置重新加载完成!

pause