@echo off
title Git下载工具

echo ================================
echo Git下载工具
echo ================================
echo.

echo 正在下载Git安装包...
echo.

powershell -Command "Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.45.2.windows.1/Git-2.45.2-64-bit.exe' -OutFile 'Git-Installer.exe'"

if %errorlevel% neq 0 (
    echo.
    echo 错误: 下载失败
    echo 请手动下载: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo.
echo 下载完成!
echo 文件已保存为: Git-Installer.exe
echo.
echo 请双击运行该文件完成安装
echo 安装完成后，请重新启动命令行工具
echo.
pause