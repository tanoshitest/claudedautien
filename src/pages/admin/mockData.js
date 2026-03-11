// Dữ liệu đơn hàng giả để demo giao diện admin
// (Khi kết nối backend thật, thay bằng gọi API)

import { products } from '../../data/products';

export const MOCK_ORDERS = [
  {
    _id: 'ord001abc123',
    items: [
      { product: products[0], name: products[0].name, image: products[0].image, price: products[0].price, qty: 2 },
      { product: products[3], name: products[3].name, image: products[3].image, price: products[3].price, qty: 1 },
    ],
    shippingAddress: { name: 'Nguyễn Thị Lan', phone: '0901 234 567', street: '12 Lê Lợi', city: 'TP. HCM' },
    itemsPrice: 435000, shippingPrice: 0, totalPrice: 435000,
    status: 'delivered',
    isPaid: true,
    createdAt: '2024-03-01T08:30:00Z',
  },
  {
    _id: 'ord002def456',
    items: [
      { product: products[1], name: products[1].name, image: products[1].image, price: products[1].price, qty: 1 },
    ],
    shippingAddress: { name: 'Trần Minh Khoa', phone: '0912 345 678', street: '88 Trần Hưng Đạo', city: 'Hà Nội' },
    itemsPrice: 125000, shippingPrice: 30000, totalPrice: 155000,
    status: 'shipping',
    isPaid: true,
    createdAt: '2024-03-05T14:20:00Z',
  },
  {
    _id: 'ord003ghi789',
    items: [
      { product: products[4], name: products[4].name, image: products[4].image, price: products[4].price, qty: 1 },
      { product: products[6], name: products[6].name, image: products[6].image, price: products[6].price, qty: 2 },
    ],
    shippingAddress: { name: 'Phạm Thu Hà', phone: '0933 456 789', street: '5 Nguyễn Huệ', city: 'Đà Nẵng' },
    itemsPrice: 355000, shippingPrice: 0, totalPrice: 355000,
    status: 'confirmed',
    isPaid: false,
    createdAt: '2024-03-08T10:10:00Z',
  },
  {
    _id: 'ord004jkl012',
    items: [
      { product: products[7], name: products[7].name, image: products[7].image, price: products[7].price, qty: 3 },
    ],
    shippingAddress: { name: 'Lê Văn Bình', phone: '0945 567 890', street: '22 Pasteur', city: 'TP. HCM' },
    itemsPrice: 465000, shippingPrice: 0, totalPrice: 465000,
    status: 'pending',
    isPaid: false,
    createdAt: '2024-03-10T09:00:00Z',
  },
  {
    _id: 'ord005mno345',
    items: [
      { product: products[2], name: products[2].name, image: products[2].image, price: products[2].price, qty: 1 },
      { product: products[5], name: products[5].name, image: products[5].image, price: products[5].price, qty: 1 },
    ],
    shippingAddress: { name: 'Hoàng Anh Tú', phone: '0956 678 901', street: '77 Đinh Tiên Hoàng', city: 'Huế' },
    itemsPrice: 270000, shippingPrice: 30000, totalPrice: 300000,
    status: 'pending',
    isPaid: false,
    createdAt: '2024-03-11T11:45:00Z',
  },
  {
    _id: 'ord006pqr678',
    items: [
      { product: products[3], name: products[3].name, image: products[3].image, price: products[3].price, qty: 2 },
    ],
    shippingAddress: { name: 'Vũ Thị Mai', phone: '0967 789 012', street: '3 Hai Bà Trưng', city: 'Hải Phòng' },
    itemsPrice: 130000, shippingPrice: 30000, totalPrice: 160000,
    status: 'cancelled',
    isPaid: false,
    createdAt: '2024-03-07T16:30:00Z',
  },
];
