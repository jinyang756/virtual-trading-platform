# Simple Git Installation Script
Write-Host "Git Auto Installation Script" -ForegroundColor Green
Write-Host "===========================" -ForegroundColor Green

# Detect system architecture
$architecture = "64"
if ([Environment]::Is64BitOperatingSystem -eq $false) {
    $architecture = "32"
}

Write-Host "Detected system architecture: ${architecture}bit" -ForegroundColor Cyan

# Create temporary directory
$tempDir = "$env:TEMP\GitInstall"
if (-not (Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir | Out-Null
}

try {
    # Download Git installer
    Write-Host "Downloading Git installer..." -ForegroundColor Cyan
    $installerPath = "$tempDir\Git-Installer.exe"
    $downloadUrl = "https://github.com/git-for-windows/git/releases/download/v2.45.2.windows.1/Git-2.45.2-${architecture}-bit.exe"
    
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -ErrorAction Stop
    
    Write-Host "Download complete, installing..." -ForegroundColor Green
    
    # Run installer (silent installation)
    Start-Process -FilePath $installerPath -ArgumentList "/SILENT" -Wait
    
    Write-Host "Git installation completed!" -ForegroundColor Green
    
} catch {
    Write-Host "Installation failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please download manually: https://git-scm.com/download/win" -ForegroundColor Yellow
}

# Clean up temporary files
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Please restart PowerShell to use Git commands" -ForegroundColor Yellow