import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';
import Button from '../ui/Button';
import { getSettings } from '../../utils/api';

const navLinks = [
  { label: 'Accueil', href: '#' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Créations', href: '#creations' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Charte', to: '/charte' },
];

function smoothScroll(hash) {
  if (!hash || hash === '#') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const id = hash.replace('#', '');
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
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
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
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

  function handleNavClick(e, link) {
    if (link.href) {
      e.preventDefault();
      setMobileOpen(false);

      if (location.pathname !== '/') {
        // Navigate to homepage with the section anchor
        navigate('/' + (link.href === '#' ? '' : link.href));
        if (link.href === '#' || !link.href) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setTimeout(() => {
            smoothScroll(link.href);
          }, 120);
        }
      } else {
        smoothScroll(link.href);
      }
    } else {
      setMobileOpen(false);
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center font-display text-xl">
              <span className="gradient-text font-bold">V</span>
              <span className="text-white font-bold">ITALI</span>
              <span className="text-gray-400 font-light ml-1">STUDIO</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Button variant="primary" href={fiverrUrl} className="px-5 py-2 text-sm">
                Commander sur Fiverr
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <HiOutlineXMark className="w-6 h-6" />
              ) : (
                <HiOutlineBars3 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-dark-900/98 backdrop-blur-xl flex flex-col items-center justify-center lg:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {link.to ? (
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="text-white text-2xl font-display font-medium hover:text-transparent hover:bg-gradient-accent hover:bg-clip-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link)}
                      className="text-white text-2xl font-display font-medium hover:text-transparent hover:bg-gradient-accent hover:bg-clip-text transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.05 }}
                className="mt-4"
              >
                <Button variant="primary" href={fiverrUrl} className="px-8 py-3">
                  Commander sur Fiverr
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
