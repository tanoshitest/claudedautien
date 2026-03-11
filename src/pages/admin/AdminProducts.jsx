import { useState } from 'react';
import { useProducts, CATEGORIES } from '../../context/ProductContext';
import styles from './AdminProducts.module.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const PRODUCT_CATEGORIES = CATEGORIES.filter((c) => c !== 'Tất cả');

const EMPTY_FORM = {
  name: '', category: 'Stationery', price: '', originalPrice: '',
  image: '', tag: '', description: '', stock: 100,
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [search,   setSearch]   = useState('');
  const [errors,   setErrors]   = useState({});
  const [saving,   setSaving]   = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || '',
      image: p.image || '',
      tag: p.tag || '',
      description: p.description || '',
      stock: p.stock ?? 100,
    });
    setEditId(p.id);
    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập tên sản phẩm';
    if (!form.price || +form.price <= 0) e.price = 'Vui lòng nhập giá hợp lệ';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSaving(true);
    try {
      if (editId) {
        await updateProduct(editId, form);
      } else {
        await addProduct(form);
      }
      setShowForm(false);
    } catch (err) {
      console.error('Lỗi lưu sản phẩm:', err);
      alert('Lỗi: ' + (err?.message || JSON.stringify(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa sản phẩm này?')) {
      deleteProduct(id);
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
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#999' }}>Không tìm thấy sản phẩm nào</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className={styles.productCell}>
                    {p.image
                      ? <img src={p.image} alt={p.name} onError={(e) => { e.target.style.display='none'; }} />
                      : <div className={styles.noImg}>🖼️</div>
                    }
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
              <h3>{editId ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h3>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.full}`}>
                <label>Tên sản phẩm *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="VD: Matcha Latte Kit" />
                {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
              </div>

              <div className={styles.field}>
                <label>Danh mục</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Tag</label>
                <select name="tag" value={form.tag || ''} onChange={handleChange}>
                  <option value="">-- Không có --</option>
                  {['Bán chạy', 'Mới', 'Giảm giá', 'Yêu thích'].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Giá bán (VNĐ) *</label>
                <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="185000" />
                {errors.price && <span className={styles.errMsg}>{errors.price}</span>}
              </div>

              <div className={styles.field}>
                <label>Giá gốc (nếu giảm giá)</label>
                <input name="originalPrice" type="number" min="0" value={form.originalPrice} onChange={handleChange} placeholder="220000" />
              </div>

              <div className={styles.field}>
                <label>Tồn kho</label>
                <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label>URL ảnh sản phẩm</label>
                <input name="image" value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
                {form.image && (
                  <img
                    src={form.image}
                    alt="preview"
                    className={styles.imgPreview}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label>Mô tả sản phẩm</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Mô tả ngắn về sản phẩm..." />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelModalBtn} onClick={() => setShowForm(false)}>Hủy</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? '⏳ Đang lưu...' : editId ? '💾 Lưu thay đổi' : '✅ Thêm sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
