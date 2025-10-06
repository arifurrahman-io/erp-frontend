import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import AddSaleModal from "../components/AddSaleModal";
import SaleDetailsModal from "../components/SaleDetailsModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { CSVLink } from "react-csv";
import { FiCalendar } from "react-icons/fi";

// Helper component for summary cards
const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

// Custom Input component for the DatePicker
const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    className="flex items-center justify-between w-full sm:w-64 bg-white p-2 border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <span className="text-gray-700">{value}</span>
    <FiCalendar className="ml-2 text-gray-500" />
  </button>
));

const SalesPage = () => {
  // --- STATE MANAGEMENT ---
  const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return [start, end];
  };

  const [filterRange, setFilterRange] = useState(getTodayRange());
  const [pickerStartDate, setPickerStartDate] = useState(new Date());
  const [pickerEndDate, setPickerEndDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalProfit: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  // --- DATA FETCHING & RESPONSIVENESS ---
  const fetchSales = async (start, end) => {
    if (!start || !end) return;

    try {
      setLoading(true);

      // This ensures the query covers the entire day, regardless of timezone
      const adjustedStartDate = new Date(start);
      adjustedStartDate.setHours(0, 0, 0, 0);

      const adjustedEndDate = new Date(end);
      adjustedEndDate.setHours(23, 59, 59, 999);

      const params = {
        startDate: adjustedStartDate.toISOString(),
        endDate: adjustedEndDate.toISOString(),
      };

      const response = await api.get("/sales", { params });

      if (response.data && response.data.sales) {
        setSales(response.data.sales);
        setSummary(response.data.summary);
        setChartData(response.data.salesForChart);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch sales records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(filterRange[0], filterRange[1]);
  }, [filterRange]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- HANDLERS ---
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setPickerStartDate(start);
    setPickerEndDate(end);

    if (start && !end) {
      setFilterRange([start, start]);
    }
    if (start && end) {
      setFilterRange([start, end]);
    }
  };

  const handleDetailsClick = (sale) => {
    setSelectedSale(sale);
    setIsDetailsModalOpen(true);
  };

  const csvData = [
    ["Date", "Customer", "Total", "Paid", "Due"],
    ...sales.map((s) => [
      new Date(s.saleDate).toLocaleDateString(),
      s.customer?.name,
      s.totalAmount,
      s.amountPaid,
      s.totalAmount - s.amountPaid,
    ]),
  ];

  return (
    <div>
      {/* Page Header and Report Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Report</h1>
        <div className="flex flex-wrap items-center gap-2">
          <DatePicker
            selectsRange={true}
            startDate={pickerStartDate}
            endDate={pickerEndDate}
            onChange={handleDateChange}
            isClearable={true}
            monthsShown={isMobile ? 1 : 2}
            todayButton="Go to Today"
            customInput={
              <CustomDateInput
                value={
                  filterRange[0] && filterRange[1]
                    ? `${filterRange[0].toLocaleDateString()} - ${filterRange[1].toLocaleDateString()}`
                    : "Select a range"
                }
              />
            }
          />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md"
          >
            + Record Sale
          </button>
          <CSVLink
            data={csvData}
            filename={"sales-report.csv"}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-md"
          >
            Export CSV
          </CSVLink>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard
          title="Total Revenue"
          value={`৳${summary.totalRevenue.toLocaleString()}`}
        />
        <StatCard
          title="Total Profit"
          value={`৳${summary.totalProfit.toLocaleString()}`}
        />
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Sales Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `৳${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="sales" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sales Data Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4 text-right">Amount Paid</th>
                <th className="p-4 text-right">Due</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-red-500">
                    {error}
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                sales.map((sale) => (
                  <tr key={sale._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium">
                      {sale.customer?.name || "N/A"}
                    </td>
                    <td className="p-4 text-right">
                      ৳{sale.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      ৳{sale.amountPaid.toLocaleString()}
                    </td>
                    <td
                      className={`p-4 font-semibold text-right ${
                        sale.totalAmount - sale.amountPaid > 0
                          ? "text-orange-500"
                          : "text-green-600"
                      }`}
                    >
                      ৳{(sale.totalAmount - sale.amountPaid).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDetailsClick(sale)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddSaleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaleAdded={() => fetchSales(filterRange[0], filterRange[1])}
      />
      <SaleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        sale={selectedSale}
      />
    </div>
  );
};

export default SalesPage;
