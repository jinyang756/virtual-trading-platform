@echo off
echo === 清理重复的报告文件 ===

echo.
echo 正在清理重复的报告文件...
del /Q "docs\reports\TEABLE_SCHEMA_ENHANCEMENT_REPORT.md"
echo 已删除重复的报告文件

echo.
echo 清理完成！

echo.
echo === 保留的重要报告 ===
echo docs\reports\FINAL_SCHEMA_ENHANCEMENT_SUMMARY.md - Teable Schema增强项目总结
echo docs\reports\SCHEMA_OPTIMIZATION_REPORT.md - Schema优化报告
echo docs\reports\FIELD_CHANGE_NOTIFICATION_REPORT.md - 字段变更通知报告