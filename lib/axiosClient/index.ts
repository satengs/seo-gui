import axios from 'axios';
import { apiBaseUrl } from 'next-auth/client/_utils';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_CONFIG_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
