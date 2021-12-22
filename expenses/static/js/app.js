function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function isPortrait() {
  return window.innerHeight > window.innerWidth
}

function isLandscape() {
  return window.innerHeight < window.innerWidth
}

function handleContainerSize() {
  if(isPortrait()) {
    const container = document.getElementsByClassName('container')[0]
    container.style.width = '100%'
    container.style.maxWidth = 'none'
  }
}

function setCenterPaginationBar() {
  try{
    const paginationEl = document.getElementsByClassName('pagination')[0]
    paginationEl.style.justifyContent = 'center'
  } catch(e) {
    console.log(e)
  }
}

function unsetCenterPaginationBar() {
  try{
    const paginationEl = document.getElementsByClassName('pagination')[0]
    paginationEl.style.justifyContent = 'unset'
  } catch(e) {
    console.log(e)
  }
}



const isObjEmpty = (obj) => Object.keys(obj).length === 0;

Chart.plugins.register({
  afterDraw: function(chart) {
    const labels = chart.data.labels;
    const data = chart.data.datasets[0].data;

    if (isObjEmpty(labels) || isObjEmpty(data)) {
        // No data is present
      var ctx = chart.chart.ctx;
      var width = chart.chart.width;
      var height = chart.chart.height
      chart.clear();

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = "16px normal 'Helvetica Nueue'";
      ctx.fillText('No data to display', width / 2, height / 2);
      ctx.restore();
    }
  }
});



function handleCreateLineChart(page) {
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: `/line-chart-data/?page=${page}`,
    success: (response) => {
      createLineChart(response, 'totalExpensesLineChart', 'Total expenses by day');
    }
  });
}

const createLineChart = (data, canvasId, titleText) => {
  let dates = Object.keys(data)
  let amounts = Object.values(data)
  let ctx = document.getElementById(canvasId).getContext('2d');  

  Chart.defaults.global.defaultFontSize = 12;
  let myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Expenses',
        data: amounts,
        borderColor: 'rgb(255,140,0)',
        fill: false,
        tension: 0
      }]
    },

    options: {
      responsive: true,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Dates'
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: '(€) Amounts'
          },
        }]
      },
      title: {
        display: true,
        text: titleText
      }
    }
  });
}

function handleCreateAllExpensesPieChart()  {
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/total-expenses-pie-chart-data/',
    success: (response) => {
      createPieChart(response, 'totalExpensesPieChart', `Total expense amounts by category`);
    }
  });
}


function handleCreateMontlyExpensesPieChart() {
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/monthly-expenses-pie-chart-data/', 
    success: (response) => {
      createPieChart(response, 'monthlyExpensesPieChart', 'Montly expense amounts by category');
    }
  });
}


const createPieChart = (data, canvasId, titleText) => {
  let categories = Object.keys(data)
  let amounts = Object.values(data)

  let ctx = document.getElementById(canvasId).getContext('2d');
  let totalExpensesPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: amounts,
        backgroundColor: [
          'rgb(219, 112, 147)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(122, 235, 52)',
          'rgb(75, 192, 192)',
          'rgb(0, 255, 255)',
          'rgb(255, 99, 132)',
          'rgb(162, 52, 235)',
          'rgb(235, 52, 208)',
          'rgb(255, 69, 0)',
          'rgb(255, 105, 180)',
          'rgb(0, 100, 0)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: titleText,
      }
    }
  })
}

function handleCreateExpensesByMonthBarChart() {
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/expenses-by-month-bar-chart-data/',
    success: (response) => {
      createBarChart(response, 'monthlyExpensesBarChart', 'Expense amounts by month', true);
    }
  });
}

function handleCreateExpensesByWeekBarChart() {
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/expenses-by-week-bar-chart-data/',
    success: (response) => {
      createBarChart(response, 'weeklyExpensesBarChart', 'Expenses amounts by week (Monday - Sunday)');
    }
  });
}

const createBarChart = (data, canvasId, titleText, singleColor=false) => {
  let time;
  let amounts;

  time = Object.keys(data);
  amounts = Object.values(data);

  const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    legend: {
      display: false
    },
    responsive: true,
    title: {
      display: true,
      text: titleText,
    }
  }

  const backgroundColor = singleColor ? 
  'rgb(54, 162, 235)' 
  :
  [
    'rgb(219, 112, 147)',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
    'rgb(122, 235, 52)',
    'rgb(75, 192, 192)',
    'rgb(0, 255, 255)',
    'rgb(255, 99, 132)',
    'rgb(162, 52, 235)',
    'rgb(235, 52, 208)',
    'rgb(255, 69, 0)',
    'rgb(255, 105, 180)',
    'rgb(0, 100, 0)'
  ]

  let ctx = document.getElementById(canvasId).getContext('2d');
  let myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: time,
      datasets: [{
        data: amounts,
        backgroundColor: backgroundColor,
        borderWidth: 1
      }]
    },
    options: options

  })
}