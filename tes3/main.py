import tkinter as tk
import ctypes
import numpy
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import time
import matplotlib.animation as anim
from multiprocessing import Process

try:  # >= win 8.1
    ctypes.windll.shcore.SetProcessDpiAwareness(2)
except:  # win 8.0 or less
    ctypes.windll.user32.SetProcessDPIAware()

epochs = [0]


def runInParallel(*fns):
    proc = []
    for fn in fns:
        p = Process(target=fn)
        p.start()
        proc.append(p)
    for p in proc:
        p.join()


class App:
    def __init__(self, root):
        canvas = tk.Canvas(root, width=400, height=200)
        canvas.pack()

        label_judul = tk.Label(root, text='Visualisasi Sorting algoritma')
        label_judul.config(font=('helvetica', 18))
        canvas.create_window(200, 25, window=label_judul)

        label_input_size = tk.Label(root, text='Masukkan ukuran array')
        canvas.create_window(200, 75, window=label_input_size)

        # create input box for size array
        self.input_box_size_array = tk.Entry(root)
        canvas.create_window(200, 100, window=self.input_box_size_array)
        # button submit size array
        self.button_submit = tk.Button(
            text='submit', command=self.generateArray)
        canvas.create_window(200, 140, window=self.button_submit)
        # button for starting sort algorithm
        button_sort = tk.Button(
            text='sort now', command=self.printUpdateBarChart)
        canvas.create_window(200, 180, window=button_sort)

    def generateArray(self):
        self.size_array = int(self.input_box_size_array.get())
        self.myArray_selection_sort = numpy.random.randint(
            self.size_array, size=(self.size_array))
        self.myArray_gnome_sort = numpy.random.randint(
            self.size_array, size=(self.size_array))
        self.printBarChart()
        print(self.myArray_selection_sort)

    def printBarChart(self):
        # bar selection sort
        self.figure_selection_sort = plt.Figure(figsize=(6, 5), dpi=100)
        self.axis_selection_sort = self.figure_selection_sort.add_subplot(111)
        self.x_selection_sort = numpy.arange(self.size_array)
        self.rects_selection_sort = self.axis_selection_sort.bar(
            self.x_selection_sort, self.myArray_selection_sort)
        self.bar_selection_sort = FigureCanvasTkAgg(
            self.figure_selection_sort, root)
        self.bar_selection_sort.get_tk_widget().pack(side=tk.LEFT, fill=tk.BOTH)
        # bar gnome sort
        self.figure_gnome_sort = plt.Figure(figsize=(6, 5), dpi=100)
        self.axis_gnome_sort = self.figure_gnome_sort.add_subplot(111)
        self.x_gnome_sort = numpy.arange(self.size_array)
        self.rects_gnome_sort = self.axis_gnome_sort.bar(
            self.x_gnome_sort, self.myArray_gnome_sort)
        self.bar_gnome_sort = FigureCanvasTkAgg(
            self.figure_gnome_sort, root)
        self.bar_gnome_sort.get_tk_widget().pack(side=tk.LEFT, fill=tk.BOTH)

    def selectionSort(self):
        print("start selection")
        start = time.process_time()
        for i in range(len(self.myArray_selection_sort)):
            # Find the minimum element in remaining
            # unsorted array
            min_idx = i
            for j in range(i+1, len(self.myArray_selection_sort)):
                if self.myArray_selection_sort[min_idx] > self.myArray_selection_sort[j]:
                    min_idx = j

            self.myArray_selection_sort[i], self.myArray_selection_sort[
                min_idx] = self.myArray_selection_sort[min_idx], self.myArray_selection_sort[i]
            self.updateBarChartSelection()
        print(self.myArray_selection_sort)
        print(time.process_time() - start)

    def gnomeSort(self):
        print("start gnome")
        index = 0
        while index < len(self.myArray_gnome_sort):
            if index == 0:
                index = index + 1
            if self.myArray_gnome_sort[index] >= self.myArray_gnome_sort[index - 1]:
                index = index + 1
            else:
                self.myArray_gnome_sort[index], self.myArray_gnome_sort[index -
                                                                        1] = self.myArray_gnome_sort[index-1], self.myArray_gnome_sort[index]
                index = index - 1
            self.updateBarChartGnome()

    def updateBarChartSelection(self):
        # for rec, val in zip(rec, self.myArray_selection_sort):
        #     rec.set_hight(val)
        # epochs[0] += 1
        self.rects_selection_sort.remove()
        self.rects_selection_sort = self.axis_selection_sort.bar(
            numpy.arange(self.size_array), self.myArray_selection_sort)
        self.bar_selection_sort.draw()

    def updateBarChartGnome(self):
        # for rec, val in zip(rec, self.myArray_selection_sort):
        #     rec.set_hight(val)
        # epochs[0] += 1
        self.rects_gnome_sort.remove()
        self.rects_gnome_sort = self.axis_gnome_sort.bar(
            numpy.arange(self.size_array), self.myArray_gnome_sort)
        self.bar_gnome_sort.draw()

    def printUpdateBarChart(self):
        # anima = anim.FuncAnimation(self.figure_selection_sort, func=self.updateBarChart, fargs=(
        #     self.rects_selection_sort, epochs), frames=self.selectionSort, interval=1, repeat=False)
        # plt.show()
        runInParallel(self.gnomeSort(), self.selectionSort())


root = tk.Tk()
root.wm_iconbitmap('gopher.ico')
root.wm_title("Visualisasi Sorting Algoritma")
app = App(root)

# canvas1 = tk.Canvas(root, width=400, height=200)
# canvas1.pack()

# entry1 = tk.Entry(root)
# canvas1.create_window(200, 100, window=entry1)

# label_judul = tk.Label(root, text='Visualisasi Sorting algoritma')
# label_judul.config(font=('helvetica', 18))
# canvas1.create_window(200, 25, window=label_judul)

# label_input_size = tk.Label(root, text='Masukkan ukuran array')
# canvas1.create_window(200, 75, window=label_input_size)

# size_array = tk.IntVar()


# def getSizeArray():
#     size_array.set(int(entry1.get()))

#     size = int(size_array.get())
#     global myarray
#     myarray = random.randint(size, size=(size))

#     global figure1
#     figure1 = plt.Figure(figsize=(6, 5), dpi=100)
#     global ax1
#     ax1 = figure1.add_subplot(111)
#     global rects1
#     rects1 = ax1.bar(numpy.arange(size), myarray)
#     global bar1
#     bar1 = FigureCanvasTkAgg(figure1, root)
#     bar1.get_tk_widget().pack(side=tk.LEFT, fill=tk.BOTH)
#     bar1.draw()
#     print(myarray)


# def selectionSort():

# ax1.remove()
# for i in range(len(myarray)):
#     # Find the minimum element in remaining
#     # unsorted array
#     min_idx = i
#     for j in range(i+1, len(myarray)):
#         if myarray[min_idx] > myarray[j]:
#             min_idx = j

#     myarray[i], myarray[min_idx] = myarray[min_idx], myarray[i]

# # rects1 = ax1.bar(numpy.arange(len(myarray)), myarray)
# ax1.set_hight(myarray)
# bar1.draw()
#     print(myarray)


# button_submit = tk.Button(text='submit', command=getSizeArray)
# canvas1.create_window(200, 140, window=button_submit)

# button_sort = tk.Button(text='sort now', command=selectionSort)
# canvas1.create_window(200, 180, window=button_sort)
root.mainloop()
