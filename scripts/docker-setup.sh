#!/bin/bash

# Docker setup script for manga crawler

echo "🐳 Setting up Docker environment for Manga Crawler..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
DATABASE_URL=postgresql://postgres:password@localhost:5432/komik_crawler
SCRAPING_URL=https://mangapark.net/
NODE_ENV=development
EOF
    echo "✅ .env file created"
fi

# Build and start services
echo "🏗️  Building Docker images..."
docker-compose -f docker-compose.dev.yml build

echo "🚀 Starting services..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate dev

echo "✅ Docker setup complete!"
echo "🌐 Application is running at http://localhost:3000"
echo "🗄️  Database is running at localhost:5432"
echo ""
echo "Useful commands:"
echo "  - View logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "  - Stop services: docker-compose -f docker-compose.dev.yml down"
echo "  - Restart services: docker-compose -f docker-compose.dev.yml restart"