@echo off
echo === 清理无效测试文件 ===

echo 正在删除根目录下的无效测试文件...
del /Q "test-api.js"
del /Q "test-frontend.js"
del /Q "test-responsive-design.js"
del /Q "test-international-teable.js"

echo 正在检查并保留有效的测试文件...
echo 保留 test-proxy.js
echo 保留 test-teable-connection.js
echo 保留 test-teable-create.js

echo 清理完成！

echo.
echo === 保留的测试文件 ===
echo test-proxy.js - 测试 Teable 代理连接
echo test-teable-connection.js - 测试 Teable 数据库连接
echo test-teable-create.js - 测试 Teable 表创建功能
echo.
echo 这些文件保留在根目录中，因为它们提供了重要的数据库连接测试功能。