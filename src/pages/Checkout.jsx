import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import styles from './Checkout.module.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const PAYMENT_METHODS = [
  { id: 'cod',      label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
  { id: 'transfer', label: 'Chuyển khoản ngân hàng',         icon: '🏦' },
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', phone: '', street: '', city: '', note: '',
  });
  const [payment, setPayment]   = useState('cod');
  const [loading, setLoading]   = useState(false);
  const [errors,  setErrors]    = useState({});

  const shippingPrice = totalPrice >= 300000 ? 0 : 30000;
  const total         = totalPrice + shippingPrice;

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Giỏ hàng trống. <Link to="/shop">Mua sắm ngay →</Link></p>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name   = 'Vui lòng nhập họ tên';
    if (!form.phone.trim())  e.phone  = 'Vui lòng nhập số điện thoại';
    if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Số điện thoại không hợp lệ';
    if (!form.street.trim()) e.street = 'Vui lòng nhập địa chỉ';
    if (!form.city.trim())   e.city   = 'Vui lòng nhập thành phố';
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    // Giả lập delay xử lý
    await new Promise((r) => setTimeout(r, 800));

    const order = placeOrder({
      items: items.map((i) => ({
        product: i.id,
        name: i.name,
        image: i.image,
        price: i.price,
        qty: i.qty,
      })),
      shippingAddress: {
        name:   form.name.trim(),
        phone:  form.phone.trim(),
        street: form.street.trim(),
        city:   form.city.trim(),
      },
      note:          form.note.trim(),
      paymentMethod: payment,
      itemsPrice:    totalPrice,
      shippingPrice,
      totalPrice:    total,
    });

    clearCart();
    navigate(`/order-success/${order._id}`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Thanh toán</h1>

        <form onSubmit={handleSubmit} className={styles.layout}>
          {/* LEFT — Form */}
          <div className={styles.left}>

            {/* Địa chỉ giao hàng */}
            <section className={styles.card}>
              <h2>📍 Địa chỉ giao hàng</h2>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label>Họ và tên *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Nguyễn Văn A" />
                  {errors.name && <span className={styles.err}>{errors.name}</span>}
                </div>
                <div className={styles.field}>
                  <label>Số điện thoại *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="0901 234 567" />
                  {errors.phone && <span className={styles.err}>{errors.phone}</span>}
                </div>
              </div>
              <div className={styles.field}>
                <label>Địa chỉ (số nhà, tên đường) *</label>
                <input name="street" value={form.street} onChange={handleChange} placeholder="12 Lê Lợi, P. Bến Nghé" />
                {errors.street && <span className={styles.err}>{errors.street}</span>}
              </div>
              <div className={styles.field}>
                <label>Tỉnh / Thành phố *</label>
                <select name="city" value={form.city} onChange={handleChange}>
                  <option value="">-- Chọn tỉnh thành --</option>
                  {['TP. Hồ Chí Minh','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Bình Dương','Đồng Nai','Huế','Nha Trang','Vũng Tàu'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {errors.city && <span className={styles.err}>{errors.city}</span>}
              </div>
              <div className={styles.field}>
                <label>Ghi chú (tuỳ chọn)</label>
                <textarea name="note" value={form.note} onChange={handleChange} rows={2} placeholder="Giao giờ hành chính, gọi trước khi giao..." />
              </div>
            </section>

            {/* Phương thức thanh toán */}
            <section className={styles.card}>
              <h2>💳 Phương thức thanh toán</h2>
              <div className={styles.paymentList}>
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`${styles.paymentOption} ${payment === m.id ? styles.selected : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={payment === m.id}
                      onChange={() => setPayment(m.id)}
                    />
                    <span className={styles.payIcon}>{m.icon}</span>
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
              {payment === 'transfer' && (
                <div className={styles.bankInfo}>
                  <p>🏦 <strong>MB Bank</strong> — 0123456789</p>
                  <p>Chủ TK: <strong>TANOSHI STORE</strong></p>
                  <p>Nội dung: <strong>Tên + SĐT</strong> của bạn</p>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT — Order summary */}
          <div className={styles.right}>
            <section className={styles.card}>
              <h2>🛍️ Đơn hàng ({items.length} sản phẩm)</h2>

              <div className={styles.itemList}>
                {items.map((item) => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.itemImg}>
                      <img src={item.image} alt={item.name} />
                      <span className={styles.qty}>{item.qty}</span>
                    </div>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemPrice}>{formatPrice(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>

              <div className={styles.divider} />

              <div className={styles.summaryRow}>
                <span>Tạm tính</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Phí vận chuyển</span>
                <span>{shippingPrice === 0 ? '🎉 Miễn phí' : formatPrice(shippingPrice)}</span>
              </div>

              <div className={styles.divider} />

              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Tổng cộng</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? '⏳ Đang xử lý...' : '✅ Xác nhận đặt hàng'}
              </button>

              <Link to="/cart" className={styles.backLink}>← Quay lại giỏ hàng</Link>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}
