import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { RiDoubleQuotesL } from 'react-icons/ri';
import AnimatedSection from '../ui/AnimatedSection';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import { getTestimonials } from '../../utils/api';

const DEFAULT_TESTIMONIALS = [
  {
    _id: 'test-1',
    clientName: 'Maxime B.',
    clientTitle: 'Créateur YouTube & Streameur (120k abonnés)',
    content: "Vitali a complètement révolutionné ma présence sur TikTok et Shorts. En 3 semaines, deux de ses clips ont dépassé les 800k vues. Le rythme est chirurgical, les sous-titres sont ultra-propres et la communication est irréprochable.",
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  },
  {
    _id: 'test-2',
    clientName: 'Clara Delmas',
    clientTitle: 'Fondatrice de LeadFlow Studio',
    content: "Commander via Fiverr avec Vitali est d'une simplicité déconcertante. Je lui dépose mes interviews Zoom brutes, et il me renvoie des pépites prêtes à publier pour LinkedIn et Instagram. C'est le meilleur monteur avec qui j'ai collaboré.",
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    _id: 'test-3',
    clientName: 'Romain Guérin',
    clientTitle: 'Coach Business & Conférencier',
    content: "Rapport qualité/prix imbattable. Sa maîtrise des hooks visuels et de l'intelligence artificielle pour dénicher les moments clés me fait gagner au moins 10 heures de travail par semaine. Bravo pour le professionnalisme !",
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  },
  {
    _id: 'test-4',
    clientName: 'Élodie Laurent',
    clientTitle: 'Directrice Marketing chez Nexa Brand',
    content: "Les vidéos verticales livrées ont généré un taux de conversion +35% sur nos campagnes de reels sponsorisés. Respect des délais au poil, finitions parfaites. Je recommande les yeux fermés.",
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadTestimonials() {
      try {
        const data = await getTestimonials();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setTestimonials(data);
          } else {
            setTestimonials(DEFAULT_TESTIMONIALS);
          }
        }
      } catch (err) {
        if (isMounted) setTestimonials(DEFAULT_TESTIMONIALS);
      }
    }
    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  // Autoplay
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex] || DEFAULT_TESTIMONIALS[0];

  return (
    <AnimatedSection id="avis" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-900/60 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent-rose/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <SectionTitle
          title="Témoignages & Avis Clients"
          subtitle="Découvrez les retours de créateurs et entreprises qui me font confiance au quotidien."
          gradient={true}
          className="mb-14"
        />

        {/* Carousel Card */}
        <div className="relative">
          <Card className="p-8 sm:p-12 relative overflow-hidden border border-white/10 bg-dark-700/60 shadow-2xl backdrop-blur-xl rounded-3xl min-h-[320px] flex flex-col justify-between">
            {/* Giant quote background icon */}
            <RiDoubleQuotesL className="absolute -top-4 -right-4 text-9xl text-white/[0.03] pointer-events-none select-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-col justify-between h-full"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < (current.rating || 5)
                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs font-mono text-gray-400 uppercase tracking-wider">
                      Vérifié Fiverr ★★★★★
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-gray-200 text-lg sm:text-xl font-normal leading-relaxed italic mb-8 font-sans">
                    « {current.content} »
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <img
                    src={current.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt={current.clientName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-accent-rose/40 shadow-md"
                  />
                  <div>
                    <h4 className="font-display font-bold text-white text-base sm:text-lg">
                      {current.clientName}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium">
                      {current.clientTitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-8">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentIndex(dotIdx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === dotIdx
                        ? 'w-8 bg-gradient-accent'
                        : 'w-2 bg-dark-600 hover:bg-dark-500'
                    }`}
                    aria-label={`Aller au témoignage ${dotIdx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white border border-white/10 transition active:scale-95"
                  aria-label="Témoignage précédent"
                >
                  <HiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white border border-white/10 transition active:scale-95"
                  aria-label="Témoignage suivant"
                >
                  <HiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
