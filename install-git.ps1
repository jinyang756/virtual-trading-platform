# Git自动安装脚本
# 作者: 虚拟交易平台开发团队
# 日期: 2025年10月20日

Write-Host "================================" -ForegroundColor Green
Write-Host "Git自动安装脚本" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# 检查管理员权限
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "警告: 建议以管理员身份运行此脚本以确保安装成功" -ForegroundColor Yellow
    Write-Host ""
}

# 检测系统架构
Write-Host "正在检测系统架构..." -ForegroundColor Cyan
$architecture = "64"
if ([Environment]::Is64BitOperatingSystem -eq $false) {
    $architecture = "32"
}
Write-Host "检测到系统架构: ${architecture}位" -ForegroundColor Green
Write-Host ""

# 创建临时目录
$tempDir = "$env:TEMP\GitInstall"
if (-not (Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir | Out-Null
}

try {
    # 下载Git安装包
    Write-Host "正在从GitHub下载Git安装包..." -ForegroundColor Cyan
    $installerPath = "$tempDir\Git-Installer.exe"
    $downloadUrl = "https://github.com/git-for-windows/git/releases/download/v2.45.2.windows.1/Git-2.45.2-${architecture}-bit.exe"
    
    Write-Host "下载地址: $downloadUrl" -ForegroundColor Gray
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -ErrorAction Stop
    
    Write-Host "下载完成!" -ForegroundColor Green
    Write-Host ""
    
    # 验证下载的文件
    if (-not (Test-Path $installerPath)) {
        throw "下载的安装包文件不存在"
    }
    
    $fileSize = (Get-Item $installerPath).Length
    if ($fileSize -lt 10MB) {
        throw "下载的安装包文件大小异常 (${fileSize} bytes)"
    }
    
    Write-Host "安装包文件大小: $([math]::Round($fileSize / 1MB, 2)) MB" -ForegroundColor Gray
    Write-Host ""
    
    # 运行安装程序
    Write-Host "开始安装Git..." -ForegroundColor Cyan
    Write-Host "安装过程中请按照默认设置进行安装" -ForegroundColor Yellow
    Write-Host ""
    
    # 使用静默安装参数
    $process = Start-Process -FilePath $installerPath -ArgumentList "/SILENT" -PassThru -Wait
    
    if ($process.ExitCode -eq 0) {
        Write-Host "Git安装成功!" -ForegroundColor Green
    } else {
        Write-Host "警告: 安装程序返回代码 $($process.ExitCode)" -ForegroundColor Yellow
        Write-Host "请检查Git是否已正确安装" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "错误: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "请尝试以下解决方案:" -ForegroundColor Yellow
    Write-Host "1. 手动下载安装包: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "2. 检查网络连接" -ForegroundColor Yellow
    Write-Host "3. 以管理员身份重新运行此脚本" -ForegroundColor Yellow
    Write-Host ""
    
    # 清理临时文件
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    Write-Host "按任意键退出..." -ForegroundColor Gray
    $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
    exit 1
}

# 清理临时文件
Write-Host "正在清理临时文件..." -ForegroundColor Cyan
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "安装完成!" -ForegroundColor Green
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Cyan
Write-Host "1. 重新启动命令行工具或PowerShell" -ForegroundColor Yellow
Write-Host "2. 运行 init-git.bat 初始化Git仓库" -ForegroundColor Yellow
Write-Host "3. 或直接运行 node scripts/init-git-repo.js" -ForegroundColor Yellow
Write-Host ""

Write-Host "按任意键退出..." -ForegroundColor Gray
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null