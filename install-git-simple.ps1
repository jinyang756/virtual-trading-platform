# 简化版Git安装脚本
Write-Host "Git自动安装脚本" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green

# 检测系统架构
$architecture = "64"
if ([Environment]::Is64BitOperatingSystem -eq $false) {
    $architecture = "32"
}

Write-Host "检测到系统架构: ${architecture}位" -ForegroundColor Cyan

# 创建临时目录
$tempDir = "$env:TEMP\GitInstall"
if (-not (Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir | Out-Null
}

try {
    # 下载Git安装包
    Write-Host "正在下载Git安装包..." -ForegroundColor Cyan
    $installerPath = "$tempDir\Git-Installer.exe"
    $downloadUrl = "https://github.com/git-for-windows/git/releases/download/v2.45.2.windows.1/Git-2.45.2-${architecture}-bit.exe"
    
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -ErrorAction Stop
    
    Write-Host "下载完成，正在安装..." -ForegroundColor Green
    
    # 运行安装程序（静默安装）
    Start-Process -FilePath $installerPath -ArgumentList "/SILENT" -Wait
    
    Write-Host "Git安装完成!" -ForegroundColor Green
    
} catch {
    Write-Host "安装失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "请手动下载安装: https://git-scm.com/download/win" -ForegroundColor Yellow
}

# 清理临时文件
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "请重新启动PowerShell以使用Git命令" -ForegroundColor Yellow