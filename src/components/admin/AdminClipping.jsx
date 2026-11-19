import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiArrowTopRightOnSquare,
  HiSparkles,
  HiWrenchScrewdriver,
  HiShieldCheck,
  HiPlus,
  HiTrash,
} from 'react-icons/hi2';
import { getClippingConfig, updateClippingConfig } from '../../utils/api';

const DEFAULT_PACKS = [
  {
    id: 'pack-decouverte',
    name: 'Pack 1 — Découverte',
    badge: '3 à 5 extraits',
    clipsCount: '3 à 5 extraits (9:16)',
    price: 'Paiement unique',
    tagline: 'Idéal pour vidéo courte / test',
    delivery: '24h à 48h ouvrées',
    description:
      'Idéal pour tester le format ou extraire l’essentiel d’une courte vidéo sans engagement.',
    features: [
      '3 à 5 clips verticaux au format 9:16',
      'Sélection chirurgicale des meilleurs moments & punchlines',
      'Recadrage dynamique centré sur le sujet principal',
      'Export haute définition (1080x1920) optimisé mobile',
      'Paiement unique au clip (aucun abonnement requis)',
    ],
    highlight: false,
    fiverrUrl: '',
  },
  {
    id: 'pack-standard',
    name: 'Pack 2 — Standard',
    badge: '8 à 10 extraits',
    clipsCount: '8 à 10 extraits (9:16)',
    price: 'Paiement unique',
    tagline: 'Idéal pour podcast ou vidéo longue',
    delivery: '48h ouvrées',
    description:
      'Couverture complète des moments forts d’un épisode ou d’un long format, prêt à publier.',
    features: [
      '8 à 10 clips verticaux au format 9:16',
      'Couverture exhaustive et rythmée des temps forts',
      'Recadrage dynamique et transitions soignées',
      'Sous-titres synchronisés haute visibilité',
      'Fichiers calibrés pour TikTok, Reels et YouTube Shorts',
      'Paiement unique au nombre d’extraits (aucun abonnement)',
    ],
    highlight: true,
    fiverrUrl: '',
  },
  {
    id: 'pack-volume',
    name: 'Pack 3 — Volume',
    badge: '15 extraits',
    clipsCount: '15 extraits (9:16)',
    price: 'Paiement unique',
    tagline: 'Idéal live, conférence & long podcast',
    delivery: '72h ouvrées',
    description:
      'Exploitation maximale d’un flux live, d’un séminaire ou d’un podcast de plusieurs heures.',
    features: [
      '15 clips verticaux au format 9:16',
      'Exploitation maximale et chirurgicale de votre vidéo source',
      'Diversité des angles d’intérêt & hooks percutants',
      'Rythme et rétention optimisés pour l’engagement',
      'Pack complet de fichiers organisés et prêts à programmer',
      'Paiement unique au nombre d’extraits (aucun abonnement)',
    ],
    highlight: false,
    fiverrUrl: '',
  },
];

const DEFAULT_OPTIONS = [
  {
    id: 'opt-express',
    title: 'Livraison Express',
    description:
      'Traitement prioritaire en haut de pile et livraison de vos extraits sous 24h ouvrées.',
    tag: 'Urgent',
  },
  {
    id: 'opt-subtitles',
    title: 'Sous-titres dynamiques sur-mesure',
    description:
      'Animation mot à mot calibrée selon votre charte graphique (typographie de marque, palette de couleurs, emojis ciblés).',
    tag: 'Branding',
  },
  {
    id: 'opt-multicam',
    title: 'Cadrage dynamique / Multicam & Split-Screen',
    description:
      'Suivi automatique de la prise de parole, découpe multi-angles ou split-screen vertical (facecam + rush démonstration).',
    tag: 'Technique',
  },
  {
    id: 'opt-sound',
    title: 'Habillage & Musique de fond',
    description:
      'Zooms lents de rétention, bande-son libre de droits mixée avec soin, sound design discret et barre de rétention.',
    tag: 'Rétention',
  },
  {
    id: 'opt-ready',
    title: 'Pack prêt à poster',
    description:
      'Miniature dédiée par extrait + titre percutant + suggestion de description et hashtags SEO prêts à copier/coller.',
    tag: 'Clé en main',
  },
];

export default function AdminClipping() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    title: 'Clipping Vidéo (TikTok / Reels / Shorts)',
    subtitle:
      'Transformez vos vidéos longues en formats courts viraux et percutants sans aucun abonnement.',
    fiverrUrl: 'https://www.fiverr.com',
    packs: DEFAULT_PACKS,
    options: DEFAULT_OPTIONS,
    qualityAdvice:
      "La résolution 1080p n'est pas obligatoire mais fortement conseillée pour obtenir un rendu net après recadrage vertical (9:16). Prévenir qu'avec une source de basse qualité, le rendu peut être dégradé. Il est possible de tenter une amélioration de qualité par IA, mais sans aucune promesse ni garantie sur le résultat final.",
  });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const data = await getClippingConfig();
        if (data) {
          setForm({
            title: data.title || form.title,
            subtitle: data.subtitle || form.subtitle,
            fiverrUrl: data.fiverrUrl || 'https://www.fiverr.com',
            packs: data.packs && data.packs.length > 0 ? data.packs : DEFAULT_PACKS,
            options:
              data.options && data.options.length > 0
                ? data.options
                : DEFAULT_OPTIONS,
            qualityAdvice: data.qualityAdvice || form.qualityAdvice,
          });
        }
      } catch (err) {
        console.error(err);
        showToast('error', 'Impossible de charger la configuration');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handlePackChange = (index, field, value) => {
    const newPacks = [...form.packs];
    newPacks[index] = { ...newPacks[index], [field]: value };
    setForm({ ...form, packs: newPacks });
  };

  const handlePackFeaturesChange = (index, text) => {
    const features = text
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);
    const newPacks = [...form.packs];
    newPacks[index] = { ...newPacks[index], features };
    setForm({ ...form, packs: newPacks });
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...form.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setForm({ ...form, options: newOptions });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateClippingConfig(form);
      showToast('success', 'Offres et packs de clipping mis à jour !');
    } catch (err) {
      console.error(err);
      showToast('error', err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-8 rounded-2xl bg-dark-700/40 border border-white/5 animate-pulse h-40"
          />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl border flex items-center gap-3 text-sm shadow-xl ${
              toast.type === 'success'
                ? 'bg-dark-900 border-emerald-500/30 text-emerald-400'
                : 'bg-dark-900 border-red-500/30 text-red-400'
            }`}
          >
            {toast.type === 'success' ? (
              <HiCheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <HiExclamationCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Gestion de l’Offre Clipping Vidéo
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Modifiez en temps réel les 3 packs, liens Fiverr, options et conseils de la page /services/clipping.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-gray-200 transition disabled:opacity-50 self-start sm:self-auto flex items-center gap-2 shadow-lg"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Sauvegarde...</span>
            </>
          ) : (
            <span>Enregistrer les modifications</span>
          )}
        </button>
      </div>

      {/* ── SECTION 1 : LIEN FIVERR GLOBAL ──────────────────────── */}
      <div className="p-6 rounded-2xl bg-dark-700/50 border border-white/5 space-y-4">
        <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
          <HiSparkles className="w-5 h-5 text-accent-cyan" />
          <span>Lien Fiverr Principal & En-tête</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Lien Fiverr de redirection par défaut
            </label>
            <input
              type="url"
              required
              value={form.fiverrUrl}
              onChange={(e) => setForm({ ...form, fiverrUrl: e.target.value })}
              placeholder="https://www.fiverr.com/votre-gig-clipping"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-white/10 text-white text-sm focus:border-white/30 outline-none"
            />
            <span className="text-[11px] font-mono text-gray-500 mt-1 block">
              Utilisé par défaut pour tous les boutons "Commander sur Fiverr".
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
              Titre du Service
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-white/10 text-white text-sm focus:border-white/30 outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── SECTION 2 : LES 3 PACKS ─────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <HiWrenchScrewdriver className="w-5 h-5 text-white" />
            <span>Les 3 Packs (Paiement Unique)</span>
          </h2>
          <span className="text-xs font-mono text-gray-400">
            Fixé à 3 packs sans abonnement
          </span>
        </div>

        <div className="space-y-6">
          {form.packs.map((pack, idx) => (
            <div
              key={pack.id || idx}
              className="p-6 rounded-2xl bg-dark-700/50 border border-white/10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-mono font-bold text-accent-cyan uppercase">
                  Pack {idx + 1}
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-gray-300">
                  <input
                    type="checkbox"
                    checked={pack.highlight || false}
                    onChange={(e) =>
                      handlePackChange(idx, 'highlight', e.target.checked)
                    }
                    className="rounded bg-dark-800 border-white/10 text-white focus:ring-0"
                  />
                  <span>Mettre en avant ("Recommandé")</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    Nom du pack
                  </label>
                  <input
                    type="text"
                    required
                    value={pack.name}
                    onChange={(e) => handlePackChange(idx, 'name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-white/10 text-white text-sm focus:border-white/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    Badge / Volume d'extraits
                  </label>
                  <input
                    type="text"
                    required
                    value={pack.badge || pack.clipsCount}
                    onChange={(e) => {
                      handlePackChange(idx, 'badge', e.target.value);
                      handlePackChange(idx, 'clipsCount', e.target.value);
                    }}
                    placeholder="ex: 3 à 5 extraits"
                    className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-white/10 text-white text-sm focus:border-white/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    Délai de livraison
                  </label>
                  <input
                    type="text"
                    value={pack.delivery || ''}
                    onChange={(e) =>
                      handlePackChange(idx, 'delivery', e.target.value)
                    }
                    placeholder="ex: 24h à 48h ouvrées"
                    className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-white/10 text-white text-sm focus:border-white/30 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">
                  Description courte
                </label>
                <textarea
                  rows={2}
                  value={pack.description}
                  onChange={(e) =>
                    handlePackChange(idx, 'description', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-white/10 text-white text-sm focus:border-white/30 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">
                  Points inclus (1 point par ligne)
                </label>
                <textarea
                  rows={4}
                  value={(pack.features || []).join('\n')}
                  onChange={(e) => handlePackFeaturesChange(idx, e.target.value)}
                  placeholder="3 à 5 clips verticaux (9:16)&#10;Recadrage dynamique..."
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-white/10 text-white text-xs font-mono focus:border-white/30 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">
                  Lien Fiverr spécifique à ce pack (optionnel, laisse vide pour utiliser le lien global)
                </label>
                <input
                  type="url"
                  value={pack.fiverrUrl || ''}
                  onChange={(e) =>
                    handlePackChange(idx, 'fiverrUrl', e.target.value)
                  }
                  placeholder="https://www.fiverr.com/... (laisser vide si identique)"
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-white/10 text-white text-xs font-mono focus:border-white/30 outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 3 : OPTIONS À LA CARTE ──────────────────────── */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-white">
          Options à la Carte (5 options)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.options.map((opt, idx) => (
            <div
              key={opt.id || idx}
              className="p-5 rounded-2xl bg-dark-700/50 border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400 uppercase">
                  Option {idx + 1}
                </span>
                <input
                  type="text"
                  value={opt.tag || ''}
                  onChange={(e) => handleOptionChange(idx, 'tag', e.target.value)}
                  placeholder="Tag (ex: Branding)"
                  className="px-2.5 py-1 rounded-md bg-dark-800 border border-white/10 text-white text-[10px] font-mono w-28 text-right focus:border-white/30 outline-none"
                />
              </div>

              <input
                type="text"
                required
                value={opt.title}
                onChange={(e) => handleOptionChange(idx, 'title', e.target.value)}
                placeholder="Titre de l’option"
                className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-white/10 text-white text-sm font-medium focus:border-white/30 outline-none"
              />

              <textarea
                rows={2}
                required
                value={opt.description}
                onChange={(e) =>
                  handleOptionChange(idx, 'description', e.target.value)
                }
                placeholder="Description de l’option..."
                className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-white/10 text-white text-xs focus:border-white/30 outline-none resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 4 : CONSEIL QUALITÉ ─────────────────────────── */}
      <div className="p-6 rounded-2xl bg-dark-700/50 border border-white/5 space-y-3">
        <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
          <HiShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Texte de l'Encart "Conseil Qualité"</span>
        </h2>
        <textarea
          rows={3}
          value={form.qualityAdvice}
          onChange={(e) => setForm({ ...form, qualityAdvice: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-white/10 text-white text-xs leading-relaxed focus:border-white/30 outline-none resize-none font-sans"
        />
      </div>

      {/* Submit footer */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-2 shadow-xl"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <span>Enregistrer toutes les modifications</span>
          )}
        </button>
      </div>
    </form>
  );
}
