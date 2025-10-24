# Renew SSL Certificate
# ====================

Write-Host "Renewing SSL certificate..." -ForegroundColor Green

try {
    # Run acme.sh renew command
    $command = "wsl -d Ubuntu -u administrator bash -c `"source ~/.bashrc && ~/.acme.sh/acme.sh --renew -d jcstjj.top`""
    Write-Host "Executing: $command" -ForegroundColor Yellow
    Invoke-Expression $command
    Write-Host "Certificate renewal completed!" -ForegroundColor Green
}
catch {
    Write-Error "Error renewing certificate: $($_.Exception.Message)"
    exit 1
}