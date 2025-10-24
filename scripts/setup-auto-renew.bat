@echo off
setlocal

echo SSL证书自动续签任务配置脚本
echo ==========================

:: 检查是否以管理员身份运行
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 请以管理员身份运行此脚本
    pause
    exit /b 1
)

echo 1. 正在创建任务计划程序任务...

:: 创建任务计划程序任务
schtasks /create /tn "SSL Certificate Renewal" /tr "C:\ssl-manager\install-acme-windows-final.bat >> C:\ssl-manager\logs\renew.log 2>&1" /sc monthly /d 1 /st 03:00 /ru SYSTEM /f

if %errorlevel% equ 0 (
    echo ✅ 自动续签任务创建成功
    echo 📋 任务详情:
    echo    名称: SSL Certificate Renewal
    echo    触发器: 每月1日 03:00
    echo    操作: 运行 C:\ssl-manager\install-acme-windows-final.bat
    echo    权限: 以SYSTEM账户运行
) else (
    echo ❌ 自动续签任务创建失败
)

echo.
echo 2. 正在创建日志轮转任务...

:: 创建日志轮转任务（每月清理一次日志）
schtasks /create /tn "SSL Manager Log Cleanup" /tr "powershell -Command \"Get-ChildItem 'C:\ssl-manager\logs\*.log' | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)} | Remove-Item\"" /sc monthly /d 1 /st 04:00 /ru SYSTEM /f

if %errorlevel% equ 0 (
    echo ✅ 日志轮转任务创建成功
) else (
    echo ❌ 日志轮转任务创建失败
)

echo.
echo 🎉 任务计划程序配置完成!
echo.
echo 📝 下一步:
echo 1. 打开任务计划程序查看任务状态
echo 2. 手动运行任务测试功能
echo 3. 检查日志文件确认任务执行情况

pause