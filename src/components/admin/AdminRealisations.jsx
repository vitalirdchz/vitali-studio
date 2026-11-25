import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  HiCloudArrowUp,
  HiArrowUpTray,
  HiLink,
  HiEye,
  HiDocumentText,
  HiLockClosed,
  HiClipboardDocument,
  HiArrowTopRightOnSquare,
} from 'react-icons/hi2';
import {
  getRealisations,
  createRealisation,
  updateRealisation,
  deleteRealisation,
  uploadVideoToImageKit,
} from '../../utils/api';

const CATEGORIES = ['Podcast', 'Live', 'Conférence', 'Vidéo longue'];

const emptyForm = {
  title: '',
  category: 'Podcast',
  description: '',
  videoUrl: '',
  thumbnailUrl: '',
  aspectRatio: '9:16', // '9:16' (Shorts / Reels) ou '16:9' (YouTube / Paysage)
  order: 0,
  active: true,
  visibility: 'public', // 'public', 'draft', 'private'
};

function parseEmbedUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();

  // Fichier direct ou ImageKit
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed) || trimmed.includes('ik.imagekit.io')) {
    return { type: 'video', src: trimmed };
  }

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

  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
    };
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
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'public', 'draft', 'private'

  // Gestion du téléversement direct ImageKit
  const [videoMode, setVideoMode] = useState('upload'); // 'upload' ou 'link'
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
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
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadSuccess(false);
    setVideoMode('upload');
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      category: item.category || 'Podcast',
      description: item.description || '',
      videoUrl: item.videoUrl || '',
      thumbnailUrl: item.thumbnailUrl || '',
      aspectRatio: item.aspectRatio || (item.category === 'Vidéo longue' ? '16:9' : '9:16'),
      order: item.order || 0,
      active: item.active !== undefined ? item.active : true,
      visibility: item.visibility || (item.active === false ? 'draft' : 'public'),
    });
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadSuccess(Boolean(item.videoUrl && item.videoUrl.includes('imagekit.io')));
    setVideoMode(item.videoUrl && item.videoUrl.includes('imagekit.io') ? 'upload' : 'link');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      // Si l'utilisateur choisit 'Vidéo longue' et le format est par défaut 9:16, basculer automatiquement en 16:9
      if (name === 'category' && value === 'Vidéo longue' && prev.aspectRatio === '9:16') {
        updated.aspectRatio = '16:9';
      }
      return updated;
    });
  };

  // Sélection d'un fichier vidéo
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Veuillez sélectionner un fichier vidéo valide (.mp4, .mov, .webm)', 'error');
      return;
    }

    // Avertissement taille si > 30 Mo
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 45) {
      showToast(
        `Ce fichier pèse ${sizeInMB.toFixed(1)} Mo. Pour le plan gratuit ImageKit, compressez de préférence sous 25-30 Mo.`,
        'error'
      );
    }

    setSelectedFile(file);
    setUploadSuccess(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Veuillez déposer un fichier vidéo valide (.mp4, .mov, .webm)', 'error');
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 45) {
      showToast(
        `Ce fichier pèse ${sizeInMB.toFixed(1)} Mo. Pour le plan gratuit ImageKit, compressez de préférence sous 25-30 Mo.`,
        'error'
      );
    }

    setSelectedFile(file);
    setUploadSuccess(false);
  };

  // Lancement du téléversement vers ImageKit
  const handleUpload = async () => {
    if (!selectedFile) {
      showToast('Sélectionnez un fichier vidéo avant de téléverser', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await uploadVideoToImageKit(selectedFile, (percent) => {
        setUploadProgress(percent);
      });

      if (res && res.url) {
        // Enregistre l'URL ImageKit dans le formulaire
        const isLandscape = form.aspectRatio === '16:9' || form.category === 'Vidéo longue';
        const defaultThumb = isLandscape
          ? `${res.url.split('?')[0]}/ik-thumbnail.jpg?tr=w-1280,h-720,fo-auto`
          : `${res.url.split('?')[0]}/ik-thumbnail.jpg?tr=w-600,h-1066,fo-auto`;

        setForm((prev) => ({
          ...prev,
          videoUrl: res.url,
          thumbnailUrl: res.thumbnailUrl || defaultThumb,
        }));

        setUploadSuccess(true);
        showToast('Vidéo téléversée avec succès sur ImageKit CDN !');
      } else {
        throw new Error('Réponse invalide reçue d’ImageKit');
      }
    } catch (err) {
      console.error('Erreur upload ImageKit:', err);
      showToast(
        err.message ||
          'Erreur lors du téléversement. Vérifiez vos clés ImageKit dans l’onglet Paramètres.',
        'error'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.videoUrl?.trim()) {
      showToast('Veuillez renseigner ou téléverser une vidéo avant d’enregistrer.', 'error');
      return;
    }

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
          <h2 className="font-display text-2xl font-bold text-[#F5F6F8]">
            Gestion des Réalisations (Vidéos 9:16)
          </h2>
          <p className="text-[#B6C0D0] text-xs sm:text-sm mt-1">
            Téléversez vos clips directement vers ImageKit ou intégrez vos liens YouTube Shorts / TikTok.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <HiPlus className="w-4 h-4" />
          <span>Ajouter une réalisation</span>
        </button>
      </div>

      {/* ── BANDEAU QUOTA IMAGEKIT CDN ────────────────────────────────────── */}
      <div className="rounded-2xl bg-[#1A1F2B] border border-[#394150] p-4.5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF] flex-shrink-0">
            <HiCloudArrowUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#F5F6F8]">
                Quota ImageKit CDN
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                ● Connecté (qv6svz4aq)
              </span>
            </div>
            <p className="text-[11px] text-[#B6C0D0] mt-0.5">
              Stockage permanent : <strong>20 Go gratuits</strong> • Bande passante : <strong>20 Go / mois inclus</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="bg-[#11151D] border border-[#394150] px-3 py-1.5 rounded-xl">
            <span className="text-[#717F9A]">Clips sur CDN : </span>
            <span className="text-[#8EAFFF] font-bold">
              {items.filter((i) => i.videoUrl && i.videoUrl.includes('imagekit.io')).length}
            </span>
          </div>
          <div className="bg-[#11151D] border border-[#394150] px-3 py-1.5 rounded-xl">
            <span className="text-[#717F9A]">Espace gratuit : </span>
            <span className="text-emerald-400 font-bold">20 Go</span>
          </div>
          <a
            href="https://imagekit.io/dashboard/media-library"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#11151D] hover:bg-[#232A38] border border-[#394150] text-[#8EAFFF] hover:text-[#B3CAFF] transition text-xs font-mono"
          >
            <span>Médiathèque ImageKit</span>
            <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Onglets de filtrage par statut de visibilité */}
      {!loading && items.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {[
            { id: 'all', label: 'Toutes les vidéos', count: items.length },
            {
              id: 'public',
              label: '🟢 Publiées',
              count: items.filter(
                (i) => i.visibility === 'public' || (!i.visibility && i.active !== false)
              ).length,
            },
            {
              id: 'draft',
              label: '🟡 Brouillons (Draft)',
              count: items.filter((i) => i.visibility === 'draft' || i.active === false).length,
            },
            {
              id: 'private',
              label: '🔒 Privées (Lien secret)',
              count: items.filter((i) => i.visibility === 'private').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition flex items-center gap-2 border ${
                statusFilter === tab.id
                  ? 'bg-[#8EAFFF] text-[#0B0D12] border-[#8EAFFF] font-bold shadow-sm'
                  : 'bg-[#1A1F2B] text-[#B6C0D0] hover:text-[#F5F6F8] border-[#394150] hover:bg-[#232A38]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id
                    ? 'bg-[#0B0D12]/20 text-[#0B0D12]'
                    : 'bg-[#11151D] text-[#8EAFFF]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bento-card h-48 animate-pulse bg-[#11151D] border border-[#394150] rounded-2xl"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-[#394150] bg-[#1A1F2B] p-12 text-center text-[#B6C0D0]">
          <HiOutlineFilm className="w-8 h-8 text-[#717F9A] mx-auto mb-2" />
          <p className="text-sm font-medium text-[#F5F6F8] mb-1">
            Aucune réalisation publiée pour l'instant
          </p>
          <p className="text-xs text-[#B6C0D0] max-w-sm mx-auto mb-4 font-sans">
            L'état vide discret ("Nouvelles démonstrations en cours de préparation") est actuellement affiché sur le site public.
          </p>
          <button
            onClick={openCreate}
            className="px-5 py-2.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-xs transition"
          >
            Publier la première réalisation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items
            .filter((item) => {
              const vis = item.visibility || (item.active === false ? 'draft' : 'public');
              if (statusFilter === 'public') return vis === 'public';
              if (statusFilter === 'draft') return vis === 'draft';
              if (statusFilter === 'private') return vis === 'private';
              return true;
            })
            .map((item) => {
              const isImageKit = Boolean(item.videoUrl && item.videoUrl.includes('imagekit.io'));
              const vis = item.visibility || (item.active === false ? 'draft' : 'public');
              return (
                <div
                  key={item._id}
                  className="rounded-2xl border border-[#394150] bg-[#1A1F2B] p-5 flex flex-col justify-between hover:border-[#8EAFFF]/50 transition group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#11151D] border border-[#394150] text-[#8EAFFF]">
                          {item.category}
                        </span>
                        {/* Badge Format 9:16 ou 16:9 */}
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#11151D] border border-[#394150] text-[#D6DCE6]">
                          {item.aspectRatio === '16:9' || item.category === 'Vidéo longue' ? '🖥️ 16:9' : '📱 9:16'}
                        </span>
                        {/* Badge de visibilité */}
                        {vis === 'public' && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Publié</span>
                          </span>
                        )}
                        {vis === 'draft' && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Brouillon</span>
                          </span>
                        )}
                        {vis === 'private' && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                            <HiLockClosed className="w-3 h-3 text-indigo-400" />
                            <span>Privé</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isImageKit && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            ImageKit
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-[#717F9A]">
                          Ordre: {item.order || 0}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-[#F5F6F8] text-base mb-1 line-clamp-1">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-[#B6C0D0] line-clamp-2 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    )}

                    <div className="p-2.5 rounded-lg bg-[#11151D] border border-[#394150] text-[11px] font-mono text-[#D6DCE6] truncate mb-4 flex items-center justify-between">
                      <span className="truncate">{item.videoUrl}</span>
                    </div>
                  </div>

                  {/* Actions & Preview */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#394150]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="text-xs font-mono text-[#B6C0D0] hover:text-[#8EAFFF] flex items-center gap-1.5 transition"
                      >
                        <HiPlay className="w-3.5 h-3.5 text-[#8EAFFF]" />
                        <span>Tester lecteur</span>
                      </button>

                      {/* Bouton copier le lien privé pour les clients */}
                      {vis === 'private' && (
                        <button
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/portfolio?share=${item._id}`;
                            navigator.clipboard.writeText(shareUrl);
                            showToast('Lien privé copié ! Transmettez-le directement à votre client.');
                          }}
                          className="text-[11px] font-mono text-indigo-300 hover:text-indigo-200 flex items-center gap-1 ml-1 px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-400/30 transition"
                          title="Copier le lien secret d'accès direct"
                        >
                          <HiLink className="w-3 h-3 text-indigo-400" />
                          <span>Lien privé</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg bg-[#11151D] hover:bg-[#232A38] text-[#B6C0D0] hover:text-[#F5F6F8] border border-[#394150] transition"
                        title="Modifier"
                      >
                        <HiPencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(item._id)}
                        className="p-1.5 rounded-lg bg-[#11151D] hover:bg-red-500/20 text-[#B6C0D0] hover:text-red-400 border border-[#394150] transition"
                        title="Supprimer"
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
              className="bg-[#1A1F2B] border border-[#394150] rounded-2xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#394150] mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#F5F6F8]">
                    {editingItem ? 'Modifier la réalisation' : 'Nouvelle vidéo de réalisation (9:16)'}
                  </h3>
                  <p className="text-xs text-[#B6C0D0] mt-0.5">
                    Ajoutez vos clips vidéo haute définition pour la page portfolio.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg bg-[#11151D] hover:bg-[#232A38] text-[#B6C0D0] hover:text-[#F5F6F8] transition"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono text-[#D6DCE6] uppercase mb-1.5 font-medium">
                    Titre du clip *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={form.title}
                    onChange={handleChange}
                    placeholder="ex: Clip Hook Podcast — Mindset #42"
                    className="w-full bg-[#11151D] border border-[#394150] rounded-xl px-4 py-2.5 text-sm text-[#F5F6F8] focus:border-[#8EAFFF] focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#D6DCE6] uppercase mb-1.5 font-medium">
                      Catégorie *
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full bg-[#11151D] border border-[#394150] rounded-xl px-4 py-2.5 text-sm text-[#F5F6F8] focus:border-[#8EAFFF] focus:outline-none transition cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#11151D] text-[#F5F6F8]">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#D6DCE6] uppercase mb-1.5 font-medium">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={form.order}
                      onChange={handleChange}
                      className="w-full bg-[#11151D] border border-[#394150] rounded-xl px-4 py-2.5 text-sm text-[#F5F6F8] focus:border-[#8EAFFF] focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* ── FORMAT & RATIO VIDÉO (9:16 vs 16:9) ───────────── */}
                <div>
                  <label className="block text-xs font-mono text-[#D6DCE6] uppercase mb-1.5 font-medium">
                    Format d'affichage (Ratio)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, aspectRatio: '9:16' }))}
                      className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                        (form.aspectRatio || '9:16') === '9:16'
                          ? 'bg-[#8EAFFF]/10 border-[#8EAFFF] text-[#F5F6F8]'
                          : 'bg-[#11151D] border-[#394150] text-[#B6C0D0] hover:border-[#8EAFFF]/40'
                      }`}
                    >
                      <div
                        className={`w-6 h-9 rounded border-2 flex items-center justify-center font-mono text-[9px] font-bold shrink-0 ${
                          (form.aspectRatio || '9:16') === '9:16'
                            ? 'border-[#8EAFFF] text-[#8EAFFF]'
                            : 'border-[#717F9A] text-[#717F9A]'
                        }`}
                      >
                        9:16
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#F5F6F8]">📱 Format Vertical (9:16)</div>
                        <div className="text-[10px] text-[#717F9A] font-sans">Shorts, Reels, TikTok (1080×1920)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, aspectRatio: '16:9' }))}
                      className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                        form.aspectRatio === '16:9'
                          ? 'bg-[#8EAFFF]/10 border-[#8EAFFF] text-[#F5F6F8]'
                          : 'bg-[#11151D] border-[#394150] text-[#B6C0D0] hover:border-[#8EAFFF]/40'
                      }`}
                    >
                      <div
                        className={`w-9 h-6 rounded border-2 flex items-center justify-center font-mono text-[9px] font-bold shrink-0 ${
                          form.aspectRatio === '16:9'
                            ? 'border-[#8EAFFF] text-[#8EAFFF]'
                            : 'border-[#717F9A] text-[#717F9A]'
                        }`}
                      >
                        16:9
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#F5F6F8]">🖥️ Format Paysage (16:9)</div>
                        <div className="text-[10px] text-[#717F9A] font-sans">YouTube, Conférence, Écran (1920×1080)</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ── SÉLECTEUR DE MÉTHODE VIDÉO ─────────────────────── */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono text-[#D6DCE6] uppercase font-medium">
                      Source Vidéo *
                    </label>
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#11151D] border border-[#394150] text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => setVideoMode('upload')}
                        className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                          videoMode === 'upload'
                            ? 'bg-[#8EAFFF] text-[#0B0D12] font-semibold shadow-sm'
                            : 'text-[#B6C0D0] hover:text-[#F5F6F8]'
                        }`}
                      >
                        <HiCloudArrowUp className="w-3.5 h-3.5" />
                        <span>Téléverser ImageKit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoMode('link')}
                        className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                          videoMode === 'link'
                            ? 'bg-[#8EAFFF] text-[#0B0D12] font-semibold shadow-sm'
                            : 'text-[#B6C0D0] hover:text-[#F5F6F8]'
                        }`}
                      >
                        <HiLink className="w-3.5 h-3.5" />
                        <span>Lien externe / URL</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1 : Téléversement direct ImageKit */}
                  {videoMode === 'upload' ? (
                    <div className="space-y-3">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                          uploadSuccess
                            ? 'border-emerald-500/40 bg-emerald-500/5'
                            : isUploading
                            ? 'border-[#8EAFFF]/50 bg-[#8EAFFF]/5'
                            : 'border-[#394150] hover:border-[#8EAFFF]/60 bg-[#11151D]/60 hover:bg-[#11151D]'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/mp4,video/quicktime,video/webm"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {isUploading ? (
                          <div className="space-y-3 py-2">
                            <div className="w-10 h-10 rounded-full border-2 border-[#8EAFFF] border-t-transparent animate-spin mx-auto" />
                            <div className="text-xs font-mono text-[#F5F6F8]">
                              Téléversement vers ImageKit en cours... ({uploadProgress}%)
                            </div>
                            <div className="w-full bg-[#1A1F2B] rounded-full h-2 overflow-hidden border border-[#394150] max-w-xs mx-auto">
                              <div
                                className="bg-[#8EAFFF] h-full transition-all duration-200"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : uploadSuccess ? (
                          <div className="space-y-2 py-1">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                              <HiCheckCircle className="w-6 h-6" />
                            </div>
                            <div className="text-xs font-bold text-[#F5F6F8]">
                              Vidéo hébergée sur ImageKit CDN
                            </div>
                            <div className="text-[11px] font-mono text-[#8EAFFF] truncate max-w-sm mx-auto">
                              {form.videoUrl}
                            </div>
                            <span className="text-[10px] font-mono text-[#B6C0D0] block">
                              Glissez un nouveau fichier ou cliquez ici pour le remplacer.
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-2 py-2">
                            <HiArrowUpTray className="w-8 h-8 text-[#8EAFFF] mx-auto" />
                            <div className="text-xs text-[#F5F6F8] font-medium">
                              {selectedFile ? (
                                <span className="font-mono text-[#8EAFFF]">
                                  {selectedFile.name} (
                                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} Mo)
                                </span>
                              ) : (
                                <span>
                                  Glissez-déposez votre vidéo (.mp4, .mov) ici ou cliquez pour parcourir
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-[#717F9A] font-mono">
                              Glisser-déposer actif • Format 9:16 (1080x1920) recommandé
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bouton pour déclencher le téléversement si un fichier est choisi et pas encore uploadé */}
                      {selectedFile && !uploadSuccess && !isUploading && (
                        <button
                          type="button"
                          onClick={handleUpload}
                          className="w-full py-2.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-xs font-mono transition flex items-center justify-center gap-2 shadow-md shadow-[#8EAFFF]/10"
                        >
                          <HiCloudArrowUp className="w-4 h-4 text-[#0B0D12]" />
                          <span>Envoyer cette vidéo vers ImageKit CDN</span>
                        </button>
                      )}

                      {/* Aperçu du lien généré */}
                      {form.videoUrl && (
                        <div className="p-2.5 rounded-xl bg-[#11151D] border border-[#394150] text-[11px] font-mono text-[#B6C0D0] truncate flex items-center justify-between">
                          <span className="truncate">{form.videoUrl}</span>
                          <span className="text-[10px] text-emerald-400 font-bold ml-2">Prête</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Mode 2 : Lien externe ou vidéo locale */
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        name="videoUrl"
                        value={form.videoUrl}
                        onChange={handleChange}
                        placeholder="ex: https://www.youtube.com/shorts/... ou /videos/mon-clip.mp4"
                        className="w-full bg-[#11151D] border border-[#394150] rounded-xl px-4 py-2.5 text-sm text-[#F5F6F8] focus:border-[#8EAFFF] focus:outline-none transition font-mono text-xs"
                      />
                      <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#B6C0D0]">
                        <span className="text-[#717F9A]">Formats acceptés :</span>
                        <span className="px-2 py-0.5 rounded bg-[#11151D] border border-[#394150] text-[#8EAFFF]">
                          YouTube Shorts (public ou non répertorié)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#11151D] border border-[#394150] text-[#8EAFFF]">
                          Fichier local (/videos/clip.mp4)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#11151D] border border-[#394150] text-[#8EAFFF]">
                          Lien direct .mp4 / .webm
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Prévisualisation en direct 9:16 ou 16:9 si une URL est présente */}
                  {form.videoUrl && (
                    <div className="mt-3 p-3 rounded-xl bg-[#11151D] border border-[#394150] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-[#F5F6F8]">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <HiCheckCircle className="w-4 h-4" />
                          <span>Prévisualisation du rendu</span>
                        </span>
                        <span className="text-[10px] text-[#717F9A] font-mono">
                          Ratio {form.aspectRatio === '16:9' || form.category === 'Vidéo longue' ? '16:9 (Paysage)' : '9:16 (Vertical)'}
                        </span>
                      </div>
                      <div
                        className={`${
                          form.aspectRatio === '16:9' || form.category === 'Vidéo longue'
                            ? 'aspect-video max-w-sm'
                            : 'aspect-[9/16] max-h-48'
                        } rounded-lg overflow-hidden bg-black mx-auto border border-[#394150]`}
                      >
                        {(() => {
                          const embed = parseEmbedUrl(form.videoUrl);
                          if (embed?.type === 'video') {
                            return (
                              <video
                                src={embed.src}
                                controls
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            );
                          }
                          if (embed?.type === 'iframe') {
                            return (
                              <iframe
                                src={embed.src}
                                title="Prévisualisation"
                                allowFullScreen
                                className="w-full h-full border-0"
                              />
                            );
                          }
                          return (
                            <div className="w-full h-full flex items-center justify-center text-xs text-[#717F9A] font-mono">
                              Format de lien non reconnu
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#D6DCE6] uppercase mb-1.5 font-medium">
                    Description courte
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Ex: Découpage dynamique des 40 premières secondes avec sous-titres animés et zooms..."
                    className="w-full bg-[#11151D] border border-[#394150] rounded-xl p-3 text-sm text-[#F5F6F8] focus:border-[#8EAFFF] focus:outline-none transition leading-relaxed resize-none"
                  />
                </div>

                {/* Choix du statut : Public vs Brouillon (Draft) vs Privé */}
                <div>
                  <label className="block text-xs font-mono text-[#D6DCE6] uppercase mb-2 font-medium">
                    Statut de visibilité & Publication
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      {
                        id: 'public',
                        label: 'Publié (Public)',
                        badge: '🟢 Visible',
                        desc: 'Visible par tous les visiteurs sur le Portfolio et l’Accueil.',
                        icon: HiEye,
                      },
                      {
                        id: 'draft',
                        label: 'Brouillon (Draft)',
                        badge: '🟡 Masqué',
                        desc: 'En préparation. Visible uniquement dans ce panel admin.',
                        icon: HiDocumentText,
                      },
                      {
                        id: 'private',
                        label: 'Privé (Lien secret)',
                        badge: '🔒 Client seul',
                        desc: 'Masqué du portfolio, accessible uniquement via un lien direct.',
                        icon: HiLockClosed,
                      },
                    ].map((opt) => {
                      const isSelected = (form.visibility || 'public') === opt.id;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              visibility: opt.id,
                              active: opt.id !== 'draft',
                            }))
                          }
                          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#11151D] border-[#8EAFFF] shadow-md shadow-[#8EAFFF]/10 ring-1 ring-[#8EAFFF]'
                              : 'bg-[#11151D]/60 border-[#394150] hover:border-[#8EAFFF]/40'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#F5F6F8]">
                                <Icon className="w-3.5 h-3.5 text-[#8EAFFF]" />
                                <span>{opt.label}</span>
                              </span>
                            </div>
                            <span
                              className={`inline-block text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border mb-1.5 ${
                                opt.id === 'public'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30'
                                  : opt.id === 'draft'
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-400/30'
                                  : 'bg-indigo-500/10 text-indigo-300 border-indigo-400/30'
                              }`}
                            >
                              {opt.badge}
                            </span>
                            <p className="text-[11px] text-[#B6C0D0] leading-relaxed font-sans">
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#394150] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#11151D] text-[#B6C0D0] text-xs font-medium hover:bg-[#232A38] transition border border-[#394150]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving || isUploading}
                    className="px-6 py-2.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-xs transition disabled:opacity-50"
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
              className="bg-[#1A1F2B] border border-[#394150] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h4 className="font-display font-bold text-[#F5F6F8] text-base mb-2">
                Supprimer la réalisation
              </h4>
              <p className="text-xs text-[#B6C0D0] mb-6 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer cette vidéo de démonstration ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-xl bg-[#11151D] text-[#B6C0D0] text-xs font-medium hover:bg-[#232A38] transition border border-[#394150]"
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

      {/* Preview Modal 9:16 ou 16:9 */}
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
              className={`bg-[#1A1F2B] border border-[#394150] rounded-2xl p-6 ${
                previewItem.aspectRatio === '16:9' || previewItem.category === 'Vidéo longue'
                  ? 'max-w-2xl'
                  : 'max-w-sm'
              } w-full shadow-2xl transition-all`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#394150] mb-4">
                <div className="flex items-center gap-2 truncate max-w-[80%]">
                  <span className="text-xs font-mono text-[#F5F6F8] truncate">
                    {previewItem.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#11151D] border border-[#394150] text-[#8EAFFF]">
                    {previewItem.aspectRatio === '16:9' || previewItem.category === 'Vidéo longue'
                      ? '16:9'
                      : '9:16'}
                  </span>
                </div>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="text-[#B6C0D0] hover:text-[#F5F6F8]"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              <div
                className={`${
                  previewItem.aspectRatio === '16:9' || previewItem.category === 'Vidéo longue'
                    ? 'aspect-video'
                    : 'aspect-[9/16]'
                } w-full bg-black rounded-xl overflow-hidden border border-[#394150]`}
              >
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
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    );
                  }
                  return (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[#B6C0D0] font-mono">
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
