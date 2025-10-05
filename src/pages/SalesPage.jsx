import React, { useState, useEffect } from "react";
import AddSaleModal from "../components/AddSaleModal";
import SaleDetailsModal from "../components/SaleDetailsModal"; // Import the new modal
import api from "../api/axiosConfig";

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null); // To store the sale for details view

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await api.get("/sales");
      // CHANGE 1: Reverse the array to show the last item first
      setSales(response.data.data.reverse());
      setError(null);
    } catch (err) {
      setError("Failed to fetch sales records.");
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Function to handle clicking the "Details" button
  const handleDetailsClick = (sale) => {
    setSelectedSale(sale);
    setIsDetailsModalOpen(true);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Records</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
        >
          + Record New Sale
        </button>
      </div>

      {/* Sales Data Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            {/* ... table head ... */}
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Amount Paid</th>
                <th className="p-4">Due</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* ... loading and error states ... */}
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
                    <td className="p-4">
                      ৳{sale.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-4">৳{sale.amountPaid.toLocaleString()}</td>
                    <td
                      className={`p-4 font-semibold ${
                        sale.totalAmount - sale.amountPaid > 0
                          ? "text-orange-500"
                          : "text-green-600"
                      }`}
                    >
                      ৳{(sale.totalAmount - sale.amountPaid).toLocaleString()}
                    </td>
                    <td className="p-4">
                      {/* CHANGE 2: Add onClick handler to the button */}
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
        onSaleAdded={fetchSales}
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
