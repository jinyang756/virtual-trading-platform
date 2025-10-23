@echo off
title 虚拟交易平台部署脚本

echo 🚀 开始部署虚拟交易平台...

echo 📥 拉取最新代码...
git pull origin main

echo 📦 安装依赖...
npm install

echo 🔨 构建前端...
cd web
npm install
npm run build
cd ..

echo 🔄 重启PM2服务...
pm2 reload ecosystem.config.js

echo 💾 保存PM2配置...
pm2 save

echo ✅ 检查服务状态...
pm2 list

echo 🎉 部署完成！

pause
@echo off
setlocal enabledelayedexpansion

:: 虚拟交易平台Windows部署脚本

:: 设置变量
set "PROJECT_DIR=%~dp0.."
set "LOG_FILE=%PROJECT_DIR%\logs\deploy.log"

:: 创建日志目录
if not exist "%PROJECT_DIR%\logs" mkdir "%PROJECT_DIR%\logs"

:: 日志函数
:log
echo [%date% %time%] %~1 >> "%LOG_FILE%"
echo [%date% %time%] %~1
exit /b

:: 检查Node.js是否安装
:check_node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    call :log "错误: Node.js未安装"
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set "node_version=%%i"
call :log "Node.js版本: !node_version!"
exit /b

:: 检查npm是否安装
:check_npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    call :log "错误: npm未安装"
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set "npm_version=%%i"
call :log "npm版本: !npm_version!"
exit /b

:: 安装依赖
:install_dependencies
call :log "安装项目依赖..."
cd /d "%PROJECT_DIR%"
call npm install
if %errorlevel% equ 0 (
    call :log "依赖安装成功"
) else (
    call :log "依赖安装失败"
    exit /b 1
)
exit /b

:: 备份现有数据
:backup_data
call :log "备份现有数据..."
cd /d "%PROJECT_DIR%"
call node scripts/backup.js
if %errorlevel% equ 0 (
    call :log "数据备份成功"
) else (
    call :log "数据备份失败"
    exit /b 1
)
exit /b

:: 启动服务
:start_service
call :log "启动服务..."
cd /d "%PROJECT_DIR%"

:: 检查是否有PM2
where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    pm2 start server.js --name "virtual-trading-platform"
    call :log "服务已通过PM2启动"
) else (
    :: 使用npm start启动
    start "Virtual Trading Platform" /B npm start
    call :log "服务已在后台启动"
)
exit /b

:: 重启服务
:restart_service
call :log "重启服务..."

:: 检查是否有PM2
where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    pm2 restart "virtual-trading-platform"
    call :log "服务已通过PM2重启"
) else (
    :: 杀死现有进程并重新启动
    taskkill /F /FI "WINDOWTITLE eq Virtual Trading Platform*" >nul 2>&1
    cd /d "%PROJECT_DIR%"
    start "Virtual Trading Platform" /B npm start
    call :log "服务已重启"
)
exit /b

:: 停止服务
:stop_service
call :log "停止服务..."

:: 检查是否有PM2
where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    pm2 stop "virtual-trading-platform"
    call :log "服务已通过PM2停止"
) else (
    :: 杀死现有进程
    taskkill /F /FI "WINDOWTITLE eq Virtual Trading Platform*" >nul 2>&1
    call :log "服务已停止"
)
exit /b

:: 显示服务状态
:status_service
:: 检查是否有PM2
where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    pm2 status "virtual-trading-platform"
) else (
    :: 检查进程是否存在
    tasklist /FI "WINDOWTITLE eq Virtual Trading Platform*" 2>nul | findstr /I "node.exe" >nul
    if %errorlevel% equ 0 (
        call :log "服务正在运行"
    ) else (
        call :log "服务未运行"
    )
)
exit /b

:: 主函数
:main
call :log "开始部署虚拟交易平台..."
call :check_node
call :check_npm
call :install_dependencies
call :backup_data
call :start_service
call :log "部署完成!"
exit /b

:: 根据参数执行不同操作
if /i "%1"=="start" (
    call :start_service
    exit /b
)
if /i "%1"=="stop" (
    call :stop_service
    exit /b
)
if /i "%1"=="restart" (
    call :restart_service
    exit /b
)
if /i "%1"=="status" (
    call :status_service
    exit /b
)
if /i "%1"=="backup" (
    call :backup_data
    exit /b
)

:: 默认执行完整部署
call :main