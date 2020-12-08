package helpers

import (
	"fmt"
	"sync"
	"time"
)

func GnomeSort(arr []int, chanArr chan []int, elapsed chan time.Duration, wg *sync.WaitGroup) {
	fmt.Println("gnomeSort : Start gnome sorting")

	defer wg.Done()

	start := time.Now()

	if len(arr) == 1 {
		chanArr <- arr
		close(chanArr) // menutup channel ketika sorting sudah selesai
		elapsed <- time.Since(start)
		close(elapsed)
		defer fmt.Println("gnomeSort : gnome sorting done (", time.Since(start), ")")
		return
	}

	for i, j := 1, 2; i < len(arr); {
		if arr[i-1] > arr[i] {
			arr[i-1], arr[i] = arr[i], arr[i-1]
			i--
			if i > 0 { //jika i lebih dari 0, iterasi akan di skip
				continue
			}
		}
		i = j
		j++
		chanArr <- arr //mengirim array yang sudah berubah ke channel
	}
	close(chanArr) // menutup channel ketika sorting sudah selesai
	elapsed <- time.Since(start)
	close(elapsed)
	defer fmt.Println("gnomeSort : gnome sorting done (", time.Since(start), ")")
}
