package helpers

import (
	"encoding/json"
	"fmt"
	"time"

	"golang.org/x/net/websocket"
)

func SelectionSort(ws *websocket.Conn, arr1 []int) {
	chanArr := make(chan []int, 10)
	elapsed := make(chan time.Duration)

	go func(arr1 []int) {
		start := time.Now()
		for i := 0; i < len(arr1); i++ {
			var minIdx = i
			for j := i; j < len(arr1); j++ {
				if arr1[j] < arr1[minIdx] {
					minIdx = j
				}
			}
			arr1[i], arr1[minIdx] = arr1[minIdx], arr1[i]
			chanArr <- arr1

		}
		elapsed <- time.Since(start)
	}(arr1)

	for i := 0; i < len(arr1); i++ {
		json, _ := json.Marshal(SendResponse{Tipe: "selection-sort", Data: <-chanArr})
		_ = websocket.Message.Send(ws, string(json))
	}

	json, _ := json.Marshal(SendResponse{Tipe: "time-selection-sort", Data: fmt.Sprintf("time execute : %v", <-elapsed)})
	_ = websocket.Message.Send(ws, string(json))

	fmt.Println(string(json))
}
