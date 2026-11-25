import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiVideoCamera,
  HiCircleStack,
  HiCommandLine,
  HiArrowRight,
  HiCheckCircle,
  HiExclamationCircle,
  HiSparkles,
} from 'react-icons/hi2';
import { createServiceProposal, getServices } from '../utils/api';

const DEFAULT_COMPLEMENTARY_SERVICES = [
  {
    _id: 'default-scraping',
    title: 'Web Scraping & Pipelines de Données',
    category: 'Data & Automatisation',
    description:
      'Extraction automatisée et structurée de données web à grande échelle : leads qualifiés, surveillance de catalogues concurrents et agrégation de prix. Gestion avancée des sessions, headless browsers et contournements anti-bot.',
    features: [
      'Exports sur-mesure (JSON, CSV, PostgreSQL)',
      'Tâches planifiées et scripts autonomes',
      'Surveillance continue et alertes',
      'Données nettoyées et prêtes à l’emploi',
    ],
    ctaLink: '/contact',
    ctaText: 'Étudier un besoin',
  },
  {
    _id: 'default-automation',
    title: 'Automatisations & Scripts Sur-Mesure',
    category: 'Data & Automatisation',
    description:
      'Suppression des points de friction et des tâches manuelles récurrentes : traitement batch de fichiers médias par FFmpeg, intégration de micro-APIs (OpenAI, Whisper) et bots de monitoring temps réel (Discord, Telegram).',
    features: [
      'Scripts Python ultra-légers et documentés',
      'Connecteurs sans intermédiaire pour vos flux',
      'Traitement automatique audio / vidéo',
      'Gain de temps massif et fiabilité 100%',
    ],
    ctaLink: '/contact',
    ctaText: 'Étudier un besoin',
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Form state for service proposal
  const [proposalForm, setProposalForm] = useState({
    contact: '',
    title: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getServices()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          setServices(DEFAULT_COMPLEMENTARY_SERVICES);
        }
      })
      .catch(() => setServices(DEFAULT_COMPLEMENTARY_SERVICES))
      .finally(() => setLoadingServices(false));
  }, []);

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      !proposalForm.contact.trim() ||
      !proposalForm.title.trim() ||
      !proposalForm.description.trim()
    ) {
      setErrorMsg('Veuillez remplir l’ensemble des champs ci-dessus.');
      return;
    }

    setSubmitting(true);
    try {
      await createServiceProposal(proposalForm);
      setSubmitted(true);
      setProposalForm({ contact: '', title: '', description: '' });
    } catch (err) {
      setErrorMsg(
        err.message || 'Une erreur est survenue lors de l’envoi. Veuillez réessayer.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Halo radial diffus en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none radial-halo opacity-90 z-0" />

      <div className="relative z-10 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ── HEADER ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
            CATALOGUE DES OFFRES
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F6F8] mt-2 mb-4">
            Services Numériques & Solutions Sur-Mesure
          </h1>
          <p className="text-[#D6DCE6] text-base leading-relaxed font-sans">
            Une approche technique et créative sans intermédiaire. Du clipping vertical haute rétention aux pipelines d’automatisation, chaque offre répond à des critères stricts de rigueur et d’efficacité.
          </p>
        </motion.div>

        {/* ── SECTION 1 : SERVICE ACTIF (MISE EN VALEUR) ──────────── */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8EAFFF] animate-pulse" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#D6DCE6] font-medium">
                Service Actif // Prêt à la commande
              </h2>
            </div>
            <span className="text-xs font-mono text-[#B6C0D0] hidden sm:inline">
              Formule unique • Aucun abonnement
            </span>
          </div>

          {/* Featured Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate('/services/clipping')}
            className="group relative cursor-pointer rounded-2xl bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] p-8 sm:p-12 transition-all duration-300 shadow-2xl hover:shadow-[#8EAFFF]/5"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-[#394150] text-[#8EAFFF] flex items-center justify-center flex-shrink-0 font-bold shadow-md">
                    <HiVideoCamera className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#11151D] border border-[#8EAFFF]/40 text-[#8EAFFF] text-[11px] font-mono font-medium">
                      ● Actif & Disponible
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8] group-hover:text-[#8EAFFF] transition-colors">
                  Clipping Vidéo (TikTok / Reels / Shorts)
                </h3>

                <p className="text-[#D6DCE6] text-sm sm:text-base leading-relaxed font-sans">
                  Extraction chirurgicale de vos meilleurs moments à partir de rushs, podcasts, conférences et lives. Recadrage dynamique au ratio vertical 9:16, rythme soutenu et formats optimisés pour maximiser la rétention algorithmique.
                </p>

                {/* Key Specs Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 rounded-lg bg-[#11151D] border border-[#394150] text-xs font-mono text-[#D6DCE6]">
                    3 Packs disponibles (3 à 15 extraits)
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#11151D] border border-[#394150] text-xs font-mono text-[#D6DCE6]">
                    Paiement unique au nombre d'extraits
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#11151D] border border-[#394150] text-xs font-mono text-[#D6DCE6]">
                    Export HD 1080x1920
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#11151D] border border-[#394150] text-xs font-mono text-[#D6DCE6]">
                    Commande sécurisée via Fiverr
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex-shrink-0 self-start lg:self-center">
                <Link
                  to="/services/clipping"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-sm transition shadow-lg shadow-[#8EAFFF]/15 group-hover:translate-x-0.5"
                >
                  <span>Voir les packs & options</span>
                  <HiArrowRight className="w-4 h-4 text-[#0B0D12]" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── SECTION 2 : OFFRES COMPLÉMENTAIRES SUR-MESURE ──────── */}
        <section className="mb-24 pt-12 border-t border-[#394150]">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
              SERVICES SUR-MESURE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8] mt-1">
              Data & Automatisations
            </h2>
            <p className="text-[#D6DCE6] text-sm mt-2 font-sans">
              Modules techniques conçus sur-mesure pour fluidifier et accélérer vos flux de travail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(services.length > 0
              ? services.filter(
                  (s) =>
                    s.slug !== 'clipping' &&
                    !s.title?.toLowerCase().includes('clipping 9:16')
                )
              : DEFAULT_COMPLEMENTARY_SERVICES
            ).map((srv, idx) => {
              const isExternal = srv.ctaLink?.startsWith('http');
              const Icon =
                srv.icon === 'HiVideoCamera'
                  ? HiVideoCamera
                  : srv.icon === 'HiCircleStack'
                  ? HiCircleStack
                  : HiCommandLine;

              return (
                <div
                  key={srv._id || srv.id || idx}
                  className="p-8 flex flex-col justify-between bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] rounded-2xl transition duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-11 h-11 rounded-xl bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-[#11151D] border border-[#394150] text-[11px] font-mono text-[#B6C0D0] uppercase tracking-wide">
                        {srv.category || 'Sur consultation'}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-[#F5F6F8] mb-2 group-hover:text-[#8EAFFF] transition-colors">
                      {srv.title}
                    </h3>

                    <p className="text-[#B6C0D0] text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                      {srv.description}
                    </p>

                    {Array.isArray(srv.features) && srv.features.length > 0 && (
                      <ul className="space-y-2 text-xs font-mono text-[#B6C0D0] mb-6">
                        {srv.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#394150] flex items-center justify-between text-xs font-mono text-[#B6C0D0]">
                    <span>Statut : Disponible sur devis</span>
                    {isExternal ? (
                      <a
                        href={srv.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8EAFFF] hover:text-[#B3CAFF] transition flex items-center gap-1 font-medium"
                      >
                        <span>{srv.ctaText || 'En savoir plus'}</span>
                        <HiArrowRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <Link
                        to={srv.ctaLink || '/contact'}
                        className="text-[#8EAFFF] hover:text-[#B3CAFF] transition flex items-center gap-1 font-medium"
                      >
                        <span>{srv.ctaText || 'Étudier un besoin'}</span>
                        <HiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 3 : PROPOSER UN BESOIN SPÉCIFIQUE ───────────── */}
        <section className="pt-8">
          <div className="p-8 sm:p-12 rounded-2xl bg-[#1A1F2B] border border-[#394150] shadow-2xl">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
                SUR-MESURE & CRÉATIVITÉ
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8] mt-1 mb-2">
                Un besoin spécifique ? Proposez un projet
              </h2>
              <p className="text-[#D6DCE6] text-sm leading-relaxed font-sans">
                Une idée d’automatisation, un projet vidéo particulier ou une extraction complexe ? Soumettez votre demande en direct pour obtenir un retour rapide.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-xl bg-[#11151D] border border-[#8EAFFF]/40 text-center max-w-md mx-auto my-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#8EAFFF]/10 border border-[#8EAFFF]/30 text-[#8EAFFF] flex items-center justify-center mx-auto mb-3">
                  <HiCheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-[#F5F6F8] text-base mb-1">
                  Proposition bien reçue
                </h3>
                <p className="text-xs text-[#B6C0D0] leading-relaxed font-sans">
                  Votre demande a été enregistrée avec succès. Nous l’étudierons avec attention et reviendrons vers vous dans les plus brefs délais.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="block mt-4 text-xs font-mono text-[#8EAFFF] hover:underline transition mx-auto"
                >
                  Envoyer une autre proposition
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs text-red-300">
                    <HiExclamationCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="proposal-contact"
                      className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium"
                    >
                      Nom ou Email <span className="text-[#8EAFFF]">*</span>
                    </label>
                    <input
                      id="proposal-contact"
                      type="text"
                      required
                      placeholder="ex: alex@domaine.com ou @pseudo"
                      value={proposalForm.contact}
                      onChange={(e) =>
                        setProposalForm({ ...proposalForm, contact: e.target.value })
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] placeholder-[#717F9A] text-sm focus:outline-none focus:border-[#8EAFFF] transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="proposal-title"
                      className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium"
                    >
                      Service souhaité <span className="text-[#8EAFFF]">*</span>
                    </label>
                    <input
                      id="proposal-title"
                      type="text"
                      required
                      placeholder="ex: Script d'extraction de données e-commerce"
                      value={proposalForm.title}
                      onChange={(e) =>
                        setProposalForm({ ...proposalForm, title: e.target.value })
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] placeholder-[#717F9A] text-sm focus:outline-none focus:border-[#8EAFFF] transition"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="proposal-desc"
                    className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium"
                  >
                    Description courte <span className="text-[#8EAFFF]">*</span>
                  </label>
                  <textarea
                    id="proposal-desc"
                    rows={4}
                    required
                    placeholder="Décrivez en quelques phrases votre besoin, vos contraintes et le résultat espéré..."
                    value={proposalForm.description}
                    onChange={(e) =>
                      setProposalForm({
                        ...proposalForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] placeholder-[#717F9A] text-sm focus:outline-none focus:border-[#8EAFFF] transition resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <span className="text-xs font-mono text-[#B6C0D0]">
                    Enregistré directement dans la base de données du studio.
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-xs uppercase tracking-wider transition shadow-lg shadow-[#8EAFFF]/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#0B0D12] border-t-transparent rounded-full animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <span>Envoyer la proposition</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
