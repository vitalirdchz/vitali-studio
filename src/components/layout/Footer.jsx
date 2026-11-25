import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiTwitterXLine, RiInstagramLine, RiTiktokLine, RiYoutubeLine } from 'react-icons/ri';
import { HiEnvelope, HiArrowRight } from 'react-icons/hi2';
import { getSettings } from '../../utils/api';

const navigationLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio Clients', to: '/portfolio' },
  { label: 'Le Labo (R&D)', to: '/labo' },
  { label: 'Contact', to: '/contact' },
  { label: 'Charte Technique', to: '/charte' },
  { label: 'CGV & Mentions Légales', to: '/cgv' },
];

const expertises = [
  { label: 'Clipping Vidéo (TikTok / Reels)', to: '/services/clipping' },
  { label: 'Web Scraping & Extraction Data', to: '/services' },
  { label: 'Automatisations Python', to: '/services' },
  { label: 'Post-production YouTube', to: '/services' },
  { label: 'Micro-Outils & Web sur-mesure', to: '/services' },
];

export default function Footer() {
  const [contactEmail, setContactEmail] = useState('vitali.studio.contact@gmail.com');

  useEffect(() => {
    getSettings()
      .then((data) => {
        if (data?.contactEmail) {
          setContactEmail(data.contactEmail);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="relative z-10 border-t border-[#394150] bg-[#0B0D12] text-[#B6C0D0] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-[#F5F6F8] font-display font-bold text-lg group">
              <span className="w-8 h-8 rounded-lg bg-[#1A1F2B] border border-[#394150] flex items-center justify-center font-mono text-xs text-[#F5F6F8] group-hover:border-[#8EAFFF]/60 group-hover:text-[#8EAFFF] transition">
                V
              </span>
              <span>VITALI STUDIO</span>
            </Link>
            <p className="text-xs text-[#B6C0D0] leading-relaxed max-w-sm">
              Studio digital multidisciplinaire dédié à l'alliance du Code, de la Vidéo dynamique et de la Data. Création sur-mesure, rigoureuse et performante.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: RiTiktokLine, href: 'https://tiktok.com', label: 'TikTok' },
                { icon: RiInstagramLine, href: 'https://instagram.com', label: 'Instagram' },
                { icon: RiYoutubeLine, href: 'https://youtube.com', label: 'YouTube' },
                { icon: RiTwitterXLine, href: 'https://twitter.com', label: 'Twitter' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-[#1A1F2B] hover:bg-[#232A38] border border-[#394150] hover:border-[#8EAFFF]/60 flex items-center justify-center text-[#B6C0D0] hover:text-[#8EAFFF] transition"
                >
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-[#F5F6F8] font-mono text-xs uppercase tracking-widest mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-[#B6C0D0] hover:text-[#F5F6F8] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Expertises */}
          <div>
            <h4 className="text-[#F5F6F8] font-mono text-xs uppercase tracking-widest mb-4">
              Pôles d'Expertise
            </h4>
            <ul className="space-y-2.5 text-xs">
              {expertises.map((item, idx) => (
                <li key={idx}>
                  <Link to={item.to} className="text-[#B6C0D0] hover:text-[#F5F6F8] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Disponibilité */}
          <div className="space-y-3.5">
            <h4 className="text-[#F5F6F8] font-mono text-xs uppercase tracking-widest mb-4">
              Contact & Disponibilité
            </h4>

            {/* Lien direct vers le formulaire de contact */}
            <div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1A1F2B] hover:bg-[#232A38] border border-[#394150] hover:border-[#8EAFFF]/60 text-[#F5F6F8] text-xs font-mono transition group shadow-md"
              >
                <HiEnvelope className="w-4 h-4 text-[#8EAFFF]" />
                <span>Formulaire de contact</span>
                <HiArrowRight className="w-3.5 h-3.5 text-[#8EAFFF] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {contactEmail ? (
              <p className="text-xs">
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-[#B6C0D0] hover:text-[#8EAFFF] transition font-mono"
                >
                  {contactEmail}
                </a>
              </p>
            ) : null}

            <p className="text-xs text-[#B6C0D0] font-mono">
              📍 France // Remote Global
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A1F2B] border border-[#394150] text-[11px] font-mono text-[#8EAFFF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF] animate-pulse" />
                <span>Disponible pour nouveaux projets</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#394150] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#B6C0D0]">
          <p>© 2026 Vitali Studio. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link to="/charte" className="text-[#B6C0D0] hover:text-[#F5F6F8] transition">
              Charte 1080p
            </Link>
            <span>•</span>
            <Link to="/cgv" className="text-[#B6C0D0] hover:text-[#F5F6F8] transition">
              CGV & Légal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
