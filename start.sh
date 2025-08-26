#!/bin/bash

# Tuya-Alternative Service Management Script
# This script provides easy management of all Docker Compose services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Tuya-Alternative Services${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Function to start services
start_services() {
    print_status "Starting Tuya-Alternative services..."
    docker-compose up -d
    print_status "Services started successfully!"
    
    echo ""
    print_status "Service URLs:"
    echo "  Next.js App:     http://localhost:3000"
    echo "  MongoDB Express: http://localhost:8081"
    echo "  pgAdmin:         http://localhost:8082"
    echo "  Grafana:         http://localhost:3001"
    echo "  Prometheus:      http://localhost:9090"
    echo "  Nginx:           http://localhost"
    echo ""
    print_status "To start the Next.js application:"
    echo "  npm run dev"
}

# Function to stop services
stop_services() {
    print_status "Stopping Tuya-Alternative services..."
    docker-compose down
    print_status "Services stopped successfully!"
}

# Function to restart services
restart_services() {
    print_status "Restarting Tuya-Alternative services..."
    docker-compose down
    docker-compose up -d
    print_status "Services restarted successfully!"
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    docker-compose ps
}

# Function to show logs
show_logs() {
    if [ -z "$1" ]; then
        print_status "Showing logs for all services..."
        docker-compose logs -f
    else
        print_status "Showing logs for service: $1"
        docker-compose logs -f "$1"
    fi
}

# Function to reset everything
reset_services() {
    print_warning "This will remove all data and containers. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Resetting all services..."
        docker-compose down -v --rmi all
        print_status "Reset completed!"
    else
        print_status "Reset cancelled."
    fi
}

# Function to check health
check_health() {
    print_status "Checking service health..."
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_status "Services are running"
        
        # Check MongoDB
        if curl -s http://localhost:27017 > /dev/null 2>&1; then
            print_status "MongoDB: OK"
        else
            print_warning "MongoDB: Not responding"
        fi
        
        # Check Next.js app
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            print_status "Next.js App: OK"
        else
            print_warning "Next.js App: Not responding"
        fi
        
        # Check Grafana
        if curl -s http://localhost:3001 > /dev/null 2>&1; then
            print_status "Grafana: OK"
        else
            print_warning "Grafana: Not responding"
        fi
        
    else
        print_error "No services are running"
    fi
}

# Function to show help
show_help() {
    print_header
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start all services"
    echo "  stop      Stop all services"
    echo "  restart   Restart all services"
    echo "  status    Show service status"
    echo "  logs      Show logs (all services or specific service)"
    echo "  health    Check service health"
    echo "  reset     Reset all services (removes data)"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs mongodb"
    echo "  $0 health"
}

# Main script logic
main() {
    check_docker
    check_docker_compose
    
    case "${1:-help}" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs "$2"
            ;;
        health)
            check_health
            ;;
        reset)
            reset_services
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
