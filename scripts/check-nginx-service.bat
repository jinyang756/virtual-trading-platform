@echo off
setlocal

:: 设置服务名称
set SERVICE_NAME=nginx

:: 检查服务状态
echo 🔍 正在检查 Nginx 服务状态...
sc query %SERVICE_NAME% | findstr "RUNNING" >nul

if %errorlevel% equ 0 (
    echo ✅ Nginx 服务正在运行
) else (
    echo ⚠️ Nginx 服务未运行，正在尝试启动...
    sc start %SERVICE_NAME%
    
    if %errorlevel% equ 0 (
        echo ✅ Nginx 服务启动成功
    ) else (
        echo ❌ Nginx 服务启动失败，尝试重新安装服务...
        
        :: 停止可能存在的服务
        sc stop %SERVICE_NAME% >nul 2>&1
        
        :: 重新安装服务
        cd /d C:\nginx\nginx-1.24.0
        nginx-service.exe stop >nul 2>&1
        nginx-service.exe uninstall >nul 2>&1
        nginx-service.exe install
        nginx-service.exe start
        
        if %errorlevel% equ 0 (
            echo ✅ Nginx 服务重新安装并启动成功
        ) else (
            echo ❌ Nginx 服务重新安装失败
        )
    )
)

:: 检查端口是否开放
echo 🔍 正在检查端口状态...
netstat -an | findstr ":80 " >nul
if %errorlevel% equ 0 (
    echo ✅ HTTP 端口 (80) 已开放
) else (
    echo ⚠️ HTTP 端口 (80) 未开放
)

netstat -an | findstr ":443 " >nul
if %errorlevel% equ 0 (
    echo ✅ HTTPS 端口 (443) 已开放
) else (
    echo ⚠️ HTTPS 端口 (443) 未开放
)

echo.
echo 📊 服务状态检查完成
endlocal
pause