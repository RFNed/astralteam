package main

import (
	"astral-core/internal/app"
	"astral-core/internal/config"
	"log"
)

func main() {
	log.Println("boot ...")
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}
	application, err := app.New(cfg)

	if err != nil {
		log.Fatal(err)
	}
	defer application.Close()

	if err := application.Run(); err != nil {
		log.Fatal(err)
	}
}
