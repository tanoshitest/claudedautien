import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './Cart.module.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export default function Cart() {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.empty}>
          <span>🛒</span>
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <Link to="/shop" className={styles.shopBtn}>Mua sắm ngay →</Link>
        </div>
      </main>
    );
  }

  const shipping = totalPrice >= 300000 ? 0 : 30000;
  const total = totalPrice + shipping;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Giỏ hàng của bạn</h1>

        <div className={styles.layout}>
          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <img src={item.image} alt={item.name} />
                <div className={styles.itemInfo}>
                  <span className={styles.itemCat}>{item.category}</span>
                  <Link to={`/product/${item.id}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                </div>
                <div className={styles.qtyControl}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <div className={styles.itemTotal}>
                  {formatPrice(item.price * item.qty)}
                </div>
                <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
              </div>
            ))}

            <button className={styles.clearBtn} onClick={clearCart}>
              Xóa tất cả
            </button>
          </div>

          <div className={styles.summary}>
            <h2>Tóm tắt đơn hàng</h2>

            <div className={styles.summaryRow}>
              <span>Tạm tính</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Phí vận chuyển</span>
              <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className={styles.shippingNote}>
                Thêm {formatPrice(300000 - totalPrice)} để được miễn phí vận chuyển!
              </p>
            )}

            <div className={styles.divider} />

            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Tổng cộng</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Link to="/checkout" className={styles.checkoutBtn}>
              Tiến hành thanh toán →
            </Link>

            <Link to="/shop" className={styles.continueLink}>
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
