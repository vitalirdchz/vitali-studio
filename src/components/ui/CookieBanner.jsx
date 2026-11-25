import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiShieldCheck, HiXMark } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const COOKIE_STORAGE_KEY = 'vitali_studio_cookie_consent_v1';

/**
 * CookieBanner
 * Bandeau de consentement cookies & RGPD sobre et élégant ("le truc en bas comme sur tous les sites").
 * - Apparaît en bas à droite de l'écran avec une animation fluide
 * - Mémorise le choix dans localStorage
 * - Design Dark Minimalist raccord avec le studio
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Vérifie si le visiteur a déjà accepté ou refusé
    try {
      const consent = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!consent) {
        // Petit délai d'apparition agréable pour ne pas bloquer l'affichage initial
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback si localStorage est indisponible
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'accepted');
    } catch {}
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'declined');
    } catch {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-4 inset-x-4 sm:left-auto sm:right-6 sm:max-w-md z-50 pointer-events-auto"
        >
          <div className="p-5 rounded-2xl bg-[#11151D]/95 border border-[#394150] shadow-2xl shadow-black/80 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#1A1F2B] border border-[#8EAFFF]/40 flex items-center justify-center text-[#8EAFFF]">
                  <HiShieldCheck className="w-4 h-4" />
                </span>
                <span className="font-mono text-xs font-bold text-[#F5F6F8] tracking-wider uppercase">
                  Respect de la Vie Privée
                </span>
              </div>
              <button
                onClick={handleDecline}
                className="text-[#717F9A] hover:text-[#F5F6F8] transition p-1"
                aria-label="Fermer"
              >
                <HiXMark className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#D6DCE6] leading-relaxed mb-4 font-sans">
              Ce site utilise des cookies essentiels au fonctionnement et à l'optimisation des vidéos (CDN ImageKit, sécurité). Aucune donnée n'est cédée à des tiers. Consultez nos{' '}
              <Link to="/cgv" className="text-[#8EAFFF] hover:underline">
                mentions légales
              </Link>.
            </p>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] text-xs font-semibold font-mono tracking-wider transition shadow-md shadow-[#8EAFFF]/20 active:scale-[0.98]"
              >
                ACCEPTER TOUT
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2 rounded-xl bg-[#1A1F2B] hover:bg-[#232A38] border border-[#394150] text-[#B6C0D0] hover:text-[#F5F6F8] text-xs font-mono transition active:scale-[0.98]"
              >
                REFUSER
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
