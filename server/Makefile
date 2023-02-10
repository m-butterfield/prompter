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
	yarn prettier --write .

run-server: export USE_LOCAL_FS=true
run-server: export SQL_LOGS=true
run-server: export GQL_PLAYGROUND=true
run-server:
	go run cmd/server/main.go

run-webpack:
	yarn run webpack --mode development --watch

run-webpack-prod:
	rm -rf app/static/js/dist
	yarn run webpack --mode production

test:
	go test -v ./app/...

update-deps:
	go get -u ./...
	go mod tidy
	yarn upgrade
