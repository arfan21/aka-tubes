package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"strconv"
	"strings"
	"time"

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

				//deklarasi channel
				//channel digunakkan untuk menerima perubahan array setiap iteration
				//channel ketika menerima data dari fungsi sorting akan langsung dikirim ke client
				chanArrSelection := make(chan []int)
				chanArrGnome := make(chan []int)
				elapsedSelection := make(chan time.Duration)
				elapsedGnome := make(chan time.Duration)

				go helpers.SelectionSort(arr1, chanArrSelection, elapsedSelection)

				for arrSelection := range chanArrSelection {
					// mengirim data channel yang diterima dari fungsi selectionSort ke client
					json, _ := json.Marshal(helpers.SendResponse{Tipe: "selection-sort", Data: arrSelection})
					_ = websocket.Message.Send(ws, string(json)) //mengirim perubahan array ke client
				}

				msg, _ := json.Marshal(helpers.SendResponse{Tipe: "time-selection-sort", Data: fmt.Sprintf("time execute : %v", <-elapsedSelection)})
				_ = websocket.Message.Send(ws, string(msg))

				go helpers.GnomeSort(arr2, chanArrGnome, elapsedGnome)

				for arrGnome := range chanArrGnome {
					// mengirim data channel yang diterima dari fungsi gnomeSort ke client
					json, _ := json.Marshal(helpers.SendResponse{Tipe: "gnome-sort", Data: arrGnome})
					_ = websocket.Message.Send(ws, string(json)) //mengirim perubahan array ke client
				}

				msg, _ = json.Marshal(helpers.SendResponse{Tipe: "time-gnome-sort", Data: fmt.Sprintf("time execute : %v", <-elapsedGnome)})
				_ = websocket.Message.Send(ws, string(msg))
			}
		}

	}).ServeHTTP(e.Response(), e.Request())

	return nil
}
