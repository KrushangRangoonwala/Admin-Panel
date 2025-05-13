import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/', // ✅ replace with your real API base URL
  withCredentials: true, // imp for setting cookie from server
//   headers: {
//     'Content-Type': 'application/json',
//   },
});

export default api;
