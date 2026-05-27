APP_NAME=server

run:
	air

dev:
	go run ./cmd/server

build:
	go build -o ./bin/$(APP_NAME) ./cmd/server

start:
	./bin/$(APP_NAME)

clean:
	rm -rf ./bin
	rm -rf ./tmp

test:
	go test ./...

fmt:
	go fmt ./...

tidy:
	go mod tidy