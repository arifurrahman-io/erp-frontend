import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axiosConfig";
import {
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiPlusCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

// Modernized StatCard Component with real icons
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform transform hover:-translate-y-1">
    <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// Custom Tooltip for the chart for a better look
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-semibold">{`Month: ${label}`}</p>
        <p className="text-indigo-600">{`Sales: ৳${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await api.get("/analytics/summary");
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
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading Dashboard Data...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-10 text-red-500 bg-red-100 rounded-md">
        {error}
      </div>
    );
  }
  if (!summary) {
    return <div className="text-center p-10">No summary data available.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome Back, Admin!
        </h1>
        <p className="text-gray-500">
          Here's a summary of your business performance.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`৳${summary.totalRevenue?.toLocaleString() || 0}`}
          icon={<FiDollarSign size={24} className="text-green-800" />}
          color="bg-green-100"
        />
        <StatCard
          title="Total Profit"
          value={`৳${summary.totalProfit?.toLocaleString() || 0}`}
          icon={<FiTrendingUp size={24} className="text-blue-800" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Total Customers"
          value={summary.totalCustomers || 0}
          icon={<FiUsers size={24} className="text-orange-800" />}
          color="bg-orange-100"
        />
        <StatCard
          title="Products in Stock"
          value={summary.totalProducts || 0}
          icon={<FiPackage size={24} className="text-purple-800" />}
          color="bg-purple-100"
        />
      </div>

      {/* Main Content Area with Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart (takes 2/3 width on large screens) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Sales Over Time
          </h2>
          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer>
              <AreaChart
                data={summary.salesOverTime}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Recent Activity (takes 1/3 width) */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <Link
              to="/sales"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-indigo-100 transition"
            >
              <FiPlusCircle className="text-indigo-600 mr-3" size={20} />
              <span>Record New Sale</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-indigo-100 transition"
            >
              <FiPlusCircle className="text-indigo-600 mr-3" size={20} />
              <span>Add New Product</span>
            </Link>
            <Link
              to="/customers"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-indigo-100 transition"
            >
              <FiPlusCircle className="text-indigo-600 mr-3" size={20} />
              <span>Add New Customer</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
