import axios from "axios";
import { API_BASE_URL } from "../constants";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
