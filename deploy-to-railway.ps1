# Railway Deployment Script for Combridge Polytechnic System
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Railway Deployment Helper" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
Write-Host "Checking Railway CLI..." -ForegroundColor Yellow
$railwayVersion = railway --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Railway CLI is not installed!" -ForegroundColor Red
    Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}
Write-Host "✓ Railway CLI is ready" -ForegroundColor Green
Write-Host ""

# Step 1: Login to Railway
Write-Host "Step 1: Login to Railway" -ForegroundColor Cyan
Write-Host "This will open your browser for authentication..." -ForegroundColor Yellow
Write-Host ""
railway login

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to login to Railway" -ForegroundColor Red
    Write-Host "Please try manually: railway login" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Successfully logged in to Railway" -ForegroundColor Green
Write-Host ""

# Step 2: Initialize/Link Project
Write-Host "Step 2: Initialize Railway Project" -ForegroundColor Cyan
Write-Host "Choose an option:" -ForegroundColor Yellow
Write-Host "  1. Create a new project" -ForegroundColor White
Write-Host "  2. Link to an existing project" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host "Creating new Railway project..." -ForegroundColor Yellow
    railway init
} elseif ($choice -eq "2") {
    Write-Host "Linking to existing Railway project..." -ForegroundColor Yellow
    railway link
} else {
    Write-Host "Invalid choice. Exiting." -ForegroundColor Red
    exit 1
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to initialize/link project" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Project configured" -ForegroundColor Green
Write-Host ""

# Step 3: Add MySQL Database
Write-Host "Step 3: Add MySQL Database" -ForegroundColor Cyan
Write-Host "Do you want to add a MySQL database? (y/n)" -ForegroundColor Yellow
$addDb = Read-Host

if ($addDb -eq "y" -or $addDb -eq "Y") {
    Write-Host "Adding MySQL database..." -ForegroundColor Yellow
    railway add --database mysql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ MySQL database added" -ForegroundColor Green
    } else {
        Write-Host "! Could not add database automatically" -ForegroundColor Yellow
        Write-Host "Please add MySQL manually from Railway dashboard" -ForegroundColor Yellow
    }
} else {
    Write-Host "Skipping database setup" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Set Environment Variables
Write-Host "Step 4: Set Environment Variables" -ForegroundColor Cyan
Write-Host "Setting critical environment variables..." -ForegroundColor Yellow

# Set APP_KEY
$appKey = "base64:hE3BMwpHZmltFP2rkssDa8BVf8foyrd+5U7nJWwdQho="
railway variables set APP_KEY=$appKey
Write-Host "✓ APP_KEY set" -ForegroundColor Green

# Set APP_ENV
railway variables set APP_ENV=production
Write-Host "✓ APP_ENV set" -ForegroundColor Green

# Set APP_DEBUG
railway variables set APP_DEBUG=false
Write-Host "✓ APP_DEBUG set" -ForegroundColor Green

# Database variables
railway variables set DB_CONNECTION=mysql
Write-Host "✓ DB_CONNECTION set" -ForegroundColor Green

Write-Host ""
Write-Host "! IMPORTANT: Set these database variables in Railway dashboard:" -ForegroundColor Yellow
Write-Host "  DB_HOST=`${{MySQL.MYSQL_HOST}}" -ForegroundColor White
Write-Host "  DB_PORT=`${{MySQL.MYSQL_PORT}}" -ForegroundColor White
Write-Host "  DB_DATABASE=`${{MySQL.MYSQL_DATABASE}}" -ForegroundColor White
Write-Host "  DB_USERNAME=`${{MySQL.MYSQL_USER}}" -ForegroundColor White
Write-Host "  DB_PASSWORD=`${{MySQL.MYSQL_PASSWORD}}" -ForegroundColor White
Write-Host ""

# School information
railway variables set SCHOOL_NAME="Combridge Centre for Polytechnic Studies"
railway variables set SCHOOL_EMAIL="combridgecentre@gmail.com"
railway variables set SCHOOL_PHONE="+256 393 258 879"
railway variables set SCHOOL_WHATSAPP="+256 787 803 099"
railway variables set "SCHOOL_ADDRESS=Nyamityobora, Kaboba Mbarara City, 200 meters off Mbarara Masaka Highway"
railway variables set "SCHOOL_PO_BOX=P.O. Box 177267, Mbarara"
Write-Host "✓ School information variables set" -ForegroundColor Green
Write-Host ""

# Step 5: Deploy
Write-Host "Step 5: Deploy Application" -ForegroundColor Cyan
Write-Host "Ready to deploy to Railway?" -ForegroundColor Yellow
Write-Host "This will push your code and start the deployment..." -ForegroundColor White
Write-Host ""
$deploy = Read-Host "Deploy now? (y/n)"

if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host "Deploying to Railway..." -ForegroundColor Yellow
    railway up
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "=======================================" -ForegroundColor Green
        Write-Host "✓ Deployment Started!" -ForegroundColor Green
        Write-Host "=======================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Go to Railway dashboard to monitor deployment" -ForegroundColor White
        Write-Host "2. Set database reference variables (see above)" -ForegroundColor White
        Write-Host "3. Update APP_URL with your Railway domain" -ForegroundColor White
        Write-Host "4. Generate a domain: railway domain" -ForegroundColor White
        Write-Host ""
        Write-Host "Open Railway dashboard:" -ForegroundColor Yellow
        railway open
    } else {
        Write-Host "✗ Deployment failed" -ForegroundColor Red
        Write-Host "Check the errors above and try again" -ForegroundColor Yellow
    }
} else {
    Write-Host "Deployment cancelled" -ForegroundColor Yellow
    Write-Host "You can deploy later with: railway up" -ForegroundColor White
}

Write-Host ""
Write-Host "Useful Railway Commands:" -ForegroundColor Cyan
Write-Host "  railway status      - Check project status" -ForegroundColor White
Write-Host "  railway logs        - View application logs" -ForegroundColor White
Write-Host "  railway open        - Open Railway dashboard" -ForegroundColor White
Write-Host "  railway domain      - Generate a domain" -ForegroundColor White
Write-Host "  railway variables   - List all variables" -ForegroundColor White
Write-Host ""
