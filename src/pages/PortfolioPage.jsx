import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowTopRightOnSquare,
  HiOutlineFilm,
  HiLockClosed,
} from 'react-icons/hi2';
import { getProjects, getRealisations, getSettings } from '../utils/api';
import VideoCard916 from '../components/ui/VideoCard916';

const DEFAULT_PROJECTS = [
  {
    _id: 'default-p1',
    title: 'Clipping Vidéo (TikTok / Reels / Shorts)',
    status: 'Actif',
    badge: 'Actif',
    description:
      'Extraction et montage de formats courts à partir de vidéos longues, lives, conférences et podcasts.',
    tags: ['Format 9:16', 'IA & Rétention', 'Sous-titres Animés', 'Sound Design'],
    order: 1,
  },
  {
    _id: 'default-p2',
    title: 'Web Scraping & Extraction Structurée',
    status: 'Sur-mesure',
    badge: 'Sur-mesure',
    description:
      'Conception de pipelines d’extraction de données volumineuses, contournement anti-bot et exports prêts à l’analyse.',
    tags: ['Python', 'Playwright', 'Data Pipelines'],
    order: 2,
  },
  {
    _id: 'default-p3',
    title: 'Automatisations & Scripts Sur-Mesure',
    status: 'Sur-mesure',
    badge: 'Sur-mesure',
    description:
      'Développement de micro-outils internes, bots de notification et connecteurs API pour accélérer les flux opérationnels.',
    tags: ['APIs', 'Micro-services', 'Scripts CLI'],
    order: 3,
  },
];

const CATEGORIES = ['Tous', 'Podcast', 'Live', 'Conférence', 'Vidéo longue'];

export default function PortfolioPage() {
  const [searchParams] = useSearchParams();
  const shareId = searchParams.get('share') || searchParams.get('video');
  const [privateVideo, setPrivateVideo] = useState(null);

  const [projects, setProjects] = useState([]);
  const [realisations, setRealisations] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingRealisations, setLoadingRealisations] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [fiverrUrl, setFiverrUrl] = useState('https://www.fiverr.com');

  useEffect(() => {
    // Si un lien de partage privé est présent dans l'URL
    if (shareId) {
      getRealisations({ share: shareId })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setPrivateVideo(data[0]);
          }
        })
        .catch(() => {});
    }

    getSettings()
      .then((d) => {
        if (d?.fiverrUrl) setFiverrUrl(d.fiverrUrl);
      })
      .catch(() => {});

    // Fetch Projects
    getProjects()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(DEFAULT_PROJECTS);
        }
      })
      .catch(() => setProjects(DEFAULT_PROJECTS))
      .finally(() => setLoadingProjects(false));

    // Fetch Realisations
    getRealisations()
      .then((data) => {
        if (Array.isArray(data)) {
          setRealisations(data);
        }
      })
      .catch(() => setRealisations([]))
      .finally(() => setLoadingRealisations(false));
  }, []);

  const filteredRealisations = realisations.filter((item) => {
    if (selectedCategory === 'Tous') return true;
    return item.category && item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="relative overflow-hidden">
      {/* Halo radial diffus en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none radial-halo opacity-90 z-0" />

      <div className="relative z-10 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ── EN-TÊTE DE LA PAGE ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
            PORTFOLIO DU STUDIO
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F6F8] mt-2 mb-4">
            Projets & Réalisations
          </h1>
          <p className="text-[#D6DCE6] text-base leading-relaxed font-sans">
            Une sélection rigoureuse de nos interventions : du montage vertical optimisé pour la rétention algorithmique à la conception de pipelines de données structurées.
          </p>
        </motion.div>

        {/* ── BANNIÈRE VIDÉO PRIVÉE (ACCÈS DIRECT CLIENT) ────────── */}
        {privateVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-6 sm:p-8 rounded-2xl bg-[#11151D] border-2 border-[#8EAFFF]/50 shadow-2xl shadow-[#8EAFFF]/10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#394150] mb-6">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#1A1F2B] border border-[#8EAFFF]/40 flex items-center justify-center text-[#8EAFFF]">
                  <HiLockClosed className="w-5 h-5 text-[#8EAFFF]" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-[#8EAFFF] uppercase tracking-wider">
                      Vidéo Privée // Accès Client Réservé
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#F5F6F8] mt-0.5">
                    {privateVideo.title}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono text-[#B6C0D0] bg-[#1A1F2B] px-3 py-1 rounded-lg border border-[#394150] self-start sm:self-auto">
                Format: {privateVideo.category}
              </span>
            </div>

            <div
              className={`${
                privateVideo?.aspectRatio === '16:9' || privateVideo?.category === 'Vidéo longue'
                  ? 'max-w-xl'
                  : 'max-w-xs'
              } mx-auto`}
            >
              <VideoCard916 item={privateVideo} />
            </div>
          </motion.div>
        )}

        {/* ── SECTION 1 : RÉALISATIONS (GRILLE VIDÉOS 9:16 & 16:9) ──────── */}
        <section className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-[#394150]">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
                01 // SHOWCASE VIDÉO (9:16 & 16:9)
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8] mt-1">
                Réalisations
              </h2>
              <p className="text-xs text-[#B6C0D0] mt-1 font-sans">
                Démonstrations de montage au format court (TikTok, Reels, Shorts) et format paysage (YouTube, conférences).
              </p>
            </div>

            {/* Filtres par catégorie */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#11151D] border border-[#394150] self-start md:self-end">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition ${
                    selectedCategory === cat
                      ? 'bg-[#8EAFFF] text-[#0B0D12] font-semibold shadow-sm'
                      : 'text-[#B6C0D0] hover:text-[#F5F6F8] hover:bg-[#232A38]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grille des réalisations 9:16 */}
          {loadingRealisations ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[9/16] rounded-2xl bg-[#1A1F2B] border border-[#394150] animate-pulse" />
              ))}
            </div>
          ) : filteredRealisations.length === 0 ? (
            /* État vide propre et discret */
            <div className="py-20 px-6 rounded-2xl border border-[#394150] bg-[#1A1F2B] text-center max-w-xl mx-auto my-6 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-[#11151D] border border-[#394150] text-[#8EAFFF] flex items-center justify-center mx-auto mb-4">
                <HiOutlineFilm className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-[#F5F6F8] text-base mb-1">
                Nouvelles démonstrations en cours de préparation
              </h3>
              <p className="text-xs text-[#B6C0D0] max-w-md mx-auto leading-relaxed mb-6 font-sans">
                Les réalisations pour la catégorie « {selectedCategory} » sont actuellement en cours d'encodage et d'intégration au format 9:16.
              </p>
              <a
                href={fiverrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] text-xs font-semibold shadow-md transition"
              >
                <span>Voir les retours clients sur Fiverr</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-[#0B0D12]" />
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
              {filteredRealisations.map((item, idx) => (
                <VideoCard916 key={item._id || idx} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 2 : DOMAINES D'ACTIVITÉ (PROJETS) ──────── */}
        <section>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#394150]">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
                02 // CHAMPS D'INTERVENTION
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8] mt-1">
                Domaines d'Activité
              </h2>
            </div>
            <span className="text-xs font-mono text-[#B6C0D0] hidden sm:inline">
              Expertises actives & sur-mesure
            </span>
          </div>

          {loadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 rounded-2xl bg-[#1A1F2B] border border-[#394150] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((proj, idx) => {
                const isActive = proj.status === 'Actif' || proj.badge === 'Actif';
                return (
                  <div
                    key={proj._id || idx}
                    className="p-7 sm:p-8 rounded-2xl bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-[10px] font-mono text-[#B6C0D0] uppercase tracking-widest">
                          DOMAINE #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                            isActive
                              ? 'bg-[#11151D] text-[#8EAFFF] border border-[#8EAFFF]/40'
                              : 'bg-[#11151D] text-[#B6C0D0] border border-[#394150]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-[#8EAFFF] animate-pulse' : 'bg-[#B6C0D0]'
                            }`}
                          />
                          <span>{proj.status || (isActive ? 'Actif' : 'Sur-mesure')}</span>
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-bold text-[#F5F6F8] mb-3 group-hover:text-[#8EAFFF] transition-colors">
                        {proj.title}
                      </h3>

                      <p className="text-[#D6DCE6] text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                        {proj.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {proj.tags && proj.tags.length > 0 && (
                      <div className="pt-4 border-t border-[#394150] flex flex-wrap gap-1.5">
                        {proj.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono text-[#B6C0D0] bg-[#11151D] border border-[#394150]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
