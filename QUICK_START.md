# Quick Start

## The Fastest Way to Run This Application

### Step 1: Install Docker Desktop

Download and install Docker Desktop:
- **Windows/Mac**: https://www.docker.com/products/docker-desktop

### Step 2: Clone the Repository

```bash
git clone https://github.com/Mateo172001/RealEstate.git
```

### Step 3: Start the Application

#### On macOS

1. Open Finder
2. Navigate to the `RealEstate` folder
3. **Double-click** `Start RealEstate.command`
4. Wait 1-2 minutes
5. Browser opens automatically ✓

**First time:** Right-click → Open → Confirm

#### On Windows

1. Open File Explorer
2. Navigate to the `RealEstate` folder
3. **Double-click** `Start RealEstate.bat`
4. Wait 1-2 minutes
5. Browser opens automatically ✓

### That's It!

The application will:
- Start all Docker containers
- Set up the database
- Load 50 sample properties
- Open http://localhost:3000 in your browser

## Available Services

Once started:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8080
- **Swagger Docs**: http://localhost:8080/swagger

## To Stop

```bash
docker-compose down
```

## Need Help?

See the full documentation:
- [README.md](./README.md) - Complete documentation
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Detailed getting started guide
- [frontend/README.md](./frontend/README.md) - Frontend documentation
- [backend/README.md](./backend/README.md) - Backend documentation

