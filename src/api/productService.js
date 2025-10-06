import api from "./axiosConfig"; // Import the centralized api instance

// All product-related functions will now use the 'api' instance

// Get all products
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// Add a new product
export const addProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

// Update a product
export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/products/${productId}`, productData);
  return response.data;
};

// Delete a product
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};
