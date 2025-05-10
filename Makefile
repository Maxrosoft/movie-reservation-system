SERVICE=backend

prod:
	docker compose run --rm $(SERVICE) npm start

dev:
	docker compose run --rm $(SERVICE) npm run dev

test:
	docker compose run --rm $(SERVICE) npm test

build:
	docker compose build

clean:
	docker compose down -v --rmi all --remove-orphans

up:
	docker compose up

down:
	docker compose down

logs:
	docker compose logs -f $(SERVICE)
