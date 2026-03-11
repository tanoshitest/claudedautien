import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, CATEGORIES } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import styles from './Shop.module.css';

const sortOptions = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
];

export default function Shop() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [sort, setSort] = useState('default');

  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const filtered = products
    .filter((p) => {
      const matchCat = activeCategory === 'Tất cả' || p.category === activeCategory;
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat !== 'Tất cả') newParams.set('category', cat);
    else newParams.delete('category');
    newParams.delete('search');
    setSearchParams(newParams);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Cửa hàng</h1>
          {searchQuery && (
            <p className={styles.searchInfo}>
              Kết quả tìm kiếm cho "<strong>{searchQuery}</strong>" — {filtered.length} sản phẩm
            </p>
          )}
        </div>

        <div className={styles.toolbar}>
          <div className={styles.categories}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.catBtn} ${activeCategory === cat ? styles.active : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.sortWrap}>
            <label>Sắp xếp:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>😢 Không tìm thấy sản phẩm nào.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
