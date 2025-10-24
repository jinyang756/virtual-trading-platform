@echo off
setlocal

:: 设置路径
set NGINX_DIR=C:\nginx\nginx-1.24.0
set SSL_DIR=%NGINX_DIR%\ssl

echo 启用HTTPS脚本
echo ==============

:: 创建SSL目录
echo 正在创建SSL目录...
mkdir "%SSL_DIR%" 2>nul

:: 复制Nginx配置文件
echo 正在复制Nginx配置文件...
copy "nginx\jcstjj.top.conf" "%NGINX_DIR%\conf\jcstjj.top.conf"

:: 更新证书路径（适配Windows路径）
echo 正在更新证书路径...
powershell -Command "(Get-Content '%NGINX_DIR%\conf\jcstjj.top.conf') -replace '/etc/nginx/ssl/jcstjj.top.pem', '%SSL_DIR:\=\\%\\jcstjj.top.pem' | Set-Content '%NGINX_DIR%\conf\jcstjj.top.conf'"
powershell -Command "(Get-Content '%NGINX_DIR%\conf\jcstjj.top.conf') -replace '/etc/nginx/ssl/jcstjj.top.key', '%SSL_DIR:\=\\%\\jcstjj.top.key' | Set-Content '%NGINX_DIR%\conf\jcstjj.top.conf'"

echo ✅ Nginx配置更新完成

:: 测试Nginx配置
echo 正在测试Nginx配置...
cd /d "%NGINX_DIR%"
nginx.exe -t

if %errorlevel% neq 0 (
    echo ⚠️ Nginx配置测试失败（证书文件可能尚未存在）
    echo 请在申请证书后再重新加载配置
) else (
    echo ✅ Nginx配置测试通过
)

:: 重新加载Nginx配置
echo 正在重新加载Nginx配置...
nginx.exe -s reload

echo.
echo 🎉 HTTPS配置完成!
echo.
echo 📝 下一步:
echo 1. 运行 scripts\install-acme-windows.bat 来申请SSL证书
echo 2. 证书申请成功后再次运行此脚本以重新加载配置
echo 3. 访问 https://jcstjj.top 测试HTTPS是否正常工作

pause