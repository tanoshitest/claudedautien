// ==========================================
// services/api.js — Các hàm gọi API backend
// ==========================================

const BASE_URL = 'http://localhost:5000/api';

// Hàm helper — tự động gắn Authorization header nếu user đã đăng nhập
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Có lỗi xảy ra');
  }

  return data;
}

// ---------- Products ----------
export const productAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products?${query}`);
  },
  getById: (id) => request(`/products/${id}`),
  create:  (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update:  (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete:  (id) => request(`/products/${id}`, { method: 'DELETE' }),
};

// ---------- Auth ----------
export const authAPI = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login:    (data) => request('/auth/login',    { method: 'POST', body: JSON.stringify(data) }),
  me:       ()     => request('/auth/me'),
};

// ---------- Orders ----------
export const orderAPI = {
  create:   (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getMyOrders: ()  => request('/orders/my'),
  getById:  (id)   => request(`/orders/${id}`),
};
