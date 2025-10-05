import React, { useState } from "react";
import api from "../api/axiosConfig";

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  // State for each form field
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null; // Don't render the modal if it's not open

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !sku || !quantity || !costPrice || !sellingPrice) {
      setError("All fields are required.");
      return;
    }

    const newProduct = {
      name,
      sku,
      quantity: Number(quantity),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
    };

    try {
      await api.post("/products", newProduct);
      onProductAdded(); // This will refresh the product list on the main page
      onClose(); // Close the modal on success
    } catch (err) {
      setError("Failed to add product. SKU might already exist.");
      console.error("Error adding product:", err);
    }
  };

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      {/* Modal Content */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Add New Product
        </h2>
        {error && (
          <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="SKU (Unique Identifier)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Cost Price (BDT)"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Selling Price (BDT)"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

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
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
