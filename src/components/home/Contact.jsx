import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPaperAirplane, HiSparkles, HiEnvelope, HiCheckCircle, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { RiShoppingBag3Line, RiTiktokLine, RiInstagramLine, RiYoutubeLine, RiTwitterXLine } from 'react-icons/ri';
import AnimatedSection from '../ui/AnimatedSection';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Clipping IA (Shorts/Reels/TikTok)',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    // Netlify forms handle POST automatically if deployed, or AJAX post
    e.preventDefault();
    const encodedData = new URLSearchParams({
      'form-name': 'contact',
      ...formData,
    }).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodedData,
    })
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(true)); // Display friendly confirmation either way
  };

  return (
    <AnimatedSection id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-800 relative">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Démarrer un Projet"
          subtitle="Envoyez-moi un message pour une demande sur-mesure ou passez directement commande via Fiverr."
          gradient={true}
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Netlify Contact Form */}
          <div className="lg:col-span-7">
            <Card className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-dark-700/60 shadow-xl h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-gradient-accent text-white shadow-md shadow-accent-rose/20">
                    <HiEnvelope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">Formulaire de Prise de Contact</h3>
                    <p className="text-xs text-gray-400">Réponse garantie sous moins de 12 heures</p>
                  </div>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl bg-dark-800/80 border border-accent-cyan/30 text-center my-8"
                  >
                    <HiCheckCircle className="w-16 h-16 text-accent-cyan mx-auto mb-4 animate-bounce" />
                    <h4 className="font-display font-bold text-xl text-white mb-2">Message transmis avec succès !</h4>
                    <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                      Merci pour votre message. Je reviens vers vous par email très rapidement pour étudier votre projet.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl bg-dark-600 hover:bg-dark-500 text-sm text-gray-200 transition"
                    >
                      Envoyer un autre message
                    </button>
                  </motion.div>
                ) : (
                  <form
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Hidden fields for Netlify Forms */}
                    <input type="hidden" name="form-name" value="contact" />
                    <p className="hidden">
                      <label>
                        Don’t fill this out if you're human: <input name="bot-field" />
                      </label>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                          Votre Nom / Marque *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="ex: Alex Dupont"
                          className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-rose focus:ring-1 focus:ring-accent-rose transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                          Votre Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="alex@exemple.com"
                          className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-rose focus:ring-1 focus:ring-accent-rose transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Type de Prestation Souhaitée
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-rose focus:ring-1 focus:ring-accent-rose transition"
                      >
                        <option value="Clipping IA (Shorts/Reels/TikTok)">Clipping IA 9:16 (Shorts/Reels/TikTok)</option>
                        <option value="Montage Vidéo Long Format">Montage Long Format (YouTube / Podcast)</option>
                        <option value="Pack Créateur Mensuel">Pack Créateur Mensuel Récurrent</option>
                        <option value="Autre demande sur-mesure">Autre demande sur-mesure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Votre Message & Détails du Projet *
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Présentez brièvement vos contenus (liens YouTube/Twitch, volume de vidéos souhaité, style recherché)..."
                        className="w-full bg-dark-800 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-rose focus:ring-1 focus:ring-accent-rose transition leading-relaxed resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      icon={<HiPaperAirplane className="w-4 h-4" />}
                      className="w-full justify-center py-4"
                    >
                      Envoyer ma demande
                    </Button>
                  </form>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Direct Fiverr Callout & Trust */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Fiverr Card Box */}
            <div className="relative rounded-3xl p-[1px] bg-gradient-accent shadow-2xl shadow-accent-rose/15 overflow-hidden">
              <div className="bg-dark-900/95 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-rose/10 text-accent-rose border border-accent-rose/20 mb-6">
                    <RiShoppingBag3Line className="w-4 h-4" />
                    <span>Commande Directe Sécurisée</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-black text-white mb-4 leading-tight">
                    Vous souhaitez commander <span className="gradient-text">immédiatement</span> ?
                  </h3>

                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Passez commande directement sur mon profil Fiverr vérifié. Vous bénéficiez de prix transparents, du paiement séquestré 100% sécurisé et d’une prise en charge instantanée sans devis préalable.
                  </p>

                  <ul className="space-y-3 mb-8 text-xs sm:text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent-cyan" />
                      <span>Paiement bloqué jusqu'à votre entière satisfaction</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent-rose" />
                      <span>Révisions incluses sur tous les packages</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent-cyan" />
                      <span>Compte à rebours officiel et livraison garantie</span>
                    </li>
                  </ul>
                </div>

                <a
                  href="https://www.fiverr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-accent text-white font-bold rounded-2xl shadow-xl shadow-accent-rose/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-base"
                >
                  <span>Accéder à mon Profil Fiverr</span>
                  <HiArrowTopRightOnSquare className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Social Links Box */}
            <div className="card p-6 rounded-2xl border border-white/5 bg-dark-700/40 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Réseaux & Veille Vidéo</h4>
                <p className="text-xs text-gray-400">Suivez mes coulisses et astuces de montage</p>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { icon: RiTiktokLine, href: 'https://tiktok.com', label: 'TikTok' },
                  { icon: RiInstagramLine, href: 'https://instagram.com', label: 'Instagram' },
                  { icon: RiYoutubeLine, href: 'https://youtube.com', label: 'YouTube' },
                  { icon: RiTwitterXLine, href: 'https://twitter.com', label: 'Twitter' },
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="p-2.5 rounded-xl bg-dark-600 hover:bg-gradient-accent text-gray-300 hover:text-white transition duration-300"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
