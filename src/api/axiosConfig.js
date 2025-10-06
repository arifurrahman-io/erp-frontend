import axios from "axios";

// Create an Axios instance
const api = axios.create({
  // Get the base URL from the environment variables we just created
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    // CHANGE: Remove JSON.parse()
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
