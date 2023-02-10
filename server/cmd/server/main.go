package main

import (
	"github.com/m-butterfield/prompter/server/app/controllers"
	"log"
)

func main() {
	if err := controllers.Run("8000"); err != nil {
		log.Fatal(err)
	}
}
