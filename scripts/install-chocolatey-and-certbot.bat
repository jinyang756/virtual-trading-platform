@echo off
setlocal

echo Chocolatey 和 Certbot 自动安装脚本
echo ====================================

echo 正在检查系统环境...
ver
echo.

echo 1. 检查是否已安装Chocolatey...
choco --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Chocolatey，正在安装...
    echo 请确保以管理员身份运行此脚本
    echo.
    
    echo 正在下载并安装 Chocolatey...
    powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
    
    if %errorlevel% neq 0 (
        echo ❌ Chocolatey 安装失败
        pause
        exit /b 1
    )
    
    echo ✅ Chocolatey 安装成功
) else (
    echo ✅ Chocolatey 已安装
)

echo 2. 正在刷新环境变量...
call refreshenv

echo 3. 正在安装 Certbot...
choco install certbot -y

if %errorlevel% neq 0 (
    echo ❌ Certbot 安装失败
    pause
    exit /b 1
)

echo ✅ Certbot 安装成功

echo 4. 验证安装...
certbot --version

if %errorlevel% neq 0 (
    echo ❌ Certbot 安装验证失败
    pause
    exit /b 1
)

echo.
echo 🎉 Chocolatey 和 Certbot 安装完成!
echo.
echo 下一步:
echo 1. 运行 scripts\one-click-deploy.bat 来申请SSL证书
echo 2. 或直接运行 certbot --nginx -d jcstjj.top -d www.jcstjj.top

pause