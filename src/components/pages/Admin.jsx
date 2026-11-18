import React, { useState, useEffect } from 'react';
import AdminLogin from '../admin/AdminLogin';
import AdminLayout from '../admin/AdminLayout';
import AdminDashboard from '../admin/AdminDashboard';
import AdminServices from '../admin/AdminServices';
import AdminPortfolio from '../admin/AdminPortfolio';
import AdminCreations from '../admin/AdminCreations';
import AdminFAQ from '../admin/AdminFAQ';
import AdminTestimonials from '../admin/AdminTestimonials';
import AdminSettings from '../admin/AdminSettings';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('vitali_admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('vitali_admin_token');
    setIsAuthenticated(false);
    setActiveSection('dashboard');
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'services':
        return <AdminServices />;
      case 'portfolio':
        return <AdminPortfolio />;
      case 'creations':
        return <AdminCreations />;
      case 'faq':
        return <AdminFAQ />;
      case 'testimonials':
        return <AdminTestimonials />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderSection()}
    </AdminLayout>
  );
};

export default Admin;
