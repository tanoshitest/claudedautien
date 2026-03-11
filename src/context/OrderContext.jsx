import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const OrderContext = createContext(null);

// Map từ DB → app
const fromDB = (row) => ({
  _id: row.id,
  status: row.status,
  shippingAddress: row.shipping_address,
  items: row.items,
  totalPrice: Number(row.total_price),
  shippingPrice: Number(row.shipping_price) || 0,
  paymentMethod: row.payment_method,
  note: row.note || '',
  createdAt: row.created_at,
});

export function OrderProvider({ children }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();

    // Realtime: tự động cập nhật khi có đơn hàng mới
    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, loadOrders)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data ? data.map(fromDB) : []);
    } catch {
      // Fallback về localStorage
      const saved = localStorage.getItem('tanoshi_orders');
      setOrders(saved ? JSON.parse(saved) : []);
    } finally {
      setLoading(false);
    }
  };

  // Khách đặt hàng
  const placeOrder = async (orderData) => {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        status: 'pending',
        shipping_address: orderData.shippingAddress,
        items: orderData.items,
        total_price: orderData.totalPrice,
        shipping_price: orderData.shippingPrice,
        payment_method: orderData.paymentMethod,
        note: orderData.note || '',
      })
      .select()
      .single();

    if (error) throw error;

    const newOrder = fromDB(data);
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Admin cập nhật trạng thái
  const updateOrderStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
      );
    }
  };

  return (
    <OrderContext.Provider value={{ orders, loading, placeOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
