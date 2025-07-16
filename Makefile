# Makefile untuk Docker Development

.PHONY: dev-up dev-down dev-build dev-logs prod-up prod-down prod-build

# Development commands
dev-up:
	docker-compose -f docker-compose.dev.yml up -d

dev-build:
	docker-compose -f docker-compose.dev.yml up --build -d

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f komik-crawler-dev

dev-shell:
	docker exec -it komik-crawler-dev sh

# Production commands
prod-up:
	docker-compose up -d

prod-build:
	docker-compose up --build -d

prod-down:
	docker-compose down

prod-logs:
	docker-compose logs -f komik-crawler-be

# Database commands
db-reset:
	docker-compose -f docker-compose.dev.yml exec komik-crawler-dev npx prisma migrate reset --force

db-migrate:
	docker-compose -f docker-compose.dev.yml exec komik-crawler-dev npx prisma migrate dev

db-studio:
	docker-compose -f docker-compose.dev.yml exec komik-crawler-dev npx prisma studio

# Cleanup commands
clean:
	docker system prune -f
	docker volume prune -f
