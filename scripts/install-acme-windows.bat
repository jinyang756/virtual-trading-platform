@echo off
setlocal

echo acme.sh Windows 安装和证书申请脚本
echo ====================================

echo 1. 正在检查系统环境...
ver
echo.

echo 2. 检查是否已安装 curl...
curl --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 curl，正在安装...
    echo 请确保系统中已安装 curl
    pause
    exit /b 1
)

echo ✅ curl 已安装

echo 3. 正在下载并安装 acme.sh...
powershell -Command "Invoke-WebRequest -Uri 'https://get.acme.sh' -OutFile 'acme.sh.install.ps1'"

if %errorlevel% neq 0 (
    echo ❌ acme.sh 下载失败
    pause
    exit /b 1
)

echo 4. 正在执行 acme.sh 安装...
powershell -ExecutionPolicy Bypass -File acme.sh.install.ps1

if %errorlevel% neq 0 (
    echo ❌ acme.sh 安装失败
    pause
    exit /b 1
)

echo ✅ acme.sh 安装成功

echo 5. 设置 Cloudflare API Token...
set CF_Token=ygil2YkieHrj0khpA9CYwOCzXZtp_QZr9okYRWQd
set CF_Email=guanyu432hz@gmail.com

echo 6. 正在申请证书...
acme.sh --issue --dns dns_cf -d jcstjj.top -d www.jcstjj.top

if %errorlevel% neq 0 (
    echo ❌ 证书申请失败
    pause
    exit /b 1
)

echo ✅ 证书申请成功

echo 7. 正在安装证书...
acme.sh --install-cert -d jcstjj.top --key-file C:
ginx
ginx-1.24.0\ssl\jcstjj.top.key --fullchain-file C:
ginx
ginx-1.24.0\ssl\jcstjj.top.pem --reloadcmd "C:
ginx
ginx-1.24.0
ginx.exe -s reload"

if %errorlevel% neq 0 (
    echo ❌ 证书安装失败
    pause
    exit /b 1
)

echo.
echo 🎉 SSL证书申请和安装完成!
echo.
echo 📝 下一步:
echo 1. 更新 Nginx 配置以使用新证书
echo 2. 配置自动续签任务
echo 3. 测试 HTTPS 访问

pause