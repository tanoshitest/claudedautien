import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <span>🎌 Miễn phí vận chuyển cho đơn từ 300.000đ</span>
      </div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>楽</span>
          <span className={styles.logoText}>Tanoshi<span>Store</span></span>
        </Link>

        <form className={styles.search} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className={styles.actions}>
          <Link to="/shop" className={styles.navLink}>Cửa hàng</Link>
          <Link to="/about" className={styles.navLink}>Về chúng tôi</Link>
          {isAdmin && (
            <Link to="/admin" className={styles.adminBtn}>⚙️ Quản trị</Link>
          )}
          {user ? (
            <button className={styles.navLink} onClick={() => { logout(); navigate('/'); }}>
              👤 {user.name.split(' ').pop()}
            </button>
          ) : (
            <Link to="/login" className={styles.navLink}>Đăng nhập</Link>
          )}
          <Link to="/cart" className={styles.cartBtn}>
            🛒
            {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
          </Link>
        </div>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Cửa hàng</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>Về chúng tôi</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>Giỏ hàng {totalItems > 0 && `(${totalItems})`}</Link>
        </div>
      )}
    </header>
  );
}
