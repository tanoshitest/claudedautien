import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { useOrders } from '../../context/OrderContext';
import styles from './Dashboard.module.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const STATUS_LABEL = {
  pending:   { label: 'Chờ xác nhận', color: '#f59e0b' },
  confirmed: { label: 'Đã xác nhận',  color: '#3b82f6' },
  shipping:  { label: 'Đang giao',    color: '#8b5cf6' },
  delivered: { label: 'Đã giao',      color: '#10b981' },
  cancelled: { label: 'Đã huỷ',       color: '#ef4444' },
};

export default function Dashboard() {
  const { orders } = useOrders();

  const totalRevenue = useMemo(
    () => orders.filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.totalPrice, 0),
    [orders]
  );

  const stats = [
    { label: 'Tổng đơn hàng',   value: orders.length,                                       icon: '📦', color: '#3b82f6' },
    { label: 'Doanh thu',        value: formatPrice(totalRevenue),                            icon: '💰', color: '#10b981' },
    { label: 'Sản phẩm',         value: products.length,                                      icon: '🛍️', color: '#8b5cf6' },
    { label: 'Đơn chờ xử lý',   value: orders.filter(o => o.status === 'pending').length,    icon: '⏳', color: '#f59e0b' },
  ];

  const recent = orders.slice(0, 5);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Tổng quan</h1>
        <p>Chào mừng trở lại! Đây là tình trạng hôm nay.</p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: s.color + '20', color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className={styles.statLabel}>{s.label}</p>
              <strong className={styles.statValue}>{s.value}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Đơn hàng gần đây</h2>
          <Link to="/admin/orders">Xem tất cả →</Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((order) => {
                const st = STATUS_LABEL[order.status];
                return (
                  <tr key={order._id}>
                    <td className={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <strong>{order.shippingAddress.name}</strong>
                      <p>{order.shippingAddress.phone}</p>
                    </td>
                    <td>{order.items.length} sản phẩm</td>
                    <td className={styles.price}>{formatPrice(order.totalPrice)}</td>
                    <td>
                      <span className={styles.badge} style={{ background: st.color + '20', color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Sản phẩm bán chạy</h2>
          <Link to="/admin/products">Quản lý →</Link>
        </div>
        <div className={styles.productList}>
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className={styles.productRow}>
              <img src={p.image} alt={p.name} />
              <div className={styles.productInfo}>
                <strong>{p.name}</strong>
                <p>{p.category}</p>
              </div>
              <div className={styles.productMeta}>
                <span>⭐ {p.rating}</span>
                <strong>{formatPrice(p.price)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
