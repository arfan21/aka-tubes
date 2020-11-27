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
		myArray := make([]helpers.MyArray, 0)
		for {
			var message string

			err := websocket.Message.Receive(ws, &message)

			if err != nil {
				log.Println(err)
				break
			}

			if strings.Contains(message, "size") {
				myArray = make([]helpers.MyArray, 0)

				var msg map[string]interface{}
				_ = json.Unmarshal([]byte(message), &msg)

				sizeStr := msg["size"].(string)
				size, _ := strconv.Atoi(sizeStr)
				array := rand.Perm(size)

				for i := 0; i < len(array); i++ {
					myArray = append(myArray, helpers.MyArray{array[i]})
				}

				json, _ := json.Marshal(helpers.SendArray{Tipe: "unsorted", Data: myArray})
				err = websocket.Message.Send(ws, string(json))
				if err != nil {
					log.Println(err)
				}
			}

			if strings.Contains(message, "now") {
				arr1 := make([]helpers.MyArray, len(myArray))
				copy(arr1, myArray)
				arr2 := make([]helpers.MyArray, len(myArray))
				copy(arr2, myArray)
				helpers.SelectionSort(ws, arr1)
				helpers.GnomeSort(ws, arr2)
			}
		}

	}).ServeHTTP(e.Response(), e.Request())

	return nil
}
