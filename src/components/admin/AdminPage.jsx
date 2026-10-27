import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { isAdminAuthenticated, adminLogout } from '../../utils/adminAuth';
import { purgeAdminActivity } from '../../utils/analyticsTracker';

export default function AdminPage({ onBackToSite }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminAuthenticated());

  useEffect(() => {
    // Permanently mark this browser as Admin and purge any accidental visit tracking
    try {
      localStorage.setItem('__sielo_is_admin', 'true');
    } catch {}
    purgeAdminActivity();
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToSite={onBackToSite}
      />
    );
  }

  return (
    <AdminDashboard
      onLogout={handleLogout}
      onBackToSite={onBackToSite}
    />
  );
}
