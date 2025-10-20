@echo off
title Git自动安装工具

echo ================================
echo Git自动安装工具
echo ================================
echo.

echo 正在检查系统架构...
set "ARCH=64"
if /i "%PROCESSOR_ARCHITECTURE%"=="x86" (
    if not defined PROCESSOR_ARCHITEW6432 set "ARCH=32"
)

echo 检测到系统架构: %ARCH%位
echo.

echo 正在下载Git安装包...
echo.

REM 创建临时目录
set "TEMP_DIR=%TEMP%\GitInstall"
mkdir "%TEMP_DIR%" 2>nul

REM 下载Git安装包
echo 正在从GitHub下载Git安装包...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.45.2.windows.1/Git-2.45.2-%ARCH%-bit.exe' -OutFile '%TEMP_DIR%\Git-Installer.exe'"

if %errorlevel% neq 0 (
    echo.
    echo 错误: 下载失败，请检查网络连接后重试
    echo 或手动下载安装包: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo.
echo 下载完成!
echo.

echo 开始安装Git...
echo 请在安装向导中按照默认设置进行安装
echo 安装完成后，请重新启动命令行工具
echo.

REM 运行安装程序
"%TEMP_DIR%\Git-Installer.exe"

if %errorlevel% neq 0 (
    echo.
    echo 安装过程中出现错误
    echo.
) else (
    echo.
    echo Git安装程序已启动
    echo 请按照安装向导的提示完成安装
    echo.
)

echo 清理临时文件...
rmdir /s /q "%TEMP_DIR%" 2>nul

echo.
echo 安装完成后，请执行以下步骤:
echo 1. 重新启动命令行工具
echo 2. 运行 init-git.bat 初始化Git仓库
echo.
pause