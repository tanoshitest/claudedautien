import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { CartProvider }    from './context/CartContext';
import { AuthProvider }    from './context/AuthContext';
import { OrderProvider }   from './context/OrderContext';
import { ProductProvider } from './context/ProductContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public layout
import Header from './components/Header';
import Footer from './components/Footer';

// Public pages
import Home          from './pages/Home';
import Shop          from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart          from './pages/Cart';
import About         from './pages/About';
import Login         from './pages/Login';
import Checkout      from './pages/Checkout';
import OrderSuccess  from './pages/OrderSuccess';

// Admin pages
import AdminLayout   from './pages/admin/AdminLayout';
import Dashboard     from './pages/admin/Dashboard';
import AdminOrders   from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';

// Layout wrapper cho các trang public (có Header & Footer)
function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicLayout />}>
                <Route path="/"                    element={<Home />} />
                <Route path="/shop"                element={<Shop />} />
                <Route path="/product/:id"         element={<ProductDetail />} />
                <Route path="/cart"                element={<Cart />} />
                <Route path="/about"               element={<About />} />
                <Route path="/checkout"            element={<Checkout />} />
                <Route path="/order-success/:id"   element={<OrderSuccess />} />
              </Route>

              {/* Auth (không có Header/Footer) */}
              <Route path="/login" element={<Login />} />

            {/* Admin (cần đăng nhập + role admin) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index             element={<Dashboard />} />
              <Route path="orders"     element={<AdminOrders />} />
              <Route path="products"   element={<AdminProducts />} />
            </Route>
            </Routes>
          </BrowserRouter>
          </CartProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
