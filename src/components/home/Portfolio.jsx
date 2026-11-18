import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlay, HiXMark, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import AnimatedSection from '../ui/AnimatedSection';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import { getPortfolio } from '../../utils/api';

const DEFAULT_PORTFOLIO = [
  {
    _id: 'port-1',
    title: 'Shorts Gaming & Moments Forts',
    clientName: 'Alexandre R. (Streameur Twitch 80k)',
    description: 'Extraction des meilleures punchlines et clutches avec sous-titrage dynamique et sound effects rythmés.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    tags: ['Gaming', 'TikTok', 'Shorts', 'Fast-Paced'],
    videoUrl: 'https://www.youtube.com',
  },
  {
    _id: 'port-2',
    title: 'Podcast Business & Hooks Viraux',
    clientName: 'Mindset Academy (Top Podcast FR)',
    description: 'Format vertical 9:16 avec cadrage centré par détection visage IA et animations de mots-clés percutants.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    tags: ['Podcast', 'Reels', 'IA Clipping', 'Finance'],
    videoUrl: 'https://www.youtube.com',
  },
  {
    _id: 'port-3',
    title: 'Vlog Voyage & Storytelling Visuel',
    clientName: 'Julien B. (Créateur YouTube)',
    description: 'Étalonnage cinématique, sound design immersif et transitions millimétrées sur rythme musical.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502759691669-76747ed20ab9?auto=format&fit=crop&w=800&q=80',
    tags: ['Cinématique', 'YouTube 16:9', 'Storytelling'],
    videoUrl: 'https://www.youtube.com',
  },
  {
    _id: 'port-4',
    title: 'Reels E-commerce & Publicité TikTok',
    clientName: 'Aura Skin (Marque DNVB)',
    description: 'Hook visuel en 1,5 seconde, transitions rythmées et sous-titres ultra-lisibles calibrés pour le ROI publicitaire.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    tags: ['Ads TikTok', 'UGC', 'E-commerce'],
    videoUrl: 'https://www.youtube.com',
  },
  {
    _id: 'port-5',
    title: 'Interview Tech & IA Décryptée',
    clientName: 'NextGen Media',
    description: 'Sélection chirurgicale des segments clés, incrustations motion design et synthétiseurs graphiques.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    tags: ['Tech', 'Interview', 'Motion Design'],
    videoUrl: 'https://www.youtube.com',
  },
  {
    _id: 'port-6',
    title: 'Série Fitness & Conseils Nutrition',
    clientName: 'Marc V. (Coach Certifié)',
    description: 'Découpage dynamique avec jauges de progression graphiques et sous-titres bicolores à haute lisibilité.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    tags: ['Fitness', 'Shorts', 'Sous-titres Hormozi'],
    videoUrl: 'https://www.youtube.com',
  },
];

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('Tous');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPortfolio() {
      try {
        const data = await getPortfolio();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
          } else {
            setItems(DEFAULT_PORTFOLIO);
          }
        }
      } catch (err) {
        if (isMounted) setItems(DEFAULT_PORTFOLIO);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPortfolio();
    return () => {
      isMounted = false;
    };
  }, []);

  const allTags = ['Tous', ...Array.from(new Set(items.flatMap((item) => item.tags || [])))];

  const filteredItems =
    activeTag === 'Tous'
      ? items
      : items.filter((item) => item.tags && item.tags.includes(activeTag));

  return (
    <AnimatedSection id="portfolio" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-800 relative">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Réalisations Clients"
          subtitle="Une sélection de projets vidéo conçus pour dominer les algorithmes et captiver les audiences."
          gradient={true}
          className="mb-10"
        />

        {/* Tag Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {allTags.slice(0, 7).map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeTag === tag
                  ? 'bg-gradient-accent text-white shadow-md shadow-accent-rose/20'
                  : 'bg-dark-700/60 text-gray-400 hover:text-white hover:bg-dark-600 border border-white/5'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card h-80 animate-pulse bg-dark-700/30 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Card className="group overflow-hidden rounded-2xl border border-white/5 bg-dark-700/50 hover:border-white/20 transition-all duration-500 flex flex-col h-full">
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-dark-900">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                      <button
                        onClick={() => setSelectedVideo(item)}
                        className="w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center text-white shadow-xl shadow-accent-rose/30 hover:scale-110 active:scale-95 transition-transform"
                        aria-label="Voir la vidéo"
                      >
                        <HiPlay className="w-6 h-6 ml-0.5" />
                      </button>
                    </div>

                    {item.clientName && (
                      <div className="absolute bottom-3 left-3 bg-dark-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-gray-300 border border-white/10">
                        {item.clientName}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-medium text-gray-400 bg-dark-600/60 px-2.5 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal Preview */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-dark-700 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <h4 className="font-display font-bold text-lg text-white">
                    {selectedVideo.title}
                  </h4>
                  <p className="text-xs text-gray-400">{selectedVideo.clientName}</p>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 rounded-xl bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-white transition"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video w-full rounded-xl overflow-hidden bg-dark-900 flex items-center justify-center relative mb-4">
                <img
                  src={selectedVideo.thumbnailUrl}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-white font-medium mb-2">Aperçu protégé</span>
                  <p className="text-xs text-gray-400 max-w-sm">
                    Tous les fichiers finaux sont remis en haute définition 4K/1080p sans filigrane sur commande Fiverr.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{selectedVideo.description}</span>
                <a
                  href="https://www.fiverr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-accent text-white text-xs font-semibold hover:shadow-lg shadow-accent-rose/20 transition"
                >
                  <span>Commander un projet similaire</span>
                  <HiArrowTopRightOnSquare className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedSection>
  );
}
