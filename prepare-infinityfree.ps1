# Prepare files for InfinityFree deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "InfinityFree Deployment Preparation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create deployment directory
$deployDir = "infinityfree-deploy"
Write-Host "Creating deployment directory..." -ForegroundColor Yellow
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copy necessary files
Write-Host "Copying project files..." -ForegroundColor Yellow

# Copy all files except excluded ones
$exclude = @('node_modules', '.git', 'infinityfree-deploy', 'vendor', 'tests', '.env')

Get-ChildItem -Path . -Exclude $exclude | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $deployDir -Recurse -Force
    Write-Host "  Copied: $($_.Name)" -ForegroundColor Green
}

# Create .env file
Write-Host ""
Write-Host "Creating .env file..." -ForegroundColor Yellow
$envContent = @"
APP_NAME="Combridge School Management System"
APP_ENV=production
APP_KEY=base64:hE3BMwpHZmltFP2rkssDa8BVf8foyrd+5U7nJWwdQho=
APP_DEBUG=false
APP_URL=http://combrige-polytechnic.66ghz.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=sql111.infinityfree.com
DB_PORT=3306
DB_DATABASE=if0_42854964_polytechnic
DB_USERNAME=if0_42854964
DB_PASSWORD=GVhCdPtrQj0Erv

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@combridge.edu"
MAIL_FROM_NAME="`${APP_NAME}"

SCHOOL_NAME="Combridge Centre for Polytechnic Studies"
SCHOOL_EMAIL="combridgecentre@gmail.com"
SCHOOL_PHONE="+256 393 258 879"
SCHOOL_WHATSAPP="+256 787 803 099"
SCHOOL_ADDRESS="Nyamityobora, Kaboba Mbarara City, 200 meters off Mbarara Masaka Highway"
SCHOOL_PO_BOX="P.O. Box 177267, Mbarara"
"@

Set-Content -Path "$deployDir\.env" -Value $envContent
Write-Host "  .env file created" -ForegroundColor Green

# Create .htaccess for root
Write-Host ""
Write-Host "Creating .htaccess file..." -ForegroundColor Yellow
$htaccessContent = @"
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/`$1 [L]
</IfModule>
"@

Set-Content -Path "$deployDir\.htaccess" -Value $htaccessContent
Write-Host "  .htaccess file created" -ForegroundColor Green

# Create index.php redirect (backup)
Write-Host ""
Write-Host "Creating index.php redirect..." -ForegroundColor Yellow
$indexContent = @"
<?php
// Redirect to public folder
header('Location: public/index.php');
exit;
"@

Set-Content -Path "$deployDir\index.php" -Value $indexContent
Write-Host "  index.php created" -ForegroundColor Green

# Create a ZIP file
Write-Host ""
Write-Host "Creating ZIP file for upload..." -ForegroundColor Yellow
$zipPath = "infinityfree-deployment.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath
}

Compress-Archive -Path "$deployDir\*" -DestinationPath $zipPath
Write-Host "  ZIP created: $zipPath" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Deployment package ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to InfinityFree File Manager" -ForegroundColor White
Write-Host "2. Upload infinityfree-deployment.zip to htdocs" -ForegroundColor White
Write-Host "3. Extract the ZIP file" -ForegroundColor White
Write-Host "4. Set storage/ and bootstrap/cache/ to 777 permissions" -ForegroundColor White
Write-Host "5. Visit: http://combrige-polytechnic.66ghz.com" -ForegroundColor White
Write-Host ""
Write-Host "Or manually upload files from: infinityfree-deploy" -ForegroundColor Yellow
Write-Host ""
