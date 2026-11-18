import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlay, HiXMark, HiArrowTopRightOnSquare, HiCommandLine, HiCircleStack, HiVideoCamera } from 'react-icons/hi2';
import { getPortfolio } from '../utils/api';

const DEFAULT_PROJECTS = [
  {
    _id: 'proj-1',
    title: 'Shorts Gaming & High-Energy Clips',
    clientName: 'Alexandre R. (Streameur Twitch 80k)',
    description: 'Sélection des moments d’action, découpage au millième de seconde, sous-titres animés et mixage des cris/bruits de jeu.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    iframeUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', // Safe fallback placeholder embed
    tags: ['Vidéo', 'Gaming', 'Shorts'],
  },
  {
    _id: 'proj-2',
    title: 'Podcast Business & Hooks Viraux 9:16',
    clientName: 'Mindset Academy (Top Podcast FR)',
    description: 'Format vertical 9:16 avec cadrage centré par détection de visage et animations graphiques sur les concepts clés.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    iframeUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    tags: ['Vidéo', 'Podcast', 'IA Clipping'],
  },
  {
    _id: 'proj-3',
    title: 'Scraper E-commerce Amazon / Cdiscount Multi-Régions',
    clientName: 'Projet Client Retail',
    description: 'Architecture Python sous Playwright pour extraire les fluctuations de prix de 100k références par jour avec proxies rotatifs.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['Data', 'Python', 'Web Scraping'],
  },
  {
    _id: 'proj-4',
    title: 'Reels Publicitaires DTC & E-commerce',
    clientName: 'Aura Skin',
    description: 'Création de vidéos UGC ultra-rythmées pour campagnes sponsorisées TikTok Ads (taux de conversion +35%).',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    iframeUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    tags: ['Vidéo', 'UGC', 'Ads'],
  },
  {
    _id: 'proj-5',
    title: 'Bot Discord d’Alerte Marché & Crypto Leads',
    clientName: 'Trading Syndicate',
    description: 'Script d’écoute websocket et scraping des annonces officielles avec notifications formatées et analyses de sentiment.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    tags: ['Data', 'Web', 'Python'],
  },
  {
    _id: 'proj-6',
    title: 'Tableau de Bord & Plateforme d’Analyse SaaS',
    clientName: 'Internal SaaS Tool',
    description: 'Interface React minimaliste et APIs serverless pour visualiser les résultats de scraping et planifier les publications.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    tags: ['Web', 'React', 'Data'],
  },
];

const FILTER_TAGS = ['Tous', 'Vidéo', 'Data', 'Web'];

export default function PortfolioPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('Tous');
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    getPortfolio()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(DEFAULT_PROJECTS);
        }
      })
      .catch(() => setItems(DEFAULT_PROJECTS))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter((item) => {
    if (activeTag === 'Tous') return true;
    return item.tags && item.tags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase()));
  });

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
            PROJETS CLIENTS & LIVRABLES
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mt-2 mb-3">
            Portfolio & Réalisations
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Consultez nos réalisations en montage vidéo, découpage dynamique et ingénierie de données. Les flux vidéos sont hébergés via iframes optimisées pour une réactivité maximale.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#141414] border border-white/10 self-start md:self-end">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition ${
                activeTag === tag
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── GRID ────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bento-card h-80 animate-pulse bg-[#121212]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const hasIframe = Boolean(item.iframeUrl || item.videoUrl);
            return (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bento-card flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Media container */}
                  <div className="relative aspect-video w-full bg-[#161616] overflow-hidden border-b border-white/10">
                    <img
                      src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Overlay if playable */}
                    {hasIframe && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => setActiveModal(item)}
                          className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform"
                          aria-label="Lire la vidéo"
                        >
                          <HiPlay className="w-5 h-5 ml-0.5" />
                        </button>
                      </div>
                    )}

                    {item.clientName && (
                      <div className="absolute bottom-3 left-3 bg-[#0A0A0A]/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-gray-300 border border-white/10">
                        {item.clientName}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2 group-hover:text-accent-cyan transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer tags */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags &&
                      item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 bg-[#1a1a1a] border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                  </div>

                  {hasIframe && (
                    <button
                      onClick={() => setActiveModal(item)}
                      className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1 transition"
                    >
                      <span>Aperçu</span>
                      <HiPlay className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── IFRAME VIDEO MODAL (YouTube / Embed / Video) ─────────── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#141414] border border-white/15 rounded-2xl overflow-hidden shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <h4 className="font-display font-bold text-lg text-white">
                    {activeModal.title}
                  </h4>
                  <p className="text-xs font-mono text-gray-400">{activeModal.clientName}</p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-xl bg-[#202020] hover:bg-[#282828] text-gray-400 hover:text-white transition"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              {/* Responsive Iframe Container */}
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative mb-4">
                {activeModal.iframeUrl ? (
                  <iframe
                    src={activeModal.iframeUrl}
                    title={activeModal.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#161616]">
                    <HiVideoCamera className="w-12 h-12 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-300 font-medium">Aperçu protégé sur demande</p>
                    <p className="text-xs text-gray-500 max-w-md mt-1">
                      Les fichiers maîtres complets 4K 60fps sont livrés directement au client sans compression tierce.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-400">
                <p className="max-w-xl">{activeModal.description}</p>
                <a
                  href="https://www.fiverr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-gray-200 transition flex-shrink-0"
                >
                  <span>Commander un projet similaire</span>
                  <HiArrowTopRightOnSquare className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
