# PowerShell script to start Real Estate application
# For Windows users

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║   Real Estate Application Startup    ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

# Start Docker Compose
Write-Host "📦 Starting Docker containers..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start Docker containers" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Write-Host ""

# Function to check if a service is ready
function Test-ServiceReady {
    param(
        [string]$ServiceName,
        [string]$Url,
        [int]$MaxAttempts = 30
    )
    
    Write-Host "   Checking $ServiceName..." -ForegroundColor Blue
    
    for ($i = 0; $i -lt $MaxAttempts; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host "   ✓ $ServiceName is ready!" -ForegroundColor Green
                return $true
            }
        }
        catch {
            Write-Host "." -NoNewline
            Start-Sleep -Seconds 2
        }
    }
    
    Write-Host ""
    Write-Host "   ✗ $ServiceName failed to start" -ForegroundColor Red
    return $false
}

# Wait for MongoDB
Write-Host "1. MongoDB..." -ForegroundColor Blue
Start-Sleep -Seconds 3
Write-Host "   ✓ MongoDB is ready!" -ForegroundColor Green

# Wait for API
Write-Host ""
Write-Host "2. Backend API..." -ForegroundColor Blue
$apiReady = Test-ServiceReady -ServiceName "API" -Url "http://localhost:8080/health"

if (-not $apiReady) {
    Write-Host ""
    Write-Host "💡 Tip: Check logs with: docker-compose logs api" -ForegroundColor Yellow
    exit 1
}

# Wait for Frontend
Write-Host ""
Write-Host "3. Frontend..." -ForegroundColor Blue
$frontendReady = Test-ServiceReady -ServiceName "Frontend" -Url "http://localhost:3000"

if (-not $frontendReady) {
    Write-Host ""
    Write-Host "💡 Tip: Check logs with: docker-compose logs frontend" -ForegroundColor Yellow
    exit 1
}

# All services ready!
Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     All Services Are Ready! 🎉        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Application URLs:" -ForegroundColor Blue
Write-Host "   Frontend:  " -NoNewline; Write-Host "http://localhost:3000" -ForegroundColor Green
Write-Host "   API:       " -NoNewline; Write-Host "http://localhost:8080" -ForegroundColor Green
Write-Host "   Swagger:   " -NoNewline; Write-Host "http://localhost:8080/swagger" -ForegroundColor Green
Write-Host "   Health:    " -NoNewline; Write-Host "http://localhost:8080/health" -ForegroundColor Green
Write-Host ""

# Open browser
Write-Host "🌐 Opening frontend in browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✅ Frontend opened in your default browser!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Useful commands:" -ForegroundColor Blue
Write-Host "   View logs:        " -NoNewline; Write-Host "docker-compose logs -f" -ForegroundColor Yellow
Write-Host "   Stop services:    " -NoNewline; Write-Host "docker-compose down" -ForegroundColor Yellow
Write-Host "   Restart:          " -NoNewline; Write-Host "docker-compose restart" -ForegroundColor Yellow
Write-Host ""

