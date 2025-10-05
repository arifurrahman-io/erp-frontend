import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axiosConfig";

// StatCard Component to display key metrics
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="text-3xl text-indigo-500">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function fetches the live data from your backend
    const fetchSummaryData = async () => {
      try {
        // Make the GET request to your backend API
        const response = await api.get("/analytics/summary");

        // Set the state with the data received from the API
        setSummary(response.data);
      } catch (err) {
        setError(
          "Failed to load dashboard data. Please ensure the backend is running."
        );
        console.error("Error fetching summary data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []); // The empty array [] ensures this effect runs only once on component mount

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Loading Dashboard Data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10 bg-red-100 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  // This check is important in case the API returns no data
  if (!summary) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No summary data available.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`৳${summary.totalRevenue?.toLocaleString() || 0}`}
          icon="💰"
        />
        <StatCard
          title="Total Profit"
          value={`৳${summary.totalProfit?.toLocaleString() || 0}`}
          icon="📈"
        />
        <StatCard
          title="Total Customers"
          value={summary.totalCustomers || 0}
          icon="👥"
        />
        <StatCard
          title="Products in Stock"
          value={summary.totalProducts || 0}
          icon="📦"
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Sales Over Time
        </h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={summary.salesOverTime}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `৳${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="sales" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
