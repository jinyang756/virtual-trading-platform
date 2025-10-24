@echo off
setlocal

echo Nginx 状态监控脚本
echo ==================

:: 设置Nginx路径
set NGINX_DIR=C:\nginx\nginx-1.24.0

:: 检查Nginx进程是否存在
echo 1. 检查Nginx进程状态...
tasklist /fi "imagename eq nginx.exe" | find /i "nginx.exe" >nul

if %errorlevel% equ 0 (
    echo ✅ Nginx进程正在运行
) else (
    echo ❌ Nginx进程未运行
    echo 正在启动Nginx...
    cd /d "%NGINX_DIR%"
    start nginx.exe
    timeout /t 3 /nobreak >nul
)

:: 测试Nginx配置
echo 2. 测试Nginx配置文件...
cd /d "%NGINX_DIR%"
nginx.exe -t

if %errorlevel% equ 0 (
    echo ✅ Nginx配置文件正确
) else (
    echo ❌ Nginx配置文件存在错误
)

:: 检查端口监听状态
echo 3. 检查端口监听状态...
netstat -an | findstr :80 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo ✅ 80端口正在监听
) else (
    echo ⚠️ 80端口未监听
)

netstat -an | findstr :443 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo ✅ 443端口正在监听
) else (
    echo ⚠️ 443端口未监听
)

:: 检查HTTPS访问
echo 4. 测试HTTPS访问...
powershell -Command "Invoke-WebRequest -Uri 'https://jcstjj.top' -UseBasicParsing -TimeoutSec 10" >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ HTTPS访问正常
) else (
    echo ❌ HTTPS访问异常
)

echo.
echo 📊 监控完成时间: %date% %time%
echo.

:: 记录日志
echo %date% %time% - 监控完成 >> C:\ssl-manager\logs\nginx-monitor.log

pause