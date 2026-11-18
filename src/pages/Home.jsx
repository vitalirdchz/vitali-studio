import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowRight,
  HiVideoCamera,
  HiCommandLine,
  HiCircleStack,
  HiSparkles,
  HiArrowTopRightOnSquare,
  HiShieldCheck,
  HiCpuChip,
} from 'react-icons/hi2';
import { getSettings, getPortfolio } from '../utils/api';

export default function Home() {
  const [fiverrUrl, setFiverrUrl] = useState('https://www.fiverr.com');
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    getSettings().then((d) => {
      if (d?.fiverrUrl) setFiverrUrl(d.fiverrUrl);
    }).catch(() => {});

    getPortfolio().then((items) => {
      if (Array.isArray(items) && items.length > 0) {
        setFeaturedProjects(items.slice(0, 3));
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 border-b border-white/10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-white/10 text-xs font-mono text-gray-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>STUDIO DIGITAL MULTIDISCIPLINAIRE // VITALI</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
            L'alliance chirurgicale du <span className="text-gray-400">Code</span>, de la <span className="text-gray-400">Vidéo</span> et de la <span className="text-white">Data</span>.
          </h1>

          <p className="text-gray-400 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl mb-10">
            Vitali Studio conçoit des solutions numériques à haute rétention : montage vidéo dynamique assisté par IA, scrapers de données robustes et scripts d'automatisation sur-mesure pour créateurs, fondateurs et équipes ambitieuses.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition active:scale-95 shadow-md"
            >
              <span>Explorer les Services</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#161616] hover:bg-[#202020] border border-white/10 text-sm font-medium text-white transition active:scale-95"
            >
              <span>Voir les Réalisations</span>
            </Link>
            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-gray-400 hover:text-white text-sm font-medium transition"
            >
              <span>Profil Fiverr</span>
              <HiArrowTopRightOnSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID : LES 3 PILIERS DU STUDIO ─────────────────── */}
      <section className="py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
              01 // EXPERTISES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
              Architecture Hybride
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-md mt-2 sm:mt-0">
            Une synergie entre précision technique du code et sensibilité visuelle moderne.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Clipping IA (Principal) */}
          <div className="md:col-span-7 bento-card p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-rose/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-white/10 flex items-center justify-center mb-6 text-white">
                <HiVideoCamera className="w-6 h-6 text-accent-rose" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#202020] border border-white/10 text-[11px] font-mono text-gray-300 uppercase mb-3">
                Prestation Active • Livrée sous 24-48h
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                Clipping Vidéo IA & Rétention Algorithmique
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
                Transformation de longs flux (streams, podcasts, interviews, replays) en clips verticaux 9:16 optimisés pour TikTok, Reels et Shorts. Détection IA des accroches, découpage rythmé et titrage cinétique.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-300 mb-8 font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-rose" />
                  <span>Règle stricte du 1080p source</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                  <span>Sous-titrage animé sur-mesure</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-rose" />
                  <span>Sound design & B-rolls</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                  <span>Format calibré pour l'algorithme</span>
                </li>
              </ul>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-accent-cyan transition"
            >
              <span>Découvrir les offres Starter / Pro / Premium</span>
              <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Web Scraping */}
          <div className="md:col-span-5 bento-card p-8 sm:p-10 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-white/10 flex items-center justify-center mb-6 text-white">
                <HiCircleStack className="w-6 h-6 text-accent-cyan" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#202020] border border-white/10 text-[11px] font-mono text-gray-400 uppercase mb-3">
                Pôle Data & Web
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">
                Web Scraping & Extraction Structurée
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Extraction automatisée de données volumineuses sur des cibles complexes (e-commerce, réseaux, annuaires). Contournement anti-bot, parsing chirurgical et exports exploitables (JSON, CSV, Postgres).
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-500">
              <span>Python • Playwright • Cheerio</span>
              <span className="text-emerald-400">R&D Active</span>
            </div>
          </div>

          {/* Card 3: Automatisations & Micro-Outils */}
          <div className="md:col-span-6 bento-card p-8 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-white/10 flex items-center justify-center mb-6 text-white">
                <HiCommandLine className="w-6 h-6 text-white" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#202020] border border-white/10 text-[11px] font-mono text-gray-400 uppercase mb-3">
                Pôle Automatisation
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                Outils & Scripts sur-mesure
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Développement de scripts d'automatisation des tâches répétitives, connecteurs API, bots Discord/Telegram et pipelines de publication automatisés.
              </p>
            </div>
            <span className="text-xs font-mono text-gray-500">REST APIs • Serverless • Micro-services</span>
          </div>

          {/* Card 4: Métriques & Engagement Qualité */}
          <div className="md:col-span-6 bento-card p-8 flex flex-col justify-between bg-gradient-to-br from-[#121212] via-[#121212] to-[#181818]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-white/10 flex items-center justify-center mb-6 text-white">
                <HiShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#202020] border border-white/10 text-[11px] font-mono text-emerald-400 uppercase mb-3">
                Garantie Technique
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                Le Standard « Zéro Template »
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Chaque livraison respecte un cahier des charges rigoureux : calibration couleur, normalisation audio (LUFS), timing au frame près et validation humaine systématique.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center font-mono">
              <div>
                <div className="text-xl font-bold text-white">+150</div>
                <div className="text-[10px] text-gray-500 uppercase">Clips Livrés</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">4.9★</div>
                <div className="text-[10px] text-gray-500 uppercase">Satisfaction</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">&lt;48h</div>
                <div className="text-[10px] text-gray-500 uppercase">Turnaround</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── APERÇU PORTFOLIO RECENT ──────────────────────────────── */}
      <section className="py-16 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
              02 // SHOWCASE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Sélection de Projets Récentes
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mt-3 sm:mt-0 font-medium"
          >
            <span>Voir toute la galerie</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Shorts Gaming & High-Energy Clips',
              client: 'Alexandre R. (Twitch Partner)',
              tag: 'Vidéo',
              desc: 'Découpage ultra-dynamique, sous-titres animés et sound effects rythmés.',
              thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
            },
            {
              title: 'Podcast Business & Hooks Viraux 9:16',
              client: 'Mindset Academy',
              tag: 'Vidéo',
              desc: 'Recadrage visage par IA, punchlines isolées et chapitrage intelligent.',
              thumb: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
            },
            {
              title: 'Pipeline de Scraping E-Commerce Multi-Sources',
              client: 'DataFlow Solutions',
              tag: 'Data',
              desc: 'Extraction quotidienne de 50k fiches produits avec résolution des captchas.',
              thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            },
          ].map((item, idx) => (
            <div key={idx} className="bento-card overflow-hidden group">
              <div className="aspect-video w-full bg-[#181818] overflow-hidden relative">
                <img
                  src={item.thumb}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-mono text-white border border-white/10">
                  {item.tag}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-white text-base mb-1 group-hover:text-accent-cyan transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 font-mono mb-3">{item.client}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CALL TO ACTION ───────────────────────────────────────── */}
      <section className="py-20 border-t border-white/10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à faire passer vos contenus au niveau supérieur ?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
            Commandez vos clips directement via Fiverr en toute sécurité ou contactez-moi pour un besoin spécifique en code ou extraction de données.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition shadow-lg"
            >
              <span>Commander sur Fiverr</span>
              <HiArrowTopRightOnSquare className="w-4 h-4" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#161616] hover:bg-[#202020] border border-white/10 text-white font-medium text-sm transition"
            >
              <span>Me contacter</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
