const myArray = {
    selection_array: [],
    gnome_array: [],
};

const app = {
    ws: undefined,
    link: undefined,
};

const message = {
    tipe: undefined,
    data: undefined,
};

function getUrl() {
    return new Promise((resolve, reject) => {
        $.get("/link-ws", (res) => {
            resolve(res.link);
        });
    });
}

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
            $("#alert").removeClass("hidden");

            console.log("[close] Connection died");
        }
    };
};

window.onload = app.init();

function generateArray() {
    (message.tipe = "generate array"), (message.data = $("#input-size").val());

    if (message.data < 1) {
        alert("input harus lebih dari 0");
        return;
    }

    if (message.data > 1000) {
        alert("max 1000, biar cepat selesai wakawkawk");
        return;
    }

    app.ws.send(JSON.stringify(message));
    console.log(`send : ${JSON.stringify(message)}`);
    $("#input-size").val("");

    app.ws.onmessage = function (event) {
        // console.log(`[message] Data received from server: ${event.data}`);
        const data = JSON.parse(event.data);

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
            $("#start-sorting").prop("disabled", false);
            $("#start-sorting").removeClass("bg-indigo-500");
            $("#start-sorting").addClass("bg-indigo-600");
            $("#container-chart").removeClass("hidden");
        }
    };
}

function sortArray() {
    const timeRenderSelection = [];
    const timeRenderGnome = [];
    if (
        myArray.selection_array.length === 0 &&
        myArray.gnome_array.length === 0
    ) {
        alert("chart masih kosong");
        return;
    }
    disabledButtonWhenSorting();
    message.tipe = "sorting now";

    app.ws.send(JSON.stringify(message));

    app.ws.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (data.tipe === "selection-sort") {
            console.log("receive selection");
            $("#note").addClass("animate-pulse");
            $("#note").removeClass("invisible");
            $("#note").removeClass("text-gray-600");
            $("#note").addClass("text-white");
            $("#note").removeClass("bg-gray-300");
            $("#note").addClass("bg-indigo-500");
            $("#note").attr("value", "Selection Sort First .....");

            var start = performance.now();
            myArray.selection_array = data.data;
            selectionChart.data.labels = myArray.selection_array;
            selectionChart.data.datasets[0].data = myArray.selection_array;
            selectionChart.update();
            timeRenderSelection.push(performance.now() - start);

            $("#selection-time-render").removeClass("invisible");
            $(`#selection-time-render`).attr(
                "value",
                `selection time chart render : ${renderTime(
                    timeRenderSelection
                )}`
            );
        }

        if (data.tipe === "time-selection-sort") {
            $(`#selection-time`).attr("value", `selection ${data.data}`);
            $(`#selection-time`).removeClass("invisible");
            console.log("selection time :" + data.data);
            console.log(
                "time render selection : " + renderTime(timeRenderSelection)
            );

            $("#note").removeClass("bg-indigo-500");
            $("#note").removeClass("text-white");
            $("#note").addClass("text-gray-600");
            $("#note").addClass("bg-gray-300");
            $("#note").attr("value", "Wait .....");
            setTimeout(() => {
                message.tipe = "selection done";
                app.ws.send(JSON.stringify(message));
            }, 1000);
        }
        if (data.tipe === "gnome-sort") {
            $("#note").removeClass("bg-gray-300");
            $("#note").removeClass("text-gray-600");
            $("#note").addClass("text-white");
            $("#note").addClass("bg-pink-500");
            $("#note").attr("value", "Gnome Sort .....");

            console.log("receive gnome");
            var start = performance.now();
            myArray.gnome_array = data.data;
            gnomeChart.data.labels = myArray.gnome_array;
            gnomeChart.data.datasets[0].data = myArray.gnome_array;
            gnomeChart.update();

            timeRenderGnome.push(performance.now() - start);
            $(`#gnome-time-render`).removeClass("invisible");
            $(`#gnome-time-render`).attr(
                "value",
                `gnome time chart render : ${renderTime(timeRenderGnome)}`
            );
        }
        if (data.tipe === "time-gnome-sort") {
            $("#note").removeClass("text-white");
            $("#note").addClass("text-gray-600");
            $("#note").removeClass("animate-pulse");
            $("#note").removeClass("bg-pink-500");
            $("#note").addClass("bg-gray-300");
            $("#note").attr("value", "Done !");

            $(`#gnome-time`).attr("value", `gnome ${data.data}`);
            $(`#gnome-time`).removeClass("invisible");

            console.log("gnome time :" + data.data);
            console.log("time render gnome : " + renderTime(timeRenderGnome));

            enableButtonAfterSorting();
        }
    };
}

function disabledButtonWhenSorting() {
    $("#note").addClass("invisible");
    $(".time").addClass("invisible");
    $("#start-sorting").prop("disabled", true);
    $("#start-sorting").removeClass("bg-indigo-600");
    $("#start-sorting").addClass("bg-indigo-500");
    $("#generate-array").removeClass("bg-indigo-600");
    $("#generate-array").addClass("bg-indigo-500");
    $("#generate-array").prop("disabled", true);
    $("#input-size").prop("disabled", true);
    $("#input-size").attr("placeholder", "wait until sort finish");
}

function enableButtonAfterSorting() {
    $("#generate-array").removeClass("bg-indigo-500");
    $("#generate-array").addClass("bg-indigo-600");
    $("#generate-array").prop("disabled", false);
    $("#input-size").prop("disabled", false);
    $("#input-size").attr("placeholder", "size array (max 1000)");
    $("#start-sorting").prop("disabled", false);
    $("#start-sorting").removeClass("bg-indigo-500");
    $("#start-sorting").addClass("bg-indigo-600");
    $("#note").removeClass("invisible");
}

function renderTime(time) {
    var timeFixed = time.reduce((a, b) => a + b).toFixed(4);

    if (timeFixed >= 1000) {
        return `${((timeFixed % 60000) / 1000).toFixed(4)} s`;
    } else {
        return `${timeFixed} ms`;
    }
}
