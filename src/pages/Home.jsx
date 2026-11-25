import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowRight,
  HiVideoCamera,
  HiArrowTopRightOnSquare,
  HiCircleStack,
  HiGlobeAlt,
} from 'react-icons/hi2';
import { getSettings, getRealisations } from '../utils/api';
import VideoCard916 from '../components/ui/VideoCard916';
import Testimonials from '../components/home/Testimonials';
import HeroDaVinciTimeline from '../components/home/HeroDaVinciTimeline';

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
        } else {
          setRecentRealisations([]);
        }
      })
      .catch((err) => {
        console.error('Erreur chargement réalisations:', err);
        setRecentRealisations([]);
      })
      .finally(() => {
        setLoadingRealisations(false);
      });
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* ── ARRIÈRE-PLAN ANIMÉ HAUTE COUTURE INSPIRÉ DE DAVINCI RESOLVE ── */}
      <HeroDaVinciTimeline />

      {/* Halo radial diffus en arrière-plan d'en-tête (accent bleu électrique doux) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] pointer-events-none radial-halo opacity-60 z-0" />

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
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1A1F2B] border border-[#394150] text-xs font-mono text-[#D6DCE6] mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF] animate-pulse" />
              <span>Studio Digital & Vidéo Indépendant</span>
            </div>

            {/* Titre principal */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F5F6F8] leading-[1.08] mb-6">
              Créer des outils utiles. <br className="hidden sm:inline" />
              Concevoir des créations soignées.
            </h1>

            {/* Sous-titre multidisciplinaire */}
            <p className="text-[#D6DCE6] text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl mb-10">
              Vitali Studio est un espace indépendant dédié au code, à la data et à la création vidéo. Né de l’envie d’inventer et d’expérimenter, le studio développe des solutions concrètes : du clipping vidéo haute rétention aux scripts d’automatisation et interfaces web épurées.
            </p>

            {/* Deux CTA propres */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/services"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-sm transition shadow-lg shadow-[#8EAFFF]/15 active:scale-[0.98]"
              >
                <span>Découvrir nos services</span>
                <HiArrowRight className="w-4 h-4 text-[#0B0D12]" />
              </Link>

              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1A1F2B] hover:bg-[#232A38] border border-[#394150] hover:border-[#8EAFFF]/60 text-[#F5F6F8] font-medium text-sm transition active:scale-[0.98]"
              >
                <span>Explorer les projets</span>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── 2. NOTRE APPROCHE (INVERSÉE : PLACÉE EN PREMIER) ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-8 sm:p-12 rounded-2xl bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/50 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11151D] border border-[#394150] text-[11px] font-mono text-[#8EAFFF]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF] animate-pulse" />
                  <span>NOTRE APPROCHE & PHILOSOPHIE</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8]">
                  Rigueur technique, transparence et travail sur-mesure
                </h3>
                <p className="text-[#D6DCE6] text-sm sm:text-base leading-relaxed font-sans">
                  Nous privilégions un artisanat numérique soigné plutôt que des recettes automatisées à la chaîne. Qu’il s’agisse de découper et monter une série d’extraits vidéo haute rétention ou de bâtir une automatisation sur-mesure, vous bénéficiez d’un échange direct, sans intermédiaire et fondé sur une écoute attentive de vos besoins.
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link
                  to="/a-propos"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#232A38] hover:bg-[#2D3546] border border-[#394150] hover:border-[#8EAFFF]/60 text-[#F5F6F8] text-xs font-mono transition shadow-sm"
                >
                  <span>En savoir plus sur le studio →</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── 3. LES TROIS PÔLES DU STUDIO (DOMAINES D'INTERVENTION) ────── */}
        <section>
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] block mb-2 font-medium">
              01 // DOMAINES D'INTERVENTION
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#F5F6F8]">
              Une expertise triple & transversale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pôle 1 : Vidéo & Formats courts (Actif) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-8 flex flex-col justify-between bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] rounded-2xl transition-all duration-300 relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF]">
                    <HiVideoCamera className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#11151D] border border-[#8EAFFF]/40 text-[#8EAFFF] text-[11px] font-mono font-medium">
                    ● Actif
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F5F6F8] mb-3">
                  Vidéo & Formats courts
                </h3>

                <p className="text-[#B6C0D0] text-sm leading-relaxed mb-6 font-sans">
                  Clipping chirurgical de vidéos longues, conférences, lives et podcasts au format 9:16 (TikTok, Reels, Shorts), optimisé pour la rétention et l'impact visuel.
                </p>
              </div>

              <div className="pt-4 border-t border-[#394150] space-y-4">
                <div className="space-y-1.5 text-xs font-mono text-[#B6C0D0]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                    <span>Recadrage dynamique 9:16 & sous-titres animés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                    <span>Paiement unique au clip (sans abonnement)</span>
                  </div>
                </div>

                <Link
                  to="/services/clipping"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#8EAFFF] hover:text-[#B3CAFF] transition group-hover:translate-x-1"
                >
                  <span>Accéder aux packs Clipping</span>
                  <HiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Pôle 2 : Automatisations & Data (Sur-mesure) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-8 flex flex-col justify-between bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] rounded-2xl transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF]">
                    <HiCircleStack className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#11151D] border border-[#394150] text-[#B6C0D0] text-[11px] font-mono">
                    Sur-mesure
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F5F6F8] mb-3">
                  Automatisations & Data
                </h3>

                <p className="text-[#B6C0D0] text-sm leading-relaxed mb-6 font-sans">
                  Conception de pipelines de web scraping, scripts Python sur-mesure et automatisation de flux opérationnels pour valoriser vos données.
                </p>
              </div>

              <div className="pt-4 border-t border-[#394150] space-y-4">
                <div className="space-y-1.5 text-xs font-mono text-[#B6C0D0]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                    <span>Extraction massive & contournement anti-bot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                    <span>Connecteurs API & micro-APIs sur-mesure</span>
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-xs font-mono text-[#D6DCE6] hover:text-[#8EAFFF] transition group-hover:translate-x-1"
                >
                  <span>Discuter d’un besoin data →</span>
                </Link>
              </div>
            </motion.div>

            {/* Pôle 3 : Web & Outils personnalisés (Sur-mesure) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-8 flex flex-col justify-between bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] rounded-2xl transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF]">
                    <HiGlobeAlt className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#11151D] border border-[#394150] text-[#B6C0D0] text-[11px] font-mono">
                    Sur-mesure
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F5F6F8] mb-3">
                  Web & Micro-Outils
                </h3>

                <p className="text-[#B6C0D0] text-sm leading-relaxed mb-6 font-sans">
                  Développement d'interfaces web épurées, dashboards légers et outils internes orientés performance, maintenabilité et sobriété esthétique.
                </p>
              </div>

              <div className="pt-4 border-t border-[#394150] space-y-4">
                <div className="space-y-1.5 text-xs font-mono text-[#B6C0D0]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                    <span>Architecture React, Tailwind CSS & Serverless</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                    <span>Interfaces sobres, minimalistes & réactives</span>
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-xs font-mono text-[#D6DCE6] hover:text-[#8EAFFF] transition group-hover:translate-x-1"
                >
                  <span>Proposer un projet web →</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 4. SECTION RÉALISATIONS (SHOWCASE AVEC LIEN DIRECT VERS /PORTFOLIO) ── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#394150]">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
                02 // SHOWCASE RÉALISATIONS (9:16 & 16:9)
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#F5F6F8] mt-1">
                Réalisations & Formats Courts
              </h2>
              <p className="text-xs sm:text-sm text-[#B6C0D0] mt-1 font-sans">
                Découvrez nos vidéos montées pour TikTok, Reels, Shorts et YouTube, calibrées pour maximiser la rétention.
              </p>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] text-xs font-semibold shadow-md transition self-start sm:self-auto active:scale-95"
            >
              <span>Accéder à la page Réalisations</span>
              <HiArrowRight className="w-3.5 h-3.5 text-[#0B0D12]" />
            </Link>
          </div>

          {/* Grille dynamique ou cartes interactives cliquables */}
          {recentRealisations.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {recentRealisations.map((item, idx) => (
                  <VideoCard916 key={item._id || idx} item={item} />
                ))}
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#1A1F2B] hover:bg-[#232A38] border border-[#394150] hover:border-[#8EAFFF]/60 text-xs font-mono text-[#F5F6F8] transition"
                >
                  <span>Voir toutes les démonstrations sur la page Portfolio</span>
                  <HiArrowRight className="w-4 h-4 text-[#8EAFFF]" />
                </Link>
              </div>
            </div>
          ) : (
            /* Cartes vitrines cliquables conduisant directement à /portfolio */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Podcasts & Interviews',
                  format: 'Format 9:16 Rétention',
                  desc: 'Découpage dynamique multi-caméra, sous-titres animés au mot près et zoom immersifs sur les punchlines.',
                  badge: 'Podcast',
                  tag: 'Sous-titres Animés',
                },
                {
                  title: 'Conférences & Keynotes',
                  format: 'Format Storytelling',
                  desc: 'Synthèse rythmée de talks longs, split-screen orateur/slides et habillage graphique minimaliste.',
                  badge: 'Conférence',
                  tag: 'Storytelling',
                },
                {
                  title: 'Lives & Débats Twitch/YT',
                  format: 'Format Réaction & Punch',
                  desc: 'Extraction des moments d’anthologie, incrustation du chat, sound design et amplification des réactions.',
                  badge: 'Live',
                  tag: 'Sound Design',
                },
              ].map((item, i) => (
                <Link
                  key={i}
                  to="/portfolio"
                  className="p-7 rounded-2xl bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/70 hover:bg-[#232A38] transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-lg hover:shadow-xl hover:shadow-[#8EAFFF]/5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#11151D] border border-[#394150] text-[#8EAFFF]">
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-mono text-[#717F9A] uppercase tracking-wider">
                        9:16 HD
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-[#F5F6F8] mb-2 group-hover:text-[#8EAFFF] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs font-mono text-[#8EAFFF]/90 mb-3 font-medium">
                      {item.format}
                    </p>

                    <p className="text-[#B6C0D0] text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#394150] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#B6C0D0] bg-[#11151D] px-2 py-0.5 rounded border border-[#394150]">
                      {item.tag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8EAFFF] group-hover:translate-x-1 transition-transform">
                      <span>Voir sur le Portfolio</span>
                      <HiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION AVIS CLIENTS (MASQUÉE AUTOMATIQUEMENT SI VIDE) ── */}
        <Testimonials />

        {/* ── 5. SECTION FINALE (CTA SOBRE ET CLAIR) ────────────────── */}
        <section className="pt-4">
          <div className="rounded-2xl bg-[#1A1F2B] border border-[#394150] p-10 sm:p-16 text-center max-w-3xl mx-auto shadow-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] block mb-3 font-medium">
              ENGAGER UNE COLLABORATION
            </span>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F5F6F8] mb-4">
              Donnons vie à vos projets vidéo et digitaux
            </h2>

            <p className="text-[#D6DCE6] text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8 font-sans">
              Commandez directement vos packs de clipping vidéo via notre profil Fiverr vérifié, ou contactez-nous pour toute demande sur-mesure.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4">
              <a
                href={fiverrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-sm transition shadow-lg shadow-[#8EAFFF]/15 active:scale-[0.98]"
              >
                <span>Commander un pack sur Fiverr</span>
                <HiArrowTopRightOnSquare className="w-4 h-4 text-[#0B0D12]" />
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#232A38] hover:bg-[#2D3546] border border-[#394150] hover:border-[#8EAFFF]/60 text-[#F5F6F8] font-medium text-sm transition active:scale-[0.98]"
              >
                <span>Question ou besoin spécifique</span>
                <HiArrowRight className="w-4 h-4 text-[#8EAFFF]" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
