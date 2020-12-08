const gnomeChart = new Chart($("#gnomeChart"), {
    type: "horizontalBar",
    data: {
        labels: [],
        datasets: [
            {
                label: "Gnome chart",
                data: [],
                backgroundColor: "rgb(236,72,153)",
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
