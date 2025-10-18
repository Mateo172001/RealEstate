@echo off
REM Batch file to start Real Estate application on Windows
REM Double-click this file to start the application

TITLE Real Estate Application Startup

cd /d "%~dp0"

color 0B
cls

echo.
echo ====================================
echo   Real Estate Application Startup
echo ====================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    color 0C
    echo.
    echo ERROR: Docker is not running!
    echo.
    echo Please start Docker Desktop and try again.
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo Starting application...
echo.

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File ".\start.ps1"

if errorlevel 1 (
    color 0C
    echo.
    echo Failed to start the application.
    echo Check the error messages above.
    echo.
)

pause

