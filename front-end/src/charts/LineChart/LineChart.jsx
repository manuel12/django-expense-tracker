import React from "react";
import { Chart } from "chart.js";
import { Line } from "react-chartjs-2";

// Chart.register(
//   CategoryScale,
//   LinearScale,
//   LineController,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

const LineChart = () => {
  const chartData = {
    "09' Jun": 48.99,
    "18' Jun": 21.0,
    "25' Jun": 20.0,
    "02' Jul": 16.0,
    "09' Jul": 369.49,
  };

  const dates = Object.keys(chartData);
  const amounts = Object.values(chartData);

  const options = {
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
      text: "Total expenses by day",
    },
  };

  const data = {
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
  };

  return (
    <div className='canvasContainer col-md-12'>
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart;
