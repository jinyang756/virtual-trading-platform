# 重载 Nginx 配置
Write-Host "正在重载 Nginx 配置..." -ForegroundColor Green

try {
    # 查找 Nginx 进程
    $nginxProcess = Get-Process nginx -ErrorAction SilentlyContinue
    
    if ($nginxProcess) {
        Write-Host "找到 Nginx 进程，正在重载配置..." -ForegroundColor Yellow
        
        # 尝试多种方式重载 Nginx
        $nginxPaths = @(
            "C:\nginx\nginx-1.24.0\nginx.exe",
            "C:\Program Files\nginx\nginx.exe",
            "C:\nginx\nginx.exe"
        )
        
        $nginxFound = $false
        foreach ($path in $nginxPaths) {
            if (Test-Path $path) {
                Write-Host "使用 Nginx 路径: $path" -ForegroundColor Cyan
                & $path -s reload
                $nginxFound = $true
                break
            }
        }
        
        if (-not $nginxFound) {
            Write-Host "警告: 未找到 Nginx 可执行文件，尝试使用系统路径..." -ForegroundColor Yellow
            nginx -s reload
        }
        
        Write-Host "✓ Nginx 配置重载完成" -ForegroundColor Green
    } else {
        Write-Host "✗ 未找到运行中的 Nginx 进程" -ForegroundColor Red
        Write-Host "请先启动 Nginx 服务" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ 重载 Nginx 配置时出错: $($_.Exception.Message)" -ForegroundColor Red
}