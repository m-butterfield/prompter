package main

import (
	"github.com/m-butterfield/prompter/server/app/data"
	"log"
)

func main() {
	if err := data.Migrate(); err != nil {
		log.Fatal(err)
	}
}
