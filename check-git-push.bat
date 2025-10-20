@echo off
echo ================================
echo 检查Git推送状态
echo ================================
echo.

echo 正在检查本地分支状态...
"C:\Program Files\Git\bin\git.exe" branch -v
echo.

echo 正在检查远程仓库状态...
"C:\Program Files\Git\bin\git.exe" remote -v
echo.

echo 正在检查提交历史...
"C:\Program Files\Git\bin\git.exe" log --oneline -5
echo.

echo 如果推送长时间没有响应，您可以:
echo 1. 检查网络连接
echo 2. 稍后再试
echo 3. 或者联系GitHub支持
echo.