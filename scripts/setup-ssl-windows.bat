@echo off
setlocal

echo SSL证书申请脚本 (Windows + WSL)
echo ================================

echo 1. 检查WSL状态...
wsl -l -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ WSL未正确安装或未启用
    echo 请先完成WSL安装后再运行此脚本
    pause
    exit /b 1
)

echo 2. 检查Ubuntu发行版...
wsl -l -v | findstr Ubuntu >nul
if %errorlevel% neq 0 (
    echo ❌ Ubuntu发行版未安装
    echo 请先安装Ubuntu发行版后再运行此脚本
    pause
    exit /b 1
)

echo 3. 将SSL设置脚本复制到WSL...
copy /Y "%~dp0setup-acme.sh" "\\wsl$\Ubuntu\home\"

echo 4. 在WSL中执行SSL证书申请...
wsl -u root bash -c "chmod +x /home/setup-acme.sh && /home/setup-acme.sh"

if %errorlevel% neq 0 (
    echo ❌ SSL证书申请失败
    pause
    exit /b 1
)

echo 5. 验证证书文件...
if exist "C:\ssl-manager\certs\jcstjj.top.key" (
    if exist "C:\ssl-manager\certs\jcstjj.top.pem" (
        echo 🎉 SSL证书申请成功!
        echo 证书文件已保存到: C:\ssl-manager\certs\
    ) else (
        echo ❌ 证书文件未找到
        pause
        exit /b 1
    )
) else (
    echo ❌ 私钥文件未找到
    pause
    exit /b 1
)

echo 6. 重启Nginx服务...
cd /d "C:\nginx\nginx-1.24.0"
nginx.exe -t && nginx.exe -s reload

if %errorlevel% neq 0 (
    echo ❌ Nginx重载失败
    pause
    exit /b 1
) else (
    echo 🎉 Nginx重载成功!
)

echo.
echo 🎉 所有步骤已完成!
echo SSL证书已申请并配置到Nginx
pause