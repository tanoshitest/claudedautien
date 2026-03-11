import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import styles from './Home.module.css';

const features = [
  { icon: '🚚', title: 'Miễn phí vận chuyển', desc: 'Đơn từ 300.000đ' },
  { icon: '🎁', title: 'Đóng gói cẩn thận', desc: 'Hộp quà xinh xắn' },
  { icon: '↩️', title: 'Đổi trả dễ dàng', desc: 'Trong vòng 7 ngày' },
  { icon: '💳', title: 'Thanh toán an toàn', desc: 'Đa dạng phương thức' },
];

export default function Home() {
  const featured = products.slice(0, 4);
  const bestsellers = products.filter((p) => p.tag === 'Bán chạy');

  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🌸 Phong cách Nhật Bản</div>
          <h1>
            Khám phá nét đẹp <br />
            <span>Nhật Bản</span> trong từng <br />
            sản phẩm
          </h1>
          <p>
            Tanoshi Store mang đến những sản phẩm chọn lọc mang đậm phong cách và văn hóa Nhật Bản,
            giúp bạn tận hưởng niềm vui trong cuộc sống hàng ngày.
          </p>
          <div className={styles.heroActions}>
            <Link to="/shop" className={styles.btnPrimary}>Mua sắm ngay →</Link>
            <Link to="/about" className={styles.btnSecondary}>Tìm hiểu thêm</Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroCircle}>楽</div>
          <div className={styles.floatingTag} style={{ top: '15%', right: '5%' }}>🌸 Kawaii</div>
          <div className={styles.floatingTag} style={{ bottom: '20%', left: '0%' }}>🍵 Matcha</div>
          <div className={styles.floatingTag} style={{ top: '55%', right: '0%' }}>🎌 Japan</div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        {features.map((f) => (
          <div key={f.title} className={styles.featureItem}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <div>
              <strong>{f.title}</strong>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Sản phẩm nổi bật</h2>
          <Link to="/shop" className={styles.viewAll}>Xem tất cả →</Link>
        </div>
        <div className={styles.grid}>
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <h2>Mua 2 tặng 1 🎉</h2>
          <p>Áp dụng cho tất cả sản phẩm văn phòng phẩm từ nay đến cuối tháng.</p>
          <Link to="/shop?category=Stationery" className={styles.btnPrimary}>
            Xem ngay
          </Link>
        </div>
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>🔥 Bán chạy nhất</h2>
            <Link to="/shop" className={styles.viewAll}>Xem tất cả →</Link>
          </div>
          <div className={styles.grid}>
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
