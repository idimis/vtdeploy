import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EventStatisticsProps {
  statistics: any[];
}

const EventStatisticsWidget: React.FC<EventStatisticsProps> = ({ statistics }) => {
  const [chartType, setChartType] = useState<'monthly' | 'yearly'>('monthly');

  if (!statistics || statistics.length === 0) return <div>No data available.</div>;

  const totalAttendees = statistics.reduce(
    (sum: number, event: { totalAttendees: number }) => sum + event.totalAttendees,
    0
  );

  // Filter events that have ratings and calculate the average rating based on those events
  const eventsWithRatings = statistics.filter(event => event.averageRating !== undefined && event.averageRating !== null);
  const averageRating = (eventsWithRatings.reduce(
    (sum: number, event: { averageRating: number }) => sum + event.averageRating,
    0
  ) / eventsWithRatings.length).toFixed(2);

  const totalRevenue = statistics.reduce(
    (sum: number, event: { totalRevenue: number }) => sum + (event.totalRevenue || 0),
    0
  );

  const eventNames = statistics.map((event: any) => event.eventName);
  const totalAttendeesData = statistics.map((event: any) => event.totalAttendees || 0);
  const averageRatingsData = statistics.map((event: any) => event.averageRating || 0);
  const totalRevenueData = statistics.map((event: any) => event.totalRevenue || 0);

  const data = {
    labels: eventNames,
    datasets: [
      {
        label: 'Total Attendees',
        data: totalAttendeesData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Average Rating',
        data: averageRatingsData,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Revenue',
        data: totalRevenueData,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartOptions = {
    scales: {
      x: {
        type: 'category',
      },
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
  };

  const yearlyChartOptions = {
    scales: {
      x: {
        type: 'category',
      },
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="event-statistics-widget">
      <div className="container mx-auto mt-12 text-center">
        <h2 className="text-2xl font-semibold text-purple-600 mb-4">Event Summary</h2>

        {/* Statistics Summary Section */}
        <div className="statistics-summary bg-white p-2 rounded-lg shadow-lg mb-16">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-medium text-gray-700">
              <strong>Total Events:</strong>
            </p>
            <span className="text-3xl font-bold text-yellow-500 glow-text">
              {statistics.length}
            </span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-medium text-gray-700">
              <strong>Total Attendees:</strong>
            </p>
            <span className="text-3xl font-bold text-yellow-500 glow-text">
              {totalAttendees}
            </span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-medium text-gray-700">
              <strong>Average Rating:</strong>
            </p>
            <span className="text-3xl font-bold text-yellow-500 glow-text">
              {averageRating}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-medium text-gray-700">
              <strong>Total Revenue:</strong>
            </p>
            <span className="text-3xl font-bold text-yellow-500 glow-text">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalRevenue)}
            </span>
          </div>
        </div>

        {/* Button Panel for Monthly/Yearly Toggle */}
        <div className="chart-tabs mb-5">
          <button
            className={`px-3 py-1 text-lg font-semibold rounded-md mr-4 transition-transform duration-300 ease-in-out ${
              chartType === 'monthly' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
            } hover:bg-purple-700 hover:scale-105`}
            onClick={() => setChartType('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-3 py-1 text-lg font-semibold rounded-md ml-4 transition-transform duration-300 ease-in-out ${
              chartType === 'yearly' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
            } hover:bg-purple-700 hover:scale-105`}
            onClick={() => setChartType('yearly')}
          >
            Yearly
          </button>
        </div>

        {/* Chart Display */}
        <div className="chart-container mb-5">
          <Bar data={data} options={chartType === 'monthly' ? monthlyChartOptions : yearlyChartOptions} />
        </div>
      </div>
    </div>
  );
};


export default EventStatisticsWidget;
