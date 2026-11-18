import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiXMark,
  HiCheckCircle,
  HiExclamationCircle,
} from 'react-icons/hi2';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../../utils/api';

const emptyForm = {
  title: '',
  description: '',
  icon: '',
  features: '',
  ctaLink: '',
  ctaText: '',
  order: 0,
  active: true,
};

const AdminServices = () => {
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
      const data = await getServices();
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
      title: item.title || '',
      description: item.description || '',
      icon: item.icon || '',
      features: Array.isArray(item.features) ? item.features.join('\n') : '',
      ctaLink: item.ctaLink || '',
      ctaText: item.ctaText || '',
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
        order: Number(form.order),
        features: form.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
      };
      if (editingItem) {
        await updateService(editingItem._id || editingItem.id, payload);
        showToast('Service mis à jour');
      } else {
        await createService(payload);
        showToast('Service créé');
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
      showToast('Service supprimé');
      setDeleteId(null);
      fetchItems();
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
        <h2 className="font-display text-2xl font-bold text-white">Gestion des Services</h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium">
          <HiPlus className="w-4 h-4" />
          Ajouter un service
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
          <p className="text-gray-500 text-lg mb-4">Aucun service pour le moment</p>
          <button onClick={openCreate} className="btn-secondary px-4 py-2 rounded-xl text-sm font-medium">
            Ajouter votre premier service
          </button>
        </div>
      )}

      {/* Items list */}
      {!loading && items.length > 0 && (
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item._id || item.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass p-5 rounded-2xl flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-white truncate">{item.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.active !== false
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {item.active !== false ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate">{item.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
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
                  {editingItem ? 'Modifier le service' : 'Nouveau service'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Titre</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="bg-dark-600 border border-white/10 rounded-xl px-4 py-3 w-full text-white focus:border-accent-rose focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="bg-dark-600 border border-white/10 rounded-xl px-4 py-3 w-full text-white focus:border-accent-rose focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Icône</label>
                  <input
                    type="text"
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    placeholder="ex: HiSparkles"
                    className="bg-dark-600 border border-white/10 rounded-xl px-4 py-3 w-full text-white focus:border-accent-rose focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Fonctionnalités</label>
                  <textarea
                    name="features"
                    value={form.features}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Une par ligne"
                    className="bg-dark-600 border border-white/10 rounded-xl px-4 py-3 w-full text-white focus:border-accent-rose focus:outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Lien CTA</label>
                    <input
                      type="text"
                      name="ctaLink"
                      value={form.ctaLink}
                      onChange={handleChange}
                      className="bg-dark-600 border border-white/10 rounded-xl px-4 py-3 w-full text-white focus:border-accent-rose focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Texte CTA</label>
                    <input
                      type="text"
                      name="ctaText"
                      value={form.ctaText}
                      onChange={handleChange}
                      className="bg-dark-600 border border-white/10 rounded-xl px-4 py-3 w-full text-white focus:border-accent-rose focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Ordre</label>
                    <input
                      type="number"
                      name="order"
                      value={form.order}
                      onChange={handleChange}
                      className="bg-dark-600 border border-white/10 rounded-xl px-4 py-3 w-full text-white focus:border-accent-rose focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
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
              <h3 className="text-lg font-bold text-white mb-2">Supprimer ce service ?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
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

export default AdminServices;
