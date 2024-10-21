// src/utils/axiosConfig.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://43.205.10.7:4000/graphql", // Updated to the backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
