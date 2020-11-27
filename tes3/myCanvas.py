def myCanvas(canvas, tk, root):
    entry1 = tk.Entry(root)
    canvas.create_window(200, 100, window=entry1)

    label_judul = tk.Label(root, text='Visualisasi Sorting algoritma')
    label_judul.config(font=('helvetica', 18))
    canvas.create_window(200, 25, window=label_judul)

    label_input_size = tk.Label(root, text='Masukkan ukuran array')
    canvas.create_window(200, 75, window=label_input_size)

    button1 = tk.Button(text='Get the Square Root')
    canvas.create_window(200, 140, window=button1)
