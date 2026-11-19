import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiCheckCircle,
  HiExclamationCircle,
  HiCheck,
  HiXMark,
  HiSparkles,
  HiWrenchScrewdriver,
  HiArrowPath,
} from 'react-icons/hi2';
import {
  getClippingPacks,
  createClippingPack,
  updateClippingPack,
  deleteClippingPack,
  getClippingOptions,
  createClippingOption,
  updateClippingOption,
  deleteClippingOption,
} from '../../utils/api';

const emptyPackForm = {
  title: '',
  clipCount: '3 à 5 extraits',
  description: '',
  features: '',
  price: 'Paiement unique',
  fiverrUrl: '',
  isFeatured: false,
  order: 1,
};

const emptyOptionForm = {
  title: '',
  description: '',
  price: '',
  tag: '',
  order: 1,
};

export default function AdminPacksOptions() {
  const [activeTab, setActiveTab] = useState('packs'); // 'packs' or 'options'
  const [packs, setPacks] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [packForm, setPackForm] = useState(emptyPackForm);
  const [editingPackId, setEditingPackId] = useState(null);
  const [savingPack, setSavingPack] = useState(false);

  const [optionForm, setOptionForm] = useState(emptyOptionForm);
  const [editingOptionId, setEditingOptionId] = useState(null);
  const [savingOption, setSavingOption] = useState(false);

  // Confirmation modal
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'pack'|'option', id: string, title: string }

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [packsData, optionsData] = await Promise.all([
        getClippingPacks(),
        getClippingOptions(),
      ]);
      setPacks(Array.isArray(packsData) ? packsData : []);
      setOptions(Array.isArray(optionsData) ? optionsData : []);
    } catch (err) {
      console.error(err);
      showToast('error', 'Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── PACKS HANDLERS ──────────────────────────────────────────────────────────

  const handleEditPack = (pack) => {
    setEditingPackId(pack._id);
    setPackForm({
      title: pack.title || '',
      clipCount: pack.clipCount || '3 à 5 extraits',
      description: pack.description || '',
      features: Array.isArray(pack.features) ? pack.features.join('\n') : '',
      price: pack.price || 'Paiement unique',
      fiverrUrl: pack.fiverrUrl || '',
      isFeatured: pack.isFeatured ?? false,
      order: pack.order ?? 1,
    });
    // Scroll smoothly to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelPackEdit = () => {
    setEditingPackId(null);
    setPackForm(emptyPackForm);
  };

  const handleSubmitPack = async (e) => {
    e.preventDefault();
    if (!packForm.title.trim()) {
      showToast('error', 'Veuillez saisir un titre pour le pack.');
      return;
    }

    setSavingPack(true);
    try {
      const payload = {
        ...packForm,
        features: packForm.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
      };

      if (editingPackId) {
        const updated = await updateClippingPack(editingPackId, payload);
        setPacks((prev) =>
          prev
            .map((p) => (p._id === editingPackId ? updated : p))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        );
        showToast('success', 'Pack mis à jour avec succès.');
      } else {
        const created = await createClippingPack(payload);
        setPacks((prev) =>
          [...prev, created].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        );
        showToast('success', 'Nouveau pack ajouté avec succès.');
      }
      handleCancelPackEdit();
    } catch (err) {
      showToast('error', err.message || 'Erreur lors de l’enregistrement du pack.');
    } finally {
      setSavingPack(false);
    }
  };

  // ── OPTIONS HANDLERS ────────────────────────────────────────────────────────

  const handleEditOption = (opt) => {
    setEditingOptionId(opt._id);
    setOptionForm({
      title: opt.title || '',
      description: opt.description || '',
      price: opt.price || '',
      tag: opt.tag || '',
      order: opt.order ?? 1,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelOptionEdit = () => {
    setEditingOptionId(null);
    setOptionForm(emptyOptionForm);
  };

  const handleSubmitOption = async (e) => {
    e.preventDefault();
    if (!optionForm.title.trim()) {
      showToast('error', 'Veuillez saisir un titre pour l’option.');
      return;
    }

    setSavingOption(true);
    try {
      if (editingOptionId) {
        const updated = await updateClippingOption(editingOptionId, optionForm);
        setOptions((prev) =>
          prev
            .map((o) => (o._id === editingOptionId ? updated : o))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        );
        showToast('success', 'Option mise à jour avec succès.');
      } else {
        const created = await createClippingOption(optionForm);
        setOptions((prev) =>
          [...prev, created].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        );
        showToast('success', 'Nouvelle option ajoutée avec succès.');
      }
      handleCancelOptionEdit();
    } catch (err) {
      showToast('error', err.message || 'Erreur lors de l’enregistrement de l’option.');
    } finally {
      setSavingOption(false);
    }
  };

  // ── DELETION ────────────────────────────────────────────────────────────────

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;

    try {
      if (type === 'pack') {
        await deleteClippingPack(id);
        setPacks((prev) => prev.filter((p) => p._id !== id));
        showToast('success', 'Pack supprimé.');
        if (editingPackId === id) handleCancelPackEdit();
      } else {
        await deleteClippingOption(id);
        setOptions((prev) => prev.filter((o) => o._id !== id));
        showToast('success', 'Option supprimée.');
        if (editingOptionId === id) handleCancelOptionEdit();
      }
    } catch (err) {
      showToast('error', 'Erreur lors de la suppression.');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl border flex items-center gap-3 text-sm shadow-xl ${
              toast.type === 'success'
                ? 'bg-[#111113] border-indigo-500/30 text-indigo-300'
                : 'bg-[#111113] border-red-500/30 text-red-400'
            }`}
          >
            {toast.type === 'success' ? (
              <HiCheckCircle className="w-5 h-5 flex-shrink-0 text-indigo-400" />
            ) : (
              <HiExclamationCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              COMMERCE & CATALOGUE
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Gestion des Packs & Options
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Gérez directement dans MongoDB les offres affichées sur /services/clipping.
          </p>
        </div>

        {/* Section switcher */}
        <div className="inline-flex rounded-xl bg-[#141417] p-1 border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('packs')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition flex items-center gap-2 ${
              activeTab === 'packs'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <HiSparkles className="w-4 h-4" />
            <span>Packs ({packs.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('options')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition flex items-center gap-2 ${
              activeTab === 'options'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <HiWrenchScrewdriver className="w-4 h-4" />
            <span>Options ({options.length})</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 : GÉRER LES PACKS
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'packs' && (
        <div className="space-y-8">
          {/* Formulaire Pack (Ajout ou Édition) */}
          <form
            onSubmit={handleSubmitPack}
            className="p-6 sm:p-8 rounded-2xl bg-[#111113] border border-white/10 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>
                    {editingPackId ? 'Modifier le pack' : 'Ajouter un nouveau pack'}
                  </span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Les modifications sont instantanément répercutées sur la page publique.
                </p>
              </div>

              {editingPackId && (
                <button
                  type="button"
                  onClick={handleCancelPackEdit}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition flex items-center gap-1.5"
                >
                  <HiXMark className="w-3.5 h-3.5" />
                  <span>Annuler modification</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                  Titre du pack <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Pack Découverte"
                  value={packForm.title}
                  onChange={(e) =>
                    setPackForm({ ...packForm, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171A] border border-white/10 text-white text-sm focus:border-indigo-500/50 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                  Volume d’extraits <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: 3 à 5 extraits"
                  value={packForm.clipCount}
                  onChange={(e) =>
                    setPackForm({ ...packForm, clipCount: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171A] border border-white/10 text-white text-sm focus:border-indigo-500/50 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                  Tarification (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="ex: Paiement unique ou 50€"
                  value={packForm.price}
                  onChange={(e) =>
                    setPackForm({ ...packForm, price: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171A] border border-white/10 text-white text-sm focus:border-indigo-500/50 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  min="0"
                  value={packForm.order}
                  onChange={(e) =>
                    setPackForm({ ...packForm, order: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171A] border border-white/10 text-white text-sm focus:border-indigo-500/50 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                Description claire du pack
              </label>
              <textarea
                rows={2}
                placeholder="Idéal pour vidéo courte / test, sélection des meilleurs moments, recadrage 9:16..."
                value={packForm.description}
                onChange={(e) =>
                  setPackForm({ ...packForm, description: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171A] border border-white/10 text-white text-sm focus:border-indigo-500/50 outline-none transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                  Points inclus (1 point par ligne)
                </label>
                <textarea
                  rows={4}
                  placeholder="3 à 5 clips verticaux au format 9:16&#10;Recadrage dynamique centré...&#10;Export 1080x1920..."
                  value={packForm.features}
                  onChange={(e) =>
                    setPackForm({ ...packForm, features: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171A] border border-white/10 text-white text-xs font-mono focus:border-indigo-500/50 outline-none transition"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                    Lien Fiverr spécifique (optionnel)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.fiverr.com/... (laisser vide pour lien global)"
                    value={packForm.fiverrUrl}
                    onChange={(e) =>
                      setPackForm({ ...packForm, fiverrUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171A] border border-white/10 text-white text-xs font-mono focus:border-indigo-500/50 outline-none transition"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#161619] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-white block">
                      Mettre en avant ce pack
                    </span>
                    <span className="text-xs text-gray-400">
                      Affiche le badge "Recommandé" et une bordure indigo distincte.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={packForm.isFeatured}
                    onChange={(e) =>
                      setPackForm({ ...packForm, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded bg-dark-800 border-white/10 text-indigo-600 focus:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {editingPackId && (
                <button
                  type="button"
                  onClick={handleCancelPackEdit}
                  className="px-5 py-2.5 rounded-xl text-xs font-mono text-gray-400 hover:text-white transition"
                >
                  Annuler
                </button>
              )}
              <button
                type="submit"
                disabled={savingPack}
                className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-2 shadow-lg"
              >
                {savingPack ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <span>
                    {editingPackId ? 'Mettre à jour le pack' : 'Enregistrer le pack'}
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Liste des Packs existants */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <span>Packs enregistrés ({packs.length})</span>
            </h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-[#111113] border border-white/5 animate-pulse h-28"
                  />
                ))}
              </div>
            ) : packs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#111113] border border-white/10 text-gray-400 text-xs font-mono">
                Aucun pack en base de données. Utilisez le formulaire ci-dessus pour en créer un.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packs.map((pack) => (
                  <div
                    key={pack._id}
                    className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                      pack.isFeatured
                        ? 'bg-[#141418] border-indigo-500/40 shadow-lg shadow-indigo-500/[0.04]'
                        : 'bg-[#111113] border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono text-gray-500">
                          Ordre : {pack.order ?? 0}
                        </span>
                        {pack.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-semibold uppercase">
                            Recommandé
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h4 className="font-display font-bold text-white text-lg">
                          {pack.title}
                        </h4>
                        <span className="text-xs font-mono text-indigo-400 font-medium">
                          {pack.clipCount}
                        </span>
                      </div>

                      {pack.price && (
                        <div className="text-xs font-mono text-gray-400 mb-3">
                          {pack.price}
                        </div>
                      )}

                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4 font-sans">
                        {pack.description}
                      </p>

                      <ul className="space-y-1.5 text-xs text-gray-300 mb-6 font-sans">
                        {(pack.features || []).slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <HiCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                        {(pack.features || []).length > 3 && (
                          <li className="text-[11px] font-mono text-gray-500 pl-5">
                            + {(pack.features || []).length - 3} autres points
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditPack(pack)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 hover:text-white transition flex items-center gap-1.5"
                      >
                        <HiPencil className="w-3.5 h-3.5" />
                        <span>Modifier</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'pack',
                            id: pack._id,
                            title: pack.title,
                          })
                        }
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 : GÉRER LES OPTIONS
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'options' && (
        <div className="space-y-8">
          {/* Formulaire Option */}
          <form
            onSubmit={handleSubmitOption}
            className="p-6 sm:p-8 rounded-2xl bg-[#111113] border border-white/10 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>
                    {editingOptionId ? 'Modifier l’option' : 'Ajouter une nouvelle option'}
                  </span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Proposez des modules à la carte activables lors de la commande.
                </p>
              </div>

              {editingOptionId && (
                <button
                  type="button"
                  onClick={handleCancelOptionEdit}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition flex items-center gap-1.5"
                >
                  <HiXMark className="w-3.5 h-3.5" />
                  <span>Annuler</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                  Titre de l’option <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Livraison Express"
                  value={optionForm.title}
                  onChange={(e) =>
                    setOptionForm({ ...optionForm, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171A] border border-white/10 text-white text-sm focus:border-indigo-500/50 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                  Tag / Badge (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="ex: Urgent, Branding, Clé en main"
                  value={optionForm.tag}
                  onChange={(e) =>
                    setOptionForm({ ...optionForm, tag: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171A] border border-white/10 text-white text-sm focus:border-indigo-500/50 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  min="0"
                  value={optionForm.order}
                  onChange={(e) =>
                    setOptionForm({
                      ...optionForm,
                      order: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171A] border border-white/10 text-white text-sm focus:border-indigo-500/50 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5">
                Description de l'option
              </label>
              <textarea
                rows={3}
                required
                placeholder="Décrivez clairement ce que cette option apporte à la commande..."
                value={optionForm.description}
                onChange={(e) =>
                  setOptionForm({ ...optionForm, description: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171A] border border-white/10 text-white text-sm focus:border-indigo-500/50 outline-none transition resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {editingOptionId && (
                <button
                  type="button"
                  onClick={handleCancelOptionEdit}
                  className="px-5 py-2.5 rounded-xl text-xs font-mono text-gray-400 hover:text-white transition"
                >
                  Annuler
                </button>
              )}
              <button
                type="submit"
                disabled={savingOption}
                className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-2 shadow-lg"
              >
                {savingOption ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <span>
                    {editingOptionId ? 'Mettre à jour l’option' : 'Enregistrer l’option'}
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Liste des Options */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-white">
              Options enregistrées ({options.length})
            </h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-[#111113] border border-white/5 animate-pulse h-24"
                  />
                ))}
              </div>
            ) : options.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#111113] border border-white/10 text-gray-400 text-xs font-mono">
                Aucune option enregistrée.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {options.map((opt) => (
                  <div
                    key={opt._id}
                    className="p-6 rounded-2xl bg-[#111113] border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono text-gray-500">
                          Ordre : {opt.order ?? 0}
                        </span>
                        {opt.tag && (
                          <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300 uppercase">
                            {opt.tag}
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-white text-base mb-2">
                        {opt.title}
                      </h4>

                      <p className="text-xs text-gray-400 leading-relaxed font-sans mb-4">
                        {opt.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditOption(opt)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 hover:text-white transition flex items-center gap-1.5"
                      >
                        <HiPencil className="w-3.5 h-3.5" />
                        <span>Modifier</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'option',
                            id: opt._id,
                            title: opt.title,
                          })
                        }
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="p-6 rounded-2xl bg-[#161619] border border-white/10 max-w-sm w-full space-y-4"
            >
              <h4 className="font-display text-base font-bold text-white">
                Supprimer {deleteConfirm.type === 'pack' ? 'ce pack' : 'cette option'} ?
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed font-sans">
                Êtes-vous sûr de vouloir supprimer « {deleteConfirm.title} » ? Cette action est irréversible.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
