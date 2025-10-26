@echo off
echo 正在推送代码到总仓库...
cd /d c:\Users\Administrator\virtual-trading-platform

echo 添加所有更改...
git add .

echo 提交更改...
git commit -m "自动推送更新"

echo 推送到远程仓库...
git push origin main

echo 推送完成!
pause