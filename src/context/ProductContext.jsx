import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { products as initialProducts } from '../data/products';

const ProductContext = createContext(null);

export const CATEGORIES = ['Tất cả', 'Drinks', 'Stationery', 'Accessories', 'Home', 'Kitchen'];

// Map từ DB (snake_case) → app (camelCase)
const fromDB = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  price: Number(row.price),
  originalPrice: row.original_price ? Number(row.original_price) : null,
  image: row.image || '',
  tag: row.tag || '',
  description: row.description || '',
  stock: row.stock ?? 100,
  rating: Number(row.rating) || 0,
  reviews: row.reviews || 0,
});

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data.length === 0) {
        await seedProducts(); // lần đầu: tự động thêm 8 sản phẩm mẫu
      } else {
        setProducts(data.map(fromDB));
      }
    } catch {
      // Fallback về localStorage nếu Supabase chưa cấu hình
      const saved = localStorage.getItem('tanoshi_products');
      setProducts(saved ? JSON.parse(saved) : initialProducts);
    } finally {
      setLoading(false);
    }
  };

  // Seed 8 sản phẩm mặc định vào Supabase lần đầu
  const seedProducts = async () => {
    const { data } = await supabase
      .from('products')
      .insert(
        initialProducts.map((p) => ({
          name: p.name,
          category: p.category,
          price: p.price,
          original_price: p.originalPrice || null,
          image: p.image,
          tag: p.tag || '',
          description: p.description || '',
          stock: 100,
          rating: p.rating,
          reviews: p.reviews,
        }))
      )
      .select();

    if (data) setProducts(data.map(fromDB));
  };

  const addProduct = async (formData) => {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: formData.name.trim(),
        category: formData.category,
        price: +formData.price,
        original_price: formData.originalPrice ? +formData.originalPrice : null,
        image: formData.image.trim(),
        tag: formData.tag || '',
        description: formData.description.trim(),
        stock: +formData.stock || 100,
        rating: 0,
        reviews: 0,
      })
      .select()
      .single();

    if (!error && data) {
      setProducts((prev) => [fromDB(data), ...prev]);
    }
    return data;
  };

  const updateProduct = async (id, formData) => {
    const { error } = await supabase
      .from('products')
      .update({
        name: formData.name.trim(),
        category: formData.category,
        price: +formData.price,
        original_price: formData.originalPrice ? +formData.originalPrice : null,
        image: formData.image.trim(),
        tag: formData.tag || '',
        description: formData.description.trim(),
        stock: +formData.stock || 100,
      })
      .eq('id', id);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                name: formData.name.trim(),
                category: formData.category,
                price: +formData.price,
                originalPrice: formData.originalPrice ? +formData.originalPrice : null,
                image: formData.image.trim(),
                tag: formData.tag || '',
                description: formData.description.trim(),
                stock: +formData.stock || 100,
              }
            : p
        )
      );
    }
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
