import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowRight,
  HiShieldCheck,
  HiEye,
  HiHeart,
  HiSparkles,
  HiCommandLine,
  HiVideoCamera,
} from 'react-icons/hi2';

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Halo radial diffus en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] pointer-events-none radial-halo opacity-90 z-0" />

      <div className="relative z-10 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-24">
        {/* ── EN-TÊTE DE PAGE ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111113] border border-white/10 text-xs font-mono text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>À PROPOS DU STUDIO</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            L’artisanat numérique, <br className="hidden sm:inline" />
            guidé par la rigueur et la passion.
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed pt-2">
            Vitali Studio est un atelier indépendant dédié à la création numérique, au développement d’outils sur-mesure et à l’édition vidéo dynamique. Découvrez la vision et les valeurs qui animent chaque projet.
          </p>
        </motion.div>

        {/* ── BLOC 1 : INTRODUCTION (QUI SUIS-JE ?) ─────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-12 rounded-2xl bg-[#111113] border border-white/10 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
                01 // PARCOURS & ORIGINES
              </span>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Comprendre les rouages, concevoir avec méthode
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
                <p>
                  Je m’appelle Vitali. Mon parcours s’est forgé au croisement d’une formation d’ingénieur, du développement informatique et de la création vidéo. Dès mes premières réalisations, ce qui m'a animé n'a jamais été la simple exécution, mais une curiosité profonde pour comprendre comment les choses fonctionnent dans le détail afin de construire des outils utiles et bien pensés.
                </p>
                <p className="text-gray-400">
                  Cette double sensibilité — logique d’ingénierie d'un côté, sens du rythme et esthétique visuelle de l'autre — permet d'aborder chaque projet avec une exigence technique constante et un regard attentif à la clarté du résultat.
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto p-5 rounded-xl bg-[#161619] border border-white/10 flex-shrink-0 text-xs font-mono space-y-3">
              <div className="text-gray-400 uppercase tracking-wider text-[11px] pb-1 border-b border-white/5">
                Profil Studio
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Ingénierie & Code</span>
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Montage & Rétention 9:16</span>
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Architecture de données</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── BLOC 2 : L'IDÉE DERRIÈRE VITALI STUDIO ─────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              02 // LA VISION
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              L’idée derrière Vitali Studio
            </h2>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-[#111113] border border-white/10 space-y-5 text-gray-300 text-sm sm:text-base leading-relaxed">
            <p>
              Vitali Studio est né d’une volonté simple : bâtir un espace de travail indépendant, fondé sur la passion de créer, le plaisir d'inventer et le désir d'être pleinement responsable de la qualité de ses créations.
            </p>
            <p>
              L'objectif n'est pas de multiplier les artifices, mais de concevoir des solutions concrètement utiles : qu’il s’agisse d'extraire la substantifique moelle d'une conférence de deux heures pour en faire des extraits captivants, de programmer un script qui automatise une tâche récurrente fastidieuse, ou d'élaborer une interface web épurée et sans friction.
            </p>
            <p className="text-gray-400 text-sm italic border-l-2 border-indigo-500/40 pl-4 py-1">
              « Chaque création doit servir un but clair, respecter le temps de celui qui la regarde ou qui l'utilise, et refléter un travail soigné. »
            </p>
          </div>
        </motion.section>

        {/* ── BLOC 3 : NOS VALEURS DE TRAVAIL ───────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              03 // NOS PRINCIPES
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Nos valeurs de travail
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Trois piliers non négociables qui guident nos échanges et nos livrables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Valeur 1 : Exigence technique */}
            <div className="p-8 rounded-2xl bg-[#111113] border border-white/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#18181C] border border-white/10 flex items-center justify-center text-indigo-400 mb-6">
                  <HiShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Exigence technique
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Des outils maîtrisés et un rendu millimétré. Nous refusons les modèles préconçus génériques : chaque fichier, chaque transition et chaque ligne de code est pensée avec rigueur et précision.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-white/5 text-xs font-mono text-gray-500">
                Précision • Qualité constante
              </div>
            </div>

            {/* Valeur 2 : Transparence */}
            <div className="p-8 rounded-2xl bg-[#111113] border border-white/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#18181C] border border-white/10 flex items-center justify-center text-indigo-400 mb-6">
                  <HiEye className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Transparence
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Un dialogue ouvert et honnête sur ce qui est réalisable et sur les limites des fichiers sources. Pas de fausses promesses : nous expliquons clairement nos choix techniques et nos recommandations.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-white/5 text-xs font-mono text-gray-500">
                Conseil sincère • Zéro artifice
              </div>
            </div>

            {/* Valeur 3 : Partage & Utilité */}
            <div className="p-8 rounded-2xl bg-[#111113] border border-white/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#18181C] border border-white/10 flex items-center justify-center text-indigo-400 mb-6">
                  <HiHeart className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Partage & Utilité
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Concevoir des solutions pensées pour servir réellement. Qu'il s'agisse de développer votre audience ou de fluidifier votre organisation, nos créations ont pour seule vocation d'apporter une valeur concrète.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-white/5 text-xs font-mono text-gray-500">
                Impact réel • Solutions durables
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── BLOC 4 : UN STUDIO EN ÉVOLUTION ───────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-12 rounded-2xl bg-[#111113] border border-white/10 relative overflow-hidden space-y-6"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              04 // HORIZON
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Un atelier en constante évolution
            </h2>
          </div>

          <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl font-sans">
            <p>
              Aujourd'hui, l'activité centrale du studio s'articule autour du <span className="text-white font-medium">clipping vidéo haute rétention</span>, une compétence opérationnelle immédiatement disponible pour les créateurs, conférenciers et médias.
            </p>
            <p className="text-gray-400">
              Mais l'aventure ne s'arrête pas là. Vitali Studio a vocation à s'enrichir progressivement de nouveaux chantiers : conception web minimaliste, scripts d'automatisation, web scraping avancé et expérimentations audiovisuelles. C'est cet esprit de laboratoire permanent qui fait la singularité de notre démarche.
            </p>
          </div>

          {/* Liens de redirection discrets */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black text-xs font-semibold hover:bg-gray-200 transition"
            >
              <span>Découvrir nos services</span>
              <HiArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#161619] hover:bg-[#1f1f23] border border-white/10 hover:border-indigo-500/30 text-xs font-mono text-gray-300 hover:text-white transition"
            >
              <span>Prendre contact avec le studio</span>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
