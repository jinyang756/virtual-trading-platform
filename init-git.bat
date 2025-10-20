@echo off
title 虚拟交易平台 Git 初始化工具

echo ================================
echo 虚拟交易平台 Git 初始化工具
echo ================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Node.js安装
    echo 请先安装Node.js，然后重新运行此工具
    echo.
    pause
    exit /b 1
)

echo Node.js版本: 
node --version
echo.

REM 运行Git初始化脚本
echo 正在运行Git初始化脚本...
echo.
node scripts/init-git-repo.js

echo.
echo 初始化脚本执行完成
echo.
echo 请按照屏幕上的指示完成剩余的Git配置步骤
echo.
pause