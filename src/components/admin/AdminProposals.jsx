import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiTrash,
  HiCheck,
  HiXMark,
  HiEnvelope,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiEye,
  HiInboxStack,
} from 'react-icons/hi2';
import {
  getServiceProposals,
  updateServiceProposal,
  deleteServiceProposal,
} from '../../utils/api';

export default function AdminProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, Nouveau, Lu
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const loadProposals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getServiceProposals();
      setProposals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showToast('error', 'Erreur lors du chargement des propositions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'Lu' ? 'Nouveau' : 'Lu';
    try {
      await updateServiceProposal(item._id, { status: nextStatus });
      setProposals((prev) =>
        prev.map((p) => (p._id === item._id ? { ...p, status: nextStatus } : p))
      );
      showToast('success', `Proposition marquée comme ${nextStatus.toLowerCase()}`);
    } catch (err) {
      showToast('error', 'Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteServiceProposal(id);
      setProposals((prev) => prev.filter((p) => p._id !== id));
      setDeleteConfirm(null);
      showToast('success', 'Proposition supprimée');
    } catch (err) {
      showToast('error', 'Erreur lors de la suppression');
    }
  };

  const filteredProposals = proposals.filter((p) => {
    if (filter === 'Nouveau') return p.status === 'Nouveau';
    if (filter === 'Lu') return p.status === 'Lu';
    return true;
  });

  const unreadCount = proposals.filter((p) => p.status === 'Nouveau').length;

  return (
    <div className="space-y-6">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-white">
              Propositions Clients
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
                {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Demandes et suggestions soumises depuis le formulaire de la page /services.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="inline-flex rounded-xl bg-dark-700 p-1 border border-white/5">
          {[
            { key: 'all', label: `Toutes (${proposals.length})` },
            { key: 'Nouveau', label: `Nouveaux (${unreadCount})` },
            { key: 'Lu', label: 'Lus' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                filter === f.key
                  ? 'bg-dark-900 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-dark-700/40 border border-white/5 animate-pulse h-28"
            />
          ))}
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-dark-700/30 border border-white/5">
          <HiInboxStack className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-white font-medium text-base mb-1">
            Aucune proposition reçue
          </h3>
          <p className="text-gray-500 text-xs font-mono">
            Les propositions envoyées depuis /services s’afficheront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map((item) => {
            const isUnread = item.status === 'Nouveau';
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Date inconnue';

            return (
              <div
                key={item._id}
                className={`p-6 rounded-2xl border transition-all ${
                  isUnread
                    ? 'bg-dark-700/80 border-emerald-500/30 shadow-lg shadow-emerald-500/[0.02]'
                    : 'bg-dark-700/40 border-white/5 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase ${
                          isUnread
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold'
                            : 'bg-white/5 border border-white/10 text-gray-400'
                        }`}
                      >
                        ● {item.status || 'Nouveau'}
                      </span>

                      <span className="text-xs font-mono text-gray-500 flex items-center gap-1.5">
                        <HiClock className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </span>

                      <span className="text-xs font-mono text-white/80 bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5">
                        Contact : <span className="text-white font-medium">{item.contact}</span>
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white">
                      {item.title}
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap bg-dark-800/60 p-4 rounded-xl border border-white/5 font-sans">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-start">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      title={isUnread ? 'Marquer comme lu' : 'Marquer comme nouveau'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition ${
                        isUnread
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <HiCheck className="w-4 h-4" />
                      <span>{isUnread ? 'Marquer Lu' : 'Non-lu'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(item._id)}
                      title="Supprimer la proposition"
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="p-6 rounded-2xl bg-dark-800 border border-white/10 max-w-sm w-full space-y-4"
            >
              <h4 className="font-display text-base font-bold text-white">
                Supprimer la proposition ?
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Cette action est définitive et retirera cette proposition de la base de données.
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
                  onClick={() => handleDelete(deleteConfirm)}
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
