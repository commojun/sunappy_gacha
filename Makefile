export LOCAL_FOLDER=./public/gacha

bin/init:
	go build -o bin/init ./cmd/init/init.go

init-gacha:
	bin/init
