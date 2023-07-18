import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ chartData, title, xLabel, yLabel }) => {
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
            labelString: xLabel,
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: yLabel,
          },
        },
      ],
    },
    title: {
      display: true,
      text: title,
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
