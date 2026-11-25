import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowRight,
  HiShieldCheck,
  HiEye,
  HiHeart,
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1F2B] border border-[#8EAFFF]/40 text-xs font-mono text-[#8EAFFF]">
            <span>● À PROPOS DU STUDIO</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F6F8] leading-[1.1]">
            L’artisanat numérique, <br className="hidden sm:inline" />
            guidé par la rigueur et la méthode.
          </h1>

          <p className="text-[#D6DCE6] text-base sm:text-lg leading-relaxed pt-2 font-sans">
            Vitali Studio est un atelier indépendant dédié à la création numérique, au développement d’outils sur-mesure et à l’édition vidéo dynamique. Découvrez la vision et les valeurs qui animent chaque projet.
          </p>
        </motion.div>

        {/* ── BLOC 1 : INTRODUCTION (QUI SUIS-JE ?) ─────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-12 rounded-2xl bg-[#1A1F2B] border border-[#394150] relative overflow-hidden shadow-2xl"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
                01 // PARCOURS & ORIGINES
              </span>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8]">
                Comprendre les rouages, concevoir avec méthode
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#D6DCE6] leading-relaxed font-sans">
                <p>
                  Je m’appelle Vitali. Mon parcours s’est forgé au croisement d’une formation d’ingénieur, du développement informatique et de la création vidéo. Dès mes premières réalisations, ce qui m'a animé n'a jamais été la simple exécution, mais une curiosité profonde pour comprendre comment les choses fonctionnent dans le détail afin de construire des outils utiles et bien pensés.
                </p>
                <p className="text-[#B6C0D0]">
                  Cette double sensibilité — logique d’ingénierie d'un côté, sens du rythme et esthétique visuelle de l'autre — permet d'aborder chaque projet avec une exigence technique constante et un regard attentif à la clarté du résultat.
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto p-5 rounded-xl bg-[#11151D] border border-[#394150] flex-shrink-0 text-xs font-mono space-y-3">
              <div className="text-[#B6C0D0] uppercase tracking-wider text-[11px] pb-1 border-b border-[#394150] font-medium">
                Profil Studio
              </div>
              <div className="flex items-center gap-2 text-[#D6DCE6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                <span>Ingénierie & Code</span>
              </div>
              <div className="flex items-center gap-2 text-[#D6DCE6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                <span>Montage & Rétention 9:16</span>
              </div>
              <div className="flex items-center gap-2 text-[#D6DCE6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                <span>Architecture de données</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── BLOC 2 : VALEURS FONDAMENTALES ─────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
              02 // VALEURS FONDAMENTALES
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8] mt-1">
              Les principes qui guident chaque livraison
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Valeur 1 : Rigueur */}
            <div className="p-8 rounded-2xl bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF] mb-6">
                  <HiShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#F5F6F8] mb-3 group-hover:text-[#8EAFFF] transition-colors">
                  Rigueur & Exigence
                </h3>
                <p className="text-[#B6C0D0] text-sm leading-relaxed font-sans">
                  Chaque détail compte. Du millième de seconde dans une coupe vidéo à la robustesse d’un script de scraping, nous appliquons une démarche méthodique sans approximation.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#394150] text-xs font-mono text-[#B6C0D0]">
                Précision • Qualité constante
              </div>
            </div>

            {/* Valeur 2 : Transparence */}
            <div className="p-8 rounded-2xl bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF] mb-6">
                  <HiEye className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#F5F6F8] mb-3 group-hover:text-[#8EAFFF] transition-colors">
                  Transparence
                </h3>
                <p className="text-[#B6C0D0] text-sm leading-relaxed font-sans">
                  Un dialogue ouvert et honnête sur ce qui est réalisable et sur les limites des fichiers sources. Pas de fausses promesses : nous expliquons clairement nos choix techniques.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#394150] text-xs font-mono text-[#B6C0D0]">
                Conseil sincère • Zéro artifice
              </div>
            </div>

            {/* Valeur 3 : Partage & Utilité */}
            <div className="p-8 rounded-2xl bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF] mb-6">
                  <HiHeart className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#F5F6F8] mb-3 group-hover:text-[#8EAFFF] transition-colors">
                  Partage & Utilité
                </h3>
                <p className="text-[#B6C0D0] text-sm leading-relaxed font-sans">
                  Concevoir des solutions pensées pour servir réellement. Qu'il s'agisse de développer votre audience ou de fluidifier votre organisation, nos créations apportent une valeur concrète.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#394150] text-xs font-mono text-[#B6C0D0]">
                Impact réel • Solutions durables
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── BLOC 3 : UN STUDIO EN ÉVOLUTION ───────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-12 rounded-2xl bg-[#1A1F2B] border border-[#394150] relative overflow-hidden space-y-6 shadow-2xl"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
              03 // HORIZON
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8] mt-1">
              Un atelier en constante évolution
            </h2>
          </div>

          <div className="space-y-4 text-[#D6DCE6] text-sm sm:text-base leading-relaxed max-w-3xl font-sans">
            <p>
              Aujourd'hui, l'activité centrale du studio s'articule autour du <span className="text-[#F5F6F8] font-semibold">clipping vidéo haute rétention</span>, une compétence opérationnelle immédiatement disponible pour les créateurs, conférenciers et médias.
            </p>
            <p className="text-[#B6C0D0]">
              Mais l'aventure ne s'arrête pas là. Vitali Studio a vocation à s'enrichir progressivement de nouveaux chantiers : conception web minimaliste, scripts d'automatisation, web scraping avancé et expérimentations audiovisuelles. C'est cet esprit d'atelier rigoureux qui fait la singularité de notre démarche.
            </p>
          </div>

          {/* Liens de redirection discrets */}
          <div className="pt-6 border-t border-[#394150] flex flex-wrap items-center gap-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] text-xs font-semibold shadow-lg shadow-[#8EAFFF]/15 transition active:scale-[0.98]"
            >
              <span>Découvrir nos services</span>
              <HiArrowRight className="w-3.5 h-3.5 text-[#0B0D12]" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#232A38] hover:bg-[#2D3546] border border-[#394150] hover:border-[#8EAFFF]/60 text-xs font-mono text-[#F5F6F8] transition active:scale-[0.98]"
            >
              <span>Prendre contact avec le studio</span>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
