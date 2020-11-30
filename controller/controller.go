package controller

import (
	"encoding/json"
	"log"
	"math/rand"
	"strconv"
	"strings"

	"github.com/arfan21/tubes/helpers"
	"github.com/labstack/echo/v4"
	"golang.org/x/net/websocket"
)

func Controller(e echo.Context) error {
	websocket.Handler(func(ws *websocket.Conn) {
		defer ws.Close()
		myArray := make([]int, 0)
		for {
			var message string

			err := websocket.Message.Receive(ws, &message) // menerima message dari client

			if err != nil {
				log.Println(err)
				break
			}

			if strings.Contains(message, "generate array") {
				myArray = make([]int, 0) // reset array

				var msg map[string]interface{}
				_ = json.Unmarshal([]byte(message), &msg) // decode message from client

				sizeStr := msg["data"].(string)
				size, err := strconv.Atoi(sizeStr) //convert size array dari string ke integer

				if err != nil {
					json, _ := json.Marshal(helpers.SendResponse{Tipe: "error", Data: "inputan hanya angka"})
					err = websocket.Message.Send(ws, string(json))
				} else {
					myArray = rand.Perm(size)

					json, _ := json.Marshal(helpers.SendResponse{Tipe: "unsorted", Data: myArray})

					err = websocket.Message.Send(ws, string(json))
					if err != nil {
						log.Println(err)
					}
				}
			}

			if strings.Contains(message, "shorting now") {
				arr1 := make([]int, len(myArray))
				copy(arr1, myArray) //membuat copy dari array myArray
				arr2 := make([]int, len(myArray))
				copy(arr2, myArray)
				helpers.SelectionSort(ws, arr1)
				helpers.GnomeSort(ws, arr2)
			}
		}

	}).ServeHTTP(e.Response(), e.Request())

	return nil
}
