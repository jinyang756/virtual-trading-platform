# Set execution policy (if not set)
Set-ExecutionPolicy RemoteSigned -Scope Process -Force

# === Basic path settings ===
$sourceFile = "C:\Users\Administrator\AppData\Local\Temp\chocolatey\ubuntu2004.appx"
$zipFile = "C:\WSL\Ubuntu-2004.zip"
$extractPath = "C:\WSL\Ubuntu20.04"

# === Rename appx to ZIP ===
Write-Host "Packaging appx as zip..."
Rename-Item -Path $sourceFile -NewName $zipFile -Force

# === Extract ZIP to target directory ===
Write-Host "Extracting Ubuntu to $extractPath..."
Expand-Archive -Path $zipFile -DestinationPath $extractPath -Force

# === Completion prompt ===
Write-Host ""
Write-Host "Extraction complete! Please go to the following directory and run ubuntu2004.exe:"
Write-Host $extractPath