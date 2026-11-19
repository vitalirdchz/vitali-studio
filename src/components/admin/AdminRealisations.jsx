import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiXMark,
  HiCheckCircle,
  HiExclamationCircle,
  HiPlay,
  HiOutlineFilm,
} from 'react-icons/hi2';
import {
  getRealisations,
  createRealisation,
  updateRealisation,
  deleteRealisation,
} from '../../utils/api';

const CATEGORIES = ['Podcast', 'Live', 'Conférence', 'Vidéo longue'];

const emptyForm = {
  title: '',
  category: 'Podcast',
  description: '',
  videoUrl: '',
  order: 0,
  active: true,
};

function parseEmbedUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();

  const iframeMatch = trimmed.match(/src=["'](.*?)["']/);
  if (iframeMatch && iframeMatch[1]) {
    return { type: 'iframe', src: iframeMatch[1] };
  }

  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=0&rel=0`,
    };
  }

  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
    };
  }

  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed)) {
    return { type: 'video', src: trimmed };
  }

  return { type: 'iframe', src: trimmed };
}

export default function AdminRealisations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRealisations();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement réalisations:', err);
      showToast(err.message || 'Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      category: item.category || 'Podcast',
      description: item.description || '',
      videoUrl: item.videoUrl || '',
      order: item.order || 0,
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        order: Number(form.order) || 0,
      };

      if (editingItem) {
        await updateRealisation(editingItem._id || editingItem.id, payload);
        showToast('Réalisation mise à jour avec succès');
      } else {
        await createRealisation(payload);
        showToast('Nouvelle réalisation enregistrée');
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      console.error('Erreur sauvegarde réalisation:', err);
      showToast(err.message || 'Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRealisation(deleteId);
      showToast('Réalisation supprimée');
      setDeleteId(null);
      fetchItems();
    } catch (err) {
      console.error('Erreur suppression réalisation:', err);
      showToast(err.message || 'Erreur lors de la suppression', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Toast */}
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Gestion des Réalisations (Vidéos 9:16)
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Ces démonstrations apparaissent dans la grille verticale 9:16 de la page <code>/portfolio</code>.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-gray-200 transition shadow-sm self-start sm:self-auto"
        >
          <HiPlus className="w-4 h-4" />
          <span>Ajouter une réalisation</span>
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bento-card h-48 animate-pulse bg-[#121212]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bento-card p-12 text-center text-gray-400">
          <HiOutlineFilm className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-white mb-1">
            Aucune réalisation publiée pour l'instant
          </p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4 font-sans">
            L'état vide discret ("Nouvelles démonstrations en cours de préparation") est actuellement affiché sur le site public.
          </p>
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-gray-200 transition"
          >
            Publier la première réalisation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item._id}
              className="bento-card p-5 flex flex-col justify-between hover:border-white/20 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#181818] border border-white/10 text-white">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                    Ordre: {item.order || 0}
                  </span>
                </div>

                <h3 className="font-display font-bold text-white text-base mb-1 line-clamp-1">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                )}

                <div className="p-2.5 rounded-lg bg-[#181818] border border-white/5 text-[11px] font-mono text-gray-400 truncate mb-4">
                  {item.videoUrl}
                </div>
              </div>

              {/* Actions & Preview */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5 transition"
                >
                  <HiPlay className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Tester lecteur</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#222222] text-gray-300 hover:text-white border border-white/10 transition"
                    title="Modifier"
                  >
                    <HiPencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="p-1.5 rounded-lg bg-[#181818] hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 transition"
                    title="Supprimer"
                  >
                    <HiTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ajout / Modification */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#141414] border border-white/15 rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <h3 className="font-display font-bold text-lg text-white">
                  {editingItem ? 'Modifier la réalisation' : 'Nouvelle vidéo de réalisation (9:16)'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#282828] text-gray-400 hover:text-white transition"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Titre de la vidéo *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={form.title}
                    onChange={handleChange}
                    placeholder="ex: Clip Hook Podcast — Mindset #42"
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                      Catégorie *
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={form.order}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Lien Vidéo / Embed Iframe *
                  </label>
                  <input
                    type="text"
                    name="videoUrl"
                    required
                    value={form.videoUrl}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/shorts/VIDEO_ID ou lien TikTok / iframe"
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition font-mono text-xs"
                  />
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Collez directement l'URL d'un YouTube Shorts, d'une vidéo YouTube ou le code <code>&lt;iframe&gt;</code>. Le lecteur s'adapte automatiquement au ratio 9:16 avec chargement différé (lazy-loading).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Description courte
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Ex: Découpage dynamique des 40 premières secondes avec sous-titres animés et zooms..."
                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-white focus:outline-none transition leading-relaxed resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="realisationActive"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    className="w-4 h-4 rounded bg-[#181818] border-white/10 text-white focus:ring-0"
                  />
                  <label htmlFor="realisationActive" className="text-xs text-gray-300">
                    Actif (visible sur la page portfolio)
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#202020] text-gray-300 text-xs font-medium hover:bg-[#282828] transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-gray-200 transition disabled:opacity-50"
                  >
                    {saving ? 'Enregistrement...' : editingItem ? 'Mettre à jour' : 'Publier'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Suppression */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141414] border border-white/15 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h4 className="font-display font-bold text-white text-base mb-2">
                Supprimer la réalisation
              </h4>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer cette vidéo de démonstration ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-xl bg-[#202020] text-gray-300 text-xs font-medium hover:bg-[#282828] transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-xs transition"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal 9:16 */}
      <AnimatePresence>
        {previewItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#141414] border border-white/15 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono text-gray-300 truncate max-w-[200px]">
                  {previewItem.title}
                </span>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-[9/16] w-full bg-black rounded-xl overflow-hidden border border-white/10">
                {(() => {
                  const embed = parseEmbedUrl(previewItem.videoUrl);
                  if (embed?.type === 'iframe') {
                    return (
                      <iframe
                        src={embed.src}
                        title={previewItem.title}
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    );
                  }
                  if (embed?.type === 'video') {
                    return (
                      <video
                        src={embed.src}
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                      />
                    );
                  }
                  return (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono">
                      URL non convertible en embed
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
