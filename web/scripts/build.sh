#!/bin/bash

# 清理旧的构建文件
rm -rf dist

# 安装依赖
npm install

# 运行类型检查
npx tsc --noEmit

# 运行测试（如果有的话）
npm run test

# 构建项目
npm run build

# 检查构建是否成功
if [ -d "dist" ]; then
  echo "Build successful!"
  exit 0
else
  echo "Build failed!"
  exit 1
fi