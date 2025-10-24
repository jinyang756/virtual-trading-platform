@echo off
setlocal

echo acme.sh Windows 直接安装脚本
echo ==========================

:: 检查是否以管理员身份运行
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 请以管理员身份运行此脚本
    pause
    exit /b 1
)

echo 1. 正在检查系统环境...
ver
echo.

echo 2. 检查是否已安装 curl...
curl --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 curl
    echo 正在尝试安装 curl...
    
    :: 尝试使用Chocolatey安装curl
    choco --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo 正在使用Chocolatey安装curl...
        choco install curl -y
    ) else (
        echo 未安装Chocolatey，无法自动安装curl
        echo 请手动安装curl后再运行此脚本
        pause
        exit /b 1
    )
)

echo ✅ curl 已安装

echo 3. 正在下载acme.sh安装脚本...
powershell -Command "Invoke-WebRequest -Uri 'https://get.acme.sh' -OutFile 'get_acme.sh.ps1'"

if %errorlevel% neq 0 (
    echo ❌ acme.sh 安装脚本下载失败
    echo 尝试使用curl下载...
    curl -L https://get.acme.sh -o get_acme.sh.ps1
    
    if %errorlevel% neq 0 (
        echo ❌ 使用curl下载也失败
        pause
        exit /b 1
    )
)

echo ✅ acme.sh 安装脚本下载成功

echo 4. 正在安装acme.sh...
:: 使用PowerShell执行安装脚本
powershell -ExecutionPolicy Bypass -File get_acme.sh.ps1

if %errorlevel% neq 0 (
    echo ❌ acme.sh 安装失败
    echo 尝试使用bash执行...
    
    :: 检查是否有bash环境
    bash --version >nul 2>&1
    if %errorlevel% equ 0 (
        bash get_acme.sh.ps1
        if %errorlevel% neq 0 (
            echo ❌ 使用bash执行也失败
            pause
            exit /b 1
        )
    ) else (
        echo 未检测到bash环境，无法继续安装
        pause
        exit /b 1
    )
)

echo ✅ acme.sh 安装成功

echo 5. 验证安装...
acme.sh --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ acme.sh 可用
) else (
    echo ⚠️ acme.sh 安装完成但不可用
)

echo.
echo 🎉 acme.sh 安装完成!
pause