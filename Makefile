export LOCAL_FOLDER=./public/gacha

bin/init:
	go build -o bin/init ./cmd/init/init.go

init-gacha:
	bin/init

build:
	npm run build

sync:
	rsync -av -e ssh ./dist/ conoha:/root/suna/public/
	rsync -av -e ssh ./bin/ conoha:/root/suna/bin/

deploy: build sync
