@echo off
setlocal

echo WSL安装完成后续操作脚本
echo ==========================

echo 1. 请重启系统以完成WSL安装
echo.

echo 2. 系统重启后，请打开"Ubuntu"应用完成初始设置
echo    - 设置默认用户名和密码
echo.

echo 3. 如果无法通过Microsoft Store安装Ubuntu，可以使用以下方法:
echo    a. 使用Chocolatey安装:
echo       choco install wsl-ubuntu-2004 -y
echo    b. 或者手动下载并安装Ubuntu:
echo       https://aka.ms/wslubuntu2004
echo.

echo 4. 在Ubuntu终端中执行以下命令安装acme.sh:
echo    curl https://get.acme.sh ^| sh
echo    source ~/.bashrc
echo.

echo 5. 然后执行以下命令申请SSL证书:
echo    export CF_Token="ygil2YkieHrj0khpA9CYwOCzXZtp_QZr9okYRWQd"
echo    export CF_Email="guanyu432hz@gmail.com"
echo    acme.sh --issue --dns dns_cf -d jcstjj.top -d www.jcstjj.top
echo.

echo 6. 安装证书到指定路径:
echo    acme.sh --install-cert -d jcstjj.top ^
echo    --key-file /mnt/c/ssl-manager/certs/jcstjj.top.key ^
echo    --fullchain-file /mnt/c/ssl-manager/certs/jcstjj.top.pem ^
echo    --reloadcmd "powershell.exe -Command 'Start-Process nginx.exe -ArgumentList \"-s reload\" -WorkingDirectory \"C:\\nginx\\nginx-1.24.0\"'"
echo.

echo 7. 或者可以直接运行我们准备好的脚本:
echo    cd /mnt/c/ssl-manager
echo    /mnt/c/Users/Administrator/jucaizhongfa/scripts/setup-ssl-wsl.sh
echo.

echo 8. 最后重启Nginx服务以应用新证书
echo.

pause