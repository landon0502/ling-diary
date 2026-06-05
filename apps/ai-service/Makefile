APP_NAME=ai-service

run:
	uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

dev:
	uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

build:
	docker build -t ai-service .

start:
	docker run -d --name ai-service -p 8001:8001 --env-file .env ai-service

clean:
	docker rm -f ai-service 2>/dev/null || true

test:
	python -m pytest tests/ -v

fmt:
	ruff format app/ tests/

tidy:
	ruff check app/ tests/ --fix

install:
	pip install -r requirements.txt

seed:
	python -m app.db.seed
