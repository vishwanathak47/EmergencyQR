#!/bin/bash

# Function to print section header
print_section() {
    echo "=============================="
    echo "$1"
    echo "=============================="
}

# Check directory structure
print_section "Directory Structure"
pwd
ls -la

# Build client
print_section "Building Client"
cd client
npm install --production=false
npm run build
ls -la dist/
cd ..

# Build server and copy client files
print_section "Building Server"
cd server
npm install
mkdir -p dist/client
cp -r ../client/dist/* dist/client/
echo "Client files copied to server/dist/client:"
ls -la dist/client/

print_section "Build Complete"