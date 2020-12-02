const myArray = {
    selection_array: [],
    gnome_array: [],
};

var selectionChart = new Chart($("#selectionChart"), {
    type: "horizontalBar",
    data: {
        labels: [],
        datasets: [
            {
                label: "Selection chart",
                data: [],
                backgroundColor: "rgba(0, 181, 204, 1)",
                borderWidth: 1,
            },
        ],
    },
    options: {
        scales: {
            yAxes: [
                {
                    display: false,
                },
            ],
        },
        animation: {
            duration: 0,
        },
    },
});

var gnomeChart = new Chart($("#gnomeChart"), {
    type: "horizontalBar",
    data: {
        labels: [],
        datasets: [
            {
                label: "Gnome chart",
                data: [],
                backgroundColor: "rgb(240,61,74)",
                borderWidth: 1,
            },
        ],
    },
    options: {
        scales: {
            yAxes: [
                {
                    display: false,
                },
            ],
        },
        animation: {
            duration: 0,
        },
    },
});

function getUrl() {
    return new Promise((resolve, reject) => {
        $.get("/link-ws", (res) => {
            resolve(res.link);
        });
    });
}

var app = {
    ws: undefined,
    link: undefined,
};

app.init = async () => {
    if (!window.WebSocket) {
        alert("Your browser does not support WebSocket");
        return;
    }

    app.link = await getUrl().then((res) => res);
    console.log(`connected websocket ${app.link}`);
    app.ws = new WebSocket(app.link);

    app.ws.onclose = function (event) {
        if (event.wasClean) {
            console.log(
                `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
            );
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            alert("[close] Connection died, please refresh");
            console.log("[close] Connection died");
        }
    };
};

window.onload = app.init();

function generateArray() {
    var msg = {
        tipe: "generate array",
        data: $("#input-size").val(),
    };

    if (msg.data > 1000) {
        alert("max 1000, biar cepat selesai wakawkawk");
        return;
    }

    app.ws.send(JSON.stringify(msg));
    console.log(`send : ${JSON.stringify(msg)}`);
    $("#input-size").val("");

    app.ws.onmessage = function (event) {
        // console.log(`[message] Data received from server: ${event.data}`);
        var data = JSON.parse(event.data);

        if (data.tipe === "error") {
            alert(data.data);
        }

        if (data.tipe === "unsorted") {
            myArray.selection_array = data.data;
            myArray.gnome_array = data.data;

            selectionChart.data.labels = myArray.selection_array;
            selectionChart.data.datasets[0].data = myArray.selection_array;
            gnomeChart.data.labels = myArray.gnome_array;
            gnomeChart.data.datasets[0].data = myArray.gnome_array;

            //update chart
            selectionChart.update();
            gnomeChart.update();
        }
    };
}

function sortArray() {
    $("#start-sorting").prop("disabled", true);
    $("#start-sorting").removeClass("bg-blue-600");
    $("#start-sorting").addClass("bg-blue-500");
    $("#generate-array").removeClass("bg-blue-600");
    $("#generate-array").addClass("bg-blue-500");
    $("#generate-array").prop("disabled", true);
    $("#input-size").prop("disabled", true);
    $("#input-size").attr("placeholder", "wait until sort finish");

    var msg = {
        tipe: "shorting now",
    };

    app.ws.send(JSON.stringify(msg));
    var timeRenderSelection = [];
    var timeRenderGnome = [];
    app.ws.onmessage = function (event) {
        var data = JSON.parse(event.data);

        if (data.tipe === "selection-sort") {
            var start = performance.now();
            myArray.selection_array = data.data;
            selectionChart.data.labels = myArray.selection_array;
            selectionChart.data.datasets[0].data = myArray.selection_array;
            selectionChart.update();
            timeRenderSelection.push(performance.now() - start);
        }
        if (data.tipe === "gnome-sort") {
            var start = performance.now();
            myArray.gnome_array = data.data;
            gnomeChart.data.labels = myArray.gnome_array;
            gnomeChart.data.datasets[0].data = myArray.gnome_array;
            gnomeChart.update();

            timeRenderGnome.push(performance.now() - start);
        }
        if (data.tipe === "time-selection-sort") {
            $("#selection-time").attr("value", `selection ${data.data}`);
            console.log("selection time :" + data.data);
            console.log(
                "time render selection : " +
                    timeRenderSelection.reduce((a, b) => a + b)
            );
        }
        if (data.tipe === "time-gnome-sort") {
            $("#gnome-time").attr("value", `gnome ${data.data}`);
            console.log("gnome time :" + data.data);
            $("#generate-array").removeClass("bg-blue-500");
            $("#generate-array").addClass("bg-blue-600");
            $("#generate-array").prop("disabled", false);
            $("#input-size").prop("disabled", false);
            $("#input-size").attr("placeholder", "size array");
            $("#start-sorting").prop("disabled", false);
            $("#start-sorting").removeClass("bg-blue-500");
            $("#start-sorting").addClass("bg-blue-600");

            console.log(
                "time render gnome : " + timeRenderGnome.reduce((a, b) => a + b)
            );
        }
    };
}
