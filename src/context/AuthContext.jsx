import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// Tài khoản demo dùng khi backend chưa chạy
const MOCK_ACCOUNTS = [
  { _id: 'mock-admin-1', name: 'Admin Tanoshi', email: 'admin@tanoshi.vn', password: 'admin123', role: 'admin', token: 'mock-token-admin' },
  { _id: 'mock-user-1',  name: 'Khách Hàng',   email: 'user@tanoshi.vn',  password: 'user123',  role: 'user',  token: 'mock-token-user'  },
];

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    if (token && saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Thử gọi backend thật trước
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      // Nếu backend chưa chạy → dùng mock accounts
      const found = MOCK_ACCOUNTS.find(
        (a) => a.email === email && a.password === password
      );
      if (!found) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }
      const { password: _, ...data } = found; // bỏ password trước khi lưu
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
