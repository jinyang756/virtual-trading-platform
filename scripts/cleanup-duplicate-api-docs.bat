@echo off
echo === 清理重复的API文档 ===

echo.
echo 正在清理重复的API文档...
del /Q "docs\api\INTERFACE_AUTO_GENERATION_SUMMARY.md"
del /Q "docs\api\API_GENERATION_REPORT.md"
del /Q "docs\api\AUTOMATION_SYSTEM_SUMMARY.md"
echo 已删除重复的API文档

echo.
echo 清理完成！

echo.
echo === 保留的重要API文档 ===
echo docs\api\API_AUTO_GENERATION.md - 接口文档自动生成器使用指南
echo docs\api\fund-schema.md - 基金模块数据结构文档