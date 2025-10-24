@echo off
setlocal

:: 设置路径
set NGINX_DIR=C:\nginx\nginx-1.24.0

echo 简化版 Nginx 设置脚本
echo ====================

:: 检查Nginx是否存在
if not exist "%NGINX_DIR%\nginx.exe" (
    echo ❌ 错误: 未找到 Nginx 可执行文件: %NGINX_DIR%\nginx.exe
    echo 请确保已正确安装 Nginx
    pause
    exit /b 1
)

:: 复制配置文件
echo 正在复制配置文件...
copy /Y "nginx\jcstjj.top.conf" "%NGINX_DIR%\conf\jcstjj.top.conf"

:: 更新nginx.conf以包含新配置
echo 正在更新 nginx.conf...
echo. >> "%NGINX_DIR%\conf\nginx.conf"
echo # 包含 jcstjj.top 配置 >> "%NGINX_DIR%\conf\nginx.conf"
echo include jcstjj.top.conf; >> "%NGINX_DIR%\conf\nginx.conf"

echo.
echo ✅ Nginx 配置已完成
echo.
echo 下一步:
echo 1. 打开命令提示符并导航到 %NGINX_DIR%
echo 2. 运行 nginx.exe 启动 Nginx
echo 3. 运行 scripts\setup-ssl.bat 来申请SSL证书

pause