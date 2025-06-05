#!/bin/bash

# Company of One - CI/CD & Monitoring Setup Script
# This script sets up the monitoring infrastructure and validates the configuration

set -e

echo "🚀 Starting Company of One CI/CD & Monitoring Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 20+ first."
        exit 1
    fi
    
    # Check Node version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    log_success "All prerequisites are met"
}

# Setup project dependencies
setup_dependencies() {
    log_info "Installing project dependencies..."
    
    # Install root dependencies
    npm ci
    
    # Install frontend dependencies
    cd frontend && npm ci && cd ..
    
    # Install backend dependencies
    cd backend && npm ci && cd ..
    
    log_success "Dependencies installed successfully"
}

# Create monitoring directories
setup_directories() {
    log_info "Setting up monitoring directories..."
    
    mkdir -p monitoring/{prometheus,grafana/{provisioning/{dashboards,datasources},dashboards},alertmanager,blackbox}
    mkdir -p logs
    
    log_success "Directories created successfully"
}

# Start monitoring stack
start_monitoring() {
    log_info "Starting monitoring stack..."
    
    # Check if docker-compose file exists
    if [ ! -f "docker-compose.monitoring.yml" ]; then
        log_error "docker-compose.monitoring.yml not found"
        exit 1
    fi
    
    # Start the monitoring stack
    docker-compose -f docker-compose.monitoring.yml up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 30
    
    # Check if services are running
    if docker-compose -f docker-compose.monitoring.yml ps | grep -q "Up"; then
        log_success "Monitoring stack started successfully"
    else
        log_error "Failed to start monitoring stack"
        docker-compose -f docker-compose.monitoring.yml logs
        exit 1
    fi
}

# Validate monitoring endpoints
validate_monitoring() {
    log_info "Validating monitoring endpoints..."
    
    # Check Prometheus
    if curl -f http://localhost:9090/-/healthy &> /dev/null; then
        log_success "Prometheus is healthy"
    else
        log_warning "Prometheus is not responding"
    fi
    
    # Check Grafana
    if curl -f http://localhost:3001/api/health &> /dev/null; then
        log_success "Grafana is healthy"
    else
        log_warning "Grafana is not responding"
    fi
    
    # Check Alertmanager
    if curl -f http://localhost:9093/-/healthy &> /dev/null; then
        log_success "Alertmanager is healthy"
    else
        log_warning "Alertmanager is not responding"
    fi
}

# Run tests
run_tests() {
    log_info "Running project tests..."
    
    # Run linting
    npm run lint
    
    # Run type checking
    npm run type-check
    
    # Run unit tests
    npm run test:all
    
    log_success "All tests passed"
}

# Generate sample configuration
generate_sample_config() {
    log_info "Generating sample configuration files..."
    
    # Create .env.example
    cat > .env.example << EOF
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_org_id_here
VERCEL_PROJECT_ID_FRONTEND=your_frontend_project_id
VERCEL_PROJECT_ID_BACKEND=your_backend_project_id

# Environment URLs
STAGING_API_URL=https://your-staging-api.vercel.app
PRODUCTION_API_URL=https://your-production-api.vercel.app
STAGING_DATABASE_URL=your_staging_database_url
PRODUCTION_DATABASE_URL=your_production_database_url

# Monitoring
SLACK_WEBHOOK_URL=your_slack_webhook_url
PAGERDUTY_ROUTING_KEY=your_pagerduty_routing_key

# Application
NODE_ENV=development
API_PORT=3000
FRONTEND_PORT=3000
EOF
    
    log_success "Sample configuration created: .env.example"
}

# Display setup summary
display_summary() {
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "📊 Monitoring Dashboards:"
    echo "  • Prometheus: http://localhost:9090"
    echo "  • Grafana: http://localhost:3001 (admin/admin123)"
    echo "  • Alertmanager: http://localhost:9093"
    echo ""
    echo "🚀 Next Steps:"
    echo "  1. Configure GitHub repository secrets (see docs/CI-CD-MONITORING.md)"
    echo "  2. Update monitoring URLs in prometheus.yml"
    echo "  3. Configure alert notification channels"
    echo "  4. Import Grafana dashboards"
    echo ""
    echo "📚 Documentation:"
    echo "  • Setup Guide: docs/CI-CD-MONITORING.md"
    echo "  • API Health: http://localhost:3000/health"
    echo ""
    echo "🔧 Useful Commands:"
    echo "  • Start monitoring: docker-compose -f docker-compose.monitoring.yml up -d"
    echo "  • Stop monitoring: docker-compose -f docker-compose.monitoring.yml down"
    echo "  • View logs: docker-compose -f docker-compose.monitoring.yml logs -f"
    echo "  • Run tests: npm run test:all"
    echo ""
}

# Cleanup function
cleanup() {
    if [ $? -ne 0 ]; then
        log_error "Setup failed. Cleaning up..."
        docker-compose -f docker-compose.monitoring.yml down &> /dev/null || true
    fi
}

# Set trap for cleanup
trap cleanup EXIT

# Main execution
main() {
    check_prerequisites
    setup_dependencies
    setup_directories
    generate_sample_config
    start_monitoring
    validate_monitoring
    run_tests
    display_summary
}

# Handle command line arguments
case "${1:-}" in
    --monitoring-only)
        log_info "Setting up monitoring stack only..."
        setup_directories
        start_monitoring
        validate_monitoring
        ;;
    --tests-only)
        log_info "Running tests only..."
        run_tests
        ;;
    --help)
        echo "Company of One CI/CD & Monitoring Setup"
        echo ""
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --monitoring-only    Setup monitoring stack only"
        echo "  --tests-only        Run tests only"
        echo "  --help              Show this help message"
        echo ""
        exit 0
        ;;
    *)
        main
        ;;
esac

log_success "Setup completed successfully! 🎉"