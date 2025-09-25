// api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api", // common base URL
  timeout: 5000, // optional timeout
  headers: {
    "Content-Type": "application/json",
    // Add any auth tokens here if needed
    // Authorization: `Bearer ${token}`
  },
});

export default api;
