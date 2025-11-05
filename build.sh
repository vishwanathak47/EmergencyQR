#!/bin/bash

# Install client dependencies and build
echo "Installing client dependencies..."
cd client
npm install
echo "Building client..."
npm run build
cd ..

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install

# Create production dist directory
echo "Setting up production structure..."
mkdir -p dist/client
cp -r ../client/dist/* dist/client/

# Start the server
echo "Starting server..."
node server.js