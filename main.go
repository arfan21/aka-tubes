package main

import (
	"github.com/arfan21/tubes/controller"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	e.Static("/", "views")
	e.GET("/stream", controller.Controller)

	e.Logger.Fatal(e.Start(":8000"))
}
