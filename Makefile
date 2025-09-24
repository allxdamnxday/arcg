.PHONY: help dev build test clean deploy lint typecheck format

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev      - Start development environment with Docker"
	@echo "  make build    - Build production Docker image"
	@echo "  make test     - Run all tests in Docker"
	@echo "  make lint     - Run linting and type checking"
	@echo "  make format   - Format code with Prettier"
	@echo "  make clean    - Clean up Docker resources"
	@echo "  make deploy   - Deploy to production (pushes to main)"
	@echo "  make logs     - Show Docker container logs"
	@echo "  make shell    - Access Docker container shell"

# Development
dev:
	docker-compose up

# Build production image
build:
	docker-compose build --no-cache

# Run tests
test:
	npm run typecheck
	npm run lint
	npm run format:check
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Linting and type checking
lint:
	npm run typecheck
	npm run lint
	npm run format:check

# Format code
format:
	npm run format

# Clean Docker resources
clean:
	docker-compose down -v --rmi all
	rm -rf .next node_modules coverage

# Deploy to production
deploy:
	@echo "Deploying to production..."
	@echo "1. Ensuring on main branch..."
	@git checkout main
	@echo "2. Pulling latest changes..."
	@git pull origin main
	@echo "3. Running tests..."
	@make test
	@echo "4. Pushing to main..."
	@git push origin main
	@echo "Deploy initiated! Check GitHub Actions for progress."

# View logs
logs:
	docker-compose logs -f

# Access container shell
shell:
	docker-compose exec app sh

# Quick rebuild (preserves cache)
rebuild:
	docker-compose build

# Status check
status:
	@docker-compose ps
	@echo ""
	@echo "Node version in container:"
	@docker-compose exec app node --version 2>/dev/null || echo "Container not running"