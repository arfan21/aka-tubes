package helpers

import (
	"time"
)

func GnomeSort(arr1 []int, chanArr chan []int, elapsed chan time.Duration) {
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
		chanArr <- arr1 //mengirim array yang sudah berubah ke channel
	}
	close(chanArr) // menutup channel ketika sorting sudah selesai
	elapsed <- time.Since(start)
}
