import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBars3, HiOutlineXMark, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { getSettings } from '../../utils/api';

const NAV_ITEMS = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Labo', to: '/labo' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fiverrUrl, setFiverrUrl] = useState('https://www.fiverr.com');

  // Fermeture automatique du menu mobile lors du changement de route
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    getSettings()
      .then((data) => {
        if (data?.fiverrUrl) setFiverrUrl(data.fiverrUrl);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Empêche le scroll quand le menu mobile est ouvert et le réactive proprement à la fermeture
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleCloseMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0B0D12]/92 backdrop-blur-md border-b border-[#394150] py-3.5 shadow-2xl shadow-black/50'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Studio */}
            <Link
              to="/"
              onClick={handleCloseMobile}
              className="flex items-center gap-3 group"
            >
              <span className="w-8 h-8 rounded-lg bg-[#1A1F2B] border border-[#394150] flex items-center justify-center font-mono font-bold text-sm text-[#F5F6F8] group-hover:border-[#8EAFFF]/60 group-hover:text-[#8EAFFF] transition">
                V
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base tracking-tight text-[#F5F6F8] flex items-center gap-2">
                  VITALI STUDIO
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full bg-[#8EAFFF] animate-pulse"
                    title="Studio disponible pour nouveaux projets"
                  />
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#B6C0D0] uppercase">
                  Code • Vidéo • Data
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-[#11151D]/90 border border-[#394150] rounded-full px-3 py-1.5 backdrop-blur-md shadow-sm">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#8EAFFF] text-[#0B0D12] font-semibold shadow-sm'
                        : 'text-[#B6C0D0] hover:text-[#F5F6F8] hover:bg-[#232A38]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={fiverrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A1F2B] hover:bg-[#232A38] border border-[#394150] hover:border-[#8EAFFF]/50 text-xs font-semibold text-[#F5F6F8] transition duration-200"
              >
                <span>Fiverr Profil</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-[#8EAFFF]" />
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden p-2.5 rounded-xl bg-[#1A1F2B] border border-[#394150] text-[#F5F6F8] hover:border-[#8EAFFF]/50 focus:outline-none"
              aria-label="Menu"
            >
              {mobileOpen ? <HiOutlineXMark className="w-5 h-5" /> : <HiOutlineBars3 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[65px] z-40 bg-[#0B0D12]/98 backdrop-blur-2xl md:hidden px-6 py-8 flex flex-col justify-between border-t border-[#394150]"
          >
            <nav className="flex flex-col space-y-3">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={handleCloseMobile}
                  className={({ isActive }) =>
                    `px-5 py-3.5 rounded-xl text-base font-medium transition ${
                      isActive
                        ? 'bg-[#8EAFFF] text-[#0B0D12] font-semibold'
                        : 'text-[#D6DCE6] hover:bg-[#1A1F2B] hover:text-[#F5F6F8]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="pt-6 border-t border-[#394150] flex flex-col gap-3">
              <a
                href={fiverrUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCloseMobile}
                className="w-full py-3.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-center text-sm flex items-center justify-center gap-2 shadow-lg transition"
              >
                <span>Commander sur Fiverr</span>
                <HiArrowTopRightOnSquare className="w-4 h-4 text-[#0B0D12]" />
              </a>
              <div className="flex justify-between items-center text-xs font-mono text-[#B6C0D0] pt-2">
                <span>VITALI STUDIO</span>
                <span>CODE • VIDÉO • DATA</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
