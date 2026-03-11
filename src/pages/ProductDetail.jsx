import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import styles from './ProductDetail.module.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find((p) => p.id === Number(id));
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Không tìm thấy sản phẩm</h2>
        <Link to="/shop">← Quay lại cửa hàng</Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link to="/shop" className={styles.back}>← Quay lại cửa hàng</Link>

        <div className={styles.detail}>
          <div className={styles.imageSection}>
            <img src={product.image} alt={product.name} />
          </div>

          <div className={styles.info}>
            <span className={styles.category}>{product.category}</span>
            <h1>{product.name}</h1>

            <div className={styles.rating}>
              {'★'.repeat(Math.floor(product.rating))}
              <span>{product.rating}</span>
              <span className={styles.reviews}>({product.reviews} đánh giá)</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                  <span className={styles.discount}>-{discount}%</span>
                </>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.qtyRow}>
              <span>Số lượng:</span>
              <div className={styles.qtyControl}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>

            <button
              className={`${styles.addBtn} ${added ? styles.added : ''}`}
              onClick={handleAdd}
            >
              {added ? '✓ Đã thêm vào giỏ!' : '🛒 Thêm vào giỏ hàng'}
            </button>

            <div className={styles.badges}>
              <span>🚚 Miễn phí ship đơn từ 300k</span>
              <span>↩️ Đổi trả trong 7 ngày</span>
              <span>✅ Hàng chính hãng 100%</span>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className={styles.related}>
            <h2>Sản phẩm liên quan</h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
