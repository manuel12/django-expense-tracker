import React from "react";
import { Pie } from "react-chartjs-2";

const PieChart = ({ chartData, title }) => {
  const categories = Object.keys(chartData);
  const amounts = Object.values(chartData);

  const options = {
    responsive: true,
    title: {
      display: true,
      text: title,
    },
  };

  const data = {
    labels: categories,
    datasets: [
      {
        label: "# of Votes",
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
        borderWidth: 0.9,
      },
    ],
  };

  return <Pie data={data} options={options} />;
};

export default PieChart