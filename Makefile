export LOCAL_FOLDER=./public/gacha

cron:
	docker pull commojun/cron:latest

up:
	docker compose up -d

shell:
	docker compose exec gacha-cron bash

clean:
	-rm bin/init

bin/init:
	go build -o bin/init ./cmd/init/init.go

init-gacha:
	bin/init

build: bin/init
	npm run build

sync:
	rsync -av -e ssh ./dist/ conoha:/root/suna/public/
	rsync -av -e ssh ./bin/ conoha:/root/suna/bin/

deploy: build sync
