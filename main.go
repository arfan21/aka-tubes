package main

import (
	"fmt"
	"os"

	"github.com/arfan21/tubes/controller"

	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo/v4"
)

func main() {
	release := os.Getenv("RELEASE")
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	e := echo.New()

	e.Static("/", "views")
	e.GET("/stream", controller.Controller)

	e.GET("/link-ws", func(c echo.Context) error {
		var linkWs string

		if release == "true" {
			linkWs = "wss://tubes-aka.arfantest-server.site/stream"
		} else {
			linkWs = fmt.Sprintf("ws://localhost:%s/stream", port)
		}

		return c.JSON(200, echo.Map{"link": linkWs})
	})

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%s", port)))
}
