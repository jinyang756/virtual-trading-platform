@echo off
setlocal

:: 设置路径
set NGINX_BASE_DIR=C:\nginx
set NGINX_DIR=%NGINX_BASE_DIR%\nginx-1.24.0
set NGINX_ZIP=nginx-1.24.0.zip
set NGINX_URL=http://nginx.org/download/nginx-1.24.0.zip
set WINSW_URL=https://github.com/winsw/winsw/releases/download/v3.0.0/WinSW-x64.exe
set WINSW_EXE=%NGINX_DIR%\nginx-service.exe
set WINSW_XML=%NGINX_DIR%\nginx-service.xml

echo Nginx Windows 自动安装脚本
echo ==========================

:: 检查是否已安装Nginx
if exist "%NGINX_DIR%" (
    echo 发现已存在的Nginx安装: %NGINX_DIR%
    goto install_service
)

:: 创建Nginx目录
echo 正在创建Nginx目录...
mkdir "%NGINX_BASE_DIR%" 2>nul

:: 下载Nginx
echo 🔽 正在下载 Nginx...
powershell -Command "Invoke-WebRequest -Uri '%NGINX_URL%' -OutFile '%NGINX_BASE_DIR%\%NGINX_ZIP%'"

if %errorlevel% neq 0 (
    echo ❌ Nginx下载失败
    pause
    exit /b 1
)

:: 解压Nginx
echo 📦 正在解压 Nginx...
powershell -Command "Expand-Archive -Path '%NGINX_BASE_DIR%\%NGINX_ZIP%' -DestinationPath '%NGINX_BASE_DIR%'"

if %errorlevel% neq 0 (
    echo ❌ Nginx解压失败
    pause
    exit /b 1
)

:: 删除下载的zip文件
del "%NGINX_BASE_DIR%\%NGINX_ZIP%"

echo ✅ Nginx安装完成

:install_service
:: 下载 WinSW 可执行文件
echo 🔽 正在下载 WinSW...
powershell -Command "Invoke-WebRequest -Uri '%WINSW_URL%' -OutFile '%WINSW_EXE%'"

:: 创建 XML 配置文件
echo 🧩 正在生成 nginx-service.xml...
echo ^<service^> > %WINSW_XML%
echo   ^<id^>nginx^</id^> >> %WINSW_XML%
echo   ^<name^>Nginx Service^</name^> >> %WINSW_XML%
echo   ^<description^>自动启动 Nginx 服务^</description^> >> %WINSW_XML%
echo   ^<executable^>%NGINX_DIR%\nginx.exe^</executable^> >> %WINSW_XML%
echo   ^<startarguments^-p %NGINX_DIR%^</startarguments^> >> %WINSW_XML%
echo   ^<stopexecutable^>%NGINX_DIR%\nginx.exe^</stopexecutable^> >> %WINSW_XML%
echo   ^<stoparguments^-p %NGINX_DIR% -s stop^</stoparguments^> >> %WINSW_XML%
echo   ^<logpath^>%NGINX_DIR%\logs^</logpath^> >> %WINSW_XML%
echo   ^<log mode="roll-by-size"^> >> %WINSW_XML%
echo     ^<sizeThreshold^>10240^</sizeThreshold^> >> %WINSW_XML%
echo     ^<keepFiles^>8^</keepFiles^> >> %WINSW_XML%
echo   ^</log^> >> %WINSW_XML%
echo   ^<startmode^>Automatic^</startmode^> >> %WINSW_XML%
echo ^</service^> >> %WINSW_XML%

:: 注册并启动服务
echo 🚀 正在注册 Nginx 为 Windows 服务...
cd /d %NGINX_DIR%
nginx-service.exe install
nginx-service.exe start

if %errorlevel% equ 0 (
    echo ✅ Nginx 服务已注册并启动成功
) else (
    echo ⚠️ Nginx 服务注册可能需要管理员权限，请以管理员身份重新运行此脚本
)

echo.
echo 📝 下一步:
echo 1. 将 nginx\jcstjj.top.conf 复制到 %NGINX_DIR%\conf\
echo 2. 在 %NGINX_DIR%\conf\nginx.conf 中添加 "include jcstjj.top.conf;"
echo 3. 运行 scripts\setup-ssl.bat 来申请SSL证书
echo 4. 使用 scripts\nginx-manager.bat 来管理Nginx服务

endlocal
pause