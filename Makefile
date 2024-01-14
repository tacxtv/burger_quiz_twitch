.PHONY: help
.DEFAULT_GOAL := help

DOCKER_IMG := $(shell (grep "^DOCKER_IMG=" .env || printf "ghcr.io/tacxtv/burger_quiz_twitch") | cut -d "=" -f 2)
DOCKER_NAME := $(shell (grep "^DOCKER_NAME=" .env || printf "burger_quiz_twitch") | cut -d "=" -f 2)
DOCKER_NETWORK := $(shell (grep "^DOCKER_NETWORK=" .env || printf "dev") | cut -d "=" -f 2)
DOCKER_HOSTINTERNAL := $(shell (grep "^DOCKER_HOSTINTERNAL=" .env || printf "host.docker.internal") | cut -d "=" -f 2)

help:
	@printf "\033[33mUsage:\033[0m\n  make [target] [arg=\"val\"...]\n\n\033[33mTargets:\033[0m\n"
	@awk 'BEGIN { FS = ":.*##"; } /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

build: ## Build Docker image
	@printf "\033[33mBuilding Docker image \033[36m$(DOCKER_IMG)\033[0m...\n"
	@docker build -t $(DOCKER_IMG) .

push:
	@printf "\033[33mPushing Docker image \033[36m$(DOCKER_IMG)\033[0m...\n"
	@docker push $(DOCKER_IMG)

start:
	@printf "\033[33mStarting \033[36m$(DOCKER_NAME)\033[0m...\n"
	@docker run -it --rm \
		--name $(DOCKER_NAME) \
		--add-host $(DOCKER_HOSTINTERNAL):host-gateway \
		--network $(DOCKER_NETWORK) \
		-v $(CURDIR):/usr/src/app \
		-p 4000:4000 \
		$(DOCKER_IMG)

dbs: ## Start Databases in Docker
	@docker run -d --rm \
		--add-host $(DOCKER_HOSTINTERNAL):host-gateway \
		--name $(DOCKER_NAME)-redis \
		--network $(DOCKER_NETWORK) \
		-p 6379:6379 \
		redis

#	@docker volume create $(DOCKER_NAME)-mongodb
#	@docker run -d --rm \
#		--name $(DOCKER_NAME)-mongodb \
#		--add-host $(DOCKER_HOSTINTERNAL):host-gateway \
#		-v $(DOCKER_NAME)-mongodb:/data/db \
#		-p 27017:27017 \
#		--network $(DOCKER_NETWORK) \
#		mongo:5.0 --wiredTigerCacheSizeGB 1.5 --quiet || true

stop: ## Stop Databases in Docker
	@docker stop $(DOCKER_NAME) || true

stopdbs: ## Stop Databases in Docker
	@docker stop $(DOCKER_NAME)-redis $(DOCKER_NAME)-mongodb || true
