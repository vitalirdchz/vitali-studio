import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiEnvelope,
  HiSparkles,
  HiCloudArrowUp,
  HiArrowTopRightOnSquare,
  HiKey,
} from 'react-icons/hi2';
import { RiShoppingBag3Line } from 'react-icons/ri';
import { getSettings, updateSettings } from '../../utils/api';

const defaultSettings = {
  fiverrUrl: 'https://www.fiverr.com',
  heroTitle: 'Montage Vidéo & Clipping IA Premium',
  heroSubtitle:
    'Transformez vos contenus longs en clips viraux optimisés pour TikTok, Reels & Shorts — propulsés par l’intelligence artificielle.',
  contactEmail: 'vitali.studio.contact@gmail.com',
  imagekitUrlEndpoint: 'https://ik.imagekit.io/qv6svz4aq',
  imagekitPublicKey: 'public_Hz1WiYFUAQ0FFYMhwooiDoGWUSg=',
  imagekitPrivateKey: 'private_tBpBG2BN7oolMBnnRCht4XrdiEs=',
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
            imagekitUrlEndpoint: data.imagekitUrlEndpoint || defaultSettings.imagekitUrlEndpoint,
            imagekitPublicKey: data.imagekitPublicKey || defaultSettings.imagekitPublicKey,
            imagekitPrivateKey: data.imagekitPrivateKey || defaultSettings.imagekitPrivateKey,
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
      showToast('Paramètres généraux & ImageKit mis à jour avec succès !');
    } catch (err) {
      console.error('Erreur mise à jour réglages:', err);
      showToast(err.message || 'Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isImageKitConnected =
    Boolean(form.imagekitPublicKey?.trim()) &&
    Boolean(form.imagekitPrivateKey?.trim());

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-[#8EAFFF] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
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
          <h2 className="font-display text-2xl font-bold text-[#F5F6F8]">
            Paramètres & Intégrations
          </h2>
          <p className="text-[#B6C0D0] text-sm mt-1">
            Configurez ici la connexion directe à ImageKit pour vos vidéos, votre lien Fiverr et vos métadonnées.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* ── SECTION IMAGEKIT : HÉBERGEMENT VIDÉO DIRECT ──────────── */}
        <div className="bg-[#1A1F2B] border border-[#394150] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#394150] mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-[#394150] text-[#8EAFFF] flex items-center justify-center">
                <HiCloudArrowUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#F5F6F8]">
                  Connexion ImageKit (CDN Vidéo)
                </h3>
                <p className="text-xs text-[#B6C0D0]">
                  Permet de téléverser des vidéos directement depuis votre panel admin.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
                  isImageKitConnected
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isImageKitConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>{isImageKitConnected ? 'ImageKit Connecté' : 'Non configuré'}</span>
              </span>

              <a
                href="https://imagekit.io/dashboard/developer/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#11151D] hover:bg-[#232A38] border border-[#394150] text-[#8EAFFF] text-xs font-mono transition"
              >
                <span>Mes clés ImageKit</span>
                <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quotas & Forfait ImageKit */}
          <div className="rounded-xl bg-[#11151D] border border-[#394150] p-4 text-xs font-mono grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[#717F9A] block text-[10px] uppercase">Stockage Gratuit</span>
              <span className="text-emerald-400 font-bold text-sm">20 Go inclus</span>
              <span className="text-[10px] text-[#B6C0D0] block">~80 à 150 clips courts HD</span>
            </div>
            <div>
              <span className="text-[#717F9A] block text-[10px] uppercase">Bande Passante</span>
              <span className="text-[#8EAFFF] font-bold text-sm">20 Go / mois</span>
              <span className="text-[10px] text-[#B6C0D0] block">Renouvellement automatique</span>
            </div>
            <div>
              <span className="text-[#717F9A] block text-[10px] uppercase">Forfait Actif</span>
              <span className="text-[#F5F6F8] font-bold text-sm">Plan Gratuit (Free Tier)</span>
              <span className="text-[10px] text-[#B6C0D0] block">Sans carte bancaire ni frais</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* URL-Endpoint */}
            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium">
                URL-Endpoint ImageKit
              </label>
              <input
                type="url"
                name="imagekitUrlEndpoint"
                value={form.imagekitUrlEndpoint}
                onChange={handleChange}
                placeholder="https://ik.imagekit.io/votre_identifiant"
                className="w-full bg-[#11151D] border border-[#394150] rounded-xl px-4 py-3 text-sm text-[#F5F6F8] placeholder-[#717F9A] focus:border-[#8EAFFF] focus:outline-none transition font-mono"
              />
              <p className="text-[11px] text-[#B6C0D0] mt-1.5 font-sans">
                Visible dans votre tableau de bord ImageKit sous <code>URL-endpoint</code> (ex: <code>https://ik.imagekit.io/vitalistudio</code>).
              </p>
            </div>

            {/* Public Key */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium flex items-center gap-1.5">
                <HiKey className="w-3.5 h-3.5 text-[#8EAFFF]" />
                <span>Public Key</span>
              </label>
              <input
                type="text"
                name="imagekitPublicKey"
                value={form.imagekitPublicKey}
                onChange={handleChange}
                placeholder="public_..."
                className="w-full bg-[#11151D] border border-[#394150] rounded-xl px-4 py-3 text-sm text-[#F5F6F8] placeholder-[#717F9A] focus:border-[#8EAFFF] focus:outline-none transition font-mono text-xs"
              />
            </div>

            {/* Private Key */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium flex items-center gap-1.5">
                <HiKey className="w-3.5 h-3.5 text-amber-400" />
                <span>Private Key</span>
              </label>
              <input
                type="password"
                name="imagekitPrivateKey"
                value={form.imagekitPrivateKey}
                onChange={handleChange}
                placeholder="private_..."
                className="w-full bg-[#11151D] border border-[#394150] rounded-xl px-4 py-3 text-sm text-[#F5F6F8] placeholder-[#717F9A] focus:border-[#8EAFFF] focus:outline-none transition font-mono text-xs"
              />
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-xl bg-[#11151D] border border-[#394150] text-xs text-[#B6C0D0] leading-relaxed">
            💡 <strong>Comment trouver vos clés :</strong> Rendez-vous sur votre dashboard ImageKit → cliquez sur <strong>Developer Options</strong> (icône d’engrenage en bas à gauche) → <strong>API Keys</strong>. Copiez votre <em>URL-endpoint</em>, votre <em>Public Key</em> et votre <em>Private Key</em> ici, puis cliquez sur <strong>Enregistrer</strong>.
          </div>
        </div>

        {/* ── SECTION PARAMÈTRES GÉNÉRAUX & FIVERR ──────────────────── */}
        <div className="bg-[#1A1F2B] border border-[#394150] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <h3 className="font-display text-lg font-bold text-[#F5F6F8] pb-4 border-b border-[#394150]">
            Paramètres Généraux
          </h3>

          {/* Fiverr Profile URL */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium flex items-center gap-2">
              <RiShoppingBag3Line className="w-4 h-4 text-[#8EAFFF]" />
              <span>Lien Profil / Service Fiverr (URL Officielle)</span>
            </label>
            <input
              type="url"
              name="fiverrUrl"
              required
              value={form.fiverrUrl}
              onChange={handleChange}
              placeholder="https://www.fiverr.com/votre_profil"
              className="w-full bg-[#11151D] border border-[#394150] rounded-xl px-4 py-3 text-sm text-[#F5F6F8] focus:border-[#8EAFFF] focus:outline-none transition font-mono text-xs"
            />
            <p className="text-[11px] text-[#B6C0D0] mt-1.5 font-sans">
              Met à jour automatiquement tous les boutons « Commander sur Fiverr » du site.
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium flex items-center gap-2">
              <HiEnvelope className="w-4 h-4 text-[#8EAFFF]" />
              <span>Email de Contact Professionnel</span>
            </label>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              placeholder="contact@vitalistudio.com"
              className="w-full bg-[#11151D] border border-[#394150] rounded-xl px-4 py-3 text-sm text-[#F5F6F8] focus:border-[#8EAFFF] focus:outline-none transition font-mono text-xs"
            />
          </div>

          <div className="pt-4 border-t border-[#394150] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-xs uppercase tracking-wider transition disabled:opacity-50 shadow-lg shadow-[#8EAFFF]/15 active:scale-[0.98]"
            >
              {saving ? 'Enregistrement en cours...' : 'Enregistrer tous les paramètres'}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
