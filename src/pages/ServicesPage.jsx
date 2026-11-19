import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiVideoCamera,
  HiCircleStack,
  HiCommandLine,
  HiArrowRight,
  HiSparkles,
  HiCheckCircle,
  HiClock,
  HiExclamationCircle,
} from 'react-icons/hi2';
import { createServiceProposal } from '../utils/api';

export default function ServicesPage() {
  const navigate = useNavigate();

  // Form state for service proposal
  const [proposalForm, setProposalForm] = useState({
    contact: '',
    title: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mb-16"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
          CATALOGUE DES OFFRES
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mt-2 mb-4">
          Services Numériques & Solutions Sur-Mesure
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Une approche technique et créative sans intermédiaire. Du clipping vertical haute rétention aux pipelines d’automatisation, chaque offre répond à des critères stricts de rigueur et d’efficacité.
        </p>
      </motion.div>

      {/* ── SECTION 1 : SERVICE ACTIF (MISE EN VALEUR) ──────────── */}
      <section className="mb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400">
              Service Actif // Prêt à la commande
            </h2>
          </div>
          <span className="text-xs font-mono text-gray-500 hidden sm:inline">
            Formule unique • Aucun abonnement
          </span>
        </div>

        {/* Featured Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/services/clipping')}
          className="group relative cursor-pointer rounded-2xl bg-[#0F0F0F] border border-white/15 p-8 sm:p-12 hover:border-white/30 transition-all duration-300 shadow-2xl hover:shadow-white/[0.02]"
        >
          {/* Subtle gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.01] rounded-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center flex-shrink-0 font-bold shadow-md">
                  <HiVideoCamera className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono uppercase">
                    ● Disponible immédiatement
                  </span>
                </div>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-white transition-colors">
                Clipping Vidéo (TikTok / Reels / Shorts)
              </h3>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Extraction chirurgicale de vos meilleurs moments à partir de rushs, podcasts, conférences et lives. Recadrage dynamique au ratio vertical 9:16, rythme soutenu et formats optimisés pour maximiser la rétention algorithmique.
              </p>

              {/* Key Specs Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                  3 Packs disponibles (3 à 15 extraits)
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                  Paiement unique au nombre d'extraits
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                  Export HD 1080x1920
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                  Commande sécurisée via Fiverr
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0 self-start lg:self-center">
              <Link
                to="/services/clipping"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition shadow-lg group-hover:translate-x-0.5"
              >
                <span>Voir les packs & options</span>
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── SECTION 2 : OFFRES À VENIR ──────────────────────────── */}
      <section className="mb-24 pt-12 border-t border-white/10">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
            ROADMAP & R&D
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Offres à venir
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Modules techniques actuellement en phase d’expérimentation au sein du studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Web Scraping */}
          <div className="bento-card p-8 flex flex-col justify-between bg-[#0D0D0D] border-white/10 opacity-90 hover:opacity-100 transition">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#161616] border border-white/10 flex items-center justify-center text-white">
                  <HiCircleStack className="w-5 h-5 text-gray-300" />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-gray-400 uppercase tracking-wide">
                  À venir
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                Web Scraping & Pipelines de Données
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                Extraction automatisée et structurée de données web à grande échelle : leads qualifiés, surveillance de catalogues concurrents et agrégation de prix. Gestion avancée des sessions, headless browsers et contournements anti-bot.
              </p>
              <ul className="space-y-2 text-xs font-mono text-gray-400 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                  <span>Exports sur-mesure (JSON, CSV, bases PostgreSQL)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                  <span>Tâches planifiées et scripts autonomes</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-500">
              <span>Statut : En laboratoire</span>
              <span>Disponibilité privée sur devis</span>
            </div>
          </div>

          {/* Card 2: Automatisations & Micro-Outils */}
          <div className="bento-card p-8 flex flex-col justify-between bg-[#0D0D0D] border-white/10 opacity-90 hover:opacity-100 transition">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#161616] border border-white/10 flex items-center justify-center text-white">
                  <HiCommandLine className="w-5 h-5 text-gray-300" />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-gray-400 uppercase tracking-wide">
                  À venir
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                Automatisations & Scripts Sur-Mesure
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                Suppression des points de friction et des tâches manuelles récurrentes : traitement batch de fichiers médias par FFmpeg, intégration de micro-APIs (OpenAI, Whisper) et bots de monitoring temps réel (Discord, Telegram).
              </p>
              <ul className="space-y-2 text-xs font-mono text-gray-400 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                  <span>Scripts Python ultra-légers et documentés</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                  <span>Connecteurs sans intermédiaire pour vos flux de travail</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-500">
              <span>Statut : En phase de test</span>
              <span>Disponibilité privée sur devis</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 : PROPOSER UN SERVICE ─────────────────────── */}
      <section className="pt-12 border-t border-white/10">
        <div className="rounded-2xl bg-[#0D0D0D] border border-white/10 p-8 sm:p-12 max-w-4xl mx-auto">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
              CO-CRÉATION & FEEDBACK
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Un besoin spécifique ? Proposez un service
            </h2>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Vous recherchez une compétence particulière en code, traitement vidéo ou automatisation de flux ? Soumettez votre idée. Chaque proposition est examinée directement par le studio.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl bg-white/5 border border-emerald-500/30 flex items-start gap-4 text-sm text-gray-300"
            >
              <HiCheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-medium block mb-1">
                  Proposition bien enregistrée
                </strong>
                Merci pour votre suggestion. Votre demande a été enregistrée avec succès. Si le projet s’aligne avec notre feuille de route technique, nous reviendrons vers vous.
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="block mt-4 text-xs font-mono text-white underline hover:text-gray-300 transition"
                >
                  Envoyer une autre proposition
                </button>
              </div>
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
                    className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2"
                  >
                    Nom ou Email <span className="text-red-400">*</span>
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
                    className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white/30 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="proposal-title"
                    className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2"
                  >
                    Service souhaité <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="proposal-title"
                    type="text"
                    required
                    placeholder="ex: Script de synchronisation audio"
                    value={proposalForm.title}
                    onChange={(e) =>
                      setProposalForm({ ...proposalForm, title: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white/30 transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="proposal-desc"
                  className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2"
                >
                  Description courte <span className="text-red-400">*</span>
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
                  className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white/30 transition resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <span className="text-xs font-mono text-gray-500">
                  Enregistré directement dans la base de données du studio.
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
  );
}
