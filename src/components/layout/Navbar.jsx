import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBars3, HiOutlineXMark, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { getSettings } from '../../utils/api';

const NAV_ITEMS = [
  { label: 'Accueil', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Labo', to: '/labo' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fiverrUrl, setFiverrUrl] = useState('https://www.fiverr.com');

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

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl shadow-black/40'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <span className="w-8 h-8 rounded-lg bg-[#161616] border border-white/15 flex items-center justify-center font-mono font-bold text-sm text-white group-hover:border-white/40 transition">
                V
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base tracking-tight text-white flex items-center gap-2">
                  VITALI STUDIO
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Available for projects" />
                </span>
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                  Code • Vidéo • Data
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-[#121212]/80 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] border border-white/10 hover:border-white/20 text-xs font-semibold text-white transition duration-200"
              >
                <span>Fiverr Profil</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-gray-400" />
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-[#161616] border border-white/10 text-gray-300 hover:text-white focus:outline-none"
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
            className="fixed inset-0 top-[65px] z-40 bg-[#0A0A0A]/98 backdrop-blur-2xl md:hidden px-6 py-8 flex flex-col justify-between border-t border-white/10"
          >
            <nav className="flex flex-col space-y-3">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-5 py-3.5 rounded-xl text-base font-medium transition ${
                      isActive
                        ? 'bg-white text-black font-semibold'
                        : 'text-gray-300 hover:bg-[#161616] hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <a
                href={fiverrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-center text-sm flex items-center justify-center gap-2"
              >
                <span>Commander sur Fiverr</span>
                <HiArrowTopRightOnSquare className="w-4 h-4" />
              </a>
              <div className="flex justify-between items-center text-xs font-mono text-gray-500 pt-2">
                <span>VITALI STUDIO v2.0</span>
                <span>PARIS / REMOTELY</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
