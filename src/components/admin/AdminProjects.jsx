import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiXMark,
  HiCheckCircle,
  HiExclamationCircle,
  HiTag,
} from 'react-icons/hi2';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../../utils/api';

const emptyForm = {
  title: '',
  status: 'Actif',
  description: '',
  tags: '',
  order: 0,
  active: true,
};

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement projets:', err);
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
      status: item.status || 'Actif',
      description: item.description || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
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
        badge: form.status,
        order: Number(form.order) || 0,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingItem) {
        await updateProject(editingItem._id || editingItem.id, payload);
        showToast('Projet mis à jour avec succès');
      } else {
        await createProject(payload);
        showToast('Nouveau projet créé avec succès');
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      console.error('Erreur sauvegarde projet:', err);
      showToast(err.message || 'Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProject(deleteId);
      showToast('Projet supprimé');
      setDeleteId(null);
      fetchItems();
    } catch (err) {
      console.error('Erreur suppression projet:', err);
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
            Gestion des Projets (Domaines d’activité)
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Ces cartes apparaissent dans la section haute Bento Box de la page <code>/portfolio</code>.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-gray-200 transition shadow-sm self-start sm:self-auto"
        >
          <HiPlus className="w-4 h-4" />
          <span>Ajouter un domaine</span>
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bento-card h-28 animate-pulse bg-[#121212]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bento-card p-12 text-center text-gray-400">
          <p className="text-sm">Aucun projet enregistré en base de données.</p>
          <button
            onClick={openCreate}
            className="mt-4 px-4 py-2 rounded-xl bg-white text-black font-medium text-xs hover:bg-gray-200 transition"
          >
            Créer le premier projet (Clipping Vidéo)
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bento-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                      item.status === 'Actif'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                  >
                    {item.status || 'Actif'}
                  </span>
                  <h3 className="font-display font-bold text-white text-base sm:text-lg">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 max-w-3xl leading-relaxed">
                  {item.description}
                </p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono text-gray-500 bg-[#161616] px-2 py-0.5 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-lg bg-[#181818] hover:bg-[#222222] text-gray-300 hover:text-white border border-white/10 transition"
                  title="Modifier"
                >
                  <HiPencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(item._id)}
                  className="p-2 rounded-lg bg-[#181818] hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 transition"
                  title="Supprimer"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
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
                  {editingItem ? 'Modifier le projet' : 'Nouveau domaine d’activité'}
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
                    Titre du domaine *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={form.title}
                    onChange={handleChange}
                    placeholder="ex: Clipping Vidéo (TikTok / Reels / Shorts)"
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                      Statut
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition"
                    >
                      <option value="Actif">Actif</option>
                      <option value="À venir">À venir</option>
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
                    Description détaillée *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Extraction et montage de formats courts à partir de vidéos longues, lives, conférences et podcasts..."
                    className="w-full bg-[#181818] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-white focus:outline-none transition leading-relaxed resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">
                    Liste des tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="Format 9:16, IA & Rétention, Sous-titres Animés"
                    className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="projectActive"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    className="w-4 h-4 rounded bg-[#181818] border-white/10 text-white focus:ring-0"
                  />
                  <label htmlFor="projectActive" className="text-xs text-gray-300">
                    Actif (visible sur le site public)
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
                    {saving ? 'Enregistrement...' : editingItem ? 'Mettre à jour' : 'Créer le projet'}
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
                Confirmer la suppression
              </h4>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer définitivement ce projet ? Cette action est irréversible.
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
    </motion.div>
  );
}
