@echo off
setlocal

:: 设置路径
set NGINX_DIR=C:\nginx\nginx-1.24.0

echo HTTPS重定向配置脚本
echo ===================

:: 更新Nginx配置以确保HTTP到HTTPS重定向
echo 正在更新Nginx配置以确保HTTP到HTTPS重定向...

:: 复制配置文件
copy "nginx\jcstjj.top.conf" "%NGINX_DIR%\conf\jcstjj.top.conf"

echo ✅ Nginx配置更新完成

:: 测试Nginx配置
echo 正在测试Nginx配置...
cd /d "%NGINX_DIR%"
nginx.exe -t

if %errorlevel% neq 0 (
    echo ❌ Nginx配置测试失败
    pause
    exit /b 1
)

echo ✅ Nginx配置测试通过

:: 重新加载Nginx配置
echo 正在重新加载Nginx配置...
nginx.exe -s reload

if %errorlevel% neq 0 (
    echo ❌ Nginx配置重新加载失败
    pause
    exit /b 1
)

echo.
echo 🎉 HTTPS重定向配置完成!
echo.
echo 🌐 访问测试:
echo HTTP:  http://jcstjj.top 或 http://www.jcstjj.top (将重定向到HTTPS)
echo.
echo 📝 下一步建议:
echo 1. 手动申请Let's Encrypt证书并配置到Nginx
echo 2. 或使用云服务商提供的SSL证书
echo 3. 配置自动续期机制

pause