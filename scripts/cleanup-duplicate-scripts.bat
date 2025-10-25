@echo off
echo === 清理重复的脚本文件 ===

echo.
echo 正在清理重复的Nginx脚本文件...
del /Q "scripts\nginx-config-check-reload.bat"
del /Q "scripts\simple-nginx-setup.bat"
echo 已删除重复的Nginx脚本文件

echo.
echo 正在清理重复的安装脚本...
del /Q "scripts\install-nginx-windows-auto.bat"
del /Q "scripts\auto-install-nginx-windows.bat"
echo 已删除重复的安装脚本

echo.
echo 清理完成！

echo.
echo === 保留的重要脚本 ===
echo scripts\nginx-deploy-and-start.bat - Nginx部署和启动脚本
echo scripts\nginx-manager.bat - Nginx管理脚本
echo scripts\install-nginx-windows.bat - Nginx安装脚本