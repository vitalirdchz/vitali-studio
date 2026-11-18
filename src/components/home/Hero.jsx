import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight, HiSparkles } from 'react-icons/hi2';
import { RiShoppingBag3Line } from 'react-icons/ri';
import GradientText from '../ui/GradientText';
import Button from '../ui/Button';
import { getSettings } from '../../utils/api';

export default function Hero() {
  const [fiverrUrl, setFiverrUrl] = useState('https://www.fiverr.com');
  const [heroSubtitle, setHeroSubtitle] = useState('');

  useEffect(() => {
    getSettings()
      .then((data) => {
        if (data?.fiverrUrl) setFiverrUrl(data.fiverrUrl);
        if (data?.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
      })
      .catch(() => {});
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] },
    },
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-dark-800">
      {/* Background Glows & Grids */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-accent-rose/15 via-accent-cyan/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent-rose/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div 
        className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" 
      />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-dark-700/80 border border-white/10 backdrop-blur-md text-gray-300 shadow-inner">
              <HiSparkles className="text-accent-cyan animate-pulse" />
              <span>Studio Créatif & Montage IA de Nouvelle Génération</span>
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.08] mb-6"
          >
            Montage Vidéo & <br className="hidden sm:inline" />
            <GradientText>Clipping IA</GradientText> Premium
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
          >
            {heroSubtitle || (
              <>
                Je transforme vos longs formats, streams et podcasts en <span className="text-white font-medium">clips viraux à fort engagement</span> (TikTok, Reels, Shorts) grâce à la puissance des workflows IA et un montage dynamique sur-mesure.
              </>
            )}
          </motion.p>

          {/* Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
          >
            <Button
              variant="primary"
              onClick={scrollToServices}
              icon={<HiArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-xl shadow-accent-rose/20 text-base py-4 px-8"
            >
              Découvrir mes services
            </Button>
            <Button
              variant="secondary"
              href={fiverrUrl}
              icon={<RiShoppingBag3Line className="w-5 h-5 text-accent-cyan" />}
              className="w-full sm:w-auto text-base py-4 px-8"
            >
              Commander sur Fiverr
            </Button>
          </motion.div>

          {/* Metrics */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-white/10 w-full max-w-2xl"
          >
            <div className="text-center">
              <div className="font-display font-black text-2xl sm:text-4xl gradient-text mb-1">
                +150
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">
                Clips Ultra-Dynamiques
              </div>
            </div>
            <div className="text-center border-x border-white/10 px-2 sm:px-4">
              <div className="font-display font-black text-2xl sm:text-4xl gradient-text mb-1">
                4.9★
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">
                Note Clients Fiverr
              </div>
            </div>
            <div className="text-center">
              <div className="font-display font-black text-2xl sm:text-4xl gradient-text mb-1">
                24-48h
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">
                Délai de Livraison Moyen
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
