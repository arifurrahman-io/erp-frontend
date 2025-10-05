import React, { useState, useEffect } from "react";
import AddCustomerModal from "../components/AddCustomerModal"; // Import the new modal component
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

  // This function fetches all customers and will be used to refresh the list
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/customers");
      setCustomers(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch customers. Please try again later.");
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Customer Management
        </h1>
        {/* Add the onClick handler to the button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition"
        >
          + Add New Customer
        </button>
      </div>

      {/* Customer Data Table (No changes here) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            {/* ... table head ... */}
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">
                  Customer Name
                </th>
                <th className="p-4 font-semibold text-gray-600">Phone</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">
                  Balance (BDT)
                </th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* ... table body with loading, error, and data rendering logic ... */}
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">
                      {customer.name}
                    </td>
                    <td className="p-4 text-gray-600">{customer.phone}</td>
                    <td className="p-4 text-gray-600">
                      {customer.email || "N/A"}
                    </td>
                    <td
                      className={`p-4 font-semibold ${
                        customer.balance < 0 ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {customer.balance.toLocaleString()}
                    </td>
                    <td className="p-4 space-x-3">
                      <Link
                        to={`/customers/${customer._id}`}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        View Ledger
                      </Link>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render the AddCustomerModal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerAdded={fetchCustomers} // Pass the fetch function to refresh the list
      />
    </div>
  );
};

export default CustomersPage;
