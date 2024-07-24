import axios from "axios";
import { getToken } from "../../components/auth/auth"; // Zakładamy, że masz funkcję, która pobiera token z localStorage lub innego miejsca

const instanceAxios = axios.create({
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

// Dodaj interceptor, aby dołączyć token do każdego zapytania
instanceAxios.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instanceAxios;
