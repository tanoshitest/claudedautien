import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import styles from './OrderSuccess.module.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const STATUS_STEPS = [
  { key: 'pending',   label: 'Chờ xác nhận', icon: '📋' },
  { key: 'confirmed', label: 'Đã xác nhận',  icon: '✅' },
  { key: 'shipping',  label: 'Đang giao',    icon: '🚚' },
  { key: 'delivered', label: 'Đã giao',      icon: '🎉' },
];

export default function OrderSuccess() {
  const { id } = useParams();
  const { orders } = useOrders();
  const order = orders.find((o) => o._id === id);

  if (!order) {
    return (
      <div className={styles.notFound}>
        <p>Không tìm thấy đơn hàng.</p>
        <Link to="/">Về trang chủ</Link>
      </div>
    );
  }

  const curStep = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* Header success */}
        <div className={styles.successHeader}>
          <div className={styles.checkCircle}>✓</div>
          <h1>Đặt hàng thành công!</h1>
          <p>Cảm ơn bạn đã tin tưởng TanoshiStore 🌸</p>
          <div className={styles.orderId}>
            Mã đơn hàng: <strong>#{order._id.slice(-8).toUpperCase()}</strong>
          </div>
        </div>

        {/* Stepper trạng thái */}
        <div className={styles.stepper}>
          {STATUS_STEPS.map((step, i) => (
            <div key={step.key} className={`${styles.step} ${i <= curStep ? styles.done : ''}`}>
              <div className={styles.stepIcon}>{i <= curStep ? step.icon : '○'}</div>
              <p>{step.label}</p>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`${styles.line} ${i < curStep ? styles.done : ''}`} />
              )}
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          {/* Thông tin giao hàng */}
          <div className={styles.card}>
            <h2>📍 Địa chỉ giao hàng</h2>
            <p><strong>{order.shippingAddress.name}</strong></p>
            <p>📞 {order.shippingAddress.phone}</p>
            <p>🏠 {order.shippingAddress.street}</p>
            <p>🏙️ {order.shippingAddress.city}</p>
            {order.paymentMethod && (
              <p className={styles.payMethod}>
                💳 {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản'}
              </p>
            )}
          </div>

          {/* Sản phẩm */}
          <div className={styles.card}>
            <h2>🛍️ Sản phẩm đã đặt</h2>
            {order.items.map((item, i) => (
              <div key={i} className={styles.item}>
                <img src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <p>x{item.qty} — {formatPrice(item.price)}</p>
                </div>
                <span>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}

            <div className={styles.divider} />
            <div className={styles.total}>
              <span>Phí ship</span>
              <span>{order.shippingPrice === 0 ? 'Miễn phí' : formatPrice(order.shippingPrice)}</span>
            </div>
            <div className={`${styles.total} ${styles.grand}`}>
              <span>Tổng cộng</span>
              <strong>{formatPrice(order.totalPrice)}</strong>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to="/shop" className={styles.btnPrimary}>Tiếp tục mua sắm</Link>
          <Link to="/" className={styles.btnSecondary}>Về trang chủ</Link>
        </div>

      </div>
    </main>
  );
}
