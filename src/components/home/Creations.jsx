import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiBeaker, HiSparkles, HiPlay } from 'react-icons/hi2';
import AnimatedSection from '../ui/AnimatedSection';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import { getCreations } from '../../utils/api';

const DEFAULT_CREATIONS = [
  {
    _id: 'lab-1',
    title: 'Lab 01 : Face-Tracking 3D & Caméra Virtuelle',
    description: 'Expérimentation d\'un système de caméra dynamique 3D asservie sur le regard du sujet avec profondeur de champ générée par IA.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    tags: ['IA Vision', 'Parallaxe 3D', 'VFX Expérimental'],
  },
  {
    _id: 'lab-2',
    title: 'Lab 02 : Sous-titrage Cinétique Réactif à l\'Audio',
    description: 'Animation automatique des typographies calée sur les transitoires audio et les inflexions émotionnelles de la voix.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    tags: ['Audio-Reactive', 'Kinetic Type', 'Motion Design'],
  },
  {
    _id: 'lab-3',
    title: 'Lab 03 : Synthèse d\'Arrière-Plan & Relighting IA',
    description: 'Remplacement de fond sans fond vert avec rééclairage cohérent de la silhouette du créateur en temps réel.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    tags: ['Rotoscopie IA', 'Relighting', 'Color Science'],
  },
  {
    _id: 'lab-4',
    title: 'Lab 04 : Algorithme de Rétention & Micro-Hooks',
    description: 'Test comparatif A/B sur 20 déclinaisons de clips pour isoler les 3 premières secondes à plus fort taux d\'arrêt de scroll.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['A/B Testing', 'Growth Hacking', 'Shorts Analytics'],
  },
];

export default function Creations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCreations() {
      try {
        const data = await getCreations();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
          } else {
            setItems(DEFAULT_CREATIONS);
          }
        }
      } catch (err) {
        if (isMounted) setItems(DEFAULT_CREATIONS);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCreations();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AnimatedSection id="creations" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-900/80 relative overflow-hidden">
      {/* Glow elements */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 mb-4">
            <HiBeaker className="w-4 h-4" />
            <span>R&D & Projets Personnels</span>
          </div>
          <SectionTitle
            title="Le Laboratoire Vidéo"
            subtitle="Ici, j'explore en continu les dernières technologies d'IA générative, de tracking neural et d'ergonomie cognitive pour garder une longueur d'avance."
            gradient={true}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card h-72 animate-pulse bg-dark-700/40 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-full"
              >
                <div className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent hover:from-accent-cyan hover:to-accent-rose transition-all duration-500 h-full">
                  <div className="bg-dark-800/90 backdrop-blur-xl rounded-2xl p-5 h-full flex flex-col justify-between overflow-hidden">
                    <div>
                      {/* Visual Container */}
                      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-4 bg-dark-900 border border-white/5">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent" />
                        <div className="absolute top-2 right-2 bg-dark-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-accent-cyan font-mono border border-accent-cyan/20">
                          EXP #{String(idx + 1).padStart(2, '0')}
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-base text-white mb-2 group-hover:text-accent-cyan transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono text-gray-400 bg-dark-700 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
