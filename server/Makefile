cloudrunbasecommand := gcloud run deploy --region=us-central1
deployservercommand := $(cloudrunbasecommand) --image=gcr.io/mattbutterfield/prompter prompter

terraformbasecommand := cd infra && terraform
terraformvarsarg := -var-file=secrets.tfvars

export DB_SOCKET=host=localhost dbname=prompter

deploy: docker-build docker-push
	$(deployservercommand)

docker-build:
	docker-compose build

docker-push:
	docker-compose push

fmt:
	go fmt ./...
	yarn prettier --loglevel warn --write .
	cd infra/ && terraform fmt

generate:
	go run github.com/99designs/gqlgen generate
	yarn graphql-codegen

reset-db:
	dropdb --if-exists prompter
	createdb prompter
	psql -f dump.sql prompter

migrate:
	go run cmd/migrate/main.go

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

test: export DB_SOCKET=host=localhost dbname=prompter_test
test:
	dropdb --if-exists prompter_test
	createdb prompter_test
	psql prompter_test -c 'CREATE EXTENSION citext'
	psql prompter_test -c 'CREATE EXTENSION "uuid-ossp"'
	go run cmd/migrate/main.go
	go test -v ./app/...

update-deps:
	go get -u ./...
	go mod tidy
	yarn upgrade
	cd infra && terraform init -upgrade && cd -
