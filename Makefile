
dev: 
	docker compose --env-file backend/.dev.env up -d --build

prod: 
	docker compose --env-file backend/.prod.env up -d --build