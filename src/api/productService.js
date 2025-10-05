import axios from "axios";

// আপনার ব্যাকএন্ড সার্ভারের URL
const API_URL = "http://localhost:5000/api/products";

// সব প্রোডাক্ট আনার জন্য ফাংশন
export const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// নতুন প্রোডাক্ট যোগ করার জন্য ফাংশ শন
export const addProduct = async (productData) => {
  const response = await axios.post(API_URL, productData);
  return response.data;
};
