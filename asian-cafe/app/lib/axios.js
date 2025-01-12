import axios from 'axios';

const api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8000",
  header: {
    'Content-Type': 'application/json',
  }
});

// axios.defaults.withCredentials = true;

export default api;