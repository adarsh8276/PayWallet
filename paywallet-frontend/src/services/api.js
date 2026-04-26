import axios from 'axios';

const API = axios.create({ baseURL: 'https://paywallet-gateway.onrender.com' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/users', data),
};
export const userAPI = {
  getById: (id) => API.get(`/users/${id}`),
};
export const walletAPI = {
  create: (userId) => API.post(`/wallet/${userId}`),
  getByUser: (userId) => API.get(`/wallet/user/${userId}`),
  addMoney: (data) => API.post('/wallet/add-money', data),
};
export const transactionAPI = {
  transfer: (data) => API.post('/transfer', data),
  getHistory: (userId) => API.get(`/transactions/user/${userId}`),
};
export default API;
