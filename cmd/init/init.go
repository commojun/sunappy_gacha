package main

import (
	"fmt"
	"log"
	"os"

	"github.com/studio-b12/gowebdav"
)

func main() {
	root := os.Getenv("DAV_URL")
	user := os.Getenv("DAV_USER")
	password := os.Getenv("DAV_PASS")

	c := gowebdav.NewClient(root, user, password)

	files, err := c.ReadDir("Picture/イラスト/今日のすなっぴー")
	if err != nil {
		log.Fatal(err)
	}
	for _, file := range files {
		//notice that [file] has os.FileInfo type
		fmt.Println(file.Name())
	}
}
