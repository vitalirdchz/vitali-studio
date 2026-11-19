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
import { getFAQ, getSettings } from '../utils/api';

const DEFAULT_FAQ = [
  {
    _id: 'faq-1',
    question: 'Pourquoi déléguer mon clipping vidéo à Vitali Studio ?',
    answer:
      'Contrairement aux outils SaaS automatiques qui recadrent bêtement le centre de l’image et génèrent des sous-titres monotones, Vitali Studio associe l’IA pour la détection rapide des moments forts et le montage manuel pour le rythme, le sound design, les B-rolls et les hooks narratifs.',
  },
  {
    _id: 'faq-2',
    question: 'Quelle est la règle minimale pour les fichiers sources ?',
    answer:
      'Toute vidéo source doit être en 1080p (Full HD) minimum, idéalement 4K, avec un son intelligible. Les vidéos pixelisées ou issues de compressions WhatsApp sont systématiquement refusées pour garantir un résultat final d’exception.',
  },
  {
    _id: 'faq-3',
    question: 'Comment se déroule la commande via Fiverr ?',
    answer:
      'Fiverr agit comme un tiers de confiance : vous passez commande, les fonds sont placés sous séquestre sécurisé, et ils ne sont versés qu’après votre validation finale des vidéos livrées.',
  },
  {
    _id: 'faq-4',
    question: 'Réalisez-vous aussi des projets de Web Scraping ou de code sur-mesure ?',
    answer:
      'Oui ! Le studio développe des scripts Python personnalisés (scraping Playwright, bots d’alerte, pipelines de données). Contactez-moi directement via le formulaire ci-dessous avec vos spécifications pour obtenir un devis.',
  },
  {
    _id: 'faq-5',
    question: 'Quels sont les délais habituels de livraison ?',
    answer:
      'Pour le clipping vidéo standard (3 à 5 clips), le délai est de 24 à 48 heures ouvrées après réception des fichiers validés. Pour les outils de code ou les abonnements mensuels, un calendrier dédié est défini à l’avance.',
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
    service: 'Clipping Vidéo IA',
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
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
            ENTRER EN CONTACT
          </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mt-2 mb-4">
          Discutons de Votre Projet
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Pour une commande de clipping vidéo standard, vous pouvez commander directement sur Fiverr. Pour une demande sur-mesure (gros volume, scraping, automatisations), utilisez le formulaire ci-dessous.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
        {/* ── LEFT: FORMULAIRE NETLIFY FORMS ─────────────────────── */}
        <div className="lg:col-span-7">
          <div className="bento-card p-8 sm:p-10">
            <h2 className="font-display font-bold text-xl text-white mb-2">
              Formulaire de Contact Sécurisé
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Réponse directe garantie sous moins de 24 heures ouvrées.
            </p>

            {submitted ? (
              <div className="p-8 rounded-xl bg-[#161616] border border-emerald-500/30 text-center my-6">
                <HiCheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-display font-bold text-lg text-white mb-1">
                  Message envoyé avec succès
                </h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                  Merci ! Votre message a bien été transmis. Je reviens vers vous rapidement avec une analyse de faisabilité.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-[#222222] text-xs font-medium text-white hover:bg-[#282828] transition"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Ne pas remplir : <input name="bot-field" />
                  </label>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                      Nom / Marque *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alexandre"
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:border-white focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@studio.com"
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:border-white focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                    Domaine d'intervention
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white focus:outline-none transition"
                  >
                    <option value="Clipping Vidéo IA">Clipping Vidéo IA (Shorts / Reels / TikTok)</option>
                    <option value="Web Scraping & Data">Web Scraping & Pipelines de Données</option>
                    <option value="Automatisations & Scripts">Scripts Python & Automatisations</option>
                    <option value="Autre demande">Autre collaboration sur-mesure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                    Détails du besoin & liens vidéo/cibles *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Précisez vos besoins : volume de clips souhaité, liens vers les rushes sources ou les cibles de données..."
                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-4 text-white text-sm placeholder-gray-600 focus:border-white focus:outline-none transition leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition shadow-md flex items-center justify-center gap-2"
                >
                  <HiPaperAirplane className="w-4 h-4" />
                  <span>Transmettre ma demande</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── RIGHT: FIVERR CALLOUT & COORDONNÉES ──────────────────── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Fiverr Direct Box */}
          <div className="bento-card p-8 border-white/20 bg-gradient-to-br from-[#161616] to-[#111111]">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#222222] text-xs font-mono text-white mb-4">
              <RiShoppingBag3Line className="w-4 h-4" />
              <span>Commande Instantanée</span>
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              Vous avez déjà vos rushes prêts ?
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
              Passez directement commande sur mon profil Fiverr vérifié. Vous bénéficiez du paiement consigné à 100% et de délais garantis.
            </p>

            <ul className="space-y-2 text-xs font-mono text-gray-300 mb-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Paiement séquestré sans risque</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>2 révisions incluses</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Décompte officiel sous 24-48h</span>
              </li>
            </ul>

            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition shadow-md"
            >
              <span>Accéder au profil Fiverr</span>
              <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Direct coordinates box */}
          <div className="bento-card p-6 text-xs font-mono space-y-3 text-gray-400">
            <div className="text-white font-semibold mb-2">Coordonnées Directes</div>
            <div className="flex items-center gap-2">
              <HiEnvelope className="w-4 h-4 text-gray-500" />
              <a href="mailto:contact@vitalistudio.com" className="hover:text-white transition">
                contact@vitalistudio.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <HiClock className="w-4 h-4 text-gray-500" />
              <span>Lun – Ven • 9h – 19h (CET)</span>
            </div>
            <div className="flex items-center gap-2">
              <HiShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Confidentialité & NDA sur demande</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ EN ACCORDÉON DYNAMIQUE ───────────────────────────── */}
      <section className="pt-16 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
              FOIRE AUX QUESTIONS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Questions Fréquentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq._id || idx}
                  className="bento-card overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-display font-medium text-sm sm:text-base text-white">
                      {faq.question}
                    </span>
                    <HiChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-white' : ''
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
                        <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
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
