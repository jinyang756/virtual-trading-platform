@echo off
cls
echo ================================
echo 提交并推送代码到仓库
echo ================================

cd /d "c:\Users\Administrator\virtual-trading-platform"

echo 当前目录: %cd%

echo.
echo 1. 检查Git状态
git status --porcelain

echo.
echo 2. 添加所有更改
git add .

echo.
echo 3. 提交更改
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set datetime=%dt:~0,4%-%dt:~4,2%-%dt:~6,2% %dt:~8,2%:%dt:~10,2%
git commit -m "Update %datetime%"

if %errorlevel% equ 0 (
    echo 提交成功
) else (
    echo 没有更改需要提交或提交失败
)

echo.
echo 4. 推送代码到远程仓库
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ================================
    echo 代码推送成功！
    echo ================================
) else (
    echo.
    echo ================================
    echo 推送失败，请检查Git状态
    echo ================================
)

echo.
echo 脚本执行完毕
pause