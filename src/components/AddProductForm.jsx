import React, { useState } from "react";
import { addProduct } from "../api/productService";

const AddProductForm = ({ onProductAdded }) => {
  // State গুলো আগের মতোই থাকবে
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  // handleSubmit ফাংশনও আগের মতোই থাকবে
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !sku || !quantity || !price) {
      alert("অনুগ্রহ করে সব ঘর পূরণ করুন");
      return;
    }
    try {
      const newProduct = {
        name,
        sku,
        quantity: Number(quantity),
        price: Number(price),
      };
      await addProduct(newProduct);
      alert("প্রোডাক্ট সফলভাবে যোগ করা হয়েছে!");
      // ফর্ম রিসেট করুন
      setName("");
      setSku("");
      setQuantity("");
      setPrice("");
      // প্রোডাক্ট লিস্ট রিফ্রেশ করার জন্য
      onProductAdded();
    } catch (error) {
      console.error("প্রোডাক্ট যোগ করতে সমস্যা হয়েছে:", error);
      alert("প্রোডাক্ট যোগ করা যায়নি");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        নতুন প্রোডাক্ট যোগ করুন
      </h3>

      <input
        type="text"
        placeholder="প্রোডাক্টের নাম"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="SKU (e.g., LP-001)"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="পরিমাণ"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="মূল্য"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300"
      >
        প্রোডাক্ট যোগ করুন
      </button>
    </form>
  );
};

export default AddProductForm;
