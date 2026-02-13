import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.API_URL || 'http://localhost:4000',
  withCredentials: true, // 🍪 Required for the JWT Cookie strategy we built
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;