# Add DNS TXT Records to Cloudflare
# =================================

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain = "jcstjj.top",
    
    [Parameter(Mandatory=$true)]
    [string]$ApiToken = "-6QQN2dxngCuq2YMBJXioG0HhhwvzByMEg6B-v1M"
)

Write-Host "Adding DNS TXT records to Cloudflare..." -ForegroundColor Green

# TXT记录值（从acme.sh输出获取）
$records = @(
    @{
        name = "_acme-challenge"
        value = "jRSe6OBTpKFka62bKSHTbGprpaIrx9qhdr-HLqQtgAU"
    },
    @{
        name = "_acme-challenge.www"
        value = "fytZsD6HxKo5Wd-sW5yY1L8fvOnO4VbAD-DrHW-gz-Q"
    }
)

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
    
    # Add each DNS record
    foreach ($record in $records) {
        Write-Host "Adding TXT record: $($record.name)" -ForegroundColor Yellow
        $dnsUrl = "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records"
        $body = @{
            type = "TXT"
            name = "$($record.name).$Domain"
            content = $record.value
            ttl = 120
        } | ConvertTo-Json
        
        try {
            $dnsResponse = Invoke-RestMethod -Uri $dnsUrl -Headers $headers -Method Post -Body $body
            if ($dnsResponse.success -eq $false) {
                Write-Warning "Failed to add DNS record '$($record.name)': $($dnsResponse.errors | ConvertTo-Json)"
            } else {
                Write-Host "Successfully added TXT record '$($record.name)'!" -ForegroundColor Green
            }
        } catch {
            Write-Warning "Error adding DNS record '$($record.name)': $($_.Exception.Message)"
        }
    }
    
    Write-Host "DNS records added successfully!" -ForegroundColor Green
    Write-Host "Now you can run the following command to complete certificate issuance:" -ForegroundColor Cyan
    Write-Host "wsl -d Ubuntu -u administrator bash -c `"source ~/.bashrc && ~/.acme.sh/acme.sh --renew -d jcstjj.top`"" -ForegroundColor White
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}