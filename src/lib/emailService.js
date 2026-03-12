import { supabase } from './supabase';

/**
 * Gửi email thông báo đơn hàng mới (cho cả khách và admin)
 */
export async function sendNewOrderEmail(order) {
  try {
    const { error } = await supabase.functions.invoke('send-order-email', {
      body: { type: 'new_order', order },
    });
    if (error) console.warn('Email warning:', error.message);
  } catch (err) {
    // Email lỗi không nên block đơn hàng → chỉ log
    console.warn('Không gửi được email:', err.message);
  }
}

/**
 * Gửi email thông báo cập nhật trạng thái đơn hàng (cho khách)
 */
export async function sendStatusUpdateEmail(order) {
  try {
    const { error } = await supabase.functions.invoke('send-order-email', {
      body: { type: 'status_update', order },
    });
    if (error) console.warn('Email warning:', error.message);
  } catch (err) {
    console.warn('Không gửi được email:', err.message);
  }
}
