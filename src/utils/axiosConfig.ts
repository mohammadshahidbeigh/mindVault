// src/utils/axiosConfig.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/graphql", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
