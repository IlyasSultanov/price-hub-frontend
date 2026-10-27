.PHONY: build-image build-loc down-loc down-v-loc logs restart-loc stop-loc install-deps

build-image:
	docker build -f .devcontainer/Dockerfile-dev -t price-hub-frontend:dev .

build-loc: build-image
	@docker network create shared_network || true
	docker rm -f price-hub-frontend-dev || true
	docker run -d \
		--name price-hub-frontend-dev \
		--network shared_network \
		-p 4201:4201 \
		-e CI=1 \
		-e CHOKIDAR_USEPOLLING=true \
		-e WATCHPACK_POLLING=true \
		--add-host=host.docker.internal:host-gateway \
		-v $(PWD):/app \
		-v price_hub_frontend_node_modules:/app/node_modules \
		-v price_hub_frontend_pnpm_store:/app/.pnpm-store \
		--restart unless-stopped \
		-it \
		-w /app \
		price-hub-frontend:dev sh -c "pnpm i && CI=1 pnpm ng serve --host=0.0.0.0 --port=4201 --poll=1000"

logs:
	docker logs -f price-hub-frontend-dev

down-loc:
	docker stop price-hub-frontend-dev || true
	docker rm price-hub-frontend-dev || true

stop-loc:
	docker stop price-hub-frontend-dev || true

down-v-loc: down-loc
	docker volume rm price_hub_frontend_node_modules || true

restart-loc:
	docker restart price-hub-frontend-dev || true

install-deps:
	docker run --rm -v $(PWD):/app -w /app price-hub-frontend:dev pnpm install
