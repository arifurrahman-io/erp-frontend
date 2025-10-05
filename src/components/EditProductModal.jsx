import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axiosConfig";

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  // State to hold form data, initialized with the product to be edited
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
  });
  const [error, setError] = useState("");

  // When the 'product' prop changes (i.e., when the modal is opened with a product),
  // this effect updates the form's state with that product's data.
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        quantity: product.quantity || 0,
        costPrice: product.costPrice || 0,
        sellingPrice: product.sellingPrice || 0,
      });
      setError(""); // Clear previous errors when a new product is loaded
    }
  }, [product]);

  // Don't render anything if the modal is not open or if there's no product data
  if (!isOpen || !product) return null;

  // A single handler to update the form data state for any input field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${product._id}`, formData);
      onProductUpdated(); // Callback to refresh the product list on the main page
      onClose(); // Close the modal on success
    } catch (err) {
      setError("Failed to update product. SKU might already be in use.");
      console.error("Failed to update product:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>
        {error && (
          <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input field for Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Input field for SKU */}
          <div>
            <label
              htmlFor="sku"
              className="block text-sm font-medium text-gray-700"
            >
              SKU (Unique Identifier)
            </label>
            <input
              id="sku"
              name="sku"
              type="text"
              value={formData.sku}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Input field for Stock Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Stock Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Input field for Cost Price */}
          <div>
            <label
              htmlFor="costPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Cost Price (BDT)
            </label>
            <input
              id="costPrice"
              name="costPrice"
              type="number"
              value={formData.costPrice}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Input field for Selling Price */}
          <div>
            <label
              htmlFor="sellingPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Selling Price (BDT)
            </label>
            <input
              id="sellingPrice"
              name="sellingPrice"
              type="number"
              value={formData.sellingPrice}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
