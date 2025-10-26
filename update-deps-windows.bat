@echo off
cls
echo ================================
echo 更新项目依赖包 (Windows版本)
echo ================================

cd /d "c:\Users\Administrator\virtual-trading-platform\web"

echo 当前目录: %cd%

echo.
echo 1. 备份当前package.json
copy package.json package.json.bak >nul

echo.
echo 2. 更新npm包到最新版本
npm update

echo.
echo 3. 检查过时的包
npm outdated

echo.
echo 4. 尝试更新主要版本依赖 (需要确认)
npm install -g npm-check-updates

echo.
echo 5. 检查可以更新的包
npx ncu

echo.
echo ================================
echo 依赖包更新脚本执行完成！
echo 请检查控制台输出确认更新结果
echo ================================
pause