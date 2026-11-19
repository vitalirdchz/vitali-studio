import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowRight,
  HiVideoCamera,
  HiCommandLine,
  HiArrowTopRightOnSquare,
  HiShieldCheck,
  HiFilm,
} from 'react-icons/hi2';
import { getSettings, getRealisations } from '../utils/api';

/**
 * Normalizes video links (YouTube Shorts, standard YouTube, TikTok, direct video) into embeddable iframe URLs.
 */
function parseEmbedUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();

  // If user pasted full iframe tag: extract src
  const iframeMatch = trimmed.match(/src=["'](.*?)["']/);
  if (iframeMatch && iframeMatch[1]) {
    return { type: 'iframe', src: iframeMatch[1] };
  }

  // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=0&rel=0`,
    };
  }

  // YouTube standard: youtu.be/VIDEO_ID or watch?v=VIDEO_ID
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
    };
  }

  // Direct video file (mp4, webm, mov)
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed)) {
    return { type: 'video', src: trimmed };
  }

  // Fallback to iframe
  return { type: 'iframe', src: trimmed };
}

export default function Home() {
  const [fiverrUrl, setFiverrUrl] = useState('https://www.fiverr.com');
  const [recentRealisations, setRecentRealisations] = useState([]);
  const [loadingRealisations, setLoadingRealisations] = useState(true);

  useEffect(() => {
    getSettings()
      .then((d) => {
        if (d?.fiverrUrl) setFiverrUrl(d.fiverrUrl);
      })
      .catch(() => {});

    getRealisations()
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          // Display the 3 most recent realisations
          setRecentRealisations(items.slice(0, 3));
        }
      })
      .catch((err) => {
        console.error('Error loading realisations:', err);
      })
      .finally(() => {
        setLoadingRealisations(false);
      });
  }, []);

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-28">
      {/* ── 1. HERO SECTION ─────────────────────────────────────── */}
      <section className="pt-8 sm:pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          {/* Badge discret */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-white/10 text-xs font-mono text-gray-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Studio Digital & Vidéo</span>
          </div>

          {/* Titre principal */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
            L’art du format court. <br className="hidden sm:inline" />
            La rigueur des architectures sur-mesure.
          </h1>

          {/* Sous-titre */}
          <p className="text-gray-400 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl mb-10">
            Vitali Studio transforme vos contenus longs — podcasts, lives et conférences — en formats courts (9:16) ultra-percutants pour TikTok, Reels et Shorts, tout en développant des outils et automatisations numériques sur-mesure.
          </p>

          {/* Deux CTA propres */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/services/clipping"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition shadow-lg active:scale-[0.98]"
            >
              <span>Voir les packs Clipping</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 text-sm font-medium text-white transition active:scale-[0.98]"
            >
              <span>Explorer les réalisations</span>
            </Link>

            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3.5 text-xs font-mono text-gray-500 hover:text-white transition"
            >
              <span>Commander sur Fiverr</span>
              <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── 2. PRÉSENTATION DU STUDIO (GRILLE BENTO 3 COLONNES) ─── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
              01 // APPROCHE DU STUDIO
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white mt-1">
              Précision Visuelle & Maîtrise Technique
            </h2>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm max-w-md mt-2 sm:mt-0 font-mono">
            Trois piliers fondamentaux au service de la rétention et de la clarté.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carte 1 : Clipping & Rétention */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bento-card p-8 flex flex-col justify-between bg-[#101010] border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#161616] border border-white/10 flex items-center justify-center mb-6 text-white">
                <HiVideoCamera className="w-6 h-6 text-white" />
              </div>

              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-2">
                Format Vertical 9:16
              </span>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">
                Clipping & Rétention
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Conversion chirurgicale de vos podcasts, lives, conférences et vidéos longues en formats courts percutants calibrés pour l’algorithme de TikTok, Reels et YouTube Shorts.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-1.5 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>Détection des moments forts & punchlines</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>Rythme soutenu sans temps mort</span>
              </div>
            </div>
          </motion.div>

          {/* Carte 2 : Maîtrise Technique */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bento-card p-8 flex flex-col justify-between bg-[#101010] border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#161616] border border-white/10 flex items-center justify-center mb-6 text-white">
                <HiShieldCheck className="w-6 h-6 text-white" />
              </div>

              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-2">
                Normes & Standards
              </span>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">
                Maîtrise Technique
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Un pipeline optimisé de bout en bout : recadrage dynamique centré sur le sujet, sous-titres dynamiques synchronisés haute visibilité et export HD 1080x1920 fluide.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-1.5 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Règle conseillée du 1080p source</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Mixage et normalisation audio claire</span>
              </div>
            </div>
          </motion.div>

          {/* Carte 3 : Vision Multidisciplinaire */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bento-card p-8 flex flex-col justify-between bg-[#101010] border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#161616] border border-white/10 flex items-center justify-center mb-6 text-white">
                <HiCommandLine className="w-6 h-6 text-white" />
              </div>

              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-2">
                Code & Automatisation
              </span>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">
                Vision Multidisciplinaire
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Un studio en constante évolution : la vidéo aujourd’hui, l’ingénierie logicielle et les automatisations de données demain. Une double compétence pour répondre à des besoins sur-mesure.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-1.5 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                <span>Web Scraping & pipelines de données</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                <span>Micro-outils et scripts sur-mesure</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. FOCUS SERVICE ACTIF (TEASER CLIPPING) ────────────── */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-[#0D0D0D] border border-white/15 p-8 sm:p-12 relative overflow-hidden"
        >
          {/* Subtle background texture */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.015] rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Prestation Ouverte & Prête à la commande</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                Clipping Vidéo (TikTok / Reels / Shorts)
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Profitez d’une formule transparente et modulable selon vos besoins réels : paiement unique calculé au nombre d’extraits (aucun abonnement mensuel obligatoire), options d’habillage à la carte, et respect rigoureux de la qualité source.
              </p>

              {/* Highlights pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-gray-300">
                  <div className="font-semibold text-white mb-0.5">3 Packs Dédiés</div>
                  <div className="text-gray-400 text-[11px]">Découverte, Standard, Volume</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-gray-300">
                  <div className="font-semibold text-white mb-0.5">Paiement Unique</div>
                  <div className="text-gray-400 text-[11px]">Aucun prélèvement mensuel</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-gray-300">
                  <div className="font-semibold text-white mb-0.5">Options à la carte</div>
                  <div className="text-gray-400 text-[11px]">Express, Multicam, Sous-titres</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-stretch gap-3 flex-shrink-0">
              <Link
                to="/services/clipping"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition shadow-lg text-center"
              >
                <span>Accéder aux 3 packs & options</span>
                <HiArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#161616] hover:bg-[#1e1e1e] border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition text-center"
              >
                <span>Voir les services à venir ou proposer un besoin →</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 4. APERÇU DES RÉALISATIONS (CONNECTÉ À MONGODB) ─────── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
              02 // DÉMONSTRATIONS EN VERTICAL
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white mt-1">
              Aperçu des Réalisations
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition mt-3 sm:mt-0 uppercase tracking-wider"
          >
            <span>Explorer toute la galerie</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grille ou état vide */}
        {loadingRealisations ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bento-card aspect-[9/16] animate-pulse bg-[#121212] rounded-2xl"
              />
            ))}
          </div>
        ) : recentRealisations.length === 0 ? (
          /* Encart minimaliste et pro quand la base est vide */
          <div className="py-16 px-6 rounded-2xl border border-white/10 bg-[#0F0F0F] text-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-[#161616] border border-white/10 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <HiFilm className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-display font-semibold text-white text-base mb-2">
              Démonstrations en cours de préparation
            </h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed mb-6 font-sans">
              Les extraits vidéos au format vertical (9:16) sont actuellement en cours d’encodage et de publication au sein du studio.
            </p>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition"
            >
              <span>Accéder à la page Portfolio</span>
              <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {recentRealisations.map((item, idx) => {
                const embed = parseEmbedUrl(item.videoUrl);

                return (
                  <motion.div
                    key={item._id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="bento-card overflow-hidden flex flex-col justify-between bg-[#0F0F0F] border-white/10 hover:border-white/20 transition-all duration-300 group rounded-2xl"
                  >
                    {/* Conteneur vidéo vertical 9:16 */}
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
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                          <HiFilm className="w-8 h-8 text-gray-600 mb-2" />
                          <span className="text-xs font-mono text-gray-500">
                            Aperçu non disponible
                          </span>
                        </div>
                      )}

                      {/* Catégorie badge */}
                      {item.category && (
                        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-gray-300 uppercase tracking-wider border border-white/10">
                          {item.category}
                        </div>
                      )}
                    </div>

                    {/* Description & Titre */}
                    <div className="p-4 bg-[#111111]">
                      <h4 className="font-display font-bold text-white text-sm mb-1 line-clamp-1">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 text-xs font-mono text-white transition"
              >
                <span>Voir toutes les réalisations sur le Portfolio</span>
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ── 5. SECTION FINALE (CTA SOBRE) ────────────────────────── */}
      <section className="pt-8">
        <div className="rounded-2xl bg-[#0D0D0D] border border-white/10 p-10 sm:p-16 text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-3">
            LANCER UN PROJET
          </span>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Transformons vos contenus en formats viraux.
          </h2>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8 font-sans">
            Passez commande directement sur Fiverr en toute sécurité ou contactez le studio pour discuter d’un projet spécifique ou d’un accompagnement technique sur-mesure.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition shadow-lg active:scale-[0.98]"
            >
              <span>Commander sur Fiverr</span>
              <HiArrowTopRightOnSquare className="w-4 h-4" />
            </a>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#161616] hover:bg-[#202020] border border-white/10 text-white font-medium text-sm transition active:scale-[0.98]"
            >
              <span>Discuter d’un projet</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
