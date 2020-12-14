const array = [80, 20, 50, 15, 100, 40, 60, 90, 70, 30];

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function startIlustrasi() {
    disableButton("#ilustrasi-sorting");
    disableButton("#start-sorting");
    disableButton("#generate-array");
    disableInput("tunggu sampai ilustrasi selesai");
    inputRemoveErrorMessage();
    $("#input-size").val("");
    $(".time").addClass("invisible");
    $("#note").addClass("invisible");
    $("#container-chart").removeClass("hidden");

    gnomeIlustrasi();
    selectionIlustrasi();
}

async function gnomeIlustrasi() {
    gnomeChart.options.animation.duration = 50;
    myArray.gnome_array = [...array];
    gnomeChart.data.labels = myArray.gnome_array;
    gnomeChart.data.datasets[0].data = myArray.gnome_array;
    gnomeChart.data.datasets[0].backgroundColor = [
        ...new Array(myArray.gnome_array.length - 1).fill("rgb(236,72,153)"),
        "rgb(236,72,153)",
    ];

    gnomeChart.update();
    await sleep(1000);

    let index = 0;
    while (index < myArray.gnome_array.length) {
        if (gnomeChart.data.datasets[0].backgroundColor[index] != "blue") {
            gnomeChart.data.datasets[0].backgroundColor[index] = "yellow";
            gnomeChart.update();
            await sleep(250);
        }

        if (index == 0) {
            index++;
            gnomeChart.data.datasets[0].backgroundColor[index - 1] =
                "rgb(236,72,153)";
            gnomeChart.update();
            await sleep(250);
        }
        if (myArray.gnome_array[index] >= myArray.gnome_array[index - 1]) {
            gnomeChart.data.datasets[0].backgroundColor = [
                ...new Array(myArray.gnome_array.length - 1).fill(
                    "rgb(236,72,153)"
                ),
                "rgb(236,72,153)",
            ];
            gnomeChart.update();
            await sleep(80);

            index++;

            gnomeChart.data.datasets[0].backgroundColor[index - 1] =
                "rgb(236,72,153)";
            gnomeChart.update();
            await sleep(250);
        } else {
            var temp = 0;
            temp = myArray.gnome_array[index];

            gnomeChart.data.datasets[0].backgroundColor[index] = "blue";
            var tempColor = gnomeChart.data.datasets[0].backgroundColor[index];
            gnomeChart.update();
            await sleep(80);

            myArray.gnome_array[index] = myArray.gnome_array[index - 1];

            gnomeChart.data.datasets[0].backgroundColor[index] =
                gnomeChart.data.datasets[0].backgroundColor[index - 1];
            gnomeChart.update();
            await sleep(80);

            myArray.gnome_array[index - 1] = temp;

            gnomeChart.data.datasets[0].backgroundColor[index - 1] = tempColor;
            gnomeChart.update();
            await sleep(80);

            index--;
        }
        updateChart(gnomeChart, myArray.gnome_array);
        await sleep(150);
    }
    enableButton("#ilustrasi-sorting");
    enableInput();
}

async function selectionIlustrasi() {
    selectionChart.options.animation.duration = 100;
    myArray.selection_array = [...array];
    selectionChart.data.labels = myArray.selection_array;
    selectionChart.data.datasets[0].data = myArray.selection_array;
    selectionChart.data.datasets[0].backgroundColor = [
        ...new Array(myArray.gnome_array.length - 1).fill("rgb(99,102,241)"),
        "rgb(99,102,241)",
    ];
    selectionChart.update();

    await sleep(1000);

    for (let i = 0; i < myArray.selection_array.length; i++) {
        // Finding the smallest number in the subarray
        let min = i;
        for (let j = i + 1; j < myArray.selection_array.length; j++) {
            selectionChart.data.datasets[0].backgroundColor[j] = "yellow";
            selectionChart.update();
            await sleep(250);
            if (myArray.selection_array[j] < myArray.selection_array[min]) {
                selectionChart.data.datasets[0].backgroundColor[min] =
                    "rgb(99,102,241)";
                selectionChart.update();
                await sleep(1);
                min = j;
            }
            selectionChart.data.datasets[0].backgroundColor[j] =
                "rgb(99,102,241)";
            selectionChart.update();
            await sleep(1);
            selectionChart.data.datasets[0].backgroundColor[min] = "red";
            selectionChart.update();
            await sleep(200);
        }
        if (min != i) {
            // Swapping the elements
            let tmp = myArray.selection_array[i];

            selectionChart.options.animation.duration = 0;
            selectionChart.data.datasets[0].backgroundColor[i] = "red";
            var tempColor = selectionChart.data.datasets[0].backgroundColor[i];
            selectionChart.update();
            await sleep(200);

            myArray.selection_array[i] = myArray.selection_array[min];

            selectionChart.data.datasets[0].backgroundColor[i] =
                selectionChart.data.datasets[0].backgroundColor[min];
            selectionChart.update();
            await sleep(1);

            myArray.selection_array[min] = tmp;
            selectionChart.data.datasets[0].backgroundColor[min] = tempColor;
            selectionChart.update();
            await sleep(200);
        }

        selectionChart.options.animation.duration = 100;
        selectionChart.data.datasets[0].backgroundColor = [
            ...new Array(myArray.gnome_array.length - 1).fill(
                "rgb(99,102,241)"
            ),
            "rgb(99,102,241)",
        ];
        selectionChart.update();

        updateChart(selectionChart, myArray.selection_array);
        await sleep(500);
    }
}
