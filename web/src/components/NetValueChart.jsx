import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const NetValueChart = () => {
  // Mock data for the chart
  const data = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [
      {
        label: '全球增长基金',
        data: [10, 12, 8, 15, 18, 20],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: '医疗保健基金',
        data: [8, 9, 11, 10, 12, 14],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '基金净值走势',
      },
    },
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">净值走势</h2>
      <div className="w-full h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default NetValueChart;