import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const tagColors = {
  'Bán chạy': '#e85d4a',
  'Mới': '#4CAF50',
  'Giảm giá': '#FF9800',
  'Yêu thích': '#9C27B0',
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imageWrap}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.tag && (
          <span
            className={styles.tag}
            style={{ background: tagColors[product.tag] || '#999' }}
          >
            {product.tag}
          </span>
        )}
        {discount && <span className={styles.discount}>-{discount}%</span>}
      </Link>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>

        <div className={styles.rating}>
          {'★'.repeat(Math.floor(product.rating))}
          <span className={styles.ratingNum}>{product.rating}</span>
          <span className={styles.reviews}>({product.reviews})</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <button className={styles.addBtn} onClick={() => addItem(product)}>
          + Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
