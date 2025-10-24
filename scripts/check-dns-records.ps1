# Check DNS TXT Records on Cloudflare
# ===================================

param(
    [Parameter(Mandatory=$false)]
    [string]$ZoneId = "3241f657cdd27991410ad91e2f7c6307",
    
    [Parameter(Mandatory=$false)]
    [string]$ApiToken = "2YADdLWLowDWtRdfSEmhhzEEKZCXGnB42KXVTtFi"
)

Write-Host "Checking DNS TXT records on Cloudflare..." -ForegroundColor Green
Write-Host "Zone ID: $ZoneId" -ForegroundColor Cyan

# Cloudflare API endpoint
$headers = @{
    "Authorization" = "Bearer $ApiToken"
    "Content-Type" = "application/json"
}

try {
    # Get existing DNS records
    $dnsUrl = "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records?type=TXT"
    
    $dnsResponse = Invoke-RestMethod -Uri $dnsUrl -Headers $headers -Method Get
    
    if ($dnsResponse.success -eq $false) {
        Write-Warning "Failed to retrieve DNS records: $($dnsResponse.errors | ConvertTo-Json)"
    } else {
        Write-Host "Found $($dnsResponse.result.Count) DNS records:" -ForegroundColor Yellow
        foreach ($record in $dnsResponse.result) {
            Write-Host "Name: $($record.name)" -ForegroundColor White
            Write-Host "Content: $($record.content)" -ForegroundColor White
            Write-Host "ID: $($record.id)" -ForegroundColor Gray
            Write-Host "---" -ForegroundColor Gray
        }
    }
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}