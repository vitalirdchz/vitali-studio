import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiTrash,
  HiCheck,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiInboxStack,
  HiCheckBadge,
} from 'react-icons/hi2';
import {
  getServiceProposals,
  updateServiceProposal,
  deleteServiceProposal,
} from '../../utils/api';

export default function AdminProposals({ onUpdated }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
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
    const isCurrentlyRead = item.isRead || item.status === 'Lu';
    const nextStatus = isCurrentlyRead ? 'Nouveau' : 'Lu';
    const nextRead = !isCurrentlyRead;

    try {
      await updateServiceProposal(item._id, { status: nextStatus, isRead: nextRead });
      setProposals((prev) =>
        prev.map((p) =>
          p._id === item._id ? { ...p, status: nextStatus, isRead: nextRead } : p
        )
      );
      if (onUpdated) onUpdated();
      showToast(
        'success',
        nextRead ? 'Proposition marquée comme lue' : 'Proposition marquée comme non-lue'
      );
    } catch (err) {
      showToast('error', 'Erreur lors de la mise à jour du statut');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await updateServiceProposal('bulk', { markAllRead: true });
      setProposals((prev) =>
        prev.map((p) => ({ ...p, status: 'Lu', isRead: true }))
      );
      if (onUpdated) onUpdated();
      showToast('success', 'Toutes les propositions ont été marquées comme lues');
    } catch (err) {
      showToast('error', 'Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteServiceProposal(id);
      setProposals((prev) => prev.filter((p) => p._id !== id));
      setDeleteConfirm(null);
      if (onUpdated) onUpdated();
      showToast('success', 'Proposition supprimée');
    } catch (err) {
      showToast('error', 'Erreur lors de la suppression');
    }
  };

  const isProposalUnread = (p) => !p.isRead && p.status !== 'Lu';

  const filteredProposals = proposals.filter((p) => {
    if (filter === 'unread') return isProposalUnread(p);
    if (filter === 'read') return !isProposalUnread(p);
    return true;
  });

  const unreadCount = proposals.filter(isProposalUnread).length;

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
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-white">
              Propositions Clients
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-1 font-sans">
            Demandes et suggestions soumises depuis le formulaire de la page /services.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/40 text-xs font-mono text-gray-300 hover:text-white transition flex items-center gap-2"
            >
              <HiCheckBadge className="w-4 h-4 text-indigo-400" />
              <span>Tout marquer comme lu</span>
            </button>
          )}

          {/* Filter buttons */}
          <div className="inline-flex rounded-xl bg-[#141416] p-1 border border-white/5">
            {[
              { key: 'all', label: `Toutes (${proposals.length})` },
              { key: 'unread', label: `Non lues (${unreadCount})` },
              { key: 'read', label: 'Lues' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                  filter === f.key
                    ? 'bg-[#1D1D22] text-white shadow-sm border border-white/10'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Chargement des propositions...
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#111113] border border-white/5">
          <HiInboxStack className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-white font-medium text-sm mb-1">
            Aucune proposition trouvée
          </h3>
          <p className="text-gray-500 text-xs font-mono">
            {filter === 'unread'
              ? 'Toutes les propositions ont été consultées.'
              : 'Les soumissions depuis la page /services apparaîtront ici.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map((item) => {
            const isUnread = isProposalUnread(item);
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
                className={`p-6 rounded-2xl border transition-all duration-200 ${
                  isUnread
                    ? 'bg-[#141418] border-indigo-500/40 shadow-lg shadow-indigo-500/[0.03]'
                    : 'bg-[#111113]/70 border-white/5 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      {isUnread ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                          Non lu
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[11px] font-mono">
                          Lu
                        </span>
                      )}

                      <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                        <HiClock className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </span>

                      <span className="text-xs font-mono text-white/90 bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5">
                        Contact : <span className="text-white font-medium">{item.contact}</span>
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white">
                      {item.title}
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap bg-[#161619] p-4 rounded-xl border border-white/5 font-sans">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-start">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      title={isUnread ? 'Marquer comme lu' : 'Marquer comme non-lu'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition ${
                        isUnread
                          ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30'
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="p-6 rounded-2xl bg-[#161619] border border-white/10 max-w-sm w-full space-y-4"
            >
              <h4 className="font-display text-base font-bold text-white">
                Supprimer la proposition ?
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed font-sans">
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
