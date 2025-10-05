import axios from "axios";

// Create an Axios instance
const api = axios.create({
  // Get the base URL from the environment variables we just created
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// You can also add other default settings here, like headers for authentication
// For example:
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
