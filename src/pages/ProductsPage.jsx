import React, { useState, useEffect } from "react";
import AddProductModal from "../components/AddProductModal"; // Import the modal component
import EditProductModal from "../components/EditProductModal";
import api from "../api/axiosConfig";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data.data);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product); // Set the product to edit
    setIsEditModalOpen(true); // Open the edit modal
  };

  const handleDeleteClick = async (productId) => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${productId}`);
        fetchProducts(); // Refresh the product list
      } catch (error) {
        console.error("Failed to delete product", error);
        alert("Error deleting product.");
      }
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        {/* This button now opens the modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300"
        >
          + Add New Product
        </button>
      </div>

      {/* Product Data Table (no changes here) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            {/* ... table head ... */}
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">
                  Product Name
                </th>
                <th className="p-4 font-semibold text-gray-600">SKU</th>
                <th className="p-4 font-semibold text-gray-600">Stock</th>
                <th className="p-4 font-semibold text-gray-600">Cost Price</th>
                <th className="p-4 font-semibold text-gray-600">
                  Selling Price
                </th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* ... table body with loading/error/data states ... */}
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Loading Products...
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
                products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">
                      {product.name}
                    </td>
                    <td className="p-4 text-gray-500">{product.sku}</td>
                    <td className="p-4">{product.quantity}</td>
                    <td className="p-4">
                      ৳{product.costPrice.toLocaleString()}
                    </td>
                    <td className="p-4">
                      ৳{product.sellingPrice.toLocaleString()}
                    </td>
                    <td className="p-4 space-x-3">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render the AddProductModal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={fetchProducts} // Pass the fetch function to refresh the list
      />
      {/* Render the Modals */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={fetchProducts}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onProductUpdated={fetchProducts}
      />
    </div>
  );
};

export default ProductsPage;
