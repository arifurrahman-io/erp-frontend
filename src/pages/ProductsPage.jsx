import React, { useState, useEffect, useMemo } from "react";
import api from "../api/axiosConfig";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportDate, setReportDate] = useState(new Date());
  const [reportTitle, setReportTitle] = useState("Current Stock");

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // --- DATA FETCHING ---
  const fetchCurrentProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data.data);
      setReportTitle("Current Stock");
      setError(null);
    } catch (err) {
      setError(
        "Failed to fetch products. Please ensure the backend is running."
      );
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetReport = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/report/stock", {
        params: { date: reportDate.toISOString() },
      });
      const reportData = response.data.data.map((p) => ({
        ...p,
        quantity: p.stock,
      }));
      setProducts(reportData);
      setReportTitle(`Stock Report for ${reportDate.toLocaleDateString()}`);
      setError(null);
    } catch (err) {
      setError("Failed to fetch stock report.");
      console.error("Error fetching stock report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentProducts(); // Fetch current stock on initial load
  }, []);

  // --- FILTERING & HANDLERS ---
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await api.delete(`/products/${productToDelete._id}`);
        fetchCurrentProducts(); // Refresh with current data after deleting
      } catch (error) {
        console.error("Failed to delete product", error);
        alert("Error deleting product.");
      } finally {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="flex items-center gap-2 p-2 border rounded-md bg-white">
            <DatePicker
              selected={reportDate}
              onChange={(date) => setReportDate(date)}
              className="w-32 p-1"
              dateFormat="yyyy-MM-dd"
            />
            <button
              onClick={handleGetReport}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 border-l pl-2"
            >
              Get Report
            </button>
            <button
              onClick={fetchCurrentProducts}
              className="text-sm font-medium text-gray-600 hover:text-gray-800 border-l pl-2"
            >
              Current Stock
            </button>
          </div>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-md"
          />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md"
          >
            + Add New
          </button>
        </div>
      </div>

      {/* Product Data Table */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {reportTitle}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">SKU</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-right">Cost Price</th>
                <th className="p-4 text-right">Selling Price</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center p-6">
                    Loading...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-red-500">
                    {error}
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-gray-500">{product.sku}</td>
                    <td className="p-4 text-center">{product.quantity}</td>
                    <td className="p-4 text-right">
                      ৳{product.costPrice?.toLocaleString() || 0}
                    </td>
                    <td className="p-4 text-right">
                      ৳{product.sellingPrice?.toLocaleString() || 0}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          onClick={() => handleEditClick(product)}
                          title="Edit"
                        >
                          <FiEdit
                            size={20}
                            className="text-blue-600 hover:text-blue-800"
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          title="Delete"
                        >
                          <FiTrash2
                            size={20}
                            className="text-red-600 hover:text-red-800"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && !error && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    {searchTerm
                      ? "No products match search."
                      : "No products found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={fetchCurrentProducts}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onProductUpdated={fetchCurrentProducts}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={productToDelete?.name}
      />
    </div>
  );
};

export default ProductsPage;
