import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiVideoCamera,
  HiCircleStack,
  HiCommandLine,
  HiPlay,
  HiXMark,
  HiArrowTopRightOnSquare,
  HiSparkles,
  HiOutlineFilm,
} from 'react-icons/hi2';
import { getProjects, getRealisations, getSettings } from '../utils/api';

const DEFAULT_PROJECTS = [
  {
    _id: 'default-p1',
    title: 'Clipping Vidéo (TikTok / Reels / Shorts)',
    status: 'Actif',
    badge: 'Actif',
    description:
      'Extraction et montage de formats courts à partir de vidéos longues, lives, conférences et podcasts.',
    tags: ['Format 9:16', 'IA & Rétention', 'Sous-titres Animés', 'Sound Design'],
    order: 1,
  },
  {
    _id: 'default-p2',
    title: 'Web Scraping & Extraction Structurée',
    status: 'À venir',
    badge: 'À venir',
    description:
      'Conception de pipelines d’extraction de données volumineuses, contournement anti-bot et exports prêts à l’analyse.',
    tags: ['Python', 'Playwright', 'Data Pipelines'],
    order: 2,
  },
  {
    _id: 'default-p3',
    title: 'Automatisations & Scripts Sur-Mesure',
    status: 'À venir',
    badge: 'À venir',
    description:
      'Développement de micro-outils internes, bots de notification et connecteurs API pour accélérer les flux opérationnels.',
    tags: ['APIs', 'Micro-services', 'Scripts CLI'],
    order: 3,
  },
];

const CATEGORIES = ['Tous', 'Podcast', 'Live', 'Conférence', 'Vidéo longue'];

/**
 * Normalizes video links (YouTube Shorts, YouTube standard, TikTok, direct video) into embeddable iframe URLs.
 */
function parseEmbedUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();

  // If user pasted full iframe tag: extract src
  const iframeMatch = trimmed.match(/src=["'](.*?)["']/);
  if (iframeMatch && iframeMatch[1]) {
    return { type: 'iframe', src: iframeMatch[1] };
  }

  // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID or https://youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=0&rel=0`,
    };
  }

  // YouTube standard: youtu.be/VIDEO_ID or watch?v=VIDEO_ID
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
    };
  }

  // Direct video file (mp4, webm)
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed)) {
    return { type: 'video', src: trimmed };
  }

  // Fallback to iframe
  return { type: 'iframe', src: trimmed };
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [realisations, setRealisations] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingRealisations, setLoadingRealisations] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [fiverrUrl, setFiverrUrl] = useState('https://www.fiverr.com');
  const [activeModalItem, setActiveModalItem] = useState(null);

  useEffect(() => {
    getSettings()
      .then((d) => {
        if (d?.fiverrUrl) setFiverrUrl(d.fiverrUrl);
      })
      .catch(() => {});

    // Fetch Projects
    getProjects()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(DEFAULT_PROJECTS);
        }
      })
      .catch(() => setProjects(DEFAULT_PROJECTS))
      .finally(() => setLoadingProjects(false));

    // Fetch Realisations
    getRealisations()
      .then((data) => {
        if (Array.isArray(data)) {
          setRealisations(data);
        }
      })
      .catch(() => setRealisations([]))
      .finally(() => setLoadingRealisations(false));
  }, []);

  const filteredRealisations = realisations.filter((item) => {
    if (selectedCategory === 'Tous') return true;
    return item.category && item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="relative overflow-hidden">
      {/* Halo radial diffus en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none radial-halo opacity-90 z-0" />

      <div className="relative z-10 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ── EN-TÊTE DE LA PAGE ─────────────────────────────────── */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
            PORTFOLIO & DÉMONSTRATIONS // VITALI STUDIO
          </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mt-2 mb-4">
          Projets & Réalisations
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Explorez les domaines d’expertise du studio ainsi que nos démonstrations vidéo verticales (9:16), montées sur-mesure pour capter l’attention dès les premières secondes.
        </p>
      </div>

      {/* ── SECTION 1 : PROJETS (DOMAINES D'ACTIVITÉ BENTO BOX) ─── */}
      <section className="mb-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
              01 // DOMAINES D'EXPERTISE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Projets
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-mono mt-2 sm:mt-0">
            MÉTIERS DU STUDIO • ACTIFS & ROADMAP
          </p>
        </div>

        {loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bento-card h-64 animate-pulse bg-[#121212]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {projects.map((proj, idx) => {
              const isActive = proj.status === 'Actif' || proj.badge === 'Actif';
              return (
                <div
                  key={proj._id || idx}
                  className={`bento-card p-7 flex flex-col justify-between relative transition-all duration-300 ${
                    isActive
                      ? 'border-white/20 bg-[#141414] shadow-lg shadow-black/40'
                      : 'border-white/5 bg-[#101010] opacity-80 hover:opacity-100'
                  }`}
                >
                  <div>
                    {/* Header badge */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                        DOMAINE #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-white/5 text-gray-400 border border-white/10'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
                          }`}
                        />
                        <span>{proj.status || (isActive ? 'Actif' : 'À venir')}</span>
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white mb-3">
                      {proj.title}
                    </h3>

                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                      {proj.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {proj.tags && proj.tags.length > 0 && (
                    <div className="pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                      {proj.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 bg-[#181818] border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── SECTION 2 : RÉALISATIONS (GRILLE VIDÉOS 9:16) ──────── */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
              02 // SHOWCASE VERTICAL 9:16
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Réalisations
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Démonstrations de montage au format court optimisé pour TikTok, Reels et YouTube Shorts.
            </p>
          </div>

          {/* Filtres par catégorie */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#141414] border border-white/10 self-start md:self-end">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des réalisations 9:16 */}
        {loadingRealisations ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bento-card aspect-[9/16] animate-pulse bg-[#121212]" />
            ))}
          </div>
        ) : filteredRealisations.length === 0 ? (
          /* État vide propre et discret */
          <div className="py-20 px-6 rounded-2xl border border-white/10 bg-[#121212] text-center max-w-xl mx-auto my-6">
            <div className="w-12 h-12 rounded-2xl bg-[#181818] border border-white/10 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <HiOutlineFilm className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-display font-semibold text-white text-base mb-1">
              Nouvelles démonstrations en cours de préparation
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed mb-6 font-sans">
              Les réalisations pour la catégorie « {selectedCategory} » sont actuellement en cours d'encodage et d'intégration au format 9:16.
            </p>
            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-gray-200 transition"
            >
              <span>Voir les retours clients sur Fiverr</span>
              <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {filteredRealisations.map((item, idx) => {
              const embed = parseEmbedUrl(item.videoUrl);
              return (
                <div
                  key={item._id || idx}
                  className="bento-card overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-white/20"
                >
                  {/* Container vertical 9:16 */}
                  <div className="relative aspect-[9/16] w-full bg-black overflow-hidden border-b border-white/10">
                    {embed?.type === 'iframe' ? (
                      <iframe
                        src={embed.src}
                        title={item.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0 object-cover"
                      />
                    ) : embed?.type === 'video' ? (
                      <video
                        src={embed.src}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#161616]">
                        <HiVideoCamera className="w-10 h-10 text-gray-600 mb-2" />
                        <span className="text-xs text-gray-400 font-mono">Lecteur vidéo</span>
                      </div>
                    )}

                    {/* Badge catégorie en superposition */}
                    <div className="absolute top-3 left-3 bg-[#0A0A0A]/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] font-mono text-white border border-white/10 pointer-events-none">
                      {item.category}
                    </div>
                  </div>

                  {/* Titre & Description courte */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-display font-bold text-sm sm:text-base text-white mb-1.5 line-clamp-1 group-hover:text-accent-cyan transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-sans">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
