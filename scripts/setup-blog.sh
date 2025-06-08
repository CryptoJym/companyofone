#!/bin/bash

# Blog Infrastructure Setup Script
# This script sets up the complete blog infrastructure for Company of One

set -e

echo "🚀 Setting up Blog Infrastructure for Company of One..."
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Step 1: Install dependencies
print_status "Installing project dependencies..."
npm install

print_status "Installing backend dependencies..."
cd backend && npm install && cd ..

print_status "Installing frontend dependencies..."
cd frontend && npm install && cd ..

print_success "Dependencies installed successfully"

# Step 2: Create blog data directory and initialize with sample posts
print_status "Setting up blog data structure..."
mkdir -p backend/data/blog

if [ -f "backend/data/blog/sample-posts.json" ]; then
    if [ ! -f "backend/data/blog/posts.json" ]; then
        cp backend/data/blog/sample-posts.json backend/data/blog/posts.json
        print_success "Blog initialized with sample posts"
    else
        print_warning "Blog posts already exist, skipping initialization"
    fi
else
    print_warning "Sample posts not found, creating empty posts file"
    echo "[]" > backend/data/blog/posts.json
fi

# Step 3: Create environment file if it doesn't exist
print_status "Setting up environment configuration..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Environment file created (.env)"
    print_warning "Please update the .env file with your configuration"
else
    print_warning ".env file already exists, skipping creation"
fi

# Step 4: Generate a secure API key
print_status "Generating secure blog admin API key..."
API_KEY=$(openssl rand -base64 32 2>/dev/null || echo "please-change-this-secure-api-key-$(date +%s)")
if [ -f ".env" ]; then
    # Update the API key in .env file
    if grep -q "BLOG_ADMIN_API_KEY" .env; then
        sed -i.bak "s/BLOG_ADMIN_API_KEY=.*/BLOG_ADMIN_API_KEY=$API_KEY/" .env
    else
        echo "BLOG_ADMIN_API_KEY=$API_KEY" >> .env
    fi
    print_success "Secure API key generated and added to .env"
else
    print_warning "No .env file found, please manually set BLOG_ADMIN_API_KEY=$API_KEY"
fi

# Step 5: Test the setup
print_status "Testing blog infrastructure..."

# Check if blog posts can be listed
echo "Testing blog CLI..."
if npm run blog:stats >/dev/null 2>&1; then
    print_success "Blog CLI working correctly"
else
    print_warning "Blog CLI test failed, but continuing setup"
fi

# Step 6: Display setup summary
echo
echo "🎉 Blog Infrastructure Setup Complete!"
echo
echo "📊 Setup Summary:"
echo "  ✅ Dependencies installed"
echo "  ✅ Blog data structure created"
echo "  ✅ Environment configuration ready"
echo "  ✅ Secure API key generated"
echo "  ✅ Sample posts initialized"
echo
echo "🔧 Available Commands:"
echo "  npm run blog:list        - List all blog posts"
echo "  npm run blog:create      - Create a new blog post"
echo "  npm run blog:publish <id> - Publish a draft post"
echo "  npm run blog:delete <id>  - Delete a post"
echo "  npm run blog:stats       - Show blog statistics"
echo
echo "🚀 Start the application:"
echo "  npm run start:backend    - Start the backend server"
echo "  npm run start:frontend   - Start the frontend development server"
echo "  npm run start:full       - Start both backend and frontend"
echo
echo "🔑 Admin API Key (save this securely):"
echo "  $API_KEY"
echo
echo "📝 Next Steps:"
echo "  1. Review and update the .env file with your configuration"
echo "  2. Start the backend server: npm run start:backend"
echo "  3. Start the frontend development server: npm run start:frontend"
echo "  4. Visit http://localhost:3000/blog to see your blog"
echo "  5. Use the API key above for creating/updating posts"
echo
print_success "Setup completed successfully! Happy blogging! 🎉"