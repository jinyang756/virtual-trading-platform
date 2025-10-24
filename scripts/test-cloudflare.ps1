# Test Cloudflare API
# ===================

$ApiToken = "-6QQN2dxngCuq2YMBJXioG0HhhwvzByMEg6B-v1M"
$Domain = "jcstjj.top"

Write-Host "Testing Cloudflare API..." -ForegroundColor Green

# Cloudflare API endpoint
$headers = @{
    "Authorization" = "Bearer $ApiToken"
    "Content-Type" = "application/json"
}

try {
    # Get zone ID
    Write-Host "Getting zone ID for $Domain..." -ForegroundColor Yellow
    $zoneUrl = "https://api.cloudflare.com/client/v4/zones?name=$Domain"
    $zoneResponse = Invoke-RestMethod -Uri $zoneUrl -Headers $headers -Method Get
    
    if ($zoneResponse.success -eq $false) {
        Write-Error "Failed to get zone information: $($zoneResponse.errors | ConvertTo-Json)"
        exit 1
    }
    
    $zoneId = $zoneResponse.result[0].id
    Write-Host "Zone ID: $zoneId" -ForegroundColor Green
    
    # List existing DNS records
    Write-Host "Listing existing TXT records..." -ForegroundColor Yellow
    $dnsUrl = "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records?type=TXT"
    $dnsResponse = Invoke-RestMethod -Uri $dnsUrl -Headers $headers -Method Get
    
    foreach ($record in $dnsResponse.result) {
        Write-Host "Record: $($record.name) = $($record.content)" -ForegroundColor Cyan
    }
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}