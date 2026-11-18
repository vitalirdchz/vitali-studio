import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiBeaker,
  HiCommandLine,
  HiCpuChip,
  HiSparkles,
  HiArrowTopRightOnSquare,
  HiCodeBracket,
} from 'react-icons/hi2';
import { getLabo } from '../utils/api';

const DEFAULT_LAB_EXPERIMENTS = [
  {
    _id: 'lab-1',
    title: 'EXP 01 // Découpe Automatique par Pics Vocaux & VAD',
    category: 'labo',
    description:
      'Script Python analysant l’activité vocale (Voice Activity Detection) avec WebRTCVAD pour découper automatiquement les silences et les hésitations avant montage humain.',
    tags: ['Python', 'Audio VAD', 'Automatisation'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    status: 'Stable',
  },
  {
    _id: 'lab-2',
    title: 'EXP 02 // Face-Tracking 3D avec Caméra Virtuelle Dynamique',
    category: 'labo',
    description:
      'Expérimentation d’un recadrage 9:16 fluide asservi sur les yeux du sujet avec inertie physique et parallaxe en arrière-plan.',
    tags: ['IA Vision', 'MediaPipe', 'Motion VFX'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    status: 'Expérimental',
  },
  {
    _id: 'lab-3',
    title: 'EXP 03 // Scraper d’Annonces & Veille Concurrentielle en Temps Réel',
    category: 'labo',
    description:
      'Pipeline de capture continue sous Playwright headless avec détection des changements de DOM et alertes automatisées sur webhook Discord.',
    tags: ['Data', 'Playwright', 'Web Scraping'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    status: 'Production',
  },
  {
    _id: 'lab-4',
    title: 'EXP 04 // Générateur de Sous-Titres Cinétiques Synchronisés',
    category: 'labo',
    description:
      'Pipeline combinant OpenAI Whisper timestamp-level avec rendu SVG/Canvas animé pour générer des sous-titres animés au mot près.',
    tags: ['Whisper', 'Node.js', 'Animation'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    status: 'Production',
  },
  {
    _id: 'lab-5',
    title: 'EXP 05 // Algorithme A/B Testing Rétention 3-Secondes',
    category: 'labo',
    description:
      'Étude comparée de 40 déclinaisons de hooks pour mesurer statistiquement les facteurs de drop-off sur TikTok et Reels.',
    tags: ['Data Science', 'Growth', 'Shorts'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80',
    status: 'Recherche',
  },
  {
    _id: 'lab-6',
    title: 'EXP 06 // Bot Telegram de Transcodage Médias FFmpeg',
    category: 'labo',
    description:
      'Bot permettant d’envoyer une vidéo brute de 2 Go et de récupérer automatiquement des versions compressées H.265 calibrées pour le web.',
    tags: ['FFmpeg', 'Telegram Bot', 'Python'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    status: 'Stable',
  },
];

export default function LaboPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLabo()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(DEFAULT_LAB_EXPERIMENTS);
        }
      })
      .catch(() => setItems(DEFAULT_LAB_EXPERIMENTS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-white/10 text-xs font-mono text-gray-300 mb-4">
          <HiBeaker className="w-4 h-4 text-accent-cyan" />
          <span>RECHERCHE & DÉVELOPPEMENT INDÉPENDANTE</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mt-1 mb-4">
          Le Laboratoire Créatif & Code
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Cet espace est dédié à mes expérimentations personnelles, scripts d'automatisation, prototypes d'IA et recherches en ingénierie visuelle. C'est ici que sont éprouvées les méthodes avant d'intégrer le studio.
        </p>
      </div>

      {/* ── EXPERIMENTS GRID ────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bento-card h-80 animate-pulse bg-[#121212]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((exp, idx) => (
            <motion.div
              key={exp._id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bento-card p-6 flex flex-col justify-between group hover:border-white/20"
            >
              <div>
                {/* Media Thumbnail */}
                <div className="aspect-[16/10] w-full rounded-xl bg-[#161616] overflow-hidden mb-5 border border-white/5 relative">
                  <img
                    src={exp.thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                    {exp.status || 'Active R&D'}
                  </div>
                </div>

                <h3 className="font-display font-bold text-base text-white mb-2 group-hover:text-accent-cyan transition-colors line-clamp-2">
                  {exp.title}
                </h3>

                <p className="text-gray-400 text-xs leading-relaxed mb-6 line-clamp-3">
                  {exp.description}
                </p>
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                {exp.tags &&
                  exp.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 bg-[#161616] border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── BOTTOM BANNER ───────────────────────────────────────── */}
      <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-[#141414] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display font-bold text-xl text-white mb-1">
            Un besoin technique particulier ou un POC à développer ?
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
            Je développe des prototypes sur-mesure combinant vision par ordinateur, API OpenAI / Claude et scrapers haute performance.
          </p>
        </div>
        <a
          href="mailto:contact@vitalistudio.com?subject=Demande%20R%26D%20/%20Labo"
          className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-gray-200 transition flex-shrink-0"
        >
          Discuter d’une expérimentation
        </a>
      </div>
    </div>
  );
}
