@echo off
setlocal

echo Nginx Windows 自动安装脚本
echo ==========================

echo 正在检查系统环境...
ver
echo.

echo 1. 检查是否已安装Nginx...
if exist "C:\nginx" (
    echo 发现已存在的Nginx安装
    goto configure
)

echo 2. 下载并安装Nginx...
echo 请访问 http://nginx.org/en/download.html 下载最新版本的 Nginx for Windows
echo 然后解压到 C:\nginx 目录
echo.

echo 或者您可以使用以下方法自动下载安装:
echo.
echo 方法1: 使用Chocolatey (如果已安装)
echo   choco install nginx
echo.
echo 方法2: 使用Scoop (如果已安装)
echo   scoop install nginx
echo.
echo 方法3: 手动下载
echo   1. 打开浏览器访问 http://nginx.org/en/download.html
echo   2. 下载 Windows 版本的 Nginx
echo   3. 解压到 C:\nginx 目录
echo.

pause
echo.
echo 安装完成后，请重新运行此脚本
exit /b

:configure
echo 3. 配置Nginx...
echo 正在复制配置文件...

if exist "C:\nginx\conf" (
    copy /Y "nginx\jcstjj.top.conf" "C:\nginx\conf\jcstjj.top.conf"
    if %errorlevel% equ 0 (
        echo 配置文件复制成功
    ) else (
        echo 警告: 配置文件复制失败
    )
) else (
    echo 警告: Nginx配置目录不存在 (C:\nginx\conf)
    echo 将配置文件保存在项目目录中
    copy /Y "nginx\jcstjj.top.conf" "jcstjj.top.conf"
)

echo.
echo 4. 配置说明:
echo 请将以下行添加到 C:\nginx\conf\nginx.conf 文件的 http 块中:
echo.
echo include jcstjj.top.conf;
echo.

echo 5. 启动Nginx服务:
echo 运行以下命令启动Nginx:
echo.
echo cd C:\nginx ^&^& nginx.exe
echo.

echo 6. 下一步:
echo 运行 scripts\setup-ssl.bat 来申请SSL证书
echo 使用 scripts\nginx-manager.bat 来管理Nginx服务
echo.

echo Nginx安装和配置完成!
pause