import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = ({ xAxisLabels = [], yAxisCounts = [], maxY = 10 }) => {

    if (!xAxisLabels.length || !yAxisCounts.length) {
    return <p>No data to display.</p>;
  }
  const data = {
    labels: xAxisLabels,
    datasets: [
      {
        label: 'Count',
        data: yAxisCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Count: ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Categories',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
        },
        suggestedMax: maxY,
        beginAtZero: true, // Ensure y-axis starts at zero
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '250px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
