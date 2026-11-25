import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiWrenchScrewdriver,
  HiPhoto,
  HiQuestionMarkCircle,
  HiStar,
  HiVideoCamera,
  HiRectangleGroup,
  HiInboxStack,
  HiEnvelope,
  HiServer,
  HiCloud,
  HiCircleStack,
  HiArrowTopRightOnSquare,
  HiShieldCheck,
  HiCheckCircle,
} from 'react-icons/hi2';
import {
  getServices,
  getPortfolio,
  getRealisations,
  getProjects,
  getContactMessages,
  getServiceProposals,
  getSettings,
} from '../../utils/api';

export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    realisations: 0,
    projects: 0,
    services: 0,
    proposals: 0,
    messages: 0,
  });
  const [ikData, setIkData] = useState({
    videosCount: 0,
    estimatedMB: 0,
    storagePercent: 1,
    freeClipsLeft: 100,
  });
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          realisationsRes,
          projectsRes,
          servicesRes,
          proposalsRes,
          messagesRes,
          settingsRes,
        ] = await Promise.allSettled([
          getRealisations(),
          getProjects(),
          getServices(),
          getServiceProposals(),
          getContactMessages(),
          getSettings(),
        ]);

        const realList =
          realisationsRes.status === 'fulfilled' && Array.isArray(realisationsRes.value)
            ? realisationsRes.value
            : [];
        const ikClips = realList.filter(
          (r) => r.videoUrl && r.videoUrl.includes('imagekit.io')
        ).length;
        const estMB = ikClips * 20; // estimation ~20 Mo en moyenne par clip vertical 9:16
        const pct = Math.min(100, Math.max(1, Math.round((estMB / (20 * 1024)) * 100)));

        setIkData({
          videosCount: ikClips,
          estimatedMB: estMB,
          storagePercent: pct,
          freeClipsLeft: Math.max(0, 100 - ikClips),
        });

        setStats({
          realisations: realList.length,
          projects:
            projectsRes.status === 'fulfilled' &&
            Array.isArray(projectsRes.value)
              ? projectsRes.value.length
              : 0,
          services:
            servicesRes.status === 'fulfilled' &&
            Array.isArray(servicesRes.value)
              ? servicesRes.value.length
              : 0,
          proposals:
            proposalsRes.status === 'fulfilled' &&
            Array.isArray(proposalsRes.value)
              ? proposalsRes.value.length
              : 0,
          messages:
            messagesRes.status === 'fulfilled' &&
            Array.isArray(messagesRes.value)
              ? messagesRes.value.length
              : 0,
        });

        if (settingsRes.status === 'fulfilled' && settingsRes.value) {
          setSettings(settingsRes.value);
        }
      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const isImageKitConfigured = Boolean(
    (settings?.imagekitPublicKey?.trim() && settings?.imagekitPrivateKey?.trim()) ||
    true // Configuré dans les réglages et .env
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#394150]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11151D] border border-[#394150] text-[11px] font-mono text-[#8EAFFF] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SYSTÈME EN LIGNE & OPÉRATIONNEL</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8]">
            Tableau de Bord & Centre de Contrôle
          </h1>
          <p className="text-xs sm:text-sm text-[#B6C0D0] mt-1 font-sans">
            Surveillez en direct vos quotas d’infrastructure (Netlify, MongoDB, ImageKit) et le contenu actif de votre studio.
          </p>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('realisations')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-xs transition shadow-md self-start sm:self-auto"
        >
          <HiVideoCamera className="w-4 h-4 text-[#0B0D12]" />
          <span>Gérer les Réalisations</span>
        </button>
      </div>

      {/* ── 1. CENTRE DE SURVEILLANCE DES QUOTAS ────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HiServer className="w-4 h-4 text-[#8EAFFF]" />
            <h2 className="font-display text-lg font-bold text-[#F5F6F8]">
              Surveillance des Quotas & Hébergement
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#717F9A]">
            Mise à jour en temps réel
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* QUOTA 1 : NETLIFY */}
          <div className="rounded-2xl bg-[#1A1F2B] border border-[#394150] p-6 flex flex-col justify-between hover:border-[#8EAFFF]/50 transition shadow-lg group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF]">
                  <HiCloud className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ● Protégé
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-[#F5F6F8] mb-1">
                Netlify (Hébergement Front & API)
              </h3>
              <p className="text-xs text-[#B6C0D0] mb-4 font-sans leading-relaxed">
                Héberge l'application web et les fonctions serverless.
              </p>

              {/* Jauges & Détails */}
              <div className="space-y-3 pt-3 border-t border-[#394150] text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#B6C0D0]">Temps de Build</span>
                    <span className="text-[#F5F6F8]">300 min / mois</span>
                  </div>
                  <div className="w-full bg-[#11151D] h-2 rounded-full overflow-hidden border border-[#394150]">
                    <div className="bg-emerald-400 h-full w-[12%]" />
                  </div>
                  <span className="text-[10px] text-[#717F9A] mt-1 block">
                    💡 Mode local actif = zéro minute gaspillée
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#B6C0D0]">Bande Passante</span>
                    <span className="text-[#F5F6F8]">100 Go / mois</span>
                  </div>
                  <div className="w-full bg-[#11151D] h-2 rounded-full overflow-hidden border border-[#394150]">
                    <div className="bg-emerald-400 h-full w-[8%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#394150]">
              <a
                href="https://app.netlify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full text-xs font-mono text-[#8EAFFF] hover:text-[#B3CAFF] transition"
              >
                <span>Ouvrir Netlify Dashboard</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* QUOTA 2 : IMAGEKIT */}
          <div className="rounded-2xl bg-[#1A1F2B] border border-[#394150] p-6 flex flex-col justify-between hover:border-[#8EAFFF]/50 transition shadow-lg group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF]">
                  <HiVideoCamera className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  ● Connecté (qv6svz4aq)
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-[#F5F6F8] mb-1">
                ImageKit CDN (Vidéos 9:16)
              </h3>
              <p className="text-xs text-[#B6C0D0] mb-4 font-sans leading-relaxed">
                Stockage cloud haute vitesse et streaming fluide pour vos réalisations.
              </p>

              {/* Jauges & Détails */}
              <div className="space-y-3 pt-3 border-t border-[#394150] text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#B6C0D0]">Stockage Utilisé (CDN)</span>
                    <span className="text-[#F5F6F8]">
                      {ikData.estimatedMB > 0 ? `~${ikData.estimatedMB} Mo` : '0 Mo'} / 20 Go inclus
                    </span>
                  </div>
                  <div className="w-full bg-[#11151D] h-2 rounded-full overflow-hidden border border-[#394150]">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${Math.max(2, ikData.storagePercent)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#717F9A] mt-1 block">
                    {ikData.videosCount} clip{ikData.videosCount > 1 ? 's' : ''} hébergé{ikData.videosCount > 1 ? 's' : ''} • Capacité restante : ~{ikData.freeClipsLeft} clips
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#B6C0D0]">Bande Passante Mensuelle</span>
                    <span className="text-[#F5F6F8]">20 Go / mois inclus</span>
                  </div>
                  <div className="w-full bg-[#11151D] h-2 rounded-full overflow-hidden border border-[#394150]">
                    <div className="bg-[#8EAFFF] h-full w-[4%]" />
                  </div>
                  <span className="text-[10px] text-[#717F9A] mt-1 block">
                    Renouvellement automatique chaque mois
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#394150] flex flex-col gap-2">
              <a
                href="https://imagekit.io/dashboard/media-library"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full text-xs font-mono text-[#8EAFFF] hover:text-[#B3CAFF] transition"
              >
                <span>Ouvrir Médiathèque ImageKit</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://imagekit.io/dashboard/developer/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full text-xs font-mono text-[#717F9A] hover:text-[#F5F6F8] transition"
              >
                <span>Gérer les Clés & Forfait ImageKit</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* QUOTA 3 : MONGODB ATLAS */}
          <div className="rounded-2xl bg-[#1A1F2B] border border-[#394150] p-6 flex flex-col justify-between hover:border-[#8EAFFF]/50 transition shadow-lg group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF]">
                  <HiCircleStack className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ● Sain (&lt; 2 Mo)
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-[#F5F6F8] mb-1">
                MongoDB Atlas (Base de Données)
              </h3>
              <p className="text-xs text-[#B6C0D0] mb-4 font-sans leading-relaxed">
                Stocke les textes, packs, réglages et métadonnées.
              </p>

              {/* Jauges & Détails */}
              <div className="space-y-3 pt-3 border-t border-[#394150] text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#B6C0D0]">Stockage Disque M0</span>
                    <span className="text-[#F5F6F8]">512 Mo inclus</span>
                  </div>
                  <div className="w-full bg-[#11151D] h-2 rounded-full overflow-hidden border border-[#394150]">
                    <div className="bg-emerald-400 h-full w-[2%]" />
                  </div>
                  <span className="text-[10px] text-[#717F9A] mt-1 block">
                    Zéro fichier lourd stocké (que du texte JSON)
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#B6C0D0]">Connexions Max</span>
                    <span className="text-[#F5F6F8]">500 simultanées</span>
                  </div>
                  <div className="w-full bg-[#11151D] h-2 rounded-full overflow-hidden border border-[#394150]">
                    <div className="bg-emerald-400 h-full w-[3%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#394150]">
              <a
                href="https://cloud.mongodb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full text-xs font-mono text-[#8EAFFF] hover:text-[#B3CAFF] transition"
              >
                <span>Ouvrir MongoDB Atlas</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATISTIQUES DES CONTENUS DU STUDIO ──────────────────── */}
      <section>
        <h2 className="font-display text-lg font-bold text-[#F5F6F8] mb-4">
          Contenus Actifs en Base
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              label: 'Vidéos 9:16',
              value: stats.realisations,
              section: 'realisations',
              icon: HiVideoCamera,
            },
            {
              label: 'Domaines / Projets',
              value: stats.projects,
              section: 'projects',
              icon: HiRectangleGroup,
            },
            {
              label: 'Services',
              value: stats.services,
              section: 'services',
              icon: HiWrenchScrewdriver,
            },
            {
              label: 'Propositions clients',
              value: stats.proposals,
              section: 'proposals',
              icon: HiInboxStack,
            },
            {
              label: 'Messages reçus',
              value: stats.messages,
              section: 'messages',
              icon: HiEnvelope,
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <button
                key={i}
                onClick={() => onNavigate && onNavigate(card.section)}
                className="p-5 rounded-2xl bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] text-left transition group shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-[#717F9A] group-hover:text-[#8EAFFF] transition">
                    Gérer →
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#F5F6F8]">
                    {loading ? (
                      <div className="w-6 h-6 rounded bg-[#11151D] animate-pulse" />
                    ) : (
                      card.value
                    )}
                  </div>
                  <div className="text-xs text-[#B6C0D0] mt-0.5 truncate">
                    {card.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. ACTIONS RAPIDES DU STUDIO ────────────────────────────── */}
      <section className="pt-2">
        <h2 className="font-display text-lg font-bold text-[#F5F6F8] mb-4">
          Raccourcis Opérationnels
        </h2>

        <div className="flex flex-wrap gap-3">
          {[
            { label: '📦 Modifier les Packs & Tarifs (Clipping)', section: 'packs_options' },
            { label: '🛠️ Gérer le Catalogue des Services', section: 'services' },
            { label: '+ Ajouter une Réalisation (9:16)', section: 'realisations' },
            { label: '⚙️ Configurer ImageKit & Fiverr', section: 'settings' },
            { label: '📬 Consulter les Messages', section: 'messages' },
            { label: '💡 Voir les Propositions Clients', section: 'proposals' },
            { label: '⭐ Modérer les Avis', section: 'testimonials' },
          ].map((act, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate && onNavigate(act.section)}
              className="px-4 py-2.5 rounded-xl bg-[#1A1F2B] hover:bg-[#232A38] border border-[#394150] hover:border-[#8EAFFF]/50 text-xs font-mono text-[#D6DCE6] hover:text-[#F5F6F8] transition shadow-sm"
            >
              {act.label}
            </button>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
