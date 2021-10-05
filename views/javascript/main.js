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

//from https://jsfiddle.net/Behseini/ue8gj52t/
$('#input-size').on('keypress keyup blur', function (event) {
    $(this).val(
        $(this)
            .val()
            .replace(/[^\d].+/, ''),
    );
    if (event.which < 48 || event.which > 57) {
        event.preventDefault();
    }
});

function validateInput(value) {
    let size = parseInt(value);

    if (size < 1 || isNaN(size)) {
        disableButton('#generate-array');

        inputErrorMessage('input harus lebih dari 0');

        return;
    }
    if (size > 1000) {
        disableButton('#generate-array');

        inputErrorMessage('max 1000, biar cepat selesai');

        return;
    }
    enableButton('#generate-array');

    inputRemoveErrorMessage();
}

app.init = async () => {
    if (!window.WebSocket) {
        alert('Your browser does not support WebSocket');
        return;
    }

    app.link = await getUrl().then((res) => res);
    console.log(`connected websocket ${app.link}`);
    app.ws = new WebSocket(app.link);

    app.ws.onclose = function (event) {
        if (event.wasClean) {
            console.log(
                `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`,
            );
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            $('#alert').removeClass('hidden');

            console.log('[close] Connection died');
        }
    };
};

window.onload = app.init();

function generateArray() {
    (message.tipe = 'generate array'), (message.data = $('#input-size').val());
    $('.time').addClass('invisible');

    if ($('#ilustrasi-sorting').is(':disabled')) {
        alert('tunggu sampai ilustrasi selesai');
        return;
    }

    if (message.data < 1) {
        alert('input harus lebih dari 0');
        return;
    }

    if (message.data > 1000) {
        alert('max 1000, biar cepat selesai wakawkawk');
        return;
    }

    //mengirim perintah ke backend untuk menggenerate random array
    app.ws.send(JSON.stringify(message));
    console.log(`send : ${JSON.stringify(message)}`);
    $('#input-size').val('');

    app.ws.onmessage = function (event) {
        // console.log(`[message] Data received from server: ${event.data}`);
        const data = JSON.parse(event.data);

        if (data.tipe === 'error') {
            alert(data.data);
        }

        if (data.tipe === 'unsorted') {
            myArray.selection_array = data.data;
            myArray.gnome_array = data.data;

            selectionChart.data.datasets[0].backgroundColor = [
                ...new Array(myArray.gnome_array.length - 1).fill(
                    'rgb(99,102,241)',
                ),
                'rgb(99,102,241)',
            ];
            selectionChart.options.animation.duration = 0;

            gnomeChart.data.datasets[0].backgroundColor = [
                ...new Array(myArray.gnome_array.length - 1).fill(
                    'rgb(236,72,153)',
                ),
                'rgb(236,72,153)',
            ];
            gnomeChart.options.animation.duration = 0;

            selectionChart.update();
            gnomeChart.update();

            //mengupdate chart setelah backend mengirim random array

            updateChart(selectionChart, myArray.selection_array);
            updateChart(gnomeChart, myArray.gnome_array);

            enableButton('#start-sorting');
            disableButton('#ilustrasi-sorting');

            $('#container-chart').removeClass('hidden');
        }
    };
}

function sortArray() {
    const timeRenderSelection = [];
    const timeRenderGnome = [];
    disableButton('#start-sorting');
    disableButton('#generate-array');
    disableButton('#ilustrasi-sorting');
    disableInput('tunggu sampai sorting selesai');
    $('.time').addClass('invisible');

    if (
        myArray.selection_array.length === 0 &&
        myArray.gnome_array.length === 0
    ) {
        alert('chart masih kosong');
        return;
    }

    message.tipe = 'sorting now';
    //mengirim perintah ke backend untuk memulai sorting
    app.ws.send(JSON.stringify(message));

    //menerima perubahan array dari backend lalu mengupdate bar chartnya
    app.ws.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (data.tipe === 'selection-sort') {
            console.log('receive selection');
            $('#note').addClass('animate-pulse');
            $('#note').removeClass('invisible');
            $('#note').removeClass('text-gray-600');
            $('#note').addClass('text-white');
            $('#note').removeClass('bg-gray-300');
            $('#note').addClass('bg-indigo-500');
            $('#note').attr('value', 'Selection Sort First .....');

            var start = performance.now();

            //mengupdate bar chart selection sort
            myArray.selection_array = data.data;
            updateChart(selectionChart, myArray.selection_array);

            //menampilkan waktu render
            timeRenderSelection.push(performance.now() - start);
            $('#selection-time-render').removeClass('invisible');
            $(`#selection-time-render`).attr(
                'value',
                `selection time chart render : ${renderTime(
                    timeRenderSelection,
                )}`,
            );
        }

        if (data.tipe === 'time-selection-sort') {
            //menampilkan waktu sorting yang dikirim dari backend
            $(`#selection-time`).attr('value', `selection ${data.data}`);
            $(`#selection-time`).removeClass('invisible');
            console.log('selection time :' + data.data);
            console.log(
                'time render selection : ' + renderTime(timeRenderSelection),
            );

            $('#note').removeClass('bg-indigo-500');
            $('#note').removeClass('text-white');
            $('#note').addClass('text-gray-600');
            $('#note').addClass('bg-gray-300');
            $('#note').attr('value', 'Wait .....');
            setTimeout(() => {
                //memberitahu backend bahwa selection sort selesai di render
                message.tipe = 'selection done';
                app.ws.send(JSON.stringify(message));
            }, 1000);
        }
        if (data.tipe === 'gnome-sort') {
            $('#note').removeClass('bg-gray-300');
            $('#note').removeClass('text-gray-600');
            $('#note').addClass('text-white');
            $('#note').addClass('bg-pink-500');
            $('#note').attr('value', 'Gnome Sort .....');
            console.log('receive gnome');

            var start = performance.now();

            //mengupdate bar chart gnome sort
            myArray.gnome_array = data.data;
            updateChart(gnomeChart, myArray.gnome_array);

            //menampilkan waktu render
            timeRenderGnome.push(performance.now() - start);
            $(`#gnome-time-render`).removeClass('invisible');
            $(`#gnome-time-render`).attr(
                'value',
                `gnome time chart render : ${renderTime(timeRenderGnome)}`,
            );
        }
        if (data.tipe === 'time-gnome-sort') {
            //menampilkan waktu sorting yang dikirim dari backend
            $(`#gnome-time`).attr('value', `gnome ${data.data}`);
            $(`#gnome-time`).removeClass('invisible');

            $('#note').removeClass('text-white');
            $('#note').addClass('text-gray-600');
            $('#note').removeClass('animate-pulse');
            $('#note').removeClass('bg-pink-500');
            $('#note').addClass('bg-gray-300');
            $('#note').attr('value', 'Done !');

            console.log('gnome time :' + data.data);
            console.log('time render gnome : ' + renderTime(timeRenderGnome));

            enableButton('#generate-array');
            enableButton('#start-sorting');
            enableButton('#ilustrasi-sorting');
            enableInput();
        }
    };
}
