package main

import (
	"os"

	"github.com/arfan21/tubes/controller"
	_ "github.com/joho/godotenv/autoload"
	"github.com/labstack/echo/v4"
)

func main() {
	release := os.Getenv("RELEASE")
	e := echo.New()

	e.Static("/", "views")
	e.GET("/stream", controller.Controller)

	e.GET("/link-ws", func(c echo.Context) error {
		var linkWs string

		if release == "true" {
			linkWs = "wss://tubes-aka.arfantest-server.site/stream"
		} else {
			linkWs = "ws://localhost:8000/stream"
		}

		return c.JSON(200, echo.Map{"link": linkWs})
	})

	e.Logger.Fatal(e.Start(":8000"))
}
