package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"github.com/studio-b12/gowebdav"
)

func main() {
	root := os.Getenv("DAV_URL")
	user := os.Getenv("DAV_USER")
	password := os.Getenv("DAV_PASS")
	remoteFolder := os.Getenv("REMOTE_FOLDER")
	localFolder := os.Getenv("LOCAL_FOLDER")

	c := gowebdav.NewClient(root, user, password)

	files, err := c.ReadDir(remoteFolder)
	if err != nil {
		log.Fatal(err)
	}
	for _, file := range files {
		//notice that [file] has os.FileInfo type
		name := file.Name()
		fmt.Println(name)
		if file.IsDir() {
			continue
		}

		remotePath := remoteFolder + "/" + name
		localPath := localFolder + "/" + name

		// すでにファイルがあればDLしない
		if fileExists(localPath) {
			// add to map
			continue
		}

		bytes, err := c.Read(remotePath)
		if err != nil {
			log.Printf("Could not read %s: %s\n", remotePath, err)
			continue
		}
		err = ioutil.WriteFile(localPath, bytes, 0644)
		if err != nil {
			log.Printf("Could not write %s: %s\n", localPath, err)
			continue
		}
		// add to map
	}
}

func fileExists(filename string) bool {
	_, err := os.Stat(filename)
	return err == nil
}
