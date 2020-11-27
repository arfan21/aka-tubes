package helpers

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"golang.org/x/net/websocket"
)

func GnomeSort(ws *websocket.Conn, arr1 []MyArray) {
	start := time.Now()

	for i, j := 1, 2; i < len(arr1); {
		if arr1[i-1].Y > arr1[i].Y {
			arr1[i-1].Y, arr1[i].Y = arr1[i].Y, arr1[i-1].Y
			i--
			if i > 0 {
				continue
			}
		}
		i = j
		j++

		json, _ := json.Marshal(SendArray{Tipe: "gnome-sort", Data: arr1})
		_ = websocket.Message.Send(ws, string(json))

	}

	elapsed := time.Since(start)
	json, _ := json.Marshal(SendArray{Tipe: "time-gnome-sort", Data: fmt.Sprintf("time execute : %v", elapsed)})
	err := websocket.Message.Send(ws, string(json))
	if err != nil {
		log.Println(err)
	}
}
