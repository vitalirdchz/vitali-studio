import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi2';
import AnimatedSection from '../ui/AnimatedSection';
import SectionTitle from '../ui/SectionTitle';
import { getFAQ } from '../../utils/api';

const DEFAULT_FAQ = [
  {
    _id: 'faq-1',
    question: "Qu'est-ce qui différencie votre clipping IA d'un outil automatisé grand public ?",
    answer: "Les outils en ligne 100% automatisés génèrent des sous-titres souvent mal calés, des recadrages mécaniques et aucun sens de la narration. Chez Vitali Studio, l'IA est utilisée comme un accélérateur chirurgical (analyse des pics sonores, pré-segmentation, détection faciale), mais l'éditorial, l'art du hook, l'humour, le sound design et le rythme sont orchestrés à la main par un monteur professionnel.",
  },
  {
    _id: 'faq-2',
    question: 'Pourquoi les commandes passent-elles par votre profil Fiverr ?',
    answer: "Fiverr offre un cadre sécurisé d'excellence pour vous comme pour moi : séquestre des paiements (vous ne payez qu'une fois satisfait), suivi d'avancement transparent, gestion des révisions et protection contractuelle bilatérale. Vous bénéficiez ainsi d'un service premium avec toutes les garanties d'une plateforme mondiale.",
  },
  {
    _id: 'faq-3',
    question: 'Quels types de fichiers vidéo dois-je fournir ?',
    answer: "Idéalement des liens directes de téléchargement (Google Drive, Dropbox, WeTransfer, YouTube non répertorié). Nous exigeons une résolution minimale de 1080p (Full HD) avec un audio propre et distinct. Nous refusons les vidéos de mauvaise qualité pour maintenir notre standard d'excellence (voir notre Charte Technique).",
  },
  {
    _id: 'faq-4',
    question: 'Quel est le délai de livraison habituel pour un pack de clips ?',
    answer: "Pour une commande standard de 3 à 5 clips, le délai moyen est de 24 à 48 heures ouvrées après réception de vos fichiers sources validés. Les projets de vidéos longues ou les packs mensuels font l'objet d'un planning convenu à l'avance.",
  },
  {
    _id: 'faq-5',
    question: 'Que se passe-t-il si je souhaite des modifications (révisions) ?',
    answer: "Toutes mes offres sur Fiverr incluent des révisions. Vous pouvez demander des ajustements sur le rythme, les sous-titres, les musiques ou les effets jusqu'à ce que le clip corresponde parfaitement à votre vision.",
  },
  {
    _id: 'faq-6',
    question: 'Fournissez-vous également les titres et descriptions optimisés ?',
    answer: "Oui, sur option ou dans le Pack Créateur, nous pouvons vous livrer pour chaque clip une suggestion de titre accrocheur, un descriptif optimisé SEO et les hashtags pertinents pour doper l'algorithme TikTok / Reels.",
  },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadFaqs() {
      try {
        const data = await getFAQ();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setFaqs(data);
          } else {
            setFaqs(DEFAULT_FAQ);
          }
        }
      } catch (err) {
        if (isMounted) setFaqs(DEFAULT_FAQ);
      }
    }
    loadFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <AnimatedSection id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-800 relative">
      <div className="max-w-4xl mx-auto">
        <SectionTitle
          title="Questions Fréquentes"
          subtitle="Toutes les réponses pour démarrer votre collaboration en toute sérénité."
          gradient={true}
          className="mb-14"
        />

        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item._id || index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-accent-rose/30 bg-dark-700/80 shadow-lg shadow-accent-rose/5'
                    : 'border-white/5 bg-dark-700/30 hover:border-white/10 hover:bg-dark-700/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-display text-base sm:text-lg font-semibold transition-colors duration-200 ${
                      isOpen ? 'text-white' : 'text-gray-300'
                    }`}
                  >
                    {item.question}
                  </span>
                  <div
                    className={`p-2 rounded-xl bg-dark-600 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-gradient-accent text-white' : 'text-gray-400'
                    }`}
                  >
                    <HiChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-gray-400 leading-relaxed border-t border-white/5 font-sans">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
