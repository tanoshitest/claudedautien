import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLayout.module.css';

const navItems = [
  { to: '/admin',          label: '📊 Tổng quan',   end: true },
  { to: '/admin/orders',   label: '📦 Đơn hàng' },
  { to: '/admin/products', label: '🛍️ Sản phẩm' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span>楽</span>
          <div>
            <strong>TanoshiStore</strong>
            <p>Quản trị viên</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <strong>{user?.name}</strong>
            <p>{user?.email}</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn} title="Đăng xuất">↩</button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
