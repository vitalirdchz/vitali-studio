import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiWrenchScrewdriver,
  HiPhoto,
  HiQuestionMarkCircle,
  HiStar,
} from 'react-icons/hi2';
import {
  getServices,
  getPortfolio,
  getCreations,
  getFAQ,
  getTestimonials,
} from '../../utils/api';

const AdminDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    services: 0,
    portfolio: 0,
    faq: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [servicesRes, portfolioRes, faqRes, testimonialsRes] =
          await Promise.all([
            getServices(),
            getPortfolio(),
            getFAQ(),
            getTestimonials(),
          ]);
        setStats({
          services: Array.isArray(servicesRes) ? servicesRes.length : 0,
          portfolio: Array.isArray(portfolioRes) ? portfolioRes.length : 0,
          faq: Array.isArray(faqRes) ? faqRes.length : 0,
          testimonials: Array.isArray(testimonialsRes) ? testimonialsRes.length : 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Services', value: stats.services, icon: HiWrenchScrewdriver },
    { label: 'Portfolio', value: stats.portfolio, icon: HiPhoto },
    { label: 'FAQ', value: stats.faq, icon: HiQuestionMarkCircle },
    { label: 'Avis', value: stats.testimonials, icon: HiStar },
  ];

  const quickActions = [
    { label: 'Packs & Options (Clipping)', section: 'packs_options' },
    { label: 'Messages reçus', section: 'messages' },
    { label: 'Propositions clients', section: 'proposals' },
    { label: 'Réalisations (9:16)', section: 'realisations' },
    { label: 'Ajouter un service', section: 'services' },
    { label: 'Nouvel avis', section: 'testimonials' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <h1 className="font-display text-3xl font-bold mb-2 text-white">Tableau de bord</h1>
      <p className="text-gray-400 mb-8">Bienvenue, Vitali 👋</p>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl"
            >
              <div
                className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center mb-4"
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? (
                  <div className="w-8 h-8 rounded bg-dark-600 animate-pulse" />
                ) : (
                  card.value
                )}
              </div>
              <div className="text-gray-500 text-sm">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-white font-display text-xl font-bold mb-4">Actions rapides</h2>
        <div className="flex gap-4 flex-wrap">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate && onNavigate(action.section)}
              className="btn-secondary px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
