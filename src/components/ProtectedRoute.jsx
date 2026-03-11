import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Bảo vệ route — chỉ cho vào nếu đã đăng nhập (và là admin nếu requireAdmin=true)
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}
