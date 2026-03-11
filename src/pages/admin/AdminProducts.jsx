import { useState } from 'react';
import { products as initialProducts } from '../../data/products';
import styles from './AdminProducts.module.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const EMPTY_FORM = {
  name: '', category: 'Stationery', price: '', originalPrice: '',
  image: '', tag: '', description: '', stock: 100,
};

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [search,   setSearch]   = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({ ...p, price: p.price, originalPrice: p.originalPrice || '', stock: p.stock ?? 100 });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editId) {
      setProducts((prev) =>
        prev.map((p) => p.id === editId ? { ...p, ...form, price: +form.price, originalPrice: form.originalPrice ? +form.originalPrice : null } : p)
      );
    } else {
      const newProduct = {
        ...form, id: Date.now(),
        price: +form.price,
        originalPrice: form.originalPrice ? +form.originalPrice : null,
        rating: 0, reviews: 0,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa sản phẩm này?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Quản lý sản phẩm</h1>
          <p>{products.length} sản phẩm</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}>+ Thêm sản phẩm</button>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="🔍  Tìm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Đánh giá</th>
              <th>Tag</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className={styles.productCell}>
                    <img src={p.image} alt={p.name} />
                    <span>{p.name}</span>
                  </div>
                </td>
                <td><span className={styles.cat}>{p.category}</span></td>
                <td>
                  <strong className={styles.price}>{formatPrice(p.price)}</strong>
                  {p.originalPrice && <p className={styles.orig}>{formatPrice(p.originalPrice)}</p>}
                </td>
                <td>⭐ {p.rating} <span className={styles.reviews}>({p.reviews})</span></td>
                <td>
                  {p.tag && <span className={styles.tag}>{p.tag}</span>}
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEdit(p)}>✏️ Sửa</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <div className={styles.overlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Tên sản phẩm *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Tên sản phẩm" />
              </div>
              <div className={styles.field}>
                <label>Danh mục</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {['Drinks','Stationery','Accessories','Home','Kitchen'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Giá bán *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="185000" />
              </div>
              <div className={styles.field}>
                <label>Giá gốc (nếu có)</label>
                <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} placeholder="220000" />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <label>URL ảnh</label>
                <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className={styles.field}>
                <label>Tag</label>
                <select name="tag" value={form.tag || ''} onChange={handleChange}>
                  <option value="">-- Không có --</option>
                  {['Bán chạy','Mới','Giảm giá','Yêu thích'].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Tồn kho</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <label>Mô tả</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Mô tả sản phẩm..." />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelModalBtn} onClick={() => setShowForm(false)}>Hủy</button>
              <button className={styles.saveBtn} onClick={handleSave}>
                {editId ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
