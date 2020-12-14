package controller

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/arfan21/tubes/helpers"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

func Controller(e echo.Context) error {
	ws, err := websocket.Upgrade(e.Response(), e.Request(), e.Response().Header(), 1024, 1024)
	if err != nil {
		e.JSON(http.StatusBadRequest, "Could not open websocket connection")
	}

	keepAlive(ws, 60*time.Second)

	defer ws.Close()
	myArray := make([]int, 0)

	for {
		var message map[string]interface{}
		err := ws.ReadJSON(&message)
		if err != nil {
			e.Logger().Error(err)
			websocket.WriteJSON(ws, helpers.SendResponse{Tipe: "error", Data: err.Error()})
			return err
		}

		msgString := message["tipe"].(string)
		fmt.Println(msgString)

		if strings.Contains(msgString, "generate array") {
			myArray = make([]int, 0) // reset array

			sizeStr := message["data"].(string)
			size, err := strconv.Atoi(sizeStr) //convert size array dari string ke integer

			if err != nil {
				err = websocket.WriteJSON(ws, helpers.SendResponse{Tipe: "error", Data: "inputan hanya angka"})
				if err != nil {
					log.Println(err)
				}
			} else {
				myArray = rand.Perm(size)

				err = websocket.WriteJSON(ws, helpers.SendResponse{Tipe: "unsorted", Data: myArray})
				if err != nil {
					log.Println(err)
				}
			}
		}

		if strings.Contains(msgString, "sorting now") {
			arrCopy := make([]int, len(myArray))
			copy(arrCopy, myArray) //membuat copy dari array myArray

			//deklarasi channel
			//channel digunakkan untuk menerima perubahan array setiap iteration
			//channel ketika menerima data dari fungsi sorting akan langsung dikirim ke client
			chanArrSelection := make(chan []int)
			elapsedSelection := make(chan time.Duration)

			fmt.Println("Main : Start all function sorting")

			var wg sync.WaitGroup

			wg.Add(2)

			go helpers.SelectionSort(arrCopy, chanArrSelection, elapsedSelection, &wg)

			go func() {
				defer wg.Done()
				for arrSelection := range chanArrSelection {
					// mengirim data channel yang diterima dari fungsi selectionSort ke client
					_ = websocket.WriteJSON(ws, helpers.SendResponse{Tipe: "selection-sort", Data: arrSelection}) //mengirim perubahan array ke client
				}
				_ = websocket.WriteJSON(ws, helpers.SendResponse{Tipe: "time-selection-sort", Data: fmt.Sprintf("time execute : %v", <-elapsedSelection)})

			}()

			wg.Wait()
		}

		if strings.Contains(msgString, "selection done") {
			arrCopy := make([]int, len(myArray))
			copy(arrCopy, myArray)

			//deklarasi channel
			//channel digunakkan untuk menerima perubahan array setiap iteration
			//channel ketika menerima data dari fungsi sorting akan langsung dikirim ke client
			chanArrGnome := make(chan []int)
			elapsedGnome := make(chan time.Duration)

			var wg sync.WaitGroup

			wg.Add(2)

			go helpers.GnomeSort(arrCopy, chanArrGnome, elapsedGnome, &wg)
			go func() {
				defer wg.Done()
				for arrGnome := range chanArrGnome {
					// mengirim data channel yang diterima dari fungsi gnomeSort ke client
					_ = websocket.WriteJSON(ws, helpers.SendResponse{Tipe: "gnome-sort", Data: arrGnome}) //mengirim perubahan array ke client
				}
				_ = websocket.WriteJSON(ws, helpers.SendResponse{Tipe: "time-gnome-sort", Data: fmt.Sprintf("time execute : %v", <-elapsedGnome)})
			}()

			wg.Wait()
			fmt.Println("Main : all function sorting done")
		}

	}
}

func keepAlive(c *websocket.Conn, timeout time.Duration) {
	lastResponse := time.Now()
	c.SetPongHandler(func(msg string) error {
		lastResponse = time.Now()
		return nil
	})

	go func() {
		for {
			err := c.WriteMessage(websocket.PingMessage, []byte("keepalive"))
			fmt.Println("send keep alive")
			if err != nil {
				return
			}
			time.Sleep(timeout / 2)
			if time.Now().Sub(lastResponse) > timeout {
				c.Close()
				return
			}
		}
	}()
}
