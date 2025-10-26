@echo off
cls
echo ================================
echo 部署Web前端到Vercel
echo ================================

cd /d "c:\Users\Administrator\virtual-trading-platform\web"

echo 当前目录: %cd%

echo.
echo 1. 检查Node.js和npm
node --version
npm --version

echo.
echo 2. 安装项目依赖
call npm install

if %errorlevel% neq 0 (
    echo.
    echo 依赖安装失败
    pause
    exit /b 1
)

echo.
echo 3. 构建项目
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo 项目构建失败
    pause
    exit /b 1
)

echo.
echo 4. 部署到Vercel
call npx vercel deploy --prod --token ba0EcYZnS9WRu1hTCm9hKrxy --confirm

if %errorlevel% neq 0 (
    echo.
    echo 部署失败
    pause
    exit /b 1
)

echo.
echo ================================
echo Web前端部署成功！
echo ================================
pause