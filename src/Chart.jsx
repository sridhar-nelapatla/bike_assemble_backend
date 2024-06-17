import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register necessary components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Chart = (props) => {
  const { data } = props;
  console.log("props,", props);
  const chartData = {
    labels: data.map((bike) => bike.name),
    datasets: [
      {
        label: "Assembled Count",
        data: data.map((bike) => bike.assembledCount.toFixed(2)), // Format to 2 decimal places
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Number of Bikes Assembled",
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default Chart;
