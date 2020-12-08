package helpers

import (
	"fmt"
	"sync"
	"time"
)

func SelectionSort(arr []int, chanArr chan []int, elapsed chan time.Duration, wg *sync.WaitGroup) {
	fmt.Println("SelectionSort : Start selection sorting")

	defer wg.Done()

	start := time.Now()
	for i := 0; i < len(arr); i++ {
		var minIdx = i
		for j := i; j < len(arr); j++ {
			if arr[j] < arr[minIdx] {
				minIdx = j
			}

		}
		arr[i], arr[minIdx] = arr[minIdx], arr[i]
		chanArr <- arr //mengirim array yang sudah berubah ke channel
	}
	close(chanArr) // menutup channel ketika sorting sudah selesai
	elapsed <- time.Since(start)
	close(elapsed)
	defer fmt.Println("SelectionSort : selection sorting done (", time.Since(start), ")")
}
