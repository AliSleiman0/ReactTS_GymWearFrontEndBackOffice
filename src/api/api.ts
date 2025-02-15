import axios from 'axios';

// Set the base URL for the API
const API_URL = 'https://localhost:7250/api'; // Change this URL if needed

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Pragma: 'no-cache',
    'Cache-control': 'no-cache',
    timeout: 20000,
  },
});
export default api;
