import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      // Nếu là admin → vào trang quản trị, user thường → về trang chủ
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span>楽</span>
          <h1>TanoshiStore</h1>
        </div>

        <h2>Đăng nhập</h2>
        <p className={styles.sub}>Chào mừng bạn quay trở lại!</p>

        {error && <div className={styles.error}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className={styles.hint}>
          <p>🔑 Tài khoản demo (nhấn để điền nhanh):</p>
          <button
            type="button"
            className={styles.demoBtn}
            onClick={() => setForm({ email: 'admin@tanoshi.vn', password: 'admin123' })}
          >
            ⚙️ Admin — admin@tanoshi.vn / admin123
          </button>
          <button
            type="button"
            className={styles.demoBtn}
            onClick={() => setForm({ email: 'user@tanoshi.vn', password: 'user123' })}
          >
            👤 Khách hàng — user@tanoshi.vn / user123
          </button>
        </div>
      </div>
    </main>
  );
}
