@echo off
REM Nginx 服务管理脚本 (Windows版本)
REM 用于管理虚拟交易平台的 Nginx 服务

set NGINX_PATH=C:\nginx
set PROJECT_NGINX_CONF=%cd%\nginx\zhengzutouzi.conf
set NGINX_CONF=%NGINX_PATH%\conf\zhengzutouzi.conf

title Nginx 服务管理工具

:menu
cls
echo ========================================
echo    🛠️  Nginx 服务管理工具
echo ========================================
echo 1. 安装/更新 Nginx 配置
echo 2. 启动 Nginx 服务
echo 3. 停止 Nginx 服务
echo 4. 重启 Nginx 服务
echo 5. 测试 Nginx 配置
echo 6. 查看 Nginx 状态
echo 7. 查看 Nginx 日志目录
echo 8. 退出
echo ========================================
echo.

choice /c 12345678 /m "请选择操作"
if errorlevel 8 goto :eof
if errorlevel 7 goto logs
if errorlevel 6 goto status
if errorlevel 5 goto test
if errorlevel 4 goto restart
if errorlevel 3 goto stop
if errorlevel 2 goto start
if errorlevel 1 goto setup

:setup
echo ⚙️  安装/更新 Nginx 配置...
echo 复制配置文件到 %NGINX_CONF%
copy "%PROJECT_NGINX_CONF%" "%NGINX_CONF%"
if %errorlevel% equ 0 (
    echo ✅ 配置文件复制成功
) else (
    echo ❌ 配置文件复制失败
)
echo.
pause
goto menu

:start
echo 🚀 启动 Nginx 服务...
cd /d %NGINX_PATH%
start nginx.exe
echo ✅ Nginx 服务启动命令已发送
echo.
pause
goto menu

:stop
echo 🛑 停止 Nginx 服务...
cd /d %NGINX_PATH%
nginx.exe -s stop
echo ✅ Nginx 服务停止命令已发送
echo.
pause
goto menu

:restart
echo 🔄 重启 Nginx 服务...
cd /d %NGINX_PATH%
nginx.exe -s reload
echo ✅ Nginx 服务重启命令已发送
echo.
pause
goto menu

:test
echo 🔍 测试 Nginx 配置...
cd /d %NGINX_PATH%
nginx.exe -t
echo.
pause
goto menu

:status
echo 📊 查看 Nginx 进程...
tasklist | findstr nginx
echo.
pause
goto menu

:logs
echo 📋 Nginx 日志目录:
dir %NGINX_PATH%\logs\
echo.
pause
goto menu