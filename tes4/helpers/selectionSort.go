package helpers

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"golang.org/x/net/websocket"
)

func SelectionSort(ws *websocket.Conn, arr1 []MyArray) {
	start := time.Now()

	for i := 0; i < len(arr1); i++ {
		var minIdx = i
		for j := i; j < len(arr1); j++ {
			if arr1[j].Y < arr1[minIdx].Y {
				minIdx = j
			}
		}
		arr1[i].Y, arr1[minIdx].Y = arr1[minIdx].Y, arr1[i].Y
		json, _ := json.Marshal(SendArray{Tipe: "selection-sort", Data: arr1})
		_ = websocket.Message.Send(ws, string(json))

	}

	elapsed := time.Since(start)
	json, _ := json.Marshal(SendArray{Tipe: "time-selection-sort", Data: fmt.Sprintf("time execute : %v", elapsed)})
	err := websocket.Message.Send(ws, string(json))
	if err != nil {
		log.Println(err)
	}
}
