import React, { useState } from 'react';
import { HiPlay, HiVideoCamera, HiFilm } from 'react-icons/hi2';

/**
 * Analyse l'URL d'une réalisation et extrait la source et la miniature éventuelle.
 */
function parseVideoSource(url, customThumbnail = null, isLandscape = false) {
  if (!url) return null;
  const trimmed = url.trim();

  // 1. Fichier vidéo direct (MP4, WEBM, MOV) ou ImageKit
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed) || trimmed.includes('ik.imagekit.io')) {
    let thumbnail = customThumbnail || null;
    if (!thumbnail && trimmed.includes('ik.imagekit.io')) {
      const baseUrl = trimmed.split('?')[0];
      thumbnail = isLandscape
        ? `${baseUrl}/ik-thumbnail.jpg?tr=w-1280,h-720,fo-auto`
        : `${baseUrl}/ik-thumbnail.jpg?tr=w-600,h-1066,fo-auto`;
    }
    return { type: 'video', src: trimmed, thumbnail };
  }

  // 2. Iframe HTML brut collé
  const iframeMatch = trimmed.match(/src=["'](.*?)["']/);
  if (iframeMatch && iframeMatch[1]) {
    const src = iframeMatch[1];
    const sep = src.includes('?') ? '&' : '?';
    return {
      type: 'iframe',
      src: `${src}${sep}autoplay=1`,
      thumbnail: customThumbnail || null,
    };
  }

  // 3. YouTube Shorts : youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    const videoId = shortsMatch[1];
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      thumbnail:
        customThumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
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
      thumbnail:
        customThumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // 5. TikTok ou autre embed
  const sep = trimmed.includes('?') ? '&' : '?';
  return {
    type: 'iframe',
    src: `${trimmed}${sep}autoplay=1`,
    thumbnail: customThumbnail || null,
  };
}

export default function VideoCard916({ item, className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isLandscape = item?.aspectRatio === '16:9' || item?.category === 'Vidéo longue';
  const parsed = parseVideoSource(item?.videoUrl, item?.thumbnailUrl, isLandscape);

  const isDirectVideo = parsed?.type === 'video';

  return (
    <div
      className={`rounded-2xl border border-[#394150] bg-[#1A1F2B] overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-[#8EAFFF]/60 hover:shadow-xl hover:shadow-[#8EAFFF]/5 ${
        isLandscape ? 'md:col-span-2' : ''
      } ${className}`}
    >
      {/* Container vidéo adaptatif 9:16 ou 16:9 */}
      <div
        className={`relative ${
          isLandscape ? 'aspect-video' : 'aspect-[9/16]'
        } w-full bg-[#11151D] overflow-hidden border-b border-[#394150]`}
      >
        {/* Cas 1 : Vidéo directe active au clic (lazy-load) */}
        {isPlaying && isDirectVideo ? (
          <video
            src={parsed.src}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-black"
          />
        ) : isPlaying && !isDirectVideo ? (
          /* Cas 2 : Lecteur iframe actif au clic (lazy-load instantané) */
          <iframe
            src={parsed?.src}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0 object-cover bg-black"
          />
        ) : (
          /* Cas 3 : Façade sobre & ultra-rapide (zéro requête lourde au chargement) */
          <div
            onClick={() => setIsPlaying(true)}
            className="w-full h-full relative cursor-pointer select-none group/facade"
          >
            {parsed?.thumbnail ? (
              <img
                src={parsed.thumbnail}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover opacity-65 group-hover/facade:opacity-85 transition duration-300 scale-100 group-hover/facade:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#232A38] to-[#11151D]">
                <HiFilm className="w-10 h-10 text-[#8EAFFF] mb-2 transition" />
                <span className="text-[11px] font-mono text-[#B6C0D0]">
                  {isLandscape ? 'Format 16:9' : 'Format 9:16'}
                </span>
              </div>
            )}

            {/* Gradient sombre pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-transparent to-[#0B0D12]/70 pointer-events-none" />

            {/* Bouton Play minimaliste */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="w-14 h-14 rounded-full bg-[#11151D]/80 backdrop-blur-md border border-[#394150] flex items-center justify-center text-[#F5F6F8] group-hover/facade:scale-110 group-hover/facade:bg-[#8EAFFF] group-hover/facade:border-[#8EAFFF] group-hover/facade:text-[#0B0D12] transition-all duration-300 shadow-2xl"
                aria-label={`Lire ${item.title}`}
              >
                <HiPlay className="w-6 h-6 ml-0.5" />
              </button>
            </div>

            {/* Indication discrète au survol */}
            <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none transition-opacity duration-200 opacity-0 group-hover/facade:opacity-100">
              <span className="text-[10px] font-mono text-[#D6DCE6] bg-[#11151D]/90 px-2.5 py-1 rounded-full backdrop-blur-sm border border-[#394150]">
                Lancer la vidéo
              </span>
            </div>
          </div>
        )}

        {/* Badge catégorie en superposition */}
        {item.category && (
          <div className="absolute top-3 left-3 bg-[#11151D]/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] font-mono text-[#F5F6F8] uppercase tracking-wider border border-[#394150] pointer-events-none z-10">
            {item.category}
          </div>
        )}

        {/* Badge Ratio */}
        <div className="absolute top-3 right-3 bg-[#232A38]/90 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-[#B6C0D0] uppercase tracking-widest border border-[#394150] pointer-events-none z-10">
          {isLandscape ? '16:9 HD' : '9:16 HD'}
        </div>
      </div>

      {/* Description & Titre */}
      <div className="p-4 sm:p-5 bg-[#1A1F2B]">
        <h4 className="font-display font-bold text-[#F5F6F8] text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-[#8EAFFF] transition-colors">
          {item.title}
        </h4>
        {item.description && (
          <p className="text-xs text-[#B6C0D0] line-clamp-2 leading-relaxed font-sans">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}
