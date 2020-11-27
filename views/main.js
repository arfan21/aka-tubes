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

var ws = new WebSocket("ws://localhost:8000/stream");

function generateArray() {
    var msg = {
        size: $("#input-size").val(),
    };

    ws.send(JSON.stringify(msg));
    console.log(`send : ${JSON.stringify(msg)}`);
    $("#input-size").val("");

    ws.onmessage = function (event) {
        console.log(`[message] Data received from server: ${event.data}`);
        var data = JSON.parse(event.data);
        if (data.tipe === "unsorted") {
            myArray.selection_array = data.data;
            myArray.gnome_array = data.data;

            chart1.options.data[0].dataPoints = myArray.selection_array;
            chart2.options.data[0].dataPoints = myArray.gnome_array;

            chart1.render();
            chart2.render();
        }
    };
}

function sortArray() {
    $("#generate-array").removeClass("bg-blue-600");
    $("#generate-array").addClass("bg-blue-500");
    $("#generate-array").prop("disabled", true);
    $("#input-size").prop("disabled", true);
    $("#input-size").attr("placeholder", "wait until sort finish");
    ws.send("now");
    ws.onmessage = function (event) {
        var data = JSON.parse(event.data);
        if (data.tipe === "selection-sort") {
            myArray.selection_array = data.data;
            chart1.options.data[0].dataPoints = myArray.selection_array;
            chart1.render();
        }
        if (data.tipe === "gnome-sort") {
            myArray.gnome_array = data.data;
            chart2.options.data[0].dataPoints = myArray.gnome_array;
            chart2.render();
        }
        if (data.tipe === "time-selection-sort") {
            $("#selection-time").attr("value", `selection ${data.data}`);
            console.log("selection time :" + data.data);
        }
        if (data.tipe === "time-gnome-sort") {
            $("#gnome-time").attr("value", `gnome ${data.data}`);
            console.log("gnome time :" + data.data);
            $("#generate-array").removeClass("bg-blue-500");
            $("#generate-array").addClass("bg-blue-600");
            $("#generate-array").prop("disabled", false);
            $("#input-size").prop("disabled", false);
            $("#input-size").attr("placeholder", "size array");
        }
    };
}

ws.onclose = function (event) {
    if (event.wasClean) {
        console.log(
            `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log("[close] Connection died");
    }
};
