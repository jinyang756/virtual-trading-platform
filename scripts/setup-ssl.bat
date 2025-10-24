@echo off
REM 虚拟交易平台 SSL 证书申请脚本 (Windows版本)
REM 域名: zhengzutouzi.com

echo 🚀 开始为 zhengzutouzi.com 申请 SSL 证书...

REM 检查是否已安装 Certbot
where certbot >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 正在安装 Certbot...
    echo 请先安装 Certbot:
    echo 1. 访问 https://certbot.eff.org/instructions 下载 Windows 版本
    echo 2. 安装 Certbot
    echo 3. 重新运行此脚本
    pause
    exit /b 1
)

REM 申请 SSL 证书
echo 🔐 正在申请 SSL 证书...
certbot --nginx -d zhengzutouzi.com -d www.zhengzutouzi.com

REM 检查证书申请结果
if %errorlevel% equ 0 (
    echo ✅ SSL 证书申请成功！
    echo 📝 Certbot 已自动更新 Nginx 配置
) else (
    echo ❌ SSL 证书申请失败，请检查错误信息
    pause
    exit /b 1
)

REM 测试 Nginx 配置
echo 🔍 测试 Nginx 配置...
nginx -t

if %errorlevel% equ 0 (
    echo ✅ Nginx 配置测试通过
    echo 🔄 重新加载 Nginx...
    nginx -s reload
    echo ✅ Nginx 重新加载完成
) else (
    echo ❌ Nginx 配置测试失败
    pause
    exit /b 1
)

echo 🎉 SSL 证书配置完成！
echo 🌐 您可以通过 https://zhengzutouzi.com 访问平台
pause