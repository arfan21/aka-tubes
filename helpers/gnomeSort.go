package helpers

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"golang.org/x/net/websocket"
)

func GnomeSort(ws *websocket.Conn, arr1 []int) {
	chanArr := make(chan []int, 10)
	elapsed := make(chan time.Duration)
	var wg sync.WaitGroup
	wg.Add(len(arr1))

	go func(arr1 []int) {
		defer wg.Done()
		start := time.Now()
		for i, j := 1, 2; i < len(arr1); {
			if arr1[i-1] > arr1[i] {
				arr1[i-1], arr1[i] = arr1[i], arr1[i-1]
				i--
				if i > 0 {
					continue
				}
			}
			i = j
			j++
			chanArr <- arr1
		}
		close(chanArr)
		elapsed <- time.Since(start)
	}(arr1)

	for arr := range chanArr {
		json, _ := json.Marshal(SendResponse{Tipe: "gnome-sort", Data: arr})
		_ = websocket.Message.Send(ws, string(json))
	}

	go func() {
		wg.Wait()
		close(elapsed)
	}()

	json, _ := json.Marshal(SendResponse{Tipe: "time-gnome-sort", Data: fmt.Sprintf("time execute : %v", <-elapsed)})
	_ = websocket.Message.Send(ws, string(json))

	fmt.Println(string(json))
}
