@echo off
cls
echo ================================
echo 开始推送代码到仓库
echo ================================

cd /d "c:\Users\Administrator\virtual-trading-platform"

echo 当前目录: %cd%

echo.
echo 1. 检查Git状态
git status --porcelain

echo.
echo 2. 添加所有更改到暂存区
git add .

echo.
echo 3. 提交更改
set datetime=%date:~0,4%-%date:~5,2%-%date:~8,2% %time:~0,2%:%time:~3,2%
git commit -m "Auto commit %datetime%"

if %errorlevel% equ 0 (
    echo 提交成功
) else (
    echo 没有更改需要提交或提交失败
)

echo.
echo 4. 拉取最新代码
git pull origin main

echo.
echo 5. 推送代码到远程仓库
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ================================
    echo 代码推送成功！
    echo ================================
) else (
    echo.
    echo ================================
    echo 推送失败，请手动检查Git状态
    echo ================================
)

echo.
echo 脚本执行完毕
pause