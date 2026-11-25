import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiXMark,
  HiCheckCircle,
  HiExclamationCircle,
  HiWrenchScrewdriver,
  HiEye,
  HiEyeSlash,
  HiArrowRight,
  HiSparkles,
  HiCircleStack,
  HiCommandLine,
  HiVideoCamera,
} from 'react-icons/hi2';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../../utils/api';

const emptyForm = {
  title: '',
  category: 'Data & Automatisation',
  description: '',
  icon: 'HiCommandLine',
  features: '',
  ctaLink: '/contact',
  ctaText: 'Étudier un besoin',
  order: 1,
  active: true,
};

const CATEGORY_PRESETS = [
  'Data & Automatisation',
  'Vidéo 9:16',
  'Montage Long',
  'Sur consultation',
  'Autre',
];

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getServices();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement services:', err);
      showToast(err.message || 'Erreur lors du chargement des services', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({
      ...emptyForm,
      order: items.length + 1,
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      category: item.category || 'Data & Automatisation',
      description: item.description || '',
      icon: item.icon || 'HiCommandLine',
      features: Array.isArray(item.features) ? item.features.join('\n') : '',
      ctaLink: item.ctaLink || '/contact',
      ctaText: item.ctaText || 'Étudier un besoin',
      order: item.order ?? 1,
      active: item.active !== undefined ? item.active : true,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleToggleActive = async (item) => {
    const newActive = !item.active;
    try {
      await updateService(item._id || item.id, { active: newActive });
      setItems((prev) =>
        prev.map((it) =>
          (it._id || it.id) === (item._id || item.id) ? { ...it, active: newActive } : it
        )
      );
      showToast(
        `Service "${item.title}" ${newActive ? 'activé (visible sur le site)' : 'désactivé (masqué)'}`
      );
    } catch (err) {
      showToast(err.message || 'Erreur lors du changement de statut', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      showToast('Veuillez renseigner un titre de service.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        order: Number(form.order) || 0,
        features: form.features
          ? form.features
              .split('\n')
              .map((f) => f.trim())
              .filter(Boolean)
          : [],
      };

      if (editingItem) {
        await updateService(editingItem._id || editingItem.id, payload);
        showToast('Service mis à jour avec succès');
      } else {
        await createService(payload);
        showToast('Nouveau service ajouté au catalogue');
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      console.error('Erreur sauvegarde service:', err);
      showToast(err.message || 'Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteService(deleteId);
      showToast('Service retiré du catalogue');
      setDeleteId(null);
      fetchItems();
    } catch (err) {
      showToast(err.message || 'Erreur lors de la suppression', 'error');
    }
  };

  const filteredItems = items
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-6xl"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl border flex items-center gap-3 text-sm shadow-xl ${
              toast.type === 'error'
                ? 'bg-[#11151D] border-red-500/40 text-red-300'
                : 'bg-[#11151D] border-emerald-500/40 text-emerald-300'
            }`}
          >
            {toast.type === 'error' ? (
              <HiExclamationCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            ) : (
              <HiCheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            )}
            <span className="font-sans text-xs">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#394150]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8EAFFF] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF]">
              OFFRES & PRESTATIONS
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8] mt-1">
            Catalogue des Services
          </h1>
          <p className="text-xs text-[#B6C0D0] mt-1">
            Modifiez directement les prestations affichées sur <code className="text-[#8EAFFF]">/services</code> et l'Accueil.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreate}
            className="px-4 py-2.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] text-xs font-mono font-bold flex items-center gap-2 transition shadow-lg shadow-[#8EAFFF]/10"
          >
            <HiPlus className="w-4 h-4 text-[#0B0D12]" />
            <span>Nouveau Service</span>
          </button>
        </div>
      </div>

      {/* ── FILTRE & RECHERCHE ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#1A1F2B] border border-[#394150] text-[#F5F6F8] text-xs placeholder-[#717F9A] focus:border-[#8EAFFF] outline-none transition"
          />
        </div>
        <span className="text-xs font-mono text-[#B6C0D0]">
          Total : <strong className="text-[#F5F6F8]">{items.length}</strong> service{items.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* ── LISTE DES SERVICES ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#1A1F2B] border border-[#394150] animate-pulse h-48"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-[#1A1F2B] border border-[#394150] p-8">
          <HiWrenchScrewdriver className="w-10 h-10 text-[#717F9A] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#F5F6F8] mb-1">
            Aucun service trouvé
          </h3>
          <p className="text-xs text-[#B6C0D0] mb-6">
            Ajoutez votre premier service ou modifiez vos critères de recherche.
          </p>
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-xl bg-[#8EAFFF] text-[#0B0D12] text-xs font-mono font-bold"
          >
            + Créer un service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item._id || item.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`p-6 rounded-2xl border transition flex flex-col justify-between ${
                item.active !== false
                  ? 'bg-[#1A1F2B] border-[#394150] hover:border-[#8EAFFF]/50'
                  : 'bg-[#11151D] border-[#394150]/60 opacity-70'
              }`}
            >
              <div>
                {/* Header Card */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#11151D] border border-[#394150] text-[#8EAFFF]">
                      #{item.order ?? index + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#D6DCE6] bg-[#11151D] border border-[#394150]">
                      {item.category || 'Général'}
                    </span>
                  </div>

                  {/* Toggle actif / inactif */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold transition border ${
                      item.active !== false
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30 hover:bg-emerald-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30 hover:bg-zinc-500/20'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.active !== false ? 'bg-emerald-400' : 'bg-zinc-500'
                      }`}
                    />
                    <span>{item.active !== false ? 'Visible' : 'Masqué'}</span>
                  </button>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg text-[#F5F6F8] mb-2 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#B6C0D0] leading-relaxed mb-4 font-sans line-clamp-3">
                  {item.description || 'Aucune description rédigée.'}
                </p>

                {/* Features preview */}
                {Array.isArray(item.features) && item.features.length > 0 && (
                  <ul className="space-y-1.5 mb-4 text-[11px] font-mono text-[#D6DCE6]">
                    {item.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF] flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                    {item.features.length > 3 && (
                      <li className="text-[10px] text-[#717F9A] pl-3.5">
                        +{item.features.length - 3} autre(s) point(s)...
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#394150] flex items-center justify-between gap-3 text-xs font-mono">
                <span className="text-[#8EAFFF] truncate max-w-[160px] flex items-center gap-1">
                  <span>{item.ctaText || 'CTA'}</span>
                  <HiArrowRight className="w-3 h-3 flex-shrink-0" />
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#11151D] hover:bg-[#232A38] border border-[#394150] text-[#F5F6F8] text-xs font-mono transition flex items-center gap-1.5"
                  >
                    <HiPencil className="w-3.5 h-3.5 text-[#8EAFFF]" />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={() => setDeleteId(item._id || item.id)}
                    className="p-1.5 rounded-lg bg-[#11151D] hover:bg-red-500/20 border border-[#394150] text-red-400 transition"
                    title="Supprimer"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── MODAL D'AJOUT / MODIFICATION ────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1A1F2B] border border-[#394150] rounded-2xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#394150] mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#F5F6F8]">
                    {editingItem ? 'Modifier le service' : 'Ajouter un nouveau service'}
                  </h3>
                  <p className="text-xs text-[#B6C0D0]">
                    Configurez le contenu, les points clés et les liens d’action.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#B6C0D0] hover:text-[#F5F6F8] p-1"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Titre */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#F5F6F8] font-bold mb-1.5">
                      Titre du service <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="ex: Web Scraping & Pipelines"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] text-xs focus:border-[#8EAFFF] outline-none transition"
                    />
                  </div>

                  {/* Catégorie / Badge */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#F5F6F8] font-bold mb-1.5">
                      Catégorie / Badge
                    </label>
                    <input
                      type="text"
                      name="category"
                      placeholder="ex: Data & Automatisation"
                      value={form.category}
                      onChange={handleChange}
                      list="category-suggestions"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] text-xs focus:border-[#8EAFFF] outline-none transition"
                    />
                    <datalist id="category-suggestions">
                      {CATEGORY_PRESETS.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[#F5F6F8] font-bold mb-1.5">
                    Description détaillée
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Expliquez en détail ce que comprend cette prestation..."
                    value={form.description}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] text-xs focus:border-[#8EAFFF] outline-none transition resize-none"
                  />
                </div>

                {/* Points inclus (features) */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[#F5F6F8] font-bold mb-1.5">
                    Points inclus & fonctionnalités (1 par ligne)
                  </label>
                  <textarea
                    name="features"
                    rows={4}
                    placeholder="Exports sur-mesure (JSON, CSV, PostgreSQL)&#10;Tâches planifiées et scripts autonomes&#10;Surveillance continue et alertes"
                    value={form.features}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] text-xs font-mono focus:border-[#8EAFFF] outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Texte CTA */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#F5F6F8] font-bold mb-1.5">
                      Texte du Bouton (CTA)
                    </label>
                    <input
                      type="text"
                      name="ctaText"
                      placeholder="ex: Étudier un besoin"
                      value={form.ctaText}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] text-xs focus:border-[#8EAFFF] outline-none transition"
                    />
                  </div>

                  {/* Lien CTA */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#F5F6F8] font-bold mb-1.5">
                      Lien du Bouton (URL ou route)
                    </label>
                    <input
                      type="text"
                      name="ctaLink"
                      placeholder="ex: /contact ou https://..."
                      value={form.ctaLink}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] text-xs font-mono focus:border-[#8EAFFF] outline-none transition"
                    />
                  </div>

                  {/* Ordre */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#F5F6F8] font-bold mb-1.5">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      name="order"
                      min="0"
                      value={form.order}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#11151D] border border-[#394150] text-[#F5F6F8] text-xs focus:border-[#8EAFFF] outline-none transition"
                    />
                  </div>
                </div>

                {/* Statut actif */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-[#11151D] border border-[#394150]">
                    <input
                      type="checkbox"
                      name="active"
                      checked={form.active}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-[#8EAFFF] accent-[#8EAFFF]"
                    />
                    <div>
                      <span className="text-xs font-mono font-bold text-[#F5F6F8] block">
                        Service Actif (Visible sur le site public)
                      </span>
                      <span className="text-[11px] text-[#B6C0D0]">
                        Si décoché, le service est masqué aux visiteurs mais reste conservé ici.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Boutons modal */}
                <div className="pt-4 border-t border-[#394150] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#11151D] text-[#B6C0D0] text-xs font-mono hover:bg-[#232A38] transition border border-[#394150]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-xs font-mono transition disabled:opacity-50"
                  >
                    {saving ? 'Enregistrement...' : editingItem ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CONFIRMATION SUPPRESSION ────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1A1F2B] border border-[#394150] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h4 className="font-display font-bold text-[#F5F6F8] text-base mb-2">
                Supprimer le service
              </h4>
              <p className="text-xs text-[#B6C0D0] mb-6 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer définitivement ce service de votre catalogue ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-xl bg-[#11151D] text-[#B6C0D0] text-xs font-mono hover:bg-[#232A38] transition border border-[#394150]"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-xs font-mono transition"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
