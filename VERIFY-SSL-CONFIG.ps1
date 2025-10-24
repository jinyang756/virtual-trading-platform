# SSL Configuration Verification Script
# ====================================

Write-Host "SSL Certificate Configuration Verification" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Check if certificate files exist
$certPath = "C:\nginx\nginx-1.24.0\ssl\jcstjj.top.pem"
$keyPath = "C:\nginx\nginx-1.24.0\ssl\jcstjj.top.key"

Write-Host "1. Checking certificate files..." -ForegroundColor Yellow
if (Test-Path $certPath) {
    Write-Host "✓ Certificate file exists: $certPath" -ForegroundColor Green
} else {
    Write-Host "✗ Certificate file does not exist: $certPath" -ForegroundColor Red
    exit 1
}

if (Test-Path $keyPath) {
    Write-Host "✓ Private key file exists: $keyPath" -ForegroundColor Green
} else {
    Write-Host "✗ Private key file does not exist: $keyPath" -ForegroundColor Red
    exit 1
}

# Check certificate information
Write-Host "`n2. Checking certificate information..." -ForegroundColor Yellow
try {
    $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
    $cert.Import($certPath)
    
    Write-Host "✓ Certificate subject: $($cert.Subject)" -ForegroundColor Green
    Write-Host "✓ Certificate issuer: $($cert.Issuer)" -ForegroundColor Green
    Write-Host "✓ Certificate validity: $($cert.NotBefore) to $($cert.NotAfter)" -ForegroundColor Green
    Write-Host "✓ Certificate serial number: $($cert.SerialNumber)" -ForegroundColor Green
    
    # Check if certificate is expired
    if ($cert.NotAfter -lt (Get-Date)) {
        Write-Host "✗ Certificate has expired!" -ForegroundColor Red
    } else {
        $daysUntilExpiry = ($cert.NotAfter - (Get-Date)).Days
        Write-Host "✓ Certificate will expire in $daysUntilExpiry days" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Could not read certificate information: $($_.Exception.Message)" -ForegroundColor Red
}

# Check Nginx process
Write-Host "`n3. Checking Nginx service..." -ForegroundColor Yellow
$nginxProcess = Get-Process -Name "nginx" -ErrorAction SilentlyContinue
if ($nginxProcess) {
    Write-Host "✓ Nginx is running, PID: $($nginxProcess.Id)" -ForegroundColor Green
} else {
    Write-Host "✗ Nginx is not running" -ForegroundColor Red
}

# Check port listening
Write-Host "`n4. Checking port listening..." -ForegroundColor Yellow
try {
    $port80 = Get-NetTCPConnection -LocalPort 80 -ErrorAction SilentlyContinue
    $port443 = Get-NetTCPConnection -LocalPort 443 -ErrorAction SilentlyContinue
    
    if ($port80) {
        Write-Host "✓ Port 80 is listening" -ForegroundColor Green
    } else {
        Write-Host "⚠ Port 80 is not listening" -ForegroundColor Yellow
    }
    
    if ($port443) {
        Write-Host "✓ Port 443 is listening" -ForegroundColor Green
    } else {
        Write-Host "✗ Port 443 is not listening" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠ Could not check port status: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`nVerification completed!" -ForegroundColor Green
Write-Host "If all checks pass, your SSL certificate should be working correctly." -ForegroundColor Cyan
Write-Host "If the website is still not accessible, please check if the backend service is running." -ForegroundColor Cyan