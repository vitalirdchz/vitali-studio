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
  HiInboxStack,
  HiFilm,
  HiEnvelope,
  HiBell,
} from 'react-icons/hi2';

const navItems = [
  { key: 'dashboard', label: 'Tableau de bord & Quotas', icon: HiSquares2X2 },
  { key: 'packs_options', label: 'Packs & Tarifs (Clipping)', icon: HiFilm },
  { key: 'services', label: 'Catalogue des Services', icon: HiWrenchScrewdriver },
  { key: 'realisations', label: 'Réalisations (Vidéos 9:16)', icon: HiVideoCamera },
  { key: 'projects', label: 'Projets (Domaines)', icon: HiRectangleGroup },
  { key: 'proposals', label: 'Propositions clients', icon: HiInboxStack, badgeKey: 'proposals' },
  { key: 'messages', label: 'Messages reçus', icon: HiEnvelope, badgeKey: 'messages' },
  { key: 'testimonials', label: 'Avis clients', icon: HiStar, badgeKey: 'testimonials' },
  { key: 'portfolio', label: 'Portfolio (Ancien)', icon: HiPhoto },
  { key: 'creations', label: 'Le Labo (R&D)', icon: HiSparkles },
  { key: 'faq', label: 'FAQ', icon: HiQuestionMarkCircle },
  { key: 'settings', label: 'Paramètres & ImageKit', icon: HiCog6Tooth },
];

const AdminLayout = ({
  activeSection,
  onNavigate,
  onLogout,
  unreadCounts = { total: 0, proposals: 0, messages: 0, testimonials: 0 },
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalUnread = unreadCounts?.total || 0;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="text-center mb-8">
        <h1 className="font-display text-xl font-bold tracking-wider text-[#F5F6F8]">
          <span className="text-[#8EAFFF]">V</span>ITALI STUDIO
        </h1>
        <p className="text-[10px] font-mono tracking-widest text-[#B6C0D0] uppercase mt-1">
          Back-Office Admin
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeSection === item.key ||
            (item.key === 'packs_options' && activeSection === 'clipping');
          const badgeCount = item.badgeKey ? unreadCounts?.[item.badgeKey] || 0 : 0;

          return (
            <button
              key={item.key}
              onClick={() => {
                onNavigate(item.key);
                setSidebarOpen(false);
              }}
              className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 ${
                isActive
                  ? 'bg-[#8EAFFF]/15 text-[#F5F6F8] border-l-2 border-[#8EAFFF] font-medium shadow-sm'
                  : 'text-[#B6C0D0] hover:text-[#F5F6F8] hover:bg-[#1A1F2B]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-[#8EAFFF]' : 'text-[#717F9A]'
                  }`}
                />
                <span className="text-xs truncate">{item.label}</span>
              </div>

              {badgeCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#8EAFFF] text-[#0B0D12] shadow-sm flex-shrink-0 animate-pulse">
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => {
          onLogout();
          setSidebarOpen(false);
        }}
        className="flex items-center gap-3 text-[#B6C0D0] hover:text-red-400 px-3.5 py-3 transition-colors mt-4 border-t border-[#394150] pt-4 text-xs font-mono"
      >
        <HiArrowRightOnRectangle className="w-4 h-4" />
        <span>Déconnexion</span>
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0B0D12] text-[#D6DCE6]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 min-h-screen bg-[#11151D] border-r border-[#394150] fixed left-0 top-0 p-5 flex-col z-30">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-[#1A1F2B] border border-[#394150] text-[#F5F6F8] shadow-lg"
      >
        <HiBars3 className="w-5 h-5" />
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 w-64 min-h-screen bg-[#11151D] border-r border-[#394150] p-5 flex-col z-50 md:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-[#B6C0D0] hover:text-[#F5F6F8] p-1"
              >
                <HiXMark className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="md:ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top-bar with global notifications */}
        <header className="sticky top-0 z-20 bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#394150] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 pl-12 md:pl-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-[#B6C0D0] uppercase tracking-wider">
              Vitali Studio • Admin
            </span>
          </div>

          {/* Unread notification status */}
          <div className="flex items-center gap-3">
            {totalUnread > 0 ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8EAFFF]/10 border border-[#8EAFFF]/30 text-[#8EAFFF] text-xs font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8EAFFF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8EAFFF]" />
                </span>
                <HiBell className="w-3.5 h-3.5 text-[#8EAFFF]" />
                <span>
                  {totalUnread} nouveau{totalUnread > 1 ? 'x' : ''} élément
                  {totalUnread > 1 ? 's' : ''} à consulter
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#11151D] border border-[#394150] text-[#717F9A] text-xs font-mono">
                <HiBell className="w-3.5 h-3.5 text-[#717F9A]" />
                <span>0 nouveau message</span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
