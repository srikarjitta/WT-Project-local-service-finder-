import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import RegisterProvider from './pages/RegisterProvider';
import UserDashboard from './pages/UserDashboard';
import MyServices from './pages/MyServices';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderHistory from './pages/ProviderHistory';
import ProviderServices from './pages/ProviderServices';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div style={{ width: 40, height: 40, border: '3px solid #DBEAFE', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading Local Service Finder...</p>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'provider') return <Navigate to="/provider" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) {
    if (user.role === 'provider') return <Navigate to="/provider" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register/user" element={<PublicRoute><RegisterUser /></PublicRoute>} />
      <Route path="/register/provider" element={<PublicRoute><RegisterProvider /></PublicRoute>} />

      {/* User routes */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/request" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/services" element={<ProtectedRoute allowedRoles={['user']}><MyServices /></ProtectedRoute>} />
      <Route path="/dashboard/notifications" element={<ProtectedRoute allowedRoles={['user']}><Notifications /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute allowedRoles={['user']}><Profile /></ProtectedRoute>} />

      {/* Provider routes */}
      <Route path="/provider" element={<ProtectedRoute allowedRoles={['provider']}><ProviderDashboard /></ProtectedRoute>} />
      <Route path="/provider/requests" element={<ProtectedRoute allowedRoles={['provider']}><ProviderDashboard /></ProtectedRoute>} />
      <Route path="/provider/services" element={<ProtectedRoute allowedRoles={['provider']}><ProviderServices /></ProtectedRoute>} />
      <Route path="/provider/history" element={<ProtectedRoute allowedRoles={['provider']}><ProviderHistory /></ProtectedRoute>} />
      <Route path="/provider/earnings" element={<ProtectedRoute allowedRoles={['provider']}><ProviderHistory /></ProtectedRoute>} />
      <Route path="/provider/notifications" element={<ProtectedRoute allowedRoles={['provider']}><Notifications /></ProtectedRoute>} />
      <Route path="/provider/profile" element={<ProtectedRoute allowedRoles={['provider']}><Profile /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '0.875rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
            },
            success: { iconTheme: { primary: '#16A34A', secondary: 'white' } },
            error: { iconTheme: { primary: '#DC2626', secondary: 'white' } },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
