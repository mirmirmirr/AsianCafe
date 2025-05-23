import axios from 'axios';

const api = axios.create({
  withCredentials: true,
  // baseURL: "http://localhost:8000",
  // baseURL: "https://asiancafefayetteville.onrender.com",
  baseURL: "/api/",
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;