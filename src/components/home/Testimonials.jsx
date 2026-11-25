import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { RiDoubleQuotesL } from 'react-icons/ri';
import { getTestimonials } from '../../utils/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
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
            setTestimonials([]);
          }
        }
      } catch (err) {
        if (isMounted) setTestimonials([]);
      } finally {
        if (isMounted) setLoading(false);
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

  // Si aucun avis en base : masquer TOTALEMENT la section (zéro effet chantier)
  if (loading || testimonials.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex];
  if (!current) return null;

  return (
    <section id="avis" className="py-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] block mb-2 font-medium">
            RETOURS D’EXPÉRIENCE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8]">
            Avis & Retours Clients
          </h2>
        </div>

        {/* Carousel Card */}
        <div className="relative">
          <div className="p-8 sm:p-12 relative overflow-hidden border border-[#394150] bg-[#1A1F2B] shadow-2xl rounded-2xl min-h-[280px] flex flex-col justify-between">
            <RiDoubleQuotesL className="absolute -top-4 -right-4 text-9xl text-white/[0.03] pointer-events-none select-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex flex-col justify-between h-full"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < (current.rating || 5)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-[#4D586D]'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs font-mono text-[#B6C0D0] uppercase tracking-wider font-medium">
                      Vérifié ★★★★★
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-[#D6DCE6] text-base sm:text-lg font-normal leading-relaxed italic mb-6 font-sans">
                    « {current.content} »
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-5 border-t border-[#394150]">
                  {current.avatarUrl && (
                    <img
                      src={current.avatarUrl}
                      alt={current.clientName}
                      className="w-11 h-11 rounded-full object-cover border border-[#394150]"
                    />
                  )}
                  <div>
                    <h4 className="font-display font-bold text-[#F5F6F8] text-sm sm:text-base">
                      {current.clientName}
                    </h4>
                    {current.clientTitle && (
                      <p className="text-xs text-[#B6C0D0] font-sans font-medium">
                        {current.clientTitle}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-6">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentIndex(dotIdx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentIndex === dotIdx
                        ? 'w-6 bg-[#8EAFFF]'
                        : 'w-2 bg-[#394150] hover:bg-[#4D586D]'
                    }`}
                    aria-label={`Aller au témoignage ${dotIdx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-[#1A1F2B] hover:bg-[#232A38] text-[#D6DCE6] hover:text-[#8EAFFF] border border-[#394150] hover:border-[#8EAFFF]/60 transition active:scale-95"
                  aria-label="Témoignage précédent"
                >
                  <HiChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-[#1A1F2B] hover:bg-[#232A38] text-[#D6DCE6] hover:text-[#8EAFFF] border border-[#394150] hover:border-[#8EAFFF]/60 transition active:scale-95"
                  aria-label="Témoignage suivant"
                >
                  <HiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
