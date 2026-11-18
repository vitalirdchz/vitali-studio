import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiCheck,
  HiVideoCamera,
  HiCircleStack,
  HiCommandLine,
  HiShieldExclamation,
  HiArrowTopRightOnSquare,
  HiClock,
  HiSparkles,
} from 'react-icons/hi2';
import { getServices, getSettings } from '../utils/api';

const DEFAULT_TIERS = [
  {
    name: 'Starter',
    tagline: 'Idéal pour tester le potentiel viral de vos flux',
    price: 'Sur devis / Pack Fiverr',
    duration: 'Rushes source jusqu’à 30 minutes',
    clipsCount: '3 à 5 clips verticaux (9:16)',
    delivery: '24h à 48h ouvrées',
    features: [
      'Détection IA des moments forts & punchlines',
      'Recadrage dynamique 9:16 centré sur le sujet',
      'Sous-titres animés bicolores haute visibilité',
      'Exports 1080x1920 60fps optimisés',
      '2 révisions incluses',
    ],
    highlight: false,
  },
  {
    name: 'Pro Viral',
    tagline: 'La formule plébiscitée par les créateurs réguliers',
    price: 'Sur devis / Pack Fiverr',
    duration: 'Rushes source jusqu’à 60 minutes',
    clipsCount: '10 à 15 clips verticaux (9:16)',
    delivery: '48h ouvrées',
    features: [
      'Tout le package Starter inclus',
      'Sound design immersif & B-rolls dynamiques',
      'Animations graphiques & zooms de rétention',
      'Format calibré algorithme TikTok / Reels / Shorts',
      'Suggestions de titres accrocheurs & hashtags SEO',
      'Révisions prioritaires',
    ],
    highlight: true,
  },
  {
    name: 'Pack Créateur Mensuel',
    tagline: 'Délégation totale et parution continue garantie',
    price: 'Abonnement / Devis sur-mesure',
    duration: 'Flux & streams mensuels illimités',
    clipsCount: '25 à 30 clips livrés par mois',
    delivery: 'Livraisons échelonnées sous 24h',
    features: [
      'Production continue de contenu vertical',
      'Stratégie éditoriale & analyse des hooks',
      'Templates de miniatures & branding exclusif',
      'Canal direct privé (Telegram / Discord)',
      'Révisions illimitées',
    ],
    highlight: false,
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fiverrUrl, setFiverrUrl] = useState('https://www.fiverr.com');

  useEffect(() => {
    getSettings().then((d) => {
      if (d?.fiverrUrl) setFiverrUrl(d.fiverrUrl);
    }).catch(() => {});

    getServices()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
          CATALOGUE DES OFFRES
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mt-2 mb-4">
          Services Numériques & Solutions Sur-Mesure
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Découvrez nos prestations clés en main. Du clipping vidéo assisté par intelligence artificielle aux outils d'extraction de données, chaque prestation répond à des exigences techniques sans compromis.
        </p>
      </div>

      {/* ── SERVICE ACTIF : CLIPPING VIDEO IA ───────────────────── */}
      <section className="mb-24">
        {/* Banner Service Card */}
        <div className="bento-card p-8 sm:p-12 mb-12 border-white/15 bg-gradient-to-b from-[#141414] to-[#0E0E0E]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center flex-shrink-0 shadow-lg">
                <HiVideoCamera className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono uppercase mb-2">
                  ● Service Actif & Prêt à la Commande
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Clipping Vidéo IA (Shorts / Reels / TikTok)
                </h2>
                <p className="text-gray-400 text-sm mt-1 max-w-2xl leading-relaxed">
                  Conçu pour les créateurs, streamers et podcasteurs cherchant à multiplier leur audience sans passer 15 heures par semaine sur un banc de montage.
                </p>
              </div>
            </div>

            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition shadow-md flex-shrink-0"
            >
              <span>Commander sur Fiverr</span>
              <HiArrowTopRightOnSquare className="w-4 h-4" />
            </a>
          </div>

          {/* Règle stricte du 1080p */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#181818] border border-amber-500/30 flex items-start gap-3.5 text-xs text-gray-300">
            <HiShieldExclamation className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white uppercase font-mono tracking-wider">
                Règle technique absolue du 1080p minimum :
              </strong>{' '}
              Pour garantir un niveau de netteté d'excellence sur les découpages verticaux 9:16, tout fichier source doit être fourni en résolution minimale de 1920x1080 (4K fortement recommandé). Les sources floues ou inférieures seront refusées.
            </div>
          </div>
        </div>

        {/* 3 Packages / Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {DEFAULT_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={`bento-card p-8 flex flex-col justify-between relative ${
                tier.highlight
                  ? 'border-white/30 bg-[#161616] shadow-xl shadow-white/[0.02]'
                  : 'bg-[#121212]'
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  Recommandé
                </div>
              )}

              <div>
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  Formule {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl font-bold text-white mt-1 mb-2">
                  {tier.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  {tier.tagline}
                </p>

                {/* Specs Box */}
                <div className="space-y-2 py-4 border-y border-white/10 mb-6 text-xs font-mono text-gray-300">
                  <div className="flex items-center gap-2">
                    <HiClock className="w-4 h-4 text-gray-400" />
                    <span>{tier.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiSparkles className="w-4 h-4 text-accent-cyan" />
                    <span className="font-semibold text-white">{tier.clipsCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Délai moyen : {tier.delivery}</span>
                  </div>
                </div>

                {/* Feature List */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <HiCheck className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={fiverrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2 transition ${
                  tier.highlight
                    ? 'bg-white text-black hover:bg-gray-200 shadow-md'
                    : 'bg-[#1a1a1a] text-white hover:bg-[#252525] border border-white/10'
                }`}
              >
                <span>Commander l'offre {tier.name}</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES FUTURS / ROADMAP EN DEV ────────────────────── */}
      <section className="pt-12 border-t border-white/10">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
            ROADMAP TECHNIQUE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Services en Cours d'Intégration & Sur-Mesure
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Ces compétences sont déjà activables sur devis ou commande privée via formulaire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service 2: Web Scraping */}
          <div className="bento-card p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#181818] border border-white/10 flex items-center justify-center text-white">
                  <HiCircleStack className="w-6 h-6 text-accent-cyan" />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[#181818] border border-white/10 text-[11px] font-mono text-gray-400 uppercase">
                  Pôle Data
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                Web Scraping & Pipelines d'Extraction
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                Extraction massive de leads, données de prix, catalogues et métriques concurrentielles. Conception de scripts Python autonomes avec gestion des proxies rotatifs, sessions et contournements Cloudflare.
              </p>
              <ul className="space-y-2 text-xs font-mono text-gray-300 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                  <span>Exports sur-mesure (JSON, CSV, Postgres, Airtable)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                  <span>Résolution des architectures Single-Page (SPA/React)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                  <span>Tâches planifiées (cron jobs) ou micro-APIs</span>
                </li>
              </ul>
            </div>
            <a
              href="mailto:contact@vitalistudio.com?subject=Demande%20Web%20Scraping"
              className="text-xs font-mono text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <span>Demander un devis scraping →</span>
            </a>
          </div>

          {/* Service 3: Outils Python */}
          <div className="bento-card p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#181818] border border-white/10 flex items-center justify-center text-white">
                  <HiCommandLine className="w-6 h-6 text-white" />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[#181818] border border-white/10 text-[11px] font-mono text-gray-400 uppercase">
                  Pôle Code & Scripting
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                Scripts & Micro-Outils d'Automatisation
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                Supprimez les frictions de votre chaîne opérationnelle : traitement batch de médias (FFmpeg automatisé), bots Discord/Telegram pour alertes en temps réel, ou connecteurs sur-mesure entre vos SaaS.
              </p>
              <ul className="space-y-2 text-xs font-mono text-gray-300 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>Scripts CLI rapides & documentés</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>Intégration d'APIs OpenAI / Claude / Whisper</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>Automatisation de découpe vidéo par code (MoviePy)</span>
                </li>
              </ul>
            </div>
            <a
              href="mailto:contact@vitalistudio.com?subject=Demande%20Outil%20Automatisation"
              className="text-xs font-mono text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <span>Demander un script sur-mesure →</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
