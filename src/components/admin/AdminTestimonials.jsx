import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiXMark,
  HiCheckCircle,
  HiExclamationCircle,
  HiStar,
} from 'react-icons/hi2';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../../utils/api';

const emptyForm = {
  clientName: '',
  clientTitle: '',
  content: '',
  rating: 5,
  avatarUrl: '',
  active: true,
  isRead: true,
};

const StarRating = ({ rating, interactive = false, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={() => interactive && onChange && onChange(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
          disabled={!interactive}
        >
          <HiStar
            className={`w-5 h-5 ${
              star <= (hovered || rating)
                ? 'text-yellow-400'
                : 'text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const AdminTestimonials = ({ onUpdated }) => {
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
      const data = await getTestimonials();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast('Erreur lors du chargement', 'error');
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
      clientName: item.clientName || '',
      clientTitle: item.clientTitle || '',
      content: item.content || '',
      rating: item.rating || 5,
      avatarUrl: item.avatarUrl || '',
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
        rating: Number(form.rating),
      };
      if (editingItem) {
        await updateTestimonial(editingItem._id || editingItem.id, payload);
        showToast('Avis mis à jour');
      } else {
        await createTestimonial(payload);
        showToast('Avis créé');
      }
      setShowModal(false);
      fetchItems();
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Erreur sauvegarde avis:', err);
      showToast(err.message || 'Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTestimonial(deleteId);
      showToast('Avis supprimé');
      setDeleteId(null);
      fetchItems();
      if (onUpdated) onUpdated();
    } catch (err) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-red-500/90 text-white'
                : 'bg-green-500/90 text-white'
            }`}
          >
            {toast.type === 'error' ? (
              <HiExclamationCircle className="w-5 h-5" />
            ) : (
              <HiCheckCircle className="w-5 h-5" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-white">Gestion des Avis</h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium">
          <HiPlus className="w-4 h-4" />
          Nouvel avis
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-accent-rose" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="text-center py-20">
          <HiStar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">Aucun avis pour le moment</p>
          <button onClick={openCreate} className="btn-secondary px-4 py-2 rounded-xl text-sm font-medium">
            Ajouter votre premier avis
          </button>
        </div>
      )}

      {/* Items grid */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item._id || item.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass p-5 rounded-2xl"
            >
              <div className="flex items-start gap-3 mb-3">
                {item.avatarUrl ? (
                  <img
                    src={item.avatarUrl}
                    alt={item.clientName}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-rose to-accent-cyan flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {(item.clientName || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{item.clientName}</h3>
                  {item.clientTitle && (
                    <p className="text-xs text-gray-500 truncate">{item.clientTitle}</p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    item.active !== false
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {item.active !== false ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <StarRating rating={item.rating || 0} />

              <p className="text-sm text-gray-400 line-clamp-3 mt-3 mb-4">{item.content}</p>

              <div className="flex items-center gap-2 border-t border-white/5 pt-3">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-lg hover:bg-dark-600 text-gray-400 hover:text-white transition-colors"
                >
                  <HiPencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(item._id || item.id)}
                  className="p-2 rounded-lg hover:bg-dark-600 text-red-400 hover:text-red-300 transition-colors"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-white">
                  {editingItem ? "Modifier l'avis" : 'Nouvel avis'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nom du client</label>
                    <input
                      type="text"
                      name="clientName"
                      value={form.clientName}
                      onChange={handleChange}
                      required
                      className="bg-dark-600 border border-white/10 rounded-xl px-4 py-3 w-full text-white focus:border-accent-rose focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Titre / Poste</label>
                    <input
                      type="text"
                      name="clientTitle"
                      value={form.clientTitle}
                      onChange={handleChange}
                      className="bg-dark-600 border border-white/10 rounded-xl px-4 py-3 w-full text-white focus:border-accent-rose focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Contenu</label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="bg-dark-600 border border-white/10 rounded-xl px-4 py-3 w-full text-white focus:border-accent-rose focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Note</label>
                  <StarRating
                    rating={Number(form.rating)}
                    interactive={true}
                    onChange={(val) => setForm((prev) => ({ ...prev, rating: val }))}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">URL Avatar</label>
                  <input
                    type="text"
                    name="avatarUrl"
                    value={form.avatarUrl}
                    onChange={handleChange}
                    className="bg-dark-600 border border-white/10 rounded-xl px-4 py-3 w-full text-white focus:border-accent-rose focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="active"
                      checked={form.active}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-accent-rose peer-checked:to-accent-cyan" />
                  </label>
                  <span className="text-sm text-gray-400">Actif</span>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1 py-3 rounded-xl font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex-1 py-3 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center"
                  >
                    {saving ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    ) : (
                      'Sauvegarder'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-8 max-w-sm w-full text-center"
            >
              <HiTrash className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Supprimer cet avis ?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="btn-secondary flex-1 py-3 rounded-xl font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminTestimonials;
