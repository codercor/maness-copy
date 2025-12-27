#!/bin/bash

# =============================================================================
# MenEscape - Production Build & Deploy Script
# =============================================================================
# This script builds and runs the entire application stack using Docker Compose.
# 
# Usage:
#   ./deploy.sh           - Build and start all services
#   ./deploy.sh build     - Build only (no start)
#   ./deploy.sh start     - Start services (assumes already built)
#   ./deploy.sh stop      - Stop all services
#   ./deploy.sh restart   - Restart all services
#   ./deploy.sh logs      - View logs from all services
#   ./deploy.sh clean     - Stop and remove all containers, volumes, and images
#   ./deploy.sh status    - Show status of all services
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Print colored message
print_msg() {
    echo -e "${2:-$BLUE}$1${NC}"
}

# Print header
print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# Check if .env file exists
check_env() {
    if [ ! -f ".env" ]; then
        print_msg "No .env file found. Creating from .env.example..." "$YELLOW"
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_msg "Created .env file. Please update it with your production values!" "$YELLOW"
            print_msg "Edit .env and run this script again." "$YELLOW"
            echo ""
            print_msg "Important settings to configure:" "$RED"
            echo "  - NEXT_PUBLIC_API_URL: Your server's public URL (e.g., http://your-domain.com:3001/api)"
            echo "  - JWT_SECRET: A strong secret key for JWT tokens"
            echo "  - ADMIN_PASSWORD: A secure admin password"
            echo ""
            exit 1
        else
            print_msg "ERROR: .env.example not found!" "$RED"
            exit 1
        fi
    fi
}

# Load environment variables
load_env() {
    if [ -f ".env" ]; then
        export $(cat .env | grep -v '^#' | xargs)
    fi
    
    # Generate frontend .env.local with the API URL from main .env
    if [ -n "$NEXT_PUBLIC_API_URL" ]; then
        echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > frontend/.env.local
        print_msg "Generated frontend/.env.local with API URL: $NEXT_PUBLIC_API_URL" "$YELLOW"
    fi
}

# Build all services
build() {
    print_header "Building Docker Images"
    docker compose build --no-cache
    print_msg "Build completed successfully!" "$GREEN"
}

# Start all services
start() {
    print_header "Starting Services"
    docker compose up -d
    
    print_msg "Waiting for services to be healthy..." "$YELLOW"
    sleep 5
    
    # Show status
    docker compose ps
    
    echo ""
    print_msg "Services started successfully!" "$GREEN"
    echo ""
    print_msg "Access the application at:" "$BLUE"
    echo "  Frontend: http://localhost:${FRONTEND_PORT:-3000}"
    echo "  Backend API: http://localhost:${BACKEND_PORT:-3001}/api"
    echo "  Admin Panel: http://localhost:${FRONTEND_PORT:-3000}/admin"
    echo ""
}

# Stop all services
stop() {
    print_header "Stopping Services"
    docker compose down
    print_msg "Services stopped." "$GREEN"
}

# Restart all services
restart() {
    print_header "Restarting Services"
    docker compose restart
    print_msg "Services restarted." "$GREEN"
}

# View logs
logs() {
    docker compose logs -f
}

# Clean everything
clean() {
    print_header "Cleaning Up"
    print_msg "WARNING: This will remove all containers, volumes, and images!" "$RED"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker compose down -v --rmi all
        print_msg "Cleanup completed." "$GREEN"
    else
        print_msg "Cleanup cancelled." "$YELLOW"
    fi
}

# Show status
status() {
    print_header "Service Status"
    docker compose ps
}

# Seed database
seed() {
    print_header "Seeding Database"
    docker compose exec backend npm run seed
    print_msg "Database seeded." "$GREEN"
}

# Main execution
main() {
    print_msg "MenEscape Deployment Script" "$BLUE"
    
    case "${1:-}" in
        build)
            check_env
            load_env
            build
            ;;
        start)
            check_env
            load_env
            start
            ;;
        stop)
            stop
            ;;
        restart)
            restart
            ;;
        logs)
            logs
            ;;
        clean)
            clean
            ;;
        status)
            status
            ;;
        seed)
            seed
            ;;
        ""|deploy)
            check_env
            load_env
            build
            start
            ;;
        *)
            echo "Usage: $0 {build|start|stop|restart|logs|clean|status|seed}"
            echo ""
            echo "Commands:"
            echo "  build    - Build Docker images"
            echo "  start    - Start all services"
            echo "  stop     - Stop all services"
            echo "  restart  - Restart all services"
            echo "  logs     - View logs from all services"
            echo "  clean    - Remove all containers, volumes, and images"
            echo "  status   - Show status of all services"
            echo "  seed     - Seed the database with initial data"
            echo ""
            echo "Running without arguments will build and start all services."
            exit 1
            ;;
    esac
}

main "$@"
