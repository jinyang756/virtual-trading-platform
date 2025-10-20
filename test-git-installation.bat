@echo off
title Git安装验证工具

echo ================================
echo Git安装验证工具
echo ================================
echo.

echo 正在检查Git安装状态...
echo.

git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Git已成功安装
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    echo 版本信息: %GIT_VERSION%
    echo.
    
    echo 正在检查Git配置...
    echo.
    
    git config --global user.name >nul 2>&1
    if %errorlevel% equ 0 (
        for /f "tokens=*" %%i in ('git config --global user.name') do set GIT_USER=%%i
        echo 用户名: %GIT_USER%
    ) else (
        echo 用户名: 未设置
    )
    
    git config --global user.email >nul 2>&1
    if %errorlevel% equ 0 (
        for /f "tokens=*" %%i in ('git config --global user.email') do set GIT_EMAIL=%%i
        echo 邮箱: %GIT_EMAIL%
    ) else (
        echo 邮箱: 未设置
    )
    
    echo.
    echo 正在检查远程仓库配置...
    echo.
    
    cd /d "c:\Users\Administrator\jucaizhongfa"
    git remote -v >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 远程仓库已配置
        for /f "tokens=*" %%i in ('git remote -v') do echo %%i
    ) else (
        echo ⚠️  远程仓库未配置
    )
    
    echo.
    echo ================================
    echo 安装验证完成
    echo ================================
    echo.
    echo 如果需要初始化Git仓库，请运行 init-git.bat
    echo.
) else (
    echo ❌ Git未安装或未正确配置
    echo.
    echo 请运行 install-git.bat 或 install-git.ps1 安装Git
    echo.
)

pause