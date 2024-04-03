include .env

.PHONY: dev
dev:
	docker-compose -f docker-compose.services.yml up

.PHONY: down
down:
	docker-compose -f docker-compose.services.yml down -v

.PHONY: psql
psql:
	docker-compose -f docker-compose.services.yml exec db psql -U ${POSTGRES_USER}
