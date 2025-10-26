@echo off
echo 正在设置SSH方式推送代码...
cd /d c:\Users\Administrator\virtual-trading-platform

echo 设置SSH远程仓库地址...
git remote set-url origin git@github.com:jinyang756/virtual-trading-platform.git

echo 添加所有更改...
git add .

echo 提交更改...
git commit -m "更新代码并切换到SSH方式"

echo 推送到远程仓库...
git push origin main

echo 推送完成!
pause