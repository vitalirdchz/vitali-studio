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
  HiCircleStack,
  HiGlobeAlt,
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
          // Affiche les 3 dernières réalisations publiées
          setRecentRealisations(items.slice(0, 3));
        }
      })
      .catch((err) => {
        console.error('Erreur chargement réalisations:', err);
      })
      .finally(() => {
        setLoadingRealisations(false);
      });
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Halo radial diffus en arrière-plan d'en-tête (indigo 9-10%) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] pointer-events-none radial-halo opacity-90 z-0" />

      <div className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-28">
        {/* ── 1. HERO SECTION : VISION MULTIDISCIPLINAIRE ───────── */}
        <section className="pt-8 sm:pt-16 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            {/* Badge discret */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111113] border border-white/10 text-xs font-mono text-gray-300 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Studio Digital & Vidéo Indépendant</span>
            </div>

            {/* Titre principal */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
              Créer des outils utiles. <br className="hidden sm:inline" />
              Concevoir des créations soignées.
            </h1>

            {/* Sous-titre multidisciplinaire */}
            <p className="text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl mb-10">
              Vitali Studio est un espace indépendant dédié au code, à la data et à la création vidéo. Né de l’envie d’inventer et d’expérimenter, le studio développe des solutions concrètes : de l’extraction vidéo rythmée aux scripts d’automatisation et interfaces web épurées.
            </p>

            {/* Deux boutons propres */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/services"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition shadow-lg active:scale-[0.98]"
              >
                <span>Découvrir nos services</span>
                <HiArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#141416] hover:bg-[#1a1a1e] border border-white/10 hover:border-indigo-500/30 text-sm font-medium text-white transition active:scale-[0.98]"
              >
                <span>Explorer le portfolio</span>
              </Link>

              <Link
                to="/a-propos"
                className="inline-flex items-center gap-1.5 px-4 py-3.5 text-xs font-mono text-gray-400 hover:text-white transition"
              >
                <span>Découvrir le studio →</span>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── 2. LES PÔLES DU STUDIO (GRILLE BENTO 3 COLONNES) ──── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
                01 // LES PÔLES DU STUDIO
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white mt-1">
                Trois disciplines, une même exigence
              </h2>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm max-w-md mt-2 sm:mt-0 font-mono">
              Un savoir-faire alliant sensibilité visuelle et rigueur d'ingénierie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pôle 1 : Vidéo & Formats courts (Actif) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bento-card p-8 flex flex-col justify-between bg-[#111113] border-white/10 hover:border-indigo-500/30 transition-all duration-300 relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#17171B] border border-white/10 flex items-center justify-center text-indigo-400">
                    <HiVideoCamera className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono font-medium">
                    ● Actif
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">
                  Vidéo & Formats courts
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Clipping chirurgical de vidéos longues, conférences, lives et podcasts au format 9:16 (TikTok, Reels, Shorts), avec une ouverture continue vers la réalisation audiovisuelle et l'optimisation de la rétention.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="space-y-1.5 text-xs font-mono text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Recadrage dynamique 9:16 & sous-titres animés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Paiement unique au clip (sans abonnement)</span>
                  </div>
                </div>

                <Link
                  to="/services/clipping"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-white hover:text-indigo-300 transition group-hover:translate-x-1"
                >
                  <span>Accéder aux packs Clipping</span>
                  <HiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Pôle 2 : Automatisations & Data (En développement) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bento-card p-8 flex flex-col justify-between bg-[#111113] border-white/10 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#17171B] border border-white/10 flex items-center justify-center text-gray-300">
                    <HiCircleStack className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[11px] font-mono">
                    En développement
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">
                  Automatisations & Data
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Conception de pipelines de web scraping, scripts Python sur-mesure et automatisation de flux opérationnels pour éliminer les tâches répétitives et valoriser la donnée brute.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="space-y-1.5 text-xs font-mono text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    <span>Extraction massive & contournement anti-bot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    <span>Connecteurs API & micro-APIs sur-mesure</span>
                  </div>
                </div>

                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition"
                >
                  <span>Consulter la feuille de route →</span>
                </Link>
              </div>
            </motion.div>

            {/* Pôle 3 : Web & Créations sur-mesure (En développement) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bento-card p-8 flex flex-col justify-between bg-[#111113] border-white/10 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#17171B] border border-white/10 flex items-center justify-center text-gray-300">
                    <HiGlobeAlt className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[11px] font-mono">
                    En développement
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">
                  Web & Créations sur-mesure
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Conception de sites web sobres, d’interfaces minimalistes et d’outils numériques sans artifice, pensés pour offrir une ergonomie fluide et une vitesse d’exécution optimale.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="space-y-1.5 text-xs font-mono text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    <span>Interfaces modernes & sobres (React / Vite)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    <span>Performance, clarté et zéro distraction</span>
                  </div>
                </div>

                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition"
                >
                  <span>Proposer un projet web →</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 3. PHILOSOPHIE DU STUDIO EN BREF ──────────────────── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-8 sm:p-12 rounded-2xl bg-[#111113] border border-white/10 relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
                  NOTRE APPROCHE
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Rigueur technique, transparence et travail sur-mesure
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Nous privilégions un artisanat numérique soigné plutôt que des recettes toutes faites. Qu’il s’agisse de monter une série d’extraits vidéo ou de bâtir une automatisation, vous bénéficiez d’un échange direct, sans intermédiaire et fondé sur une écoute attentive de vos besoins.
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link
                  to="/a-propos"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#161619] hover:bg-[#1E1E22] border border-white/10 hover:border-indigo-500/30 text-white text-xs font-mono transition"
                >
                  <span>En savoir plus sur le studio →</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── 4. APERÇU DES RÉALISATIONS (CONNECTÉ À MONGODB) ─────── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
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
                  className="bento-card aspect-[9/16] animate-pulse bg-[#121214] rounded-2xl"
                />
              ))}
            </div>
          ) : recentRealisations.length === 0 ? (
            /* Encart minimaliste et pro quand la base est vide */
            <div className="py-16 px-6 rounded-2xl border border-white/10 bg-[#111113] text-center max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xl bg-[#17171B] border border-white/10 text-gray-400 flex items-center justify-center mx-auto mb-4">
                <HiFilm className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="font-display font-semibold text-white text-base mb-2">
                Démonstrations en cours de préparation
              </h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed mb-6 font-sans">
                Les extraits vidéos au format vertical (9:16) sont actuellement en cours d’encodage et de mise en ligne.
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
                      className="bento-card overflow-hidden flex flex-col justify-between bg-[#111113] border-white/10 hover:border-indigo-500/30 transition-all duration-300 group rounded-2xl"
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
                      <div className="p-4 bg-[#141417]">
                        <h4 className="font-display font-bold text-white text-sm mb-1 line-clamp-1">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-sans">
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#141417] hover:bg-[#1A1A1E] border border-white/10 hover:border-indigo-500/30 text-xs font-mono text-white transition"
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
          <div className="rounded-2xl bg-[#111113] border border-white/10 p-10 sm:p-16 text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 block mb-3">
              ENGAGER UNE COLLABORATION
            </span>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Donnons vie à vos projets vidéo et digitaux
            </h2>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8 font-sans">
              Vous souhaitez commander vos clips vidéo via Fiverr ou discuter d’un besoin technique spécifique ? N’hésitez pas à nous contacter directement.
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
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#161619] hover:bg-[#1E1E22] border border-white/10 hover:border-indigo-500/30 text-white font-medium text-sm transition active:scale-[0.98]"
              >
                <span>Discuter d’un projet</span>
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
