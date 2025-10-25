@echo off
echo === 清理重复的文档文件 ===

echo.
echo 正在清理重复的部署文档...
del /Q "docs\deployment\DEPLOYMENT-GUIDE.md"
del /Q "docs\deployment\DEPLOYMENT_NGINX.md"
echo 已删除重复的部署文档

echo.
echo 正在清理重复的SSL文档...
del /Q "docs\ssl\CLOUDFLARE-SSL-SETUP.md"
del /Q "docs\ssl\FINAL-SSL-SETUP.md"
del /Q "docs\ssl\MANUAL-DNS-SETUP.md"
del /Q "docs\ssl\SETUP-AUTO-RENEWAL.md"
del /Q "docs\ssl\SSL-CERTIFICATE-GUIDE.md"
echo 已删除重复的SSL文档

echo.
echo 清理完成！

echo.
echo === 保留的重要文档 ===
echo docs\deployment\DEPLOYMENT.md - 主要部署指南
echo docs\ssl\SSL-DEPLOYMENT-COMPLETED.md - SSL部署完成报告
echo docs\ssl\SSL-MANAGER-DEPLOYMENT-GUIDE.md - SSL管理器部署指南