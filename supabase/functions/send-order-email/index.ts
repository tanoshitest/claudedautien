import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const ADMIN_EMAIL    = Deno.env.get("ADMIN_EMAIL") || "moringuyenvietnam@gmail.com";
const FROM_EMAIL     = Deno.env.get("FROM_EMAIL")  || "TanoshiStore <onboarding@resend.dev>";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (p: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

const STATUS_LABEL: Record<string, string> = {
  pending:   "⏳ Chờ xác nhận",
  confirmed: "✅ Đã xác nhận",
  shipping:  "🚚 Đang giao hàng",
  delivered: "🎉 Đã giao thành công",
  cancelled: "❌ Đã huỷ đơn",
};

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method:  "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body:    JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  return res.json();
}

function itemsRows(items: any[]) {
  return items.map((item) => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;">${item.name}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:center;">x${item.qty}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;white-space:nowrap;">${fmt(item.price * item.qty)}</td>
    </tr>`).join("");
}

// ─── Email templates ─────────────────────────────────────────────────────────

function customerConfirmHtml(order: any) {
  const addr = order.shippingAddress;
  const orderId = (order._id || order.id || "").slice(-6).toUpperCase();
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#ff6b6b,#ff8e53);padding:28px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:26px;">🌸 TanoshiStore</h1>
    <p style="color:rgba(255,255,255,.9);margin:6px 0 0;">Cảm ơn bạn đã đặt hàng!</p>
  </div>

  <div style="padding:28px;">
    <!-- Status banner -->
    <div style="background:#f0fdf4;border-left:4px solid #10b981;border-radius:6px;padding:14px 16px;margin-bottom:24px;">
      <p style="margin:0;color:#065f46;font-weight:bold;font-size:16px;">✅ Đơn hàng #${orderId} đã được xác nhận!</p>
      <p style="margin:4px 0 0;color:#047857;font-size:14px;">Chúng tôi sẽ xử lý và liên hệ với bạn sớm nhất.</p>
    </div>

    <!-- Shipping address -->
    <h3 style="color:#333;margin:0 0 12px;font-size:15px;border-bottom:2px solid #ff6b6b;padding-bottom:6px;">📍 Địa chỉ giao hàng</h3>
    <p style="margin:4px 0;font-weight:bold;">${addr.name}</p>
    <p style="margin:4px 0;color:#666;">📞 ${addr.phone}</p>
    <p style="margin:4px 0;color:#666;">🏠 ${addr.street}, ${addr.city}</p>

    <!-- Items -->
    <h3 style="color:#333;margin:20px 0 12px;font-size:15px;border-bottom:2px solid #ff6b6b;padding-bottom:6px;">🛍️ Sản phẩm đặt hàng</h3>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#f8f8f8;">
          <th style="padding:8px;text-align:left;color:#888;font-size:13px;font-weight:normal;">Sản phẩm</th>
          <th style="padding:8px;text-align:center;color:#888;font-size:13px;font-weight:normal;">SL</th>
          <th style="padding:8px;text-align:right;color:#888;font-size:13px;font-weight:normal;">Thành tiền</th>
        </tr>
      </thead>
      <tbody>${itemsRows(order.items)}</tbody>
    </table>

    <!-- Price -->
    <div style="background:#fff8f0;border-radius:8px;padding:16px;margin-top:16px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;color:#666;font-size:14px;">
        <span>Tiền hàng:</span><span>${fmt(order.itemsPrice ?? order.totalPrice)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;color:#666;font-size:14px;">
        <span>Phí giao hàng:</span>
        <span>${order.shippingPrice === 0 ? "🎉 Miễn phí" : fmt(order.shippingPrice)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:bold;color:#ff6b6b;border-top:2px solid #eee;padding-top:10px;margin-top:6px;">
        <span>Tổng cộng:</span><span>${fmt(order.totalPrice)}</span>
      </div>
      <p style="margin:8px 0 0;color:#888;font-size:13px;">
        Thanh toán: ${order.paymentMethod === "cod" ? "💵 Thanh toán khi nhận hàng (COD)" : "🏦 Chuyển khoản ngân hàng"}
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:28px;padding-top:20px;border-top:1px solid #eee;">
      <p style="color:#888;font-size:13px;margin:0;">Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.</p>
      <p style="color:#ff6b6b;font-weight:bold;margin:8px 0 0;">🌸 TanoshiStore — Tận tâm từng đơn hàng</p>
    </div>
  </div>
</div>
</body></html>`;
}

function adminNewOrderHtml(order: any) {
  const addr = order.shippingAddress;
  const orderId = (order._id || order.id || "").slice(-6).toUpperCase();
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);">

  <div style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);padding:28px;">
    <h1 style="color:#fff;margin:0;font-size:22px;">🛍️ Đơn hàng mới #${orderId}</h1>
    <p style="color:rgba(255,255,255,.85);margin:6px 0 0;">Vừa có khách đặt hàng trên TanoshiStore!</p>
  </div>

  <div style="padding:28px;">
    <h3 style="color:#333;margin:0 0 12px;font-size:15px;">👤 Thông tin khách hàng</h3>
    <p style="margin:4px 0;font-weight:bold;">${addr.name}</p>
    <p style="margin:4px 0;color:#666;">📞 ${addr.phone}</p>
    ${addr.email ? `<p style="margin:4px 0;color:#666;">📧 ${addr.email}</p>` : ""}
    <p style="margin:4px 0;color:#666;">🏠 ${addr.street}, ${addr.city}</p>

    <h3 style="color:#333;margin:20px 0 12px;font-size:15px;">🛍️ Sản phẩm (${order.items.length})</h3>
    <table style="width:100%;border-collapse:collapse;">
      <tbody>${itemsRows(order.items)}</tbody>
    </table>

    <div style="background:#fff8f0;border-radius:8px;padding:16px;margin-top:16px;text-align:right;">
      <p style="font-size:20px;font-weight:bold;color:#ff6b6b;margin:0;">Tổng: ${fmt(order.totalPrice)}</p>
      <p style="color:#888;font-size:13px;margin:4px 0 0;">
        ${order.paymentMethod === "cod" ? "💵 COD" : "🏦 Chuyển khoản"}
      </p>
    </div>

    <div style="text-align:center;margin-top:24px;">
      <a href="https://claudedautien.vercel.app/admin/orders"
         style="background:#3b82f6;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;font-size:15px;">
        👉 Xem đơn hàng trong Admin
      </a>
    </div>
  </div>
</div>
</body></html>`;
}

function statusUpdateHtml(order: any) {
  const addr    = order.shippingAddress;
  const orderId = (order._id || order.id || "").slice(-6).toUpperCase();
  const statusInfo = STATUS_LABEL[order.status] || order.status;
  const emoji  = statusInfo.split(" ")[0];
  const label  = statusInfo.slice(2);

  const extraNote =
    order.status === "shipping"
      ? `<div style="background:#eff6ff;border-radius:8px;padding:14px;margin-top:16px;">
           <p style="margin:0;color:#1e40af;">🚚 Đơn hàng đang trên đường đến bạn! Dự kiến giao trong 1-3 ngày.</p>
         </div>`
      : order.status === "delivered"
      ? `<div style="background:#f0fdf4;border-radius:8px;padding:14px;margin-top:16px;">
           <p style="margin:0;color:#065f46;">🎉 Cảm ơn bạn đã mua hàng tại TanoshiStore! Chúc bạn hài lòng với sản phẩm. ⭐</p>
         </div>`
      : order.status === "cancelled"
      ? `<div style="background:#fef2f2;border-radius:8px;padding:14px;margin-top:16px;">
           <p style="margin:0;color:#991b1b;">Đơn hàng của bạn đã bị huỷ. Nếu có thắc mắc, vui lòng liên hệ chúng tôi.</p>
         </div>`
      : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);">

  <div style="background:linear-gradient(135deg,#ff6b6b,#ff8e53);padding:28px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:26px;">🌸 TanoshiStore</h1>
  </div>

  <div style="padding:28px;">
    <div style="text-align:center;background:#f8f8f8;border-radius:10px;padding:24px;margin-bottom:20px;">
      <div style="font-size:48px;margin-bottom:8px;">${emoji}</div>
      <p style="font-size:22px;font-weight:bold;color:#333;margin:0;">${label}</p>
      <p style="color:#888;margin:6px 0 0;font-size:14px;">Đơn hàng #${orderId}</p>
    </div>

    <p style="color:#333;">Xin chào <strong>${addr.name}</strong>,</p>
    <p style="color:#555;">Đơn hàng của bạn đã được cập nhật trạng thái: <strong>${statusInfo}</strong></p>

    ${extraNote}

    <div style="text-align:center;margin-top:28px;padding-top:20px;border-top:1px solid #eee;">
      <p style="color:#ff6b6b;font-weight:bold;margin:0;">🌸 TanoshiStore — Cảm ơn bạn đã tin tưởng!</p>
    </div>
  </div>
</div>
</body></html>`;
}

// ─── Main handler ────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const { type, order } = await req.json();
    const results: any[] = [];

    if (type === "new_order") {
      // Gửi cho khách
      if (order.shippingAddress?.email) {
        const orderId = (order._id || order.id || "").slice(-6).toUpperCase();
        const r = await sendEmail(
          order.shippingAddress.email,
          `✅ TanoshiStore - Xác nhận đơn hàng #${orderId}`,
          customerConfirmHtml(order)
        );
        results.push({ customer: r });
      }
      // Gửi cho admin
      const orderId = (order._id || order.id || "").slice(-6).toUpperCase();
      const r = await sendEmail(
        ADMIN_EMAIL,
        `🛍️ Đơn hàng mới #${orderId} - TanoshiStore`,
        adminNewOrderHtml(order)
      );
      results.push({ admin: r });

    } else if (type === "status_update") {
      if (order.shippingAddress?.email) {
        const orderId = (order._id || order.id || "").slice(-6).toUpperCase();
        const r = await sendEmail(
          order.shippingAddress.email,
          `📦 TanoshiStore - Cập nhật đơn hàng #${orderId}`,
          statusUpdateHtml(order)
        );
        results.push({ status: r });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { "Content-Type": "application/json", ...CORS },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS },
    });
  }
});
