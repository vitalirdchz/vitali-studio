import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiLink,
  HiSparkles,
  HiEnvelope,
} from 'react-icons/hi2';
import { RiShoppingBag3Line } from 'react-icons/ri';
import { getSettings, updateSettings } from '../../utils/api';

const defaultSettings = {
  fiverrUrl: 'https://www.fiverr.com',
  heroTitle: 'Montage Vidéo & Clipping IA Premium',
  heroSubtitle:
    'Transformez vos contenus longs en clips viraux optimisés pour TikTok, Reels & Shorts — propulsés par l’intelligence artificielle.',
  contactEmail: 'contact@vitalistudio.com',
};

export default function AdminSettings() {
  const [form, setForm] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettings();
        if (data && typeof data === 'object') {
          setForm({
            fiverrUrl: data.fiverrUrl || 'https://www.fiverr.com',
            heroTitle: data.heroTitle || defaultSettings.heroTitle,
            heroSubtitle: data.heroSubtitle || defaultSettings.heroSubtitle,
            contactEmail: data.contactEmail || defaultSettings.contactEmail,
          });
        }
      } catch (err) {
        console.error('Erreur chargement réglages:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(form);
      showToast('Paramètres généraux mis à jour avec succès !');
    } catch (err) {
      console.error('Erreur mise à jour réglages:', err);
      showToast(err.message || 'Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-accent-rose border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-red-500/90 text-white border border-red-400'
                : 'bg-emerald-500/90 text-white border border-emerald-400'
            }`}
          >
            {toast.type === 'error' ? (
              <HiExclamationCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <HiCheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Paramètres & Liens du Site
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Gérez ici votre lien Fiverr officiel et les descriptions principales visibles sur la page d'accueil.
          </p>
        </div>
      </div>

      <div className="max-w-3xl bg-dark-700/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fiverr Profile URL */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <RiShoppingBag3Line className="w-4 h-4 text-accent-cyan" />
              <span>Votre Lien de Profil / Service Fiverr (URL Officielle)</span>
            </label>
            <div className="relative">
              <input
                type="url"
                name="fiverrUrl"
                required
                value={form.fiverrUrl}
                onChange={handleChange}
                placeholder="https://www.fiverr.com/votre_profil"
                className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-rose focus:ring-1 focus:ring-accent-rose focus:outline-none transition"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Ce lien met à jour automatiquement tous les boutons « Commander sur Fiverr » de votre site (Navbar, Hero, Services, Contact et Charte).
            </p>
          </div>

          {/* Hero Headline */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <HiSparkles className="w-4 h-4 text-accent-rose" />
              <span>Titre de l'Accroche Principale (Hero)</span>
            </label>
            <input
              type="text"
              name="heroTitle"
              value={form.heroTitle}
              onChange={handleChange}
              placeholder="Montage Vidéo & Clipping IA Premium"
              className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-rose focus:ring-1 focus:ring-accent-rose focus:outline-none transition"
            />
          </div>

          {/* Hero Subtitle */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Description de l'Accroche Principale
            </label>
            <textarea
              name="heroSubtitle"
              rows={3}
              value={form.heroSubtitle}
              onChange={handleChange}
              className="w-full bg-dark-800 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-accent-rose focus:ring-1 focus:ring-accent-rose focus:outline-none transition leading-relaxed resize-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <HiEnvelope className="w-4 h-4 text-gray-400" />
              <span>Email de Contact Professionnel</span>
            </label>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              placeholder="contact@vitalistudio.com"
              className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-rose focus:ring-1 focus:ring-accent-rose focus:outline-none transition"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-gradient-accent text-white font-semibold text-sm shadow-lg shadow-accent-rose/25 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
            >
              {saving ? 'Enregistrement en cours...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
