import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiChevronDown,
  HiEnvelope,
  HiCheckCircle,
  HiPaperAirplane,
  HiArrowTopRightOnSquare,
  HiClock,
  HiShieldCheck,
} from 'react-icons/hi2';
import { RiShoppingBag3Line } from 'react-icons/ri';
import { getFAQ, getSettings, createContactMessage } from '../utils/api';

const DEFAULT_FAQ = [
  {
    _id: 'faq-1',
    question: 'Pourquoi déléguer mon clipping vidéo à Vitali Studio ?',
    answer:
      'Contrairement aux outils automatiques qui recadrent arbitrairement le centre de l’image et génèrent des sous-titres monotones, Vitali Studio associe l’IA pour la détection fine des moments forts et le montage manuel pour le rythme, le sound design, les B-rolls et les hooks narratifs.',
  },
  {
    _id: 'faq-2',
    question: 'Quelle est la règle minimale pour les fichiers sources ?',
    answer:
      'Toute vidéo source doit être en 1080p (Full HD) minimum, idéalement 4K, avec un son intelligible. Les fichiers compressés ou dégradés sont déconseillés afin d’assurer un résultat final d’exception.',
  },
  {
    _id: 'faq-3',
    question: 'Comment se déroule la commande via Fiverr ?',
    answer:
      'Fiverr agit comme un tiers de confiance sécurisé : vous passez commande, les fonds sont placés sous séquestre, et ils ne sont versés qu’après votre validation finale des vidéos livrées.',
  },
  {
    _id: 'faq-4',
    question: 'Réalisez-vous aussi des projets de Web Scraping ou de code sur-mesure ?',
    answer:
      'Oui. Le studio développe des scripts Python personnalisés (scraping Playwright, bots d’alerte, micro-APIs et pipelines de données). Contactez-moi directement via le formulaire ci-dessous avec vos spécifications pour obtenir un devis.',
  },
  {
    _id: 'faq-5',
    question: 'Quels sont les délais habituels de livraison ?',
    answer:
      'Pour le clipping vidéo standard (3 à 5 clips), le délai est de 24 à 48 heures ouvrées après réception des fichiers validés. Pour les projets sur-mesure, un calendrier précis est défini à l’avance.',
  },
];

export default function ContactPage() {
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);
  const [fiverrUrl, setFiverrUrl] = useState('https://www.fiverr.com');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Clipping Vidéo (TikTok / Reels / Shorts)',
    message: '',
  });

  useEffect(() => {
    getSettings().then((d) => {
      if (d?.fiverrUrl) setFiverrUrl(d.fiverrUrl);
    }).catch(() => {});

    getFAQ()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data);
        } else {
          setFaqs(DEFAULT_FAQ);
        }
      })
      .catch(() => setFaqs(DEFAULT_FAQ));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const encoded = new URLSearchParams({
      'form-name': 'contact',
      ...formData,
    }).toString();

    // Persistance dans MongoDB
    createContactMessage(formData).catch((err) =>
      console.warn('MongoDB save warning:', err)
    );

    // Formulaire Netlify
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encoded,
    })
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(true));
  };

  return (
    <div className="relative overflow-hidden">
      {/* Halo radial diffus en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none radial-halo opacity-90 z-0" />

      <div className="relative z-10 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
            ENTRER EN CONTACT
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F6F8] mt-2 mb-4">
            Discutons de Votre Projet
          </h1>
          <p className="text-[#D6DCE6] text-sm sm:text-base leading-relaxed font-sans">
            Pour une commande de clipping vidéo standard, vous pouvez commander directement sur Fiverr. Pour une demande sur-mesure (gros volume, scraping, script Python ou développement web), transmettez-moi vos besoins via le formulaire ci-dessous.
          </p>
        </div>

        {/* ── GRID : FORMULAIRE & INFORMATIONS ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          {/* Formulaire de Contact */}
          <div className="lg:col-span-7 rounded-2xl bg-[#1A1F2B] border border-[#394150] p-8 sm:p-10 shadow-2xl">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#8EAFFF]/10 border border-[#8EAFFF]/30 text-[#8EAFFF] flex items-center justify-center mx-auto">
                  <HiCheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#F5F6F8]">
                  Message transmis avec succès
                </h3>
                <p className="text-[#B6C0D0] text-sm max-w-md mx-auto leading-relaxed font-sans">
                  Merci pour votre message. Je prends connaissance de votre demande et reviens vers vous dans un délai de 24 heures ouvrées.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-[#232A38] hover:bg-[#2D3546] border border-[#394150] text-xs font-mono text-[#F5F6F8] transition"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" name="contact" data-netlify="true">
                <input type="hidden" name="form-name" value="contact" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium">
                      Votre Nom <span className="text-[#8EAFFF]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alexandre Dupont"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] placeholder-[#717F9A] text-sm focus:outline-none focus:border-[#8EAFFF] transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium">
                      Adresse Email <span className="text-[#8EAFFF]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@entreprise.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] placeholder-[#717F9A] text-sm focus:outline-none focus:border-[#8EAFFF] transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium">
                    Prestation concernée
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] text-sm focus:outline-none focus:border-[#8EAFFF] transition cursor-pointer"
                  >
                    <option value="Clipping Vidéo (TikTok / Reels / Shorts)" className="bg-[#11151D] text-[#F5F6F8]">
                      Clipping Vidéo (TikTok / Reels / Shorts)
                    </option>
                    <option value="Web Scraping & Pipelines de Données" className="bg-[#11151D] text-[#F5F6F8]">
                      Web Scraping & Pipelines de Données
                    </option>
                    <option value="Automatisations & Scripts Python" className="bg-[#11151D] text-[#F5F6F8]">
                      Automatisations & Scripts Python
                    </option>
                    <option value="Développement Web & Outil sur-mesure" className="bg-[#11151D] text-[#F5F6F8]">
                      Développement Web & Outil sur-mesure
                    </option>
                    <option value="Autre demande spécifique" className="bg-[#11151D] text-[#F5F6F8]">
                      Autre demande spécifique
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium">
                    Détails de votre projet <span className="text-[#8EAFFF]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Présentez votre projet, la durée de vos vidéos sources, vos objectifs ou vos spécifications techniques..."
                    className="w-full px-4 py-3.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] placeholder-[#717F9A] text-sm focus:outline-none focus:border-[#8EAFFF] transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#8EAFFF]/15 transition active:scale-[0.98]"
                >
                  <HiPaperAirplane className="w-4 h-4 text-[#0B0D12]" />
                  <span>Envoyer ma demande</span>
                </button>
              </form>
            )}
          </div>

          {/* Colonne latérale droite */}
          <div className="lg:col-span-5 space-y-6">
            {/* Fiverr Card Box */}
            <div className="rounded-2xl bg-[#1A1F2B] border border-[#394150] p-8 transition shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#11151D] border border-[#394150] text-[#8EAFFF] flex items-center justify-center">
                  <RiShoppingBag3Line className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
                    COMMANDE SÉCURISÉE
                  </span>
                  <div className="text-sm font-bold text-[#F5F6F8]">Fiverr Pro</div>
                </div>
              </div>

              <h3 className="font-display font-bold text-lg text-[#F5F6F8] mb-2">
                Vous avez déjà vos rushes prêts ?
              </h3>
              <p className="text-[#D6DCE6] text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                Passez directement commande sur mon profil Fiverr vérifié. Vous bénéficiez du paiement consigné à 100% et de délais garantis.
              </p>

              <ul className="space-y-2.5 text-xs font-mono text-[#B6C0D0] mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                  <span>Paiement séquestré sans risque</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                  <span>2 révisions incluses</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                  <span>Décompte officiel sous 24-48h</span>
                </li>
              </ul>

              <a
                href={fiverrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#8EAFFF]/15 transition active:scale-[0.98]"
              >
                <span>Accéder au profil Fiverr</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-[#0B0D12]" />
              </a>
            </div>

            {/* Direct coordinates box */}
            <div className="rounded-2xl bg-[#1A1F2B] border border-[#394150] p-6 text-xs font-mono space-y-3.5 text-[#B6C0D0]">
              <div className="text-[#F5F6F8] font-bold text-sm mb-1 font-display">Coordonnées Directes</div>
              <div className="flex items-center gap-2.5">
                <HiEnvelope className="w-4 h-4 text-[#8EAFFF]" />
                <a href="mailto:vitali.studio.contact@gmail.com" className="text-[#D6DCE6] hover:text-[#8EAFFF] transition">
                  vitali.studio.contact@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <HiClock className="w-4 h-4 text-[#8EAFFF]" />
                <span>Lun – Ven • 9h – 19h (CET)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiShieldCheck className="w-4 h-4 text-[#8EAFFF]" />
                <span>Confidentialité & NDA sur demande</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ EN ACCORDÉON DYNAMIQUE ───────────────────────────── */}
        <section className="pt-16 border-t border-[#394150]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
                FOIRE AUX QUESTIONS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8] mt-1">
                Questions Fréquentes
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq._id || idx}
                    className="rounded-2xl bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/50 overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <span className="font-display font-medium text-sm sm:text-base text-[#F5F6F8]">
                        {faq.question}
                      </span>
                      <HiChevronDown
                        className={`w-4 h-4 text-[#8EAFFF] transition-transform duration-200 flex-shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#D6DCE6] leading-relaxed border-t border-[#394150] pt-4 font-sans">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
