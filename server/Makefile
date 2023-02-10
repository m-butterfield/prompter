cloudrunbasecommand := gcloud run deploy --region=us-central1
deployservercommand := $(cloudrunbasecommand) --image=gcr.io/mattbutterfield/prompter prompter

terraformbasecommand := cd infra && terraform
terraformvarsarg := -var-file=secrets.tfvars

deploy: docker-build docker-push
	$(deployservercommand)

docker-build:
	docker-compose build

docker-push:
	docker-compose push

fmt:
	go fmt ./...
	yarn prettier --write .
	cd infra/ && terraform fmt

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

tf-plan:
	$(terraformbasecommand) plan $(terraformvarsarg)

tf-apply:
	$(terraformbasecommand) apply $(terraformvarsarg)

tf-refresh:
	$(terraformbasecommand) apply $(terraformvarsarg) -refresh-only

test:
	go test -v ./app/...

update-deps:
	go get -u ./...
	go mod tidy
	yarn upgrade
	cd infra && terraform init -upgrade && cd -
