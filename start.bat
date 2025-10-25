@echo off
chcp 65001 >nul
echo === 虚拟交易平台启动器 ===
echo.
echo 请选择启动模式：
echo 1. 开发模式 (npm run dev)
echo 2. 生产模式 (PM2)
echo 3. 简化模式 (start-simple.js)
echo 4. 仅启动前端
echo.

set /p choice=请输入选项 (1-4): 

if "%choice%"=="1" (
    echo 启动开发模式...
    npm run dev
) else if "%choice%"=="2" (
    echo 启动生产模式 (PM2)...
    npm run pm2-start
) else if "%choice%"=="3" (
    echo 启动简化模式...
    node start-simple.js
) else if "%choice%"=="4" (
    echo 启动前端开发模式...
    cd web && npm run dev
) else (
    echo 无效选项
    exit /b 1
)