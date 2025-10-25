@echo off
echo === 虚拟交易平台项目 - 重复文件清理工具 ===
echo.

echo 正在清理重复的配置文件...
del /Q "new_nginx.conf" 2>nul
del /Q "new_jcstjj.top.conf" 2>nul

echo 正在清理重复的SSL文档...
del /Q "docs\ssl\CLOUDFLARE-SSL-SETUP.md" 2>nul
del /Q "docs\ssl\FINAL-SSL-SETUP.md" 2>nul
del /Q "docs\ssl\MANUAL-DNS-SETUP.md" 2>nul
del /Q "docs\ssl\SETUP-AUTO-RENEWAL.md" 2>nul
del /Q "docs\ssl\SSL-CERTIFICATE-GUIDE.md" 2>nul
del /Q "docs\ssl\SSL-SETUP-README.md" 2>nul
del /Q "docs\ssl\SSL-SETUP-COMPLETED.md" 2>nul
del /Q "docs\ssl\README-SSL.md" 2>nul

echo 正在清理重复的部署文档...
del /Q "docs\deployment\DEPLOYMENT-GUIDE.md" 2>nul
del /Q "docs\deployment\DEPLOYMENT_NGINX.md" 2>nul

echo 正在清理重复的API文档...
del /Q "docs\api\INTERFACE_AUTO_GENERATION_SUMMARY.md" 2>nul
del /Q "docs\api\API_GENERATION_REPORT.md" 2>nul
del /Q "docs\api\AUTOMATION_SYSTEM_SUMMARY.md" 2>nul

echo 正在清理重复的报告文件...
del /Q "docs\reports\TEABLE_SCHEMA_ENHANCEMENT_REPORT.md" 2>nul
del /Q "docs\reports\TODO.md" 2>nul

echo 正在清理重复的脚本文件...
del /Q "scripts\nginx-config-check-reload.bat" 2>nul
del /Q "scripts\simple-nginx-setup.bat" 2>nul
del /Q "scripts\install-nginx-windows-auto.bat" 2>nul
del /Q "scripts\auto-install-nginx-windows.bat" 2>nul

echo.
echo 清理完成！

echo.
echo === 保留的重要文件 ===
echo 配置文件:
echo - nginx.conf - 主Nginx配置文件
echo - jcstjj.top.conf - 域名配置文件
echo.
echo 部署文档:
echo - docs\deployment\DEPLOYMENT.md - 主要部署指南
echo.
echo SSL文档:
echo - docs\ssl\SSL-DEPLOYMENT-COMPLETED.md - SSL部署完成报告
echo - docs\ssl\SSL-MANAGER-DEPLOYMENT-GUIDE.md - SSL管理器部署指南
echo.
echo API文档:
echo - docs\api\API_AUTO_GENERATION.md - 接口文档自动生成器使用指南
echo - docs\api\fund-schema.md - 基金模块数据结构文档
echo.
echo 报告文件:
echo - docs\reports\FINAL_SCHEMA_ENHANCEMENT_SUMMARY.md - Teable Schema增强项目总结
echo - docs\reports\SCHEMA_OPTIMIZATION_REPORT.md - Schema优化报告
echo - docs\reports\FIELD_CHANGE_NOTIFICATION_REPORT.md - 字段变更通知报告
echo.
echo 脚本文件:
echo - scripts\nginx-deploy-and-start.bat - Nginx部署和启动脚本
echo - scripts\nginx-manager.bat - Nginx管理脚本
echo - scripts\install-nginx-windows.bat - Nginx安装脚本