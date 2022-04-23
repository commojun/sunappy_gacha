package main

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"math/big"
	"math/rand"
	"os"
	"strings"

	"github.com/commojun/sunappy_gacha/pkg/sunappy_gacha"
	"github.com/studio-b12/gowebdav"
)

func main() {
	root := os.Getenv("DAV_URL")
	user := os.Getenv("DAV_USER")
	password := os.Getenv("DAV_PASS")
	remoteFolder := os.Getenv("REMOTE_FOLDER")
	localFolder := os.Getenv("LOCAL_FOLDER")

	sunappyGacha := sunappy_gacha.SunappyGacha{
		EmissionRate: sunappy_gacha.EmissionRate{
			SSR: 3,
			SR:  30,
			R:   300,
			N:   667,
		},
		Table: sunappy_gacha.Table{
			SSR: []string{},
			SR:  []string{},
			R:   []string{},
			N:   []string{},
		},
	}

	c := gowebdav.NewClient(root, user, password)

	files, err := c.ReadDir(remoteFolder)
	if err != nil {
		log.Fatal(err)
	}

	for _, file := range files {
		//notice that [file] has os.FileInfo type
		name := file.Name()
		if file.IsDir() {
			continue
		}

		rarity := CalcRarity(name)

		remotePath := remoteFolder + "/" + name
		localPath := localFolder + "/img/" + name

		// すでにファイルがあればDLしない
		if fileExists(localPath) {
			// add to struct
			sunappyGacha.AssignRarity(rarity, name)
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
		//ダウンロード成功 add to struct
		sunappyGacha.AssignRarity(rarity, name)
	}

	// output json
	outJson, err := json.Marshal(&sunappyGacha)
	if err != nil {
		log.Fatal(err)
	}
	// ファイルに書き出す
	jsonPath := localFolder + "/gacha.json"
	err = ioutil.WriteFile(jsonPath, outJson, 0644)

	fmt.Println("done")
}

func fileExists(filename string) bool {
	_, err := os.Stat(filename)
	return err == nil
}

func CalcRarity(str string) int {

	// ファイル名に "_SSR" と含まれればそのままSSRレア
	if strings.Contains(str, "_SSR") {
		return sunappy_gacha.SSR
	}

	// md5sumを出して16進数文字列にする
	md5sum := md5.Sum([]byte(str))
	hexstr := hex.EncodeToString(md5sum[:])

	// big.Intにする
	numBig, ok := big.NewInt(1).SetString(hexstr, 16)
	if !ok {
		log.Fatalln("failed to get odds of " + str)
	}

	// Int64最大値で割った余りを計算する
	maxInt := big.NewInt(math.MaxInt64)
	numInt64 := numBig.Mod(numBig, maxInt).Int64()

	// numInt64をSeedにして乱数生成し評価値とする(0~99)
	rand.Seed(numInt64)
	eval := rand.Intn(100)

	// rarity 0:SSR 1:SR 2:R 3:N
	// 評価値で振り分ける
	switch {
	case eval < 3:
		return sunappy_gacha.SSR
	case eval < 20:
		return sunappy_gacha.SR
	case eval < 50:
		return sunappy_gacha.R
	default:
		return sunappy_gacha.N
	}
}
