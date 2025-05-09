import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // change to your deployed URL when needed
});

// Attach token to headers if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
