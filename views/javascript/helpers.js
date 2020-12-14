function disableButton(id) {
    $(id).prop("disabled", true);
    $(id).removeClass("bg-indigo-600");
    $(id).addClass("bg-indigo-500");
}

function enableButton(id) {
    $(id).prop("disabled", false);
    $(id).addClass("bg-indigo-600");
    $(id).removeClass("bg-indigo-500");
}

function renderTime(time) {
    var timeFixed = time.reduce((a, b) => a + b).toFixed(4);

    if (timeFixed >= 1000) {
        return `${((timeFixed % 60000) / 1000).toFixed(4)} s`;
    } else {
        return `${timeFixed} ms`;
    }
}

function disableInput(placeholder) {
    $("#input-size").prop("disabled", true);
    $("#input-size").removeClass("bg-white");
    $("#input-size").addClass("bg-gray-200");
    $("#input-size").attr("placeholder", placeholder);
}
function enableInput() {
    $("#input-size").prop("disabled", false);
    $("#input-size").addClass("bg-white");
    $("#input-size").removeClass("bg-gray-200");
    $("#input-size").attr("placeholder", "size array (max 1000)");
}

function inputErrorMessage(msg) {
    $("#error-msg").text(msg);
    $("#input-size").removeClass("border-gray-600");
    $("#input-size").removeClass("focus:border-indigo-500");
    $("#input-size").addClass("focus:border-red-500");
    $("#input-size").addClass("border-red-600");
    $("#error-msg").removeClass("hidden");
    $("#generate-array").addClass("lg:mb-7");
}

function inputRemoveErrorMessage() {
    $("#generate-array").removeClass("lg:mb-7");
    $("#input-size").addClass("border-gray-600");
    $("#input-size").addClass("focus:border-indigo-500");
    $("#input-size").removeClass("focus:border-red-500");
    $("#input-size").removeClass("border-red-600");
    $("#error-msg").addClass("hidden");
}

function getUrl() {
    return new Promise((resolve, reject) => {
        $.get("/link-ws", (res) => {
            resolve(res.link);
        });
    });
}

function updateChart(chart, data) {
    chart.data.labels = data;
    chart.data.datasets[0].data = data;
    chart.update();
}
