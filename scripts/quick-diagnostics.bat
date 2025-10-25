@echo off
title 虚拟交易平台快速诊断工具

echo ========================================
echo 虚拟交易平台快速诊断工具
echo ========================================
echo.

echo [1/5] 检查前端域名解析...
nslookup jiuzhougroup.vip >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ 前端域名解析正常
) else (
    echo ✗ 前端域名解析失败
)

echo.
echo [2/5] 检查后端域名解析...
nslookup api.jcstjj.top >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ 后端域名解析正常
) else (
    echo ✗ 后端域名解析失败
)

echo.
echo [3/5] 检查前端页面访问...
powershell -Command "& {try {(Invoke-WebRequest -Uri 'https://jiuzhougroup.vip' -UseBasicParsing -TimeoutSec 10).StatusCode} catch {Write-Output 'Error'}}" > temp_result.txt 2>nul
set /p status=<temp_result.txt
del temp_result.txt >nul 2>&1

if "%status%"=="200" (
    echo ✓ 前端页面访问正常
) else (
    echo ✗ 前端页面访问异常 (状态码: %status%)
)

echo.
echo [4/5] 检查后端健康接口...
powershell -Command "& {try {(Invoke-WebRequest -Uri 'https://api.jcstjj.top/health' -UseBasicParsing -TimeoutSec 10).StatusCode} catch {Write-Output 'Error'}}" > temp_result.txt 2>nul
set /p status=<temp_result.txt
del temp_result.txt >nul 2>&1

if "%status%"=="200" (
    echo ✓ 后端健康接口正常
) else (
    echo ✗ 后端健康接口异常 (状态码: %status%)
)

echo.
echo [5/5] 检查后端操作接口...
powershell -Command "& {try {(Invoke-WebRequest -Uri 'https://api.jcstjj.top/api/ops/status' -UseBasicParsing -TimeoutSec 10).StatusCode} catch {Write-Output 'Error'}}" > temp_result.txt 2>nul
set /p status=<temp_result.txt
del temp_result.txt >nul 2>&1

if "%status%"=="200" (
    echo ✓ 后端操作接口正常
) else if "%status%"=="401" (
    echo ✓ 后端操作接口连通（需要认证）
) else (
    echo ✗ 后端操作接口异常 (状态码: %status%)
)

echo.
echo ========================================
echo 诊断完成
echo ========================================
echo.
echo 如需详细诊断，请运行: node scripts/system-diagnostics.js
echo.
pause