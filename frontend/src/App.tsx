import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardLayout from './components/layout/DashboardLayout';
import HomePage from './features/dashboard/HomePage';
import MerchantsPage from './features/merchants/MerchantsPage';
import OffersPage from './features/offers/OffersPage';
import LoyaltyPage from './features/loyalty/LoyaltyPage';
import EventsPage from './features/events/EventsPage';
import ProfilePage from './features/profile/ProfilePage';
import MerchantDashboard from './features/dashboard/MerchantDashboard';
import ScanPage from './features/dashboard/ScanPage';
import AdminPage from './features/admin/AdminPage';
import LandingPage from './features/landing/LandingPage';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role && user?.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/app" replace /> : <LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={user?.role === 'merchant' ? <MerchantDashboard /> : <HomePage />} />
        <Route path="merchants" element={<MerchantsPage />} />
        <Route path="offers" element={<OffersPage />} />
        <Route path="loyalty" element={<LoyaltyPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}