import React, { useEffect, useRef, useState } from 'react';

// Les 4 formats de montage majeurs présentés dans la timeline
const SEGMENTS = [
  {
    id: 'hormozi',
    formatTitle: 'Style Alex Hormozi',
    subtitle: 'Rétention chirurgicale & Hooks percutants',
    badge: 'VIRAL HOOK',
    color: '#F59E0B', // Amber
    v1Color: 'from-[#b45309]/35 via-[#d97706]/25 to-[#f59e0b]/20 border-amber-400/40',
    v3Text: 'HOOK POP +15%',
    v2Text: 'B-ROLL CASH / EMOJI',
    viewerData: {
      tag: '01 // HORMOZI RETENTION',
      title: '« STOP SCROLLING »',
      subText: '3 SECONDES POUR CAPTIVER',
      highlightColor: '#FBBF24',
      accentBg: 'rgba(245, 158, 11, 0.20)',
      waveformColor: '#FBBF24',
    },
  },
  {
    id: 'chris',
    formatTitle: 'Style Chris Williamson',
    subtitle: 'Podcast Cinématographique & Rythme Profond',
    badge: 'CINEMATIC PODCAST',
    color: '#818CF8', // Indigo
    v1Color: 'from-[#4338ca]/35 via-[#4f46e5]/25 to-[#6366f1]/20 border-indigo-400/40',
    v3Text: 'ZOOM +12% CADRE',
    v2Text: 'CAM B SERRÉ HD',
    viewerData: {
      tag: '02 // MODERN WISDOM STYLE',
      title: '« Le vrai coût de la distraction »',
      subText: 'Montage multi-caméra fluide',
      highlightColor: '#818CF8',
      accentBg: 'rgba(99, 102, 241, 0.20)',
      waveformColor: '#818CF8',
    },
  },
  {
    id: 'live',
    formatTitle: 'Extraits de Live & Débats',
    subtitle: 'Punchlines & Découpage des Temps Forts',
    badge: 'LIVE HIGHLIGHT',
    color: '#EC4899', // Pink / Rose
    v1Color: 'from-[#be185d]/35 via-[#db2777]/25 to-[#ec4899]/20 border-pink-400/40',
    v3Text: 'SUBS POP DYNAMIQUE',
    v2Text: 'REACTION CAM CHAT',
    viewerData: {
      tag: '03 // LIVE CLIPPING',
      title: '« C’EST EXACTEMENT ÇA ! »',
      subText: 'Découpage dynamique du stream',
      highlightColor: '#F472B6',
      accentBg: 'rgba(236, 72, 153, 0.20)',
      waveformColor: '#F472B6',
    },
  },
  {
    id: 'ted',
    formatTitle: 'Conférence TED Talk',
    subtitle: 'Storytelling Inspirant & Clarté Visuelle',
    badge: 'KEYNOTE & TALK',
    color: '#10B981', // Emerald
    v1Color: 'from-[#047857]/35 via-[#059669]/25 to-[#10b981]/20 border-emerald-400/40',
    v3Text: 'KEY TAKEAWAY TITLE',
    v2Text: 'SLIDE OVERLAY SPLIT',
    viewerData: {
      tag: '04 // MASTERCLASS & TALK',
      title: '« L’avenir du travail créatif »',
      subText: 'Sous-titrage sobre & transitions nettes',
      highlightColor: '#34D399',
      accentBg: 'rgba(16, 185, 129, 0.20)',
      waveformColor: '#34D399',
    },
  },
];

const SEGMENT_WIDTH = 440; // Largeur d'un segment en pixels
const TOTAL_WIDTH = SEGMENT_WIDTH * SEGMENTS.length; // Boucle parfaite

export default function HeroDaVinciTimeline() {
  const [scrollX, setScrollX] = useState(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [timecode, setTimecode] = useState('01:14:22:08');
  const [vuLevels, setVuLevels] = useState({ left: 65, right: 72 });
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const positionRef = useRef(0);

  // Animation en continu (timeline défilante + timecode temps réel + VU-mètres)
  useEffect(() => {
    let frameCount = 8;
    let seconds = 22;
    let minutes = 14;
    let hours = 1;

    const speed = 1.05; // Vitesse de défilement bien visible et fluide

    const animate = (now) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Avancement de la timeline
      positionRef.current = (positionRef.current + speed) % TOTAL_WIDTH;
      setScrollX(positionRef.current);

      // Calcul du segment actuellement sous la tête de lecture (playhead au centre)
      const centerTarget = positionRef.current + SEGMENT_WIDTH * 0.55;
      const currentIdx = Math.floor((centerTarget % TOTAL_WIDTH) / SEGMENT_WIDTH);
      setActiveSegmentIndex(currentIdx);

      // Animation dynamique des VU-mètres audio en haut
      const t = now * 0.005;
      const leftLevel = Math.min(
        95,
        Math.max(25, Math.sin(t * 3.1) * 35 + Math.cos(t * 5.2) * 25 + 50)
      );
      const rightLevel = Math.min(
        95,
        Math.max(20, Math.cos(t * 2.8) * 35 + Math.sin(t * 4.7) * 25 + 48)
      );
      setVuLevels({ left: leftLevel, right: rightLevel });

      // Incrémentation du timecode DaVinci (style 24/60fps)
      if (delta > 25) {
        frameCount += 1;
        if (frameCount >= 25) {
          frameCount = 0;
          seconds += 1;
          if (seconds >= 60) {
            seconds = 0;
            minutes += 1;
            if (minutes >= 60) {
              minutes = 0;
              hours += 1;
            }
          }
        }
        const pad = (n) => String(n).padStart(2, '0');
        setTimecode(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frameCount)}`);
      }

      // Rendu de l'onde sonore sur le Canvas A1
      renderWaveform(positionRef.current);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Dessin de l'onde sonore Canvas pour la piste Audio A1
  const renderWaveform = (offset) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerY = height / 2;
    const barWidth = 3;
    const barGap = 2;
    const totalBars = Math.floor(width / (barWidth + barGap));

    // Dégradé émeraude éclatant / cyan / blanc style DaVinci Fairlight
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#34D399'); // Emerald light
    gradient.addColorStop(0.5, '#F0FDF4'); // Mint White
    gradient.addColorStop(1, '#059669'); // Emerald deep

    ctx.fillStyle = gradient;

    for (let i = 0; i < totalBars; i++) {
      const x = i * (barWidth + barGap);
      const wavePhase = (x + offset * 1.6) * 0.038;
      const speechEnvelope = Math.abs(Math.sin((x + offset * 0.85) * 0.009));

      let barHeight = (Math.sin(wavePhase) * 0.5 + 0.5) * (height * 0.75) * speechEnvelope + 3;
      if (speechEnvelope < 0.2) barHeight = Math.max(2, barHeight * 0.25);

      const y = centerY - barHeight / 2;
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  };

  const activeSegment = SEGMENTS[activeSegmentIndex] || SEGMENTS[0];
  const repeatedSegments = [...SEGMENTS, ...SEGMENTS, ...SEGMENTS];

  return (
    <div
      className="absolute inset-x-0 top-0 h-[820px] sm:h-[880px] overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* ── 1. AMBIANCE LUMINEUSE DU HAUT (HALOS & STUDIO LIGHT) ────── */}
      {/* Halo supérieur bleuté diffus qui illumine le haut de la page */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#8EAFFF]/16 via-[#6366F1]/08 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Grille technique de studio DaVinci plus sobre */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── 2. BARRE SUPÉRIEURE DE RÉGIE DAVINCI (HABILLAGE DU HAUT) ── */}
      <div className="absolute top-24 inset-x-0 px-6 sm:px-12 flex items-center justify-between text-[10px] font-mono border-b border-white/[0.06] pb-3 z-10 opacity-45 sm:opacity-60">
        {/* Info projet & résolution */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#11151D] border border-[#394150] text-[#8EAFFF]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold tracking-wider">DAVINCI RESOLVE STUDIO</span>
          </div>
          <span className="hidden md:inline text-[#B6C0D0]">
            PROJ: VITALI_MASTER_SHORT // 4K DCI 60FPS
          </span>
        </div>

        {/* Onglets DaVinci Workspace au centre */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-lg bg-[#11151D]/80 border border-[#394150]">
          {['MEDIA', 'CUT', 'EDIT ★', 'FUSION', 'COLOR', 'FAIRLIGHT', 'DELIVER'].map(
            (tab) => {
              const isEdit = tab === 'EDIT ★';
              return (
                <span
                  key={tab}
                  className={`px-2.5 py-0.5 rounded text-[9px] font-semibold tracking-wider ${
                    isEdit
                      ? 'bg-[#8EAFFF] text-[#0B0D12] shadow-sm'
                      : 'text-[#717F9A]'
                  }`}
                >
                  {tab}
                </span>
              );
            }
          )}
        </div>

        {/* VU-Mètres Audio Stéréo Dynamiques (L / R) */}
        <div className="flex items-center gap-2">
          <span className="text-[#8EAFFF] font-bold text-[9px]">VU MASTER</span>
          <div className="flex flex-col gap-1 w-20 sm:w-28">
            {/* Canal L */}
            <div className="w-full h-1.5 bg-[#11151D] rounded-full overflow-hidden border border-[#394150]">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500 transition-all duration-75"
                style={{ width: `${vuLevels.left}%` }}
              />
            </div>
            {/* Canal R */}
            <div className="w-full h-1.5 bg-[#11151D] rounded-full overflow-hidden border border-[#394150]">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500 transition-all duration-75"
                style={{ width: `${vuLevels.right}%` }}
              />
            </div>
          </div>
          <span className="text-emerald-400 font-mono text-[9px] hidden sm:inline">-3 dB</span>
        </div>
      </div>

      {/* ── 3. MONITEUR DE PRÉVISUALISATION 9:16 (VIEWER PRO) ───────── */}
      <div className="hidden sm:block absolute top-36 right-6 xl:right-16 z-10 opacity-75 transition-all duration-500">
        <div className="w-[185px] sm:w-[205px] rounded-2xl bg-[#0F1117]/95 border-2 border-[#394150] shadow-2xl shadow-[#8EAFFF]/10 backdrop-blur-2xl p-3 flex flex-col gap-2.5">
          {/* Header du moniteur DaVinci */}
          <div className="flex items-center justify-between px-1 text-[9px] font-mono text-[#B6C0D0] border-b border-[#2D3342] pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold tracking-wider">LIVE REC</span>
            </div>
            <span className="text-[#F5F6F8] font-bold tracking-widest">{timecode}</span>
          </div>

          {/* Écran 9:16 stylisé */}
          <div className="relative aspect-[9/16] w-full rounded-xl bg-[#07080C] border border-[#394150] overflow-hidden flex flex-col justify-between p-3.5 transition-all duration-300 shadow-inner">
            {/* Safe Areas 9:16 */}
            <div className="absolute inset-2 border border-white/10 rounded pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/[0.08] pointer-events-none" />

            {/* Haut de la vidéo 9:16 */}
            <div className="relative z-10 flex items-center justify-between">
              <span
                className="px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase border shadow-sm"
                style={{
                  color: activeSegment.viewerData.highlightColor,
                  borderColor: `${activeSegment.viewerData.highlightColor}60`,
                  backgroundColor: activeSegment.viewerData.accentBg,
                }}
              >
                {activeSegment.badge}
              </span>
              <span className="text-[8px] font-mono text-[#8EAFFF] font-semibold">60 FPS</span>
            </div>

            {/* Centre de la vidéo : Rendu sous-titres animés / Hook */}
            <div className="relative z-10 text-center my-auto px-1 space-y-1.5">
              <div
                className="text-[12px] sm:text-[13px] font-display font-extrabold tracking-tight leading-snug drop-shadow-lg transition-all duration-300"
                style={{ color: activeSegment.viewerData.highlightColor }}
              >
                {activeSegment.viewerData.title}
              </div>
              <div className="text-[9px] font-sans text-[#F5F6F8] leading-tight font-medium opacity-95 line-clamp-2">
                {activeSegment.viewerData.subText}
              </div>
            </div>

            {/* Bas de la vidéo : Mini waveform de voix */}
            <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                {[5, 10, 14, 7, 16, 11, 13, 6, 9, 15, 8].map((h, i) => (
                  <span
                    key={i}
                    className="w-[2px] rounded-full transition-all duration-150"
                    style={{
                      height: `${h}px`,
                      backgroundColor: activeSegment.viewerData.waveformColor,
                    }}
                  />
                ))}
              </div>
              <span className="text-[8px] font-mono text-[#B6C0D0] uppercase tracking-wider font-bold">
                9:16 MASTER
              </span>
            </div>
          </div>

          {/* Footer Timecode & Statut */}
          <div className="flex items-center justify-between text-[9px] font-mono text-[#B6C0D0] px-1">
            <span className="text-[#8EAFFF]">DAVINCI PROXY</span>
            <span className="text-emerald-400 font-bold">1080×1920 HD</span>
          </div>
        </div>
      </div>

      {/* ── 4. TIMELINE MULTIPISTE DÉFILANTE (HAUTEMENT VISIBLE) ──── */}
      <div className="absolute bottom-6 inset-x-0 h-[320px] sm:h-[360px] flex flex-col justify-end z-0 opacity-85">
        {/* Barre d'outils / Réglette de temps DaVinci */}
        <div className="relative h-7 bg-[#0E1017] border-y border-[#394150] flex items-center overflow-hidden">
          {/* Ticks de timecode en défilement */}
          <div
            className="flex items-center whitespace-nowrap will-change-transform"
            style={{ transform: `translateX(-${scrollX}px)` }}
          >
            {repeatedSegments.map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-[10px] font-mono text-[#B6C0D0] px-4 border-r border-[#394150]"
                style={{ width: `${SEGMENT_WIDTH}px` }}
              >
                <span className="text-[#8EAFFF] font-semibold">00:0{i * 15}:00</span>
                <span className="text-[#475267]">········</span>
                <span>00:0{i * 15 + 7}:12</span>
                <span className="text-[#475267]">········</span>
              </div>
            ))}
          </div>
        </div>

        {/* Zone des Pistes Vidéo & Audio */}
        <div className="relative flex-1 bg-[#090A0E]/95 flex flex-col justify-between py-2.5 space-y-2 overflow-hidden border-b border-[#394150]">
          {/* PISTE V3 : Titres & Hooks (Or / Ambre éclatant) */}
          <div className="relative h-[30px] flex items-center">
            <div className="absolute left-2 z-20 px-2 py-0.5 rounded bg-[#1A1F2B] border border-amber-400/40 text-[9px] font-mono text-amber-300 font-bold shadow-md">
              V3 // HOOKS
            </div>
            <div
              className="flex items-center gap-4 pl-28 whitespace-nowrap will-change-transform"
              style={{ transform: `translateX(-${scrollX}px)` }}
            >
              {repeatedSegments.map((seg, i) => (
                <div
                  key={`v3-${i}`}
                  className="flex items-center gap-3"
                  style={{ width: `${SEGMENT_WIDTH}px` }}
                >
                  <div className="h-6 px-3.5 rounded-md bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono text-[10px] font-semibold flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>{seg.v3Text}</span>
                  </div>
                  <div className="h-6 px-2.5 rounded-md bg-amber-500/12 border border-amber-400/30 text-amber-200 font-mono text-[9px] flex items-center">
                    <span>SFX IMPACT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PISTE V2 : B-Roll & Cam B (Bleu-Violet translucide) */}
          <div className="relative h-[32px] flex items-center">
            <div className="absolute left-2 z-20 px-2 py-0.5 rounded bg-[#1A1F2B] border border-indigo-400/40 text-[9px] font-mono text-indigo-300 font-bold shadow-md">
              V2 // B-ROLL
            </div>
            <div
              className="flex items-center gap-4 pl-28 whitespace-nowrap will-change-transform"
              style={{ transform: `translateX(-${scrollX}px)` }}
            >
              {repeatedSegments.map((seg, i) => (
                <div
                  key={`v2-${i}`}
                  className="flex items-center gap-2"
                  style={{ width: `${SEGMENT_WIDTH}px` }}
                >
                  <div className="h-7 px-4 rounded-md bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 font-mono text-[10px] font-medium flex items-center gap-2 flex-1 shadow-md">
                    <span className="w-1.5 h-3.5 rounded-full bg-indigo-400" />
                    <span className="truncate">{seg.v2Text}</span>
                  </div>
                  <div className="h-7 px-3 rounded-md bg-indigo-500/12 border border-indigo-400/25 text-indigo-300/80 font-mono text-[9px] flex items-center">
                    <span>OVERLAY 9:16</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PISTE V1 : Main Cam & Formats de Montage */}
          <div className="relative h-[56px] flex items-center">
            <div className="absolute left-2 z-20 px-2 py-0.5 rounded bg-[#1A1F2B] border border-[#8EAFFF]/50 text-[9px] font-mono text-[#F5F6F8] font-bold shadow-md">
              V1 // MAIN
            </div>
            <div
              className="flex items-center gap-2 pl-28 whitespace-nowrap will-change-transform"
              style={{ transform: `translateX(-${scrollX}px)` }}
            >
              {repeatedSegments.map((seg, i) => (
                <div
                  key={`v1-${i}`}
                  className={`h-13 py-1.5 rounded-xl bg-gradient-to-r ${seg.v1Color} border flex items-center justify-between px-4 transition-all duration-300 shadow-lg`}
                  style={{ width: `${SEGMENT_WIDTH - 8}px` }}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className="w-3 h-8 rounded-sm flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: seg.color }}
                    />
                    <div className="truncate">
                      <div className="text-[12px] font-mono font-bold text-[#F5F6F8] truncate">
                        {seg.formatTitle}
                      </div>
                      <div className="text-[9px] font-mono text-[#D6DCE6] truncate opacity-90">
                        {seg.subtitle}
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-black/60 text-[#F5F6F8] border border-white/20 hidden sm:inline font-semibold">
                    {seg.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PISTE A1 : Audio / Voix (Onde Sonore Canvas Émeraude/Blanc) */}
          <div className="relative h-[42px] flex items-center bg-[#07090C] border-t border-[#394150]">
            <div className="absolute left-2 z-20 px-2 py-0.5 rounded bg-[#1A1F2B] border border-emerald-400/40 text-[9px] font-mono text-emerald-400 font-bold shadow-md">
              A1 // VOIX
            </div>
            <div className="w-full h-full pl-28 pr-4 flex items-center">
              <canvas
                ref={canvasRef}
                width={1300}
                height={40}
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
        </div>

        {/* ── 5. TÊTE DE LECTURE ROUGE LASER (DAVINCI PLAYHEAD) ─────── */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
          {/* Pointeur triangulaire supérieur */}
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.95)]" />

          {/* Ligne laser rouge verticale traversant toutes les pistes */}
          <div className="w-[2px] flex-1 bg-gradient-to-b from-red-500 via-red-500/90 to-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.85)]" />

          {/* Badge Timecode flottant au-dessus */}
          <div className="absolute -top-6 px-2.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-mono font-bold tracking-widest shadow-xl border border-red-400">
            {timecode}
          </div>
        </div>
      </div>

      {/* ── 6. MASQUES DE DÉGRADÉ LATÉRAUX (FONDU DANS LE NOIR) ───── */}
      <div className="absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#0B0D12] via-[#0B0D12]/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#0B0D12] via-[#0B0D12]/80 to-transparent z-20 pointer-events-none" />

      {/* ── 7. VIGNETTAGE RADIAL AJUSTÉ (LISIBILITÉ + SOBRIÉTÉ HAUTE COUTURE) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 35% 45%, rgba(11, 13, 18, 0.76) 0%, rgba(11, 13, 18, 0.52) 55%, rgba(11, 13, 18, 0.28) 100%)',
        }}
      />

      {/* Fondu de transition doux vers le bas de la section Hero */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/90 to-transparent z-20 pointer-events-none" />
    </div>
  );
}
