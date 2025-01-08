import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.LOCAL_SERVER,
  header: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;