#!/bin/bash

# Change to the script's directory
cd "$(dirname "$0")"

# Run the startup script
./start.sh

# Keep terminal open
echo ""
read -p "Press Enter to close this window..."

