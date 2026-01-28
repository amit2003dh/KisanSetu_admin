import axios from "axios";

// Create axios instance for admin API
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api", // Backend API URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// API call wrapper function
export const apiCall = (apiFunction) => {
  return apiFunction()
    .then((response) => {
      return { data: response.data, error: null };
    })
    .catch((error) => {
      console.error("API Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      return { data: null, error: errorMessage };
    });
};

export default API;
