import React from 'react';
import { Link } from 'react-router-dom';
import { RiTwitterXLine, RiInstagramLine, RiTiktokLine, RiYoutubeLine } from 'react-icons/ri';

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
  { label: 'Web Scraping & Data', to: '/services' },
  { label: 'Automatisations Python', to: '/services' },
  { label: 'Post-production YouTube', to: '/services' },
  { label: 'Outils Médias sur-mesure', to: '/services' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0A0A] text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-white font-display font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-[#161616] border border-white/15 flex items-center justify-center font-mono text-xs">
                V
              </span>
              <span>VITALI STUDIO</span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              Studio digital multidisciplinaire spécialisé dans l'alliance du Code, de la Vidéo dynamique et de la Data. Création sur-mesure sans template générique.
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
                  className="w-8 h-8 rounded-lg bg-[#141414] hover:bg-[#202020] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
                >
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-mono text-xs uppercase tracking-widest mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Expertises */}
          <div>
            <h4 className="text-white font-mono text-xs uppercase tracking-widest mb-4">
              Pôles d'Expertise
            </h4>
            <ul className="space-y-2.5 text-xs">
              {expertises.map((item, idx) => (
                <li key={idx}>
                  <Link to={item.to} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Statut */}
          <div className="space-y-3">
            <h4 className="text-white font-mono text-xs uppercase tracking-widest mb-4">
              Contact & Disponibilité
            </h4>
            <p className="text-xs">
              <a href="mailto:contact@vitalistudio.com" className="text-gray-300 hover:text-white transition">
                contact@vitalistudio.com
              </a>
            </p>
            <p className="text-xs text-gray-500 font-mono">
              📍 France // Remote Global
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#161616] border border-white/10 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Disponible pour nouveaux projets</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <p>© 2026 Vitali Studio. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link to="/charte" className="hover:text-gray-300 transition">
              Charte 1080p
            </Link>
            <span>•</span>
            <Link to="/cgv" className="hover:text-gray-300 transition">
              CGV & Légal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
