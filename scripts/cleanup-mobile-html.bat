@echo off
echo === 清理旧的移动端HTML文件 ===

echo.
echo 正在删除旧的移动端HTML文件...
del /Q "mobile\funds.html"
del /Q "mobile\contract-market.html"
del /Q "mobile\option-market.html"

echo.
echo 清理完成！

echo.
echo === 保留的文件 ===
echo mobile\index.html - 移动端首页
echo mobile\market.html - 移动端行情页
echo mobile\trade.html - 移动端交易页
echo mobile\profile.html - 移动端个人页