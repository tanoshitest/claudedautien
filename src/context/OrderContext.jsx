import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_ORDERS } from '../pages/admin/mockData';

const OrderContext = createContext(null);

// Tạo mã đơn hàng ngắn dễ đọc
const genId = () => 'ord' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    // Khởi tạo từ localStorage (đơn hàng của khách) + mock data (demo)
    try {
      const saved = localStorage.getItem('tanoshi_orders');
      const customerOrders = saved ? JSON.parse(saved) : [];
      // Ghép demo orders + customer orders, mới nhất trước
      return [...customerOrders, ...MOCK_ORDERS];
    } catch {
      return [...MOCK_ORDERS];
    }
  });

  // Lưu các đơn hàng của khách (không phải mock) vào localStorage
  const saveCustomerOrders = (allOrders) => {
    const customerOrders = allOrders.filter((o) => o._source === 'customer');
    localStorage.setItem('tanoshi_orders', JSON.stringify(customerOrders));
  };

  // Đặt đơn hàng mới (gọi từ trang Checkout)
  const placeOrder = (orderData) => {
    const newOrder = {
      _id: genId(),
      _source: 'customer', // đánh dấu đây là đơn khách thật
      ...orderData,
      status: 'pending',
      isPaid: false,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      saveCustomerOrders(updated);
      return updated;
    });
    return newOrder;
  };

  // Admin cập nhật trạng thái đơn hàng
  const updateOrderStatus = (id, newStatus) => {
    setOrders((prev) => {
      const updated = prev.map((o) => o._id === id ? { ...o, status: newStatus } : o);
      saveCustomerOrders(updated);
      return updated;
    });
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
