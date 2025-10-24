# Ubuntu Offline Installation Script
# ==================================

Write-Host "Ubuntu Offline Installation Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check for Chocolatey installed Ubuntu package
$ubuntuPath = "C:\Users\Administrator\AppData\Local\Temp\chocolatey\ubuntu2004.appx"
if (Test-Path $ubuntuPath) {
    Write-Host "✓ Found Ubuntu package: $ubuntuPath" -ForegroundColor Green
    
    # Try multiple installation methods
    Write-Host "Attempting to install Ubuntu..." -ForegroundColor Yellow
    
    # Method 1: Using Add-AppxPackage
    try {
        Write-Host "Method 1: Using Add-AppxPackage..." -ForegroundColor Yellow
        Add-AppxPackage -Path $ubuntuPath
        Write-Host "✓ Ubuntu installed successfully" -ForegroundColor Green
        exit 0
    } catch {
        Write-Host "✗ Method 1 failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Method 2: Using WSL import
    try {
        Write-Host "Method 2: Using WSL import..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path "C:\WSL\Ubuntu2004" -Force | Out-Null
        wsl --import Ubuntu2004 "C:\WSL\Ubuntu2004" $ubuntuPath --version 2
        Write-Host "✓ Ubuntu imported successfully" -ForegroundColor Green
        Write-Host "Please run 'wsl -d Ubuntu2004' to start Ubuntu" -ForegroundColor Cyan
        exit 0
    } catch {
        Write-Host "✗ Method 2 failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Ubuntu package not found, please install with Chocolatey first:" -ForegroundColor Red
    Write-Host "  choco install wsl-ubuntu-2004 -y" -ForegroundColor Cyan
    exit 1
}

Write-Host "All installation methods failed, please install Ubuntu manually." -ForegroundColor Red
exit 1