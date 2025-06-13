#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting Plushie Paradise Application..."

# --- Frontend Setup ---
echo "Setting up Frontend..."

# Navigate to frontend directory
cd frontend

# Install frontend dependencies
if [ -f package-lock.json ]; then
    echo "Found package-lock.json, using npm ci for faster, reliable frontend installs."
    npm ci
elif [ -f yarn.lock ]; then
    echo "Found yarn.lock, using yarn install --frozen-lockfile for frontend."
    yarn install --frozen-lockfile
else
    echo "No lockfile found, using npm install for frontend."
    npm install
fi

# Build frontend
echo "Building frontend application..."
npm run build
echo "Frontend build complete."

# Navigate back to project root
cd ..

# --- Backend Setup ---
echo "Setting up Backend..."

# Navigate to backend directory
cd backend

# Install backend dependencies
if [ -f package-lock.json ]; then
    echo "Found package-lock.json, using npm ci for faster, reliable backend installs."
    npm ci
elif [ -f yarn.lock ]; then
    echo "Found yarn.lock, using yarn install --frozen-lockfile for backend."
    yarn install --frozen-lockfile
else
    echo "No lockfile found, using npm install for backend."
    npm install
fi

# Initialize and seed database
echo "Initializing and seeding database..."
# Check if the DB_PATH environment variable is set to use a file-based DB
if [[ -n "${DB_PATH}" && "${DB_PATH}" != ":memory:" ]]; then
    if [ ! -f "${DB_PATH}" ]; then
        echo "Database file ${DB_PATH} not found. Seeding database..."
        node db.js init
        echo "Database seeded."
    else
        echo "Database file ${DB_PATH} found. Assuming already initialized/seeded."
        # Optionally, you might still want to run init if it's idempotent and handles updates
        # node db.js init 
    fi
else
    echo "Using in-memory database or DB_PATH not set for file. Seeding database..."
    # For in-memory, db.js init is needed on each start to populate data
    node db.js init 
    echo "In-memory database seeded."
fi

echo "Backend setup complete."

# --- Start Application ---
echo "Starting backend server on port 9000..."
# The backend server (server.js) is configured to serve the frontend static files.
# PORT environment variable is used by server.js. Default is 9000.
export PORT=${PORT:-9000}
node server.js

echo "Plushie Paradise Application started successfully!"
echo "Access at http://localhost:${PORT}"
