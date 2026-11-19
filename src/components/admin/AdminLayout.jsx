import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSquares2X2,
  HiRectangleGroup,
  HiVideoCamera,
  HiWrenchScrewdriver,
  HiPhoto,
  HiSparkles,
  HiQuestionMarkCircle,
  HiStar,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2';

const navItems = [
  { key: 'dashboard', label: 'Tableau de bord', icon: HiSquares2X2 },
  { key: 'projects', label: 'Projets (Domaines)', icon: HiRectangleGroup },
  { key: 'realisations', label: 'Réalisations (9:16)', icon: HiVideoCamera },
  { key: 'services', label: 'Services', icon: HiWrenchScrewdriver },
  { key: 'portfolio', label: 'Portfolio (Ancien)', icon: HiPhoto },
  { key: 'creations', label: 'Le Labo (R&D)', icon: HiSparkles },
  { key: 'faq', label: 'FAQ', icon: HiQuestionMarkCircle },
  { key: 'testimonials', label: 'Avis', icon: HiStar },
  { key: 'settings', label: 'Paramètres & Fiverr', icon: HiCog6Tooth },
];

const AdminLayout = ({ activeSection, onNavigate, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="text-center mb-10">
        <h1 className="font-display text-xl font-bold">
          <span className="gradient-text">V</span>ITALI STUDIO
        </h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                onNavigate(item.key);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors ${
                isActive
                  ? 'bg-dark-700 text-white border-l-2'
                  : 'text-gray-500 hover:text-white hover:bg-dark-700/50'
              }`}
              style={
                isActive
                  ? {
                      borderImage: 'linear-gradient(to bottom, #FF0050, #00F2FE) 1',
                    }
                  : undefined
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => {
          onLogout();
          setSidebarOpen(false);
        }}
        className="flex items-center gap-3 text-gray-500 hover:text-accent-rose px-4 py-3 transition-colors mt-4"
      >
        <HiArrowRightOnRectangle className="w-5 h-5" />
        <span className="text-sm font-medium">Déconnexion</span>
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-dark-800">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 min-h-screen bg-dark-900 border-r border-white/5 fixed left-0 top-0 p-6 flex-col z-30">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-dark-700 text-white"
      >
        <HiBars3 className="w-6 h-6" />
      </button>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 w-64 min-h-screen bg-dark-900 border-r border-white/5 p-6 flex flex-col z-50 md:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <HiXMark className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="md:ml-64 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
