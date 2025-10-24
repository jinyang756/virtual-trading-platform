@echo off
setlocal

echo SSL 证书申请脚本
echo =================

echo 正在检查 Certbot 是否已安装...
certbot --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到 Certbot。请先安装 Certbot:
    echo.
    echo Linux (Ubuntu/Debian):
    echo   sudo apt update
    echo   sudo apt install certbot python3-certbot-nginx
    echo.
    echo Windows:
    echo   请访问 https://certbot.eff.org/ 获取安装说明
    echo.
    pause
    exit /b 1
)

echo Certbot 已安装，正在申请 SSL 证书...

echo.
echo 请确保:
echo 1. 域名 jcstjj.top 和 www.jcstjj.top 已正确解析到本服务器 IP
echo 2. 服务器的 80 和 443 端口已开放
echo 3. Nginx 配置文件已正确设置
echo.

echo 正在申请证书...
certbot --nginx -d jcstjj.top -d www.jcstjj.top

if %errorlevel% equ 0 (
    echo.
    echo 证书申请成功!
    echo.
    echo 正在设置自动续期...
    certbot renew --dry-run
    echo.
    echo 自动续期测试完成。生产环境将自动续期。
) else (
    echo.
    echo 证书申请失败，请检查错误信息。
)

echo.
echo 正在重启 Nginx 以应用新配置...
nginx.exe -s reload
echo Nginx 重启完成。

echo.
echo SSL 证书配置完成!
pause