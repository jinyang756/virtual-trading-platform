@echo off
echo === 清理重复的配置文件 ===

echo.
echo 正在清理重复的Nginx配置文件...
del /Q "config\nginx\nginx\jcstjj.top.conf.backup"
del /Q "config\nginx\nginx\jcstjj.top.optimized.conf"
del /Q "config\nginx\nginx\jcstjj.top.simple.conf"
echo 已删除重复的Nginx配置文件

echo.
echo 清理完成！

echo.
echo === 保留的重要配置文件 ===
echo jcstjj.top.conf - 主Nginx配置文件
echo config\nginx\nginx\jcstjj.top.conf - 备份Nginx配置文件