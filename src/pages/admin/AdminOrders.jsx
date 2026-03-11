import { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import styles from './AdminOrders.module.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const ALL_STATUSES = ['all', 'pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

const STATUS_LABEL = {
  pending:   { label: 'Chờ xác nhận', color: '#f59e0b' },
  confirmed: { label: 'Đã xác nhận',  color: '#3b82f6' },
  shipping:  { label: 'Đang giao',    color: '#8b5cf6' },
  delivered: { label: 'Đã giao',      color: '#10b981' },
  cancelled: { label: 'Đã huỷ',       color: '#ef4444' },
};

const NEXT_STATUS = {
  pending:   'confirmed',
  confirmed: 'shipping',
  shipping:  'delivered',
};

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const [filter, setFilter]   = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = (id, newStatus) => {
    updateOrderStatus(id, newStatus);
    if (selected?._id === id) {
      setSelected((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Quản lý đơn hàng</h1>
        <p>{orders.length} đơn hàng tổng cộng</p>
      </div>

      {/* Filter tabs */}
      <div className={styles.filters}>
        {ALL_STATUSES.map((s) => {
          const count = s === 'all' ? orders.length : orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              className={`${styles.filterBtn} ${filter === s ? styles.active : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'Tất cả' : STATUS_LABEL[s].label}
              <span className={styles.count}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.content}>
        {/* Orders table */}
        <div className={`${styles.tableWrap} ${selected ? styles.split : ''}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const st = STATUS_LABEL[order.status];
                return (
                  <tr
                    key={order._id}
                    className={selected?._id === order._id ? styles.selectedRow : ''}
                    onClick={() => setSelected(selected?._id === order._id ? null : order)}
                  >
                    <td className={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <strong>{order.shippingAddress.name}</strong>
                      <p>{order.shippingAddress.phone}</p>
                    </td>
                    <td>{order.items.length} sp</td>
                    <td className={styles.price}>{formatPrice(order.totalPrice)}</td>
                    <td>
                      <span className={order.isPaid ? styles.paid : styles.unpaid}>
                        {order.isPaid ? '✓ Đã TT' : '✗ Chưa TT'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.badge} style={{ background: st.color + '20', color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td className={styles.date}>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {NEXT_STATUS[order.status] && (
                        <button
                          className={styles.nextBtn}
                          onClick={() => updateStatus(order._id, NEXT_STATUS[order.status])}
                        >
                          → {STATUS_LABEL[NEXT_STATUS[order.status]].label}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.empty}>Không có đơn hàng nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Order detail panel */}
        {selected && (
          <div className={styles.detail}>
            <div className={styles.detailHeader}>
              <h3>Chi tiết đơn #{selected._id.slice(-6).toUpperCase()}</h3>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            {/* Status stepper */}
            <div className={styles.stepper}>
              {['pending', 'confirmed', 'shipping', 'delivered'].map((s, i, arr) => {
                const statuses  = ['pending', 'confirmed', 'shipping', 'delivered'];
                const curIdx    = statuses.indexOf(selected.status);
                const done      = statuses.indexOf(s) <= curIdx && selected.status !== 'cancelled';
                return (
                  <div key={s} className={`${styles.step} ${done ? styles.done : ''}`}>
                    <div className={styles.stepDot}>{done ? '✓' : i + 1}</div>
                    <p>{STATUS_LABEL[s].label}</p>
                    {i < arr.length - 1 && <div className={`${styles.stepLine} ${done && statuses.indexOf(arr[i+1]) <= curIdx ? styles.done : ''}`} />}
                  </div>
                );
              })}
            </div>

            {/* Shipping info */}
            <div className={styles.detailSection}>
              <h4>📍 Địa chỉ giao hàng</h4>
              <p><strong>{selected.shippingAddress.name}</strong></p>
              <p>{selected.shippingAddress.phone}</p>
              <p>{selected.shippingAddress.street}, {selected.shippingAddress.city}</p>
            </div>

            {/* Items */}
            <div className={styles.detailSection}>
              <h4>🛍️ Sản phẩm ({selected.items.length})</h4>
              {selected.items.map((item, i) => (
                <div key={i} className={styles.itemRow}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <p>x{item.qty} — {formatPrice(item.price)}</p>
                  </div>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            {/* Price summary */}
            <div className={styles.detailSection}>
              <h4>💵 Thanh toán</h4>
              <div className={styles.priceRow}><span>Tiền hàng</span><span>{formatPrice(selected.itemsPrice)}</span></div>
              <div className={styles.priceRow}><span>Phí ship</span><span>{selected.shippingPrice === 0 ? 'Miễn phí' : formatPrice(selected.shippingPrice)}</span></div>
              <div className={`${styles.priceRow} ${styles.total}`}><span>Tổng cộng</span><span>{formatPrice(selected.totalPrice)}</span></div>
              <div className={styles.priceRow}>
                <span>Trạng thái TT</span>
                <span className={selected.isPaid ? styles.paid : styles.unpaid}>
                  {selected.isPaid ? '✓ Đã thanh toán' : '✗ Chưa thanh toán'}
                </span>
              </div>
            </div>

            {/* Actions */}
            {NEXT_STATUS[selected.status] && (
              <button
                className={styles.actionBtn}
                onClick={() => updateStatus(selected._id, NEXT_STATUS[selected.status])}
              >
                Chuyển sang: {STATUS_LABEL[NEXT_STATUS[selected.status]].label} →
              </button>
            )}
            {selected.status === 'pending' && (
              <button
                className={styles.cancelBtn}
                onClick={() => updateStatus(selected._id, 'cancelled')}
              >
                Huỷ đơn hàng
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
