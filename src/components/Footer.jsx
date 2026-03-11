import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span>楽</span> TanoshiStore
          </div>
          <p>Mang niềm vui Nhật Bản đến với bạn mỗi ngày.</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="TikTok">🎵</a>
          </div>
        </div>

        <div className={styles.links}>
          <h4>Cửa hàng</h4>
          <Link to="/shop">Tất cả sản phẩm</Link>
          <Link to="/shop?category=Drinks">Đồ uống</Link>
          <Link to="/shop?category=Stationery">Văn phòng phẩm</Link>
          <Link to="/shop?category=Home">Đồ gia dụng</Link>
        </div>

        <div className={styles.links}>
          <h4>Hỗ trợ</h4>
          <a href="#">Chính sách đổi trả</a>
          <a href="#">Hướng dẫn mua hàng</a>
          <a href="#">Theo dõi đơn hàng</a>
          <Link to="/about">Về chúng tôi</Link>
        </div>

        <div className={styles.links}>
          <h4>Liên hệ</h4>
          <span>📍 TP. Hồ Chí Minh</span>
          <span>📞 0901 234 567</span>
          <span>✉️ hello@tanoshi.vn</span>
          <span>🕐 8:00 - 22:00 hàng ngày</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2024 TanoshiStore. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
}
