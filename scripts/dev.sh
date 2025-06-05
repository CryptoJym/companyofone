#!/bin/bash

# Development script to start both frontend and backend
echo "🚀 Starting Company of One development environment..."

# Function to kill all background processes on exit
cleanup() {
    echo "🛑 Stopping development servers..."
    jobs -p | xargs -r kill
    exit
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend server
echo "📡 Starting backend server on port 3001..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server on port 3000..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

# Display information
echo ""
echo "✅ Development environment is running!"
echo "📡 Backend API: http://localhost:3001"
echo "🎨 Frontend App: http://localhost:3000"
echo "📊 API Health Check: http://localhost:3001/health"
echo "📋 API Documentation: http://localhost:3001/api/v1"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait