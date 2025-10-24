# Reload Nginx Configuration
# ==========================

Write-Host "Reloading Nginx configuration..." -ForegroundColor Green

# 检查Nginx进程是否正在运行
$nginxProcess = Get-Process -Name "nginx" -ErrorAction SilentlyContinue

if ($nginxProcess) {
    Write-Host "Nginx is running. Reloading configuration..." -ForegroundColor Yellow
    
    # 尝试重新加载Nginx配置
    try {
        # 假设Nginx安装在默认位置 C:\nginx\nginx-1.24.0
        $nginxPath = "C:\nginx\nginx-1.24.0"
        if (Test-Path $nginxPath) {
            Set-Location $nginxPath
            .\nginx.exe -s reload
            Write-Host "Nginx configuration reloaded successfully!" -ForegroundColor Green
        } else {
            Write-Warning "Nginx installation directory not found at $nginxPath"
            Write-Host "Please adjust the nginxPath variable in this script to match your Nginx installation." -ForegroundColor Cyan
        }
    } catch {
        Write-Error "Failed to reload Nginx configuration: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Host "Nginx is not running. Starting Nginx..." -ForegroundColor Yellow
    
    # 尝试启动Nginx
    try {
        $nginxPath = "C:\nginx\nginx-1.24.0"
        if (Test-Path $nginxPath) {
            Set-Location $nginxPath
            Start-Process -FilePath ".\nginx.exe" -WorkingDirectory $nginxPath
            Write-Host "Nginx started successfully!" -ForegroundColor Green
        } else {
            Write-Warning "Nginx installation directory not found at $nginxPath"
            Write-Host "Please adjust the nginxPath variable in this script to match your Nginx installation." -ForegroundColor Cyan
        }
    } catch {
        Write-Error "Failed to start Nginx: $($_.Exception.Message)"
        exit 1
    }
}

Write-Host "SSL certificate installation and Nginx reload completed!" -ForegroundColor Green