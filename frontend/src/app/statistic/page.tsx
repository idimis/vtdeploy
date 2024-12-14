"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EventStatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<any>(null);
  const [chartType, setChartType] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    const fetchStatistics = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/events/statistics", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (result.success) {
          setStatistics(result.data.content);
        } else {
          alert("Failed to load statistics.");
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        alert("An error occurred while fetching statistics.");
      }
    };

    fetchStatistics();
  }, []);

  const processData = (statistics: any) => {
    const eventNames = statistics.map((event: any) => event.eventName);
    const totalAttendees = statistics.map((event: any) => event.totalAttendees || 0);
    const averageRatings = statistics.map((event: any) => event.averageRating || 0);
    const totalRevenue = statistics.map((event: any) => event.totalRevenue || 0);

    return {
      labels: eventNames,
      datasets: [
        {
          label: "Total Attendees",
          data: totalAttendees,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Average Rating",
          data: averageRatings,
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
        {
          label: "Total Revenue",
          data: totalRevenue,
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  if (!statistics) return <div>Loading...</div>;

  const data = processData(statistics);

  const monthlyChartOptions = {
    scales: {
      x: {
        type: 'category',  // Specify 'category' for the x-axis
        // You can add more configuration options as necessary
      },
      y: {
        type: 'linear',    // Specify 'linear' for the y-axis
        beginAtZero: true, // Optional: if you want y-axis to start from 0
        // Additional y-axis options can be added here
      },
    },
    // Other chart options
  };
  
  const yearlyChartOptions = {
    scales: {
      x: {
        type: 'category',  // Specify 'category' for the x-axis
        // Additional options for x-axis
      },
      y: {
        type: 'linear',    // Specify 'linear' for the y-axis
        beginAtZero: true, // Optional: if you want y-axis to start from 0
        // Additional y-axis options can be added here
      },
    },
    // Other chart options
  };
  
  

  return (
    <div className="event-statistics-widget">
      <Header />
      <div className="container mx-auto mt-12 text-center"> 
        {/* Adjusted title position and increased margin */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Event Statistics</h2>
  
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
      {statistics.reduce((sum: number, event: { totalAttendees: number }) => sum + event.totalAttendees, 0)}
    </span>
  </div>
  <div className="flex justify-between items-center mb-4">
    <p className="text-lg font-medium text-gray-700">
      <strong>Average Rating:</strong> 
    </p>
    <span className="text-3xl font-bold text-yellow-500 glow-text">
      {(statistics.reduce((sum: number, event: { averageRating: number }) => sum + (event.averageRating || 0), 0) / statistics.length).toFixed(2)}
    </span>
  </div>
  <div className="flex justify-between items-center mb-4">
    <p className="text-lg font-medium text-gray-700">
      <strong>Total Revenue:</strong> 
    </p>
    <span className="text-3xl font-bold text-yellow-500 glow-text">
      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
        statistics.reduce((sum: number, event: { totalRevenue: number }) => sum + (event.totalRevenue || 0), 0)
      )}
    </span>
  </div>
</div>

  
        {/* Button Panel for Monthly/Yearly Toggle */}
        <div className="chart-tabs mb-5">
          <button
            className={`px-6 py-2 text-lg font-semibold rounded-md mr-4 transition-transform duration-300 ease-in-out ${
              chartType === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            } hover:bg-blue-400 hover:scale-105`}
            onClick={() => setChartType("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 text-lg font-semibold rounded-md ml-4 transition-transform duration-300 ease-in-out ${
              chartType === "yearly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            } hover:bg-blue-400 hover:scale-105`}
            onClick={() => setChartType("yearly")}
          >
            Yearly
          </button>
        </div>
  
        {/* Chart Display */}
        <div className="chart-container mb-5">
          <Bar
            data={data}
            options={chartType === "monthly" ? monthlyChartOptions : yearlyChartOptions}
          />
        </div>
  
        <div className="event-details">
  <h3 className="text-2xl font-semibold text-gray-800 mb-6">Event Details</h3>
  <ul className="list-none px-0">
    {statistics.map((event) => (
      <li key={event.eventId} className="mb-4 text-lg"> 
        <div className="grid grid-cols-4 gap-2"> 
          {/* Event Name */}
          <div className="font-semibold text-left">
            <strong>{event.eventName}</strong>
          </div>

          {/* Event Rating */}
          <div className="text-center">
            <span>Rating: {event.averageRating || '-'}</span>
          </div>

          {/* Event Attendees */}
          <div className="text-center">
            <span>Attendees: {event.totalAttendees}</span>
          </div>

          {/* Event Revenue */}
          <div className="text-center">
            <span>
              Revenue: {event.totalRevenue ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(event.totalRevenue) : '-'}
            </span>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>

</div>
      <Footer />
    </div>
  );
};

export default EventStatisticsPage