import { createContext, useContext, useState } from 'react';
import { products as initialProducts } from '../data/products';

const ProductContext = createContext(null);
const PRODUCTS_KEY = 'tanoshi_products';

export const CATEGORIES = ['Tất cả', 'Drinks', 'Stationery', 'Accessories', 'Home', 'Kitchen'];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch { return initialProducts; }
  });

  const save = (updated) => {
    setProducts(updated);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  };

  const addProduct = (formData) => {
    const newProduct = {
      ...formData,
      id: Date.now(),
      price: +formData.price,
      originalPrice: formData.originalPrice ? +formData.originalPrice : null,
      stock: +formData.stock || 100,
      rating: 0,
      reviews: 0,
    };
    save([newProduct, ...products]);
    return newProduct;
  };

  const updateProduct = (id, formData) => {
    save(
      products.map((p) =>
        p.id === id
          ? {
              ...p,
              ...formData,
              price: +formData.price,
              originalPrice: formData.originalPrice ? +formData.originalPrice : null,
              stock: +formData.stock || 100,
            }
          : p
      )
    );
  };

  const deleteProduct = (id) => {
    save(products.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
