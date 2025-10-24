@echo off
setlocal

:: 设置路径
set NGINX_DIR=C:\nginx\nginx-1.24.0
set SSL_DIR=%NGINX_DIR%\ssl

echo 手动SSL证书配置脚本
echo ===================

:: 创建SSL目录
echo 正在创建SSL目录...
mkdir "%SSL_DIR%" 2>nul

:: 生成自签名证书
echo 正在生成自签名SSL证书...
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout "%SSL_DIR%\jcstjj.top.key" -out "%SSL_DIR%\jcstjj.top.crt" -subj "/C=CN/ST=Beijing/L=Beijing/O=JCS/OU=IT/CN=jcstjj.top"

if %errorlevel% neq 0 (
    echo ❌ 自签名证书生成失败
    echo 请确保系统中已安装 OpenSSL
    pause
    exit /b 1
)

echo ✅ 自签名证书生成成功

:: 更新Nginx配置以使用自签名证书
echo 正在更新Nginx配置...
copy "nginx\jcstjj.top.conf" "%NGINX_DIR%\conf\jcstjj.top.conf"

:: 替换证书路径
powershell -Command "(Get-Content '%NGINX_DIR%\conf\jcstjj.top.conf') -replace '/etc/letsencrypt/live/jcstjj.top/fullchain.pem', '%SSL_DIR:\=\\%\\jcstjj.top.crt' | Set-Content '%NGINX_DIR%\conf\jcstjj.top.conf'"
powershell -Command "(Get-Content '%NGINX_DIR%\conf\jcstjj.top.conf') -replace '/etc/letsencrypt/live/jcstjj.top/privkey.pem', '%SSL_DIR:\=\\%\\jcstjj.top.key' | Set-Content '%NGINX_DIR%\conf\jcstjj.top.conf'"

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
echo 🎉 SSL证书配置完成!
echo.
echo 🌐 访问测试:
echo HTTPS: https://jcstjj.top 或 https://www.jcstjj.top
echo 注意: 浏览器可能会提示证书不受信任，这是正常的自签名证书警告
echo.

echo 📝 下一步建议:
echo 1. 使用 Let's Encrypt 免费证书替换自签名证书
echo 2. 配置自动续期机制
echo 3. 在生产环境中使用受信任的证书颁发机构

pause