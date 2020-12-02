package helpers

import (
	"time"
)

func SelectionSort(arr1 []int, chanArr chan []int, elapsed chan time.Duration) {
	start := time.Now()
	for i := 0; i < len(arr1); i++ {
		var minIdx = i
		for j := i; j < len(arr1); j++ {
			if arr1[j] < arr1[minIdx] {
				minIdx = j
			}
		}
		arr1[i], arr1[minIdx] = arr1[minIdx], arr1[i]
		chanArr <- arr1 //mengirim array yang sudah berubah ke channel

	}
	close(chanArr) // menutup channel ketika sorting sudah selesai
	elapsed <- time.Since(start)
}
