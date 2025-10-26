@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo 虚拟交易平台代码推送脚本
echo ==========================================

cd /d c:\Users\Administrator\virtual-trading-platform

echo 当前目录: %cd%

echo.
echo 1. 检查Git状态...
git status

echo.
echo 2. 添加所有更改...
git add .

echo.
echo 3. 提交更改...
git commit -m "自动推送更新 %date% %time%"

if %errorlevel% neq 0 (
    echo 提交失败，可能没有更改需要提交
)

echo.
echo 4. 拉取最新代码...
git pull origin main

echo.
echo 5. 推送到远程仓库...
git push origin main

if %errorlevel% neq 0 (
    echo 推送失败，尝试强制推送...
    git push origin main --force
)

echo.
echo 6. 推送完成!
echo ==========================================
echo 任务已完成，请检查GitHub仓库确认更新
echo ==========================================
pause