@echo off
echo === 清理重复和过时的文件 ===

echo.
echo 正在清理重复的Nginx配置文件...
del /Q "new_nginx.conf"
del /Q "new_jcstjj.top.conf"
echo 已删除 new_nginx.conf, new_jcstjj.top.conf

echo.
echo 正在清理重复的SSL文档...
del /Q "docs\ssl\SSL-SETUP-README.md"
del /Q "docs\ssl\SSL-SETUP-COMPLETED.md"
del /Q "docs\ssl\README-SSL.md"
echo 已删除重复的SSL文档

echo.
echo 正在清理重复的脚本文件...
del /Q "scripts\install-acme-windows.bat"
del /Q "scripts\install-acme-windows-fixed.bat"
del /Q "scripts\setup-ssl.bat"
del /Q "scripts\setup-ssl-windows.bat"
echo 已删除重复的脚本文件

echo.
echo 正在清理过时的TODO清单...
del /Q "docs\reports\TODO.md"
echo 已删除过时的TODO清单

echo.
echo 清理完成！

echo.
echo === 保留的重要文件 ===
echo nginx.conf - 主Nginx配置文件
echo jcstjj.top.conf - 域名配置文件
echo docs\deployment\DEPLOYMENT.md - 主要部署文档
echo docs\deployment\DEPLOYMENT-GUIDE.md - 部署指南
echo docs\deployment\DEPLOYMENT_NGINX.md - Nginx部署文档
echo docs\ssl\SSL-DEPLOYMENT-COMPLETED.md - SSL部署完成报告
echo docs\ssl\SSL-MANAGER-DEPLOYMENT-GUIDE.md - SSL管理器部署指南