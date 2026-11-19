import React, { useState, useEffect, useCallback } from 'react';
import AdminLogin from '../admin/AdminLogin';
import AdminLayout from '../admin/AdminLayout';
import AdminDashboard from '../admin/AdminDashboard';
import AdminPacksOptions from '../admin/AdminPacksOptions';
import AdminMessages from '../admin/AdminMessages';
import AdminProposals from '../admin/AdminProposals';
import AdminClipping from '../admin/AdminClipping';
import AdminProjects from '../admin/AdminProjects';
import AdminRealisations from '../admin/AdminRealisations';
import AdminServices from '../admin/AdminServices';
import AdminPortfolio from '../admin/AdminPortfolio';
import AdminCreations from '../admin/AdminCreations';
import AdminFAQ from '../admin/AdminFAQ';
import AdminTestimonials from '../admin/AdminTestimonials';
import AdminSettings from '../admin/AdminSettings';
import { getUnreadCounts } from '../../utils/api';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [unreadCounts, setUnreadCounts] = useState({
    total: 0,
    proposals: 0,
    messages: 0,
    testimonials: 0,
  });

  const refreshUnreadCounts = useCallback(async () => {
    try {
      const data = await getUnreadCounts();
      if (data && typeof data === 'object') {
        setUnreadCounts(data);
      }
    } catch (err) {
      // Silently ignore or log if unauthorized
      console.warn('Failed to load unread counts:', err?.message);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('vitali_admin_token');
    if (token) {
      setIsAuthenticated(true);
      refreshUnreadCounts();
    }
  }, [refreshUnreadCounts]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    refreshUnreadCounts();
  };

  const handleLogout = () => {
    localStorage.removeItem('vitali_admin_token');
    setIsAuthenticated(false);
    setActiveSection('dashboard');
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    refreshUnreadCounts();
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'packs_options':
      case 'clipping':
        return <AdminPacksOptions />;
      case 'messages':
        return <AdminMessages onUpdated={refreshUnreadCounts} />;
      case 'proposals':
        return <AdminProposals onUpdated={refreshUnreadCounts} />;
      case 'projects':
        return <AdminProjects />;
      case 'realisations':
        return <AdminRealisations />;
      case 'services':
        return <AdminServices />;
      case 'portfolio':
        return <AdminPortfolio />;
      case 'creations':
        return <AdminCreations />;
      case 'faq':
        return <AdminFAQ />;
      case 'testimonials':
        return <AdminTestimonials onUpdated={refreshUnreadCounts} />;
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
      unreadCounts={unreadCounts}
    >
      {renderSection()}
    </AdminLayout>
  );
};

export default Admin;
