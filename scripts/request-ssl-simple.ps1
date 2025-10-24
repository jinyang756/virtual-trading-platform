# Cloudflare SSL Certificate Request Script
Write-Host "Cloudflare SSL Certificate Request Script"
Write-Host "=========================================="

# Create certificate directory
$CertDir = "C:\ssl-manager\certs"
if (!(Test-Path $CertDir)) {
    New-Item -ItemType Directory -Path $CertDir | Out-Null
}

Write-Host "Creating self-signed certificate..."
$cert = New-SelfSignedCertificate -DnsName "jcstjj.top", "www.jcstjj.top" -CertStoreLocation "cert:\LocalMachine\My" -NotAfter (Get-Date).AddYears(1)

Write-Host "Exporting certificate..."
$certPath = "$CertDir\jcstjj.top.pfx"
$certPassword = ConvertTo-SecureString -String "password" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath $certPath -Password $certPassword | Out-Null

Write-Host "Certificate created successfully!"
Write-Host "Certificate path: $certPath"
