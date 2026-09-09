# ============================================
# InfinityFree FTP Upload Script
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "InfinityFree Auto-Upload Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# FTP CREDENTIALS - FILL THESE IN
# ============================================
$ftpServer = "ftpupload.net"  # Your FTP hostname
$ftpUsername = "if0_42854964"  # Your FTP username
$ftpPassword = "YOUR_PASSWORD_HERE"  # Your FTP password
$ftpPort = 21

# Remote directory (usually htdocs)
$remoteDir = "/htdocs"

# Local directory to upload
$localDir = "infinityfree-complete"

# ============================================

Write-Host "FTP Server: $ftpServer" -ForegroundColor Yellow
Write-Host "Username: $ftpUsername" -ForegroundColor Yellow
Write-Host "Remote Directory: $remoteDir" -ForegroundColor Yellow
Write-Host ""

# Check if WinSCP is available
$winscpPath = "C:\Program Files (x86)\WinSCP\WinSCP.com"
if (!(Test-Path $winscpPath)) {
    Write-Host "WinSCP not found. Using PowerShell FTP..." -ForegroundColor Yellow
    Write-Host ""
    
    # Alternative: Use .NET WebClient
    Write-Host "Starting FTP upload..." -ForegroundColor Green
    Write-Host "This will take 20-30 minutes for 157 MB..." -ForegroundColor Yellow
    Write-Host ""
    
    $files = Get-ChildItem -Path $localDir -Recurse -File
    $total = $files.Count
    $current = 0
    
    foreach ($file in $files) {
        $current++
        $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
        $ftpPath = "ftp://$ftpServer$remoteDir/" + $relativePath.Replace("\", "/")
        
        Write-Progress -Activity "Uploading files" -Status "$current of $total" -PercentComplete (($current / $total) * 100)
        
        try {
            $webclient = New-Object System.Net.WebClient
            $webclient.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
            $webclient.UploadFile($ftpPath, $file.FullName)
            Write-Host "? Uploaded: $relativePath" -ForegroundColor Green
        } catch {
            Write-Host "? Failed: $relativePath" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Upload completed!" -ForegroundColor Green
} else {
    Write-Host "Using WinSCP for faster upload..." -ForegroundColor Green
    
    # Create WinSCP script
    $winscp = @"
open ftp://$ftpUsername`:$ftpPassword@$ftpServer
cd $remoteDir
lcd $localDir
put *
close
exit
"@
    
    Set-Content -Path "winscp_script.txt" -Value $winscp
    
    & $winscpPath /script=winscp_script.txt
    
    Remove-Item "winscp_script.txt"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "UPLOAD COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Login to InfinityFree File Manager" -ForegroundColor White
Write-Host "2. Set permissions (777) for storage and bootstrap/cache" -ForegroundColor White
Write-Host "3. Visit: http://combrige-polytechnic.66ghz.com" -ForegroundColor White
Write-Host ""

Pause
