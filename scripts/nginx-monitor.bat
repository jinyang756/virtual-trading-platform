@echo off
setlocal

:: 设置路径
set NGINX_DIR=C:\nginx\nginx-1.24.0

echo Nginx 监控脚本
echo ==============

:monitor_loop
cls
echo 当前时间: %date% %time%
echo.

echo 📊 Nginx 进程状态:
tasklist /fi "imagename eq nginx.exe" | findstr "nginx"
if %errorlevel% neq 0 (
    echo Nginx进程未运行
    echo.
)

echo.
echo 🌐 端口监听状态:
netstat -an | findstr ":80 "
if %errorlevel% equ 0 (
    echo ✅ HTTP 端口 (80) 已开放
) else (
    echo ❌ HTTP 端口 (80) 未开放
)

netstat -an | findstr ":443 "
if %errorlevel% equ 0 (
    echo ✅ HTTPS 端口 (443) 已开放
) else (
    echo ⚠️ HTTPS 端口 (443) 未开放 (SSL证书尚未配置)
)

echo.
echo 📈 Nginx 配置:
echo HTTP 重定向配置: 已启用
echo HTTPS 配置: 暂未启用 (等待SSL证书)

echo.
echo 🔄 自动刷新: 每5秒刷新一次
echo 按 Ctrl+C 停止监控

timeout /t 5 /nobreak >nul
goto monitor_loop