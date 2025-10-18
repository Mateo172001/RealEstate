# Getting Started Guide

Quick guide to get the Real Estate application running in less than 5 minutes.

## Prerequisites

Before you begin, ensure you have:

- **Docker Desktop** installed and running
  - Download: https://www.docker.com/products/docker-desktop
  - Verify: `docker --version` and `docker-compose --version`

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/Mateo172001/RealEstate.git
cd RealEstate
```

### Step 2: Start the Application

Choose your preferred method:

#### Option A: Double-Click (Easiest)

**macOS:**
1. Locate `Start RealEstate.command` in Finder
2. Double-click the file
3. A Terminal window will open and run the startup process
4. Browser opens automatically when ready

**Windows:**
1. Locate `Start RealEstate.bat` in File Explorer
2. Double-click the file
3. A Command Prompt window will open and run the startup
4. Browser opens automatically when ready

**Note:** First time on macOS, you may need to:
- Right-click → Open → Confirm
- Or run: `chmod +x "Start RealEstate.command"` in Terminal

#### Option B: Command Line

**macOS / Linux:**
```bash
# Make the script executable (first time only)
chmod +x start.sh

# Run the startup script
./start.sh
```

**Windows PowerShell:**
```powershell
# Enable script execution (first time only, if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run the startup script
.\start.ps1
```

#### Option C: Manual Start (All Platforms)

```bash
docker-compose up
```

Then manually open: http://localhost:3000

### Step 3: Wait for Services

The script will automatically:
- Build all Docker containers (first time only, takes 2-3 minutes)
- Start MongoDB, API, and Frontend
- Wait for all services to be healthy
- Open the frontend in your browser

**Expected output:**
```
╔════════════════════════════════════════╗
║   Real Estate Application Startup    ║
╚════════════════════════════════════════╝

📦 Starting Docker containers...
⏳ Waiting for services to be ready...

1. MongoDB...
   ✓ MongoDB is ready!

2. Backend API...
   ✓ API is ready!

3. Frontend...
   ✓ Frontend is ready!

🌐 Opening frontend in browser...
✅ Frontend opened in your default browser!
```

### Step 4: Explore the Application

Once the browser opens, you can:

1. **Homepage** - Search properties from the hero section
2. **Properties Page** - Browse all properties with advanced filters
3. **Property Detail** - Click any property to see full details
4. **Contact** - Learn about the developer

## Service URLs

After startup, you can access:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8080
- **Swagger Documentation**: http://localhost:8080/swagger
- **Health Check**: http://localhost:8080/health

## Common Issues

### Docker Desktop Not Running

**Error**: `Cannot connect to the Docker daemon`

**Solution**:
```bash
# Start Docker Desktop application
# Wait for it to fully start (whale icon in taskbar)
# Then run the script again
```

### Port Already in Use

**Error**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution**:
```bash
# Find what's using the port
# macOS/Linux:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml
```

### Containers Already Exist

**Error**: `container name already in use`

**Solution**:
```bash
# Stop and remove existing containers
docker-compose down

# Remove volumes (resets database)
docker-compose down -v

# Start fresh
./start.sh
```

### Script Permission Denied (macOS/Linux)

**Error**: `Permission denied: ./start.sh`

**Solution**:
```bash
chmod +x start.sh
./start.sh
```

### PowerShell Execution Policy (Windows)

**Error**: `cannot be loaded because running scripts is disabled`

**Solution**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\start.ps1
```

## Next Steps

### Explore Features

1. **Search Properties**
   - Use the hero search on homepage
   - Try filtering by name: "Heights", "Villa"
   - Try filtering by location: "California", "New York"

2. **Browse Properties**
   - Click "View All Properties"
   - Use advanced filters
   - Navigate through pages
   - Click on any property for details

3. **API Documentation**
   - Visit http://localhost:8080/swagger
   - Try out API endpoints directly
   - View request/response schemas

### Development

If you want to make changes:

```bash
# View logs
docker-compose logs -f

# Restart a service
docker-compose restart frontend
docker-compose restart api

# Rebuild after code changes
docker-compose build api
docker-compose up -d api
```

### Stop the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (database reset)
docker-compose down -v
```

## Default Data

The application seeds **50 sample properties** on first startup with:
- Realistic property names and addresses
- Prices ranging from $150,000 to $2,000,000
- Placeholder images (20 different images)
- Random owner assignments

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. View container logs: `docker-compose logs <service-name>`
3. Verify Docker Desktop is running
4. Ensure no other services are using ports 3000, 8080, or 27017

## Quick Reference

```bash
# Start application
./start.sh                          # macOS/Linux
.\start.ps1                         # Windows

# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Reset database
docker-compose down -v
docker-compose up

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up
```

---

**Need help?** Visit the full [README.md](./README.md) for comprehensive documentation.

