@echo off
setlocal

echo Nginx Windows 安装脚本
echo =====================

echo 正在检查系统环境...
ver
echo.

echo 1. 下载 Nginx for Windows...
echo 请访问 http://nginx.org/en/download.html 下载最新版本的 Nginx for Windows
echo 下载完成后解压到 C:\nginx 目录
echo.

echo 2. 创建 Nginx 配置目录...
if not exist "C:\nginx" (
    echo 错误: 未找到 Nginx 安装目录 C:\nginx
    echo 请先下载并解压 Nginx 到 C:\nginx 目录
    echo.
    pause
    exit /b 1
)

echo 3. 复制配置文件到 Nginx 配置目录...
copy /Y "nginx\jcstjj.top.conf" "C:\nginx\conf\jcstjj.top.conf"
if %errorlevel% neq 0 (
    echo 警告: 无法复制配置文件到 C:\nginx\conf\ 目录
    echo 将配置文件复制到项目 nginx 目录中
    echo.
)

echo 4. 配置 Nginx 主配置文件...
echo 请将以下内容添加到 C:\nginx\conf\nginx.conf 的 http 块中:
echo.
echo include jcstjj.top.conf;
echo.

echo 5. Windows 下 Certbot 安装说明:
echo 请访问 https://certbot.eff.org/instructions?ws=nginx&os=windows 下载 Windows 版 Certbot
echo 安装完成后，使用以下命令申请证书:
echo.
echo certbot --nginx -d jcstjj.top -d www.jcstjj.top
echo.

echo 6. Nginx Windows 服务安装:
echo Windows 版 Nginx 不像 Linux 版本那样作为系统服务运行
echo 可以通过以下方式运行:
echo.
echo 启动: cd C:\nginx && start nginx.exe
echo 停止: cd C:\nginx && nginx.exe -s stop
echo 重载: cd C:\nginx && nginx.exe -s reload
echo.

echo 安装完成!
echo 请按照上述说明完成 Nginx 配置和 SSL 证书申请
pause