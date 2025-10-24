# Add DNS TXT Records to Cloudflare
# =================================

param(
    [Parameter(Mandatory=$true)]
    [string]$ZoneId = "3241f657cdd27991410ad91e2f7c6307",
    
    [Parameter(Mandatory=$true)]
    [string]$ApiToken = "2YADdLWLowDWtRdfSEmhhzEEKZCXGnB42KXVTtFi"
)

Write-Host "Adding DNS TXT records to Cloudflare..." -ForegroundColor Green
Write-Host "Zone ID: $ZoneId" -ForegroundColor Cyan

# TXT记录值（从最新的acme.sh输出获取）
$records = @(
    @{
        name = "_acme-challenge"
        value = "tzjLPx3JAH1g88fuO6a-HmuIjwcZ7jwFg2gZjfgLnkI"
    },
    @{
        name = "_acme-challenge.www"
        value = "gChsnwjW12y8PTU5QiRW6Ot6BbqtfleKiDwDXSNdn2Y"
    }
)

# Cloudflare API endpoint
$headers = @{
    "Authorization" = "Bearer $ApiToken"
    "Content-Type" = "application/json"
}

try {
    # Add each DNS record
    foreach ($record in $records) {
        Write-Host "Adding TXT record: $($record.name)" -ForegroundColor Yellow
        $dnsUrl = "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records"
        $body = @{
            type = "TXT"
            name = "$($record.name).jcstjj.top"
            content = $record.value
            ttl = 120
        } | ConvertTo-Json
        
        try {
            $dnsResponse = Invoke-RestMethod -Uri $dnsUrl -Headers $headers -Method Post -Body $body
            if ($dnsResponse.success -eq $false) {
                Write-Warning "Failed to add DNS record '$($record.name)': $($dnsResponse.errors | ConvertTo-Json)"
            } else {
                Write-Host "Successfully added TXT record '$($record.name)' with ID: $($dnsResponse.result.id)" -ForegroundColor Green
            }
        } catch {
            Write-Warning "Error adding DNS record '$($record.name)': $($_.Exception.Message)"
        }
    }
    
    Write-Host "DNS records added successfully!" -ForegroundColor Green
    Write-Host "Now waiting for DNS propagation..." -ForegroundColor Cyan
    
    # Wait a bit for DNS propagation
    Start-Sleep -Seconds 30
    
    Write-Host "You can now run the following command to complete certificate issuance:" -ForegroundColor Cyan
    Write-Host "wsl -d Ubuntu -u administrator bash -c `"source ~/.bashrc && ~/.acme.sh/acme.sh --renew -d jcstjj.top -d www.jcstjj.top`"" -ForegroundColor White
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}