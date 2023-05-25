const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const isPortrait = () => {
  return window.innerHeight > window.innerWidth;
};

const isLandscape = () => {
  return window.innerHeight < window.innerWidth;
};

const maxContainerWidthOnPortrait = () => {
  if (isPortrait()) {
    const container = document.getElementsByClassName("container")[0];
    container.style.width = "100%";
    container.style.maxWidth = "none";
  }
};

const centerJustifyPaginationBar = () => {
  try {
    const paginationBar = document.getElementsByClassName("pagination")[0];
    paginationBar.style.justifyContent = "center";
  } catch (e) {
    console.log(e);
  }
};

const unsetJustifyPaginationBar = () => {
  try {
    const paginationBar = document.getElementsByClassName("pagination")[0];
    paginationBar.style.justifyContent = "unset";
  } catch (e) {
    console.log(e);
  }
};

const isObjEmpty = (obj) => Object.keys(obj).length === 0;

Chart.plugins.register({
  afterDraw: function (chart) {
    const labels = chart.data.labels;
    const data = chart.data.datasets[0].data;

    if (isObjEmpty(labels) || isObjEmpty(data)) {
      // No data is present
      var ctx = chart.chart.ctx;
      var width = chart.chart.width;
      var height = chart.chart.height;
      chart.clear();

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "16px normal 'Helvetica Nueue'";
      ctx.fillText("No data to display", width / 2, height / 2);
      ctx.restore();
    }
  },
});

const createCharts = (page) => {
  if (page === "homepage") {
    handleCreateLineChart();
  } else {
    handleCreateExpensesByMonthBarChart();
    handleCreateExpensesByWeekBarChart();
    handleCreateMontlyExpensesPieChart();
    handleCreateAllExpensesPieChart();
  }
};

const handleCreateLineChart = () => {
  const page = location.search.split("?page=")[1];

  $.ajax({
    type: "GET",
    dataType: "json",
    url: `/line-chart-data/?page=${page}`,
    success: (response) => {
      createLineChart(
        response,
        "total-expenses-line-chart",
        "Total expenses by day"
      );
    },
  });
};

const createLineChart = (data, canvasId, titleText) => {
  const dates = Object.keys(data);
  const amounts = Object.values(data);
  const ctx = document.getElementById(canvasId).getContext("2d");

  Chart.defaults.global.defaultFontSize = 12;
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Expenses",
          data: amounts,
          borderColor: "rgb(255,140,0)",
          fill: false,
          tension: 0,
        },
      ],
    },

    options: {
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Dates",
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "(€) Amounts",
            },
          },
        ],
      },
      title: {
        display: true,
        text: titleText,
      },
    },
  });
};

const handleCreateAllExpensesPieChart = () => {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/total-expenses-pie-chart-data/",
    success: (response) => {
      createPieChart(
        response,
        "total-expenses-pie-chart",
        `Total expense amounts by category`
      );
    },
  });
};

const handleCreateMontlyExpensesPieChart = () => {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/monthly-expenses-pie-chart-data/",
    success: (response) => {
      createPieChart(
        response,
        "monthly-expenses-pie-chart",
        "Monthly expense amounts by category"
      );
    },
  });
};

const createPieChart = (data, canvasId, titleText) => {
  const categories = Object.keys(data);
  const amounts = Object.values(data);

  const ctx = document.getElementById(canvasId).getContext("2d");
  const totalExpensesPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: [
            "rgb(219, 112, 147)",
            "rgb(54, 162, 235)",
            "rgb(255, 206, 86)",
            "rgb(122, 235, 52)",
            "rgb(75, 192, 192)",
            "rgb(0, 255, 255)",
            "rgb(255, 99, 132)",
            "rgb(162, 52, 235)",
            "rgb(235, 52, 208)",
            "rgb(255, 69, 0)",
            "rgb(255, 105, 180)",
            "rgb(0, 100, 0)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: titleText,
      },
    },
  });
};

const handleCreateExpensesByMonthBarChart = () => {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/expenses-by-month-bar-chart-data/",
    success: (response) => {
      createBarChart(
        response,
        "monthly-expenses-bar-chart",
        "Expense amounts by month",
        true
      );
    },
  });
};

const handleCreateExpensesByWeekBarChart = () => {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/expenses-by-week-bar-chart-data/",
    success: (response) => {
      createBarChart(
        response,
        "weekly-expenses-bar-chart",
        "Expense amounts by week (Monday - Sunday)"
      );
    },
  });
};

const createBarChart = (data, canvasId, titleText, singleColor = false) => {
  const time = Object.keys(data);
  const amounts = Object.values(data);

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    responsive: true,
    title: {
      display: true,
      text: titleText,
    },
  };

  const backgroundColor = singleColor
    ? "rgb(54, 162, 235)"
    : [
        "rgb(219, 112, 147)",
        "rgb(54, 162, 235)",
        "rgb(255, 206, 86)",
        "rgb(122, 235, 52)",
        "rgb(75, 192, 192)",
        "rgb(0, 255, 255)",
        "rgb(255, 99, 132)",
        "rgb(162, 52, 235)",
        "rgb(235, 52, 208)",
        "rgb(255, 69, 0)",
        "rgb(255, 105, 180)",
        "rgb(0, 100, 0)",
      ];

  let ctx = document.getElementById(canvasId).getContext("2d");
  let myBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: time,
      datasets: [
        {
          data: amounts,
          backgroundColor: backgroundColor,
          borderWidth: 1,
        },
      ],
    },
    options: options,
  });
};
