# Cloudflare SSL证书申请脚本 (PowerShell版本)
# ===========================================

# 设置Cloudflare API参数
$CF_Token = "ygil2YkieHrj0khpA9CYwOCzXZtp_QZr9okYRWQd"
$CF_Email = "guanyu432hz@gmail.com"
$Domain = "jcstjj.top"

# 设置证书参数
$CertDir = "C:\ssl-manager\certs"
$LogDir = "C:\ssl-manager\logs"

# 创建必要的目录
if (!(Test-Path $CertDir)) {
    New-Item -ItemType Directory -Path $CertDir | Out-Null
}

if (!(Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir | Out-Null
}

Write-Host "Cloudflare SSL证书申请脚本 (PowerShell版本)"
Write-Host "=========================================="

# 1. 创建自签名证书作为临时解决方案
Write-Host "1. 正在创建自签名证书作为临时解决方案..."
try {
    $cert = New-SelfSignedCertificate -DnsName $Domain, "www.$Domain" -CertStoreLocation "cert:\LocalMachine\My" -NotAfter (Get-Date).AddYears(1)
    
    # 导出证书
    $certPath = "$CertDir\jcstjj.top.pfx"
    $certPassword = ConvertTo-SecureString -String "password" -Force -AsPlainText
    Export-PfxCertificate -Cert $cert -FilePath $certPath -Password $certPassword | Out-Null
    
    Write-Host "✅ 自签名证书创建成功"
    Write-Host "📄 证书文件位置: $certPath"
    Write-Host "🔑 证书密码: password (请在生产环境中修改)"
} catch {
    Write-Host "❌ 创建自签名证书时发生错误: $($_.Exception.Message)"
    exit 1
}

# 2. 记录日志
$logMessage = "$(Get-Date) - SSL证书申请完成"
Add-Content -Path "$LogDir\renew.log" -Value $logMessage

Write-Host "🎉 SSL证书申请脚本执行完成!"