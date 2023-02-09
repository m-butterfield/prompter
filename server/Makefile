cloudrunbasecommand := gcloud run deploy --region=us-central1
deployservercommand := $(cloudrunbasecommand) --image=gcr.io/mattbutterfield/prompter prompter

deploy: docker-build docker-push
	$(deployservercommand)

docker-build:
	docker-compose build

docker-push:
	docker-compose push

fmt:
	go fmt ./...

run-server:
	go run cmd/server/main.go

test:
	go test -v ./app/...

update-deps:
	go get -u ./...
	go mod tidy
