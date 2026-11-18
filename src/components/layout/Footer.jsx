import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiTwitterXLine, RiInstagramLine, RiTiktokLine, RiYoutubeLine } from 'react-icons/ri';

const navigationLinks = [
  { label: 'Accueil', href: '#' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Créations', href: '#creations' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Charte Technique', to: '/charte' },
  { label: 'CGV & Mentions Légales', to: '/cgv' },
];

const serviceLinks = [
  { label: 'Montage vidéo', href: '#services' },
  { label: 'Motion design', href: '#services' },
  { label: 'Miniatures YouTube', href: '#services' },
  { label: 'Identité visuelle', href: '#services' },
  { label: 'Réseaux sociaux', href: '#services' },
];

const socialLinks = [
  { icon: RiTwitterXLine, href: '#', label: 'X (Twitter)' },
  { icon: RiInstagramLine, href: '#', label: 'Instagram' },
  { icon: RiTiktokLine, href: '#', label: 'TikTok' },
  { icon: RiYoutubeLine, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/' + (href === '#' ? '' : href));
      if (href === '#' || !href) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setTimeout(() => {
          const id = href.replace('#', '');
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    } else {
      if (href === '#' || !href) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer>
      {/* Gradient top border */}
      <div className="h-px bg-gradient-accent" />

      <div className="bg-dark-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Col 1: Logo & socials */}
            <div className="md:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-flex items-center font-display text-xl mb-4">
                <span className="gradient-text font-bold">V</span>
                <span className="text-white font-bold">ITALI</span>
                <span className="text-gray-400 font-light ml-1">STUDIO</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Studio créatif spécialisé en montage vidéo, motion design et création de contenu
                visuel premium pour les créateurs et les marques.
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h4 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-6">
                Navigation
              </h4>
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Services */}
            <div>
              <h4 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-6">
                Services
              </h4>
              <ul className="space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div>
              <h4 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-6">
                Contact
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:contact@vitalistudio.com"
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    contact@vitalistudio.com
                  </a>
                </li>
                <li className="text-gray-400 text-sm">
                  📍 France — Disponible worldwide
                </li>
                <li className="text-gray-400 text-sm">
                  🕐 Lun – Ven, 9h – 18h
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 Vitali Studio. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link to="/charte" className="hover:text-gray-300 transition-colors">
                Charte Technique
              </Link>
              <span>•</span>
              <Link to="/cgv" className="hover:text-gray-300 transition-colors">
                CGV & Mentions Légales
              </Link>
            </div>
            <p className="text-gray-500 text-sm">
              Fait avec ❤️ et IA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
