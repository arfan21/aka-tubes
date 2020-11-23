const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const myArray = {
    arr: [],
};

var chart = new CanvasJS.Chart("chart", {
    animationEnabled: true,

    title: {
        text: "my array",
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
            dataPoints: myArray.arr,
        },
    ],
});
chart.render();

function generateArray() {
    myArray["size"] = $("#input-size").val();
    myArray.arr = [];

    for (i = 0; i < myArray.size; i++) {
        rand_number = Math.floor(Math.random() * myArray.size);
        myArray.arr.push({ y: rand_number });
    }

    chart.options.data[0].dataPoints = myArray.arr;
    chart.render();
    console.log(myArray.arr);
}

async function sortingArray() {
    for (var i = 0; i < myArray.size; i++) {
        //set min to the current iteration of i
        var min = i;
        for (var j = i + 1; j < myArray.size; j++) {
            if (myArray.arr[j].y < myArray.arr[min].y) {
                min = j;
            }
        }
        var temp = myArray.arr[i].y;
        myArray.arr[i].y = myArray.arr[min].y;
        myArray.arr[min].y = temp;
        chart.options.data[0].dataPoints = myArray.arr;
        chart.render();
        await timer(0.00000001);
    }
    // chart.options.data[0].dataPoints = myArray.arr;
    // chart.render();
    console.log(myArray.arr);
}
