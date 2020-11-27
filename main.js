const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const myArray = {
    selection_array: [],
    gnome_array: [],
};

var chart1 = new CanvasJS.Chart("selection-sort-chart", {
    animationEnabled: true,

    title: {
        text: "selection sort",
    },
    axisX: {
        interval: 1,
    },
    axisY2: {
        interlacedColor: "rgba(1,77,101,.2)",
        gridColor: "rgba(1,77,101,.1)",
    },
    data: [
        {
            type: "bar",
            name: "number",
            axisYType: "secondary",
            color: "#014D65",
            dataPoints: myArray.selection_array,
        },
    ],
});

var chart2 = new CanvasJS.Chart("gnome-sort-chart", {
    animationEnabled: true,

    title: {
        text: "gnome sort",
    },
    axisX: {
        interval: 1,
    },
    axisY2: {
        interlacedColor: "rgba(1,77,101,.2)",
        gridColor: "rgba(1,77,101,.1)",
    },
    data: [
        {
            type: "bar",
            name: "number",
            axisYType: "secondary",
            color: "#014D65",
            dataPoints: myArray.gnome_array,
        },
    ],
});

chart1.render();
chart2.render();

async function updateChart(chart, arr) {
    return new Promise((resolve) => {
        chart.options.data[0].dataPoints = arr;
        resolve(chart);
    });
}

function generateArray() {
    myArray["size"] = $("#input-size").val();
    myArray.selection_array = [];
    myArray.gnome_array = [];

    for (i = 0; i < myArray.size; i++) {
        rand_number = Math.floor(Math.random() * myArray.size);
        myArray.selection_array.push({ y: rand_number });
        myArray.gnome_array.push({ y: rand_number });
    }

    chart1.options.data[0].dataPoints = myArray.selection_array;
    chart2.options.data[0].dataPoints = myArray.gnome_array;

    chart1.render();
    chart2.render();
}

function sort() {
    selectionSort();
    gnomeSort();
}

async function selectionSort() {
    var t0 = performance.now();
    for (var i = 0; i < myArray.size; i++) {
        var min = i;
        for (var j = i + 1; j < myArray.size; j++) {
            if (myArray.selection_array[j].y < myArray.selection_array[min].y) {
                min = j;
            }
        }
        var temp = myArray.selection_array[i].y;
        myArray.selection_array[i].y = myArray.selection_array[min].y;
        myArray.selection_array[min].y = temp;
        // chart1.options.data[0].dataPoints = myArray.selection_array;
        // chart1.render();
        // await timer(0.1);
        await updateChart(chart1, myArray.selection_array).then(
            async (chart) => {
                chart.render();
                // await timer(0.1);
            }
        );
        // await timer(0.1);
    }
    var t1 = performance.now();
    console.log(`selection sort : ${t1 - t0} ms`);
    $("#selection-time").text(`${t1 - t0} ms`);
}

async function gnomeSort() {
    var t0 = performance.now();
    function moveBack(i) {
        for (
            ;
            i > 0 && myArray.gnome_array[i - 1].y > myArray.gnome_array[i].y;
            i--
        ) {
            var t = myArray.gnome_array[i].y;
            myArray.gnome_array[i].y = myArray.gnome_array[i - 1].y;
            myArray.gnome_array[i - 1].y = t;
        }
    }
    for (var i = 1; i < myArray.gnome_array.length; i++) {
        if (myArray.gnome_array[i - 1].y > myArray.gnome_array[i].y)
            moveBack(i);

        chart2.options.data[0].dataPoints = myArray.gnome_array;
        chart2.render();
        // await timer(0.1);
    }
    var t1 = performance.now();
    console.log(`gnome sort : ${t1 - t0} ms`);
    $("#gnome-time").text(performance.now());
}
