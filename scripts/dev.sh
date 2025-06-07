#!/bin/bash

# Company of One - Development Script
# Starts both frontend and backend concurrently

echo "🚀 Starting Company of One Development Environment..."

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down development servers..."
    kill %1 %2 2>/dev/null || true
    exit 0
}

# Trap CTRL+C
trap cleanup SIGINT

# Check if .env files exist
if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found. Creating from .env.example..."
    cp frontend/.env.example frontend/.env
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating from .env.example..."
    cp backend/.env.example backend/.env
fi

# Start backend
echo "� Starting backend on port 3001..."
cd backend && npm run dev &

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "🎨 Starting frontend on port 3000..."
cd ../frontend && npm run dev &

echo ""
echo "✅ Development servers started!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "� Backend:  http://localhost:3001"
echo "� Health:   http://localhost:3001/health"
echo ""
echo "Press CTRL+C to stop all servers"

# Wait for background processes
wait