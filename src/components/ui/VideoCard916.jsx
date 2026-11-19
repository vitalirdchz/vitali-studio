import React, { useState } from 'react';
import { HiPlay, HiVideoCamera, HiFilm } from 'react-icons/hi2';

/**
 * Analyse l'URL d'une réalisation et extrait la source et la miniature éventuelle.
 */
function parseVideoSource(url) {
  if (!url) return null;
  const trimmed = url.trim();

  // 1. Fichier vidéo direct (MP4, WEBM, MOV)
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed)) {
    return { type: 'video', src: trimmed };
  }

  // 2. Iframe HTML brut collé
  const iframeMatch = trimmed.match(/src=["'](.*?)["']/);
  if (iframeMatch && iframeMatch[1]) {
    const src = iframeMatch[1];
    const sep = src.includes('?') ? '&' : '?';
    return {
      type: 'iframe',
      src: `${src}${sep}autoplay=1`,
      thumbnail: null,
    };
  }

  // 3. YouTube Shorts : youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    const videoId = shortsMatch[1];
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // 4. YouTube standard : youtu.be/VIDEO_ID ou youtube.com/watch?v=VIDEO_ID
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // 5. TikTok ou autre embed
  const sep = trimmed.includes('?') ? '&' : '?';
  return {
    type: 'iframe',
    src: `${trimmed}${sep}autoplay=1`,
    thumbnail: null,
  };
}

export default function VideoCard916({ item, className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const parsed = parseVideoSource(item?.videoUrl);

  const isDirectVideo = parsed?.type === 'video';

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#111113] overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/[0.03] ${className}`}
    >
      {/* Container vertical strict 9:16 */}
      <div className="relative aspect-[9/16] w-full bg-[#0A0A0C] overflow-hidden border-b border-white/10">
        {/* Cas 1 : Fichier vidéo MP4 direct */}
        {isDirectVideo ? (
          <video
            src={parsed.src}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-cover bg-black"
          />
        ) : isPlaying ? (
          /* Cas 2 : Lecteur iframe actif au clic (lazy-load instantané) */
          <iframe
            src={parsed?.src}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0 object-cover bg-black"
          />
        ) : (
          /* Cas 3 : Façade sobre & ultra-rapide (zéro iframe au chargement) */
          <div
            onClick={() => setIsPlaying(true)}
            className="w-full h-full relative cursor-pointer select-none group/facade"
          >
            {parsed?.thumbnail ? (
              <img
                src={parsed.thumbnail}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover opacity-60 group-hover/facade:opacity-75 transition duration-300 scale-100 group-hover/facade:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#141418] to-[#0A0A0C]">
                <HiFilm className="w-10 h-10 text-gray-600 mb-2 group-hover/facade:text-indigo-400 transition" />
                <span className="text-[11px] font-mono text-gray-500">Format 9:16</span>
              </div>
            )}

            {/* Gradient sombre pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-[#09090B]/60 pointer-events-none" />

            {/* Bouton Play minimaliste */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover/facade:scale-110 group-hover/facade:bg-indigo-600 group-hover/facade:border-indigo-500 transition-all duration-300 shadow-2xl"
                aria-label={`Lire ${item.title}`}
              >
                <HiPlay className="w-6 h-6 ml-0.5 text-white" />
              </button>
            </div>

            {/* Indication discrète au survol */}
            <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none transition-opacity duration-200 opacity-0 group-hover/facade:opacity-100">
              <span className="text-[10px] font-mono text-gray-300 bg-black/80 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                Lancer la vidéo
              </span>
            </div>
          </div>
        )}

        {/* Badge catégorie en superposition */}
        {item.category && (
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] font-mono text-gray-300 uppercase tracking-wider border border-white/10 pointer-events-none z-10">
            {item.category}
          </div>
        )}

        {/* Badge 9:16 */}
        <div className="absolute top-3 right-3 bg-white/5 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-gray-400 uppercase tracking-widest border border-white/5 pointer-events-none z-10">
          9:16 HD
        </div>
      </div>

      {/* Description & Titre */}
      <div className="p-4 sm:p-5 bg-[#111113]">
        <h4 className="font-display font-bold text-white text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-indigo-300 transition-colors">
          {item.title}
        </h4>
        {item.description && (
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-sans">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}
