@echo off
setlocal

:: 设置路径
set NGINX_DIR=C:\nginx\nginx-1.24.0
set WINSW_URL=https://github.com/winsw/winsw/releases/download/v3.0.0/WinSW-x64.exe
set WINSW_EXE=%NGINX_DIR%\nginx-service.exe
set WINSW_XML=%NGINX_DIR%\nginx-service.xml

:: 检查Nginx目录是否存在
if not exist "%NGINX_DIR%" (
    echo ❌ 错误: Nginx目录不存在: %NGINX_DIR%
    echo 请先下载并解压Nginx到指定目录
    pause
    exit /b 1
)

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

echo ✅ Nginx 服务已注册并启动成功
endlocal
pause