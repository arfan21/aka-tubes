const selectionChart = new Chart($("#selectionChart"), {
    type: "horizontalBar",
    data: {
        labels: [],
        datasets: [
            {
                label: "Selection chart",
                data: [],
                backgroundColor: "rgb(99,102,241)",
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
        hover: {
            animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
    },
});
