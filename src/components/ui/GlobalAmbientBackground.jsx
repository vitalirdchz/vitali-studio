import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * GlobalAmbientBackground
 * Arrière-plan animé haute couture & ultra-soyeux :
 * 1. La souris attire doucement les particules (force réduite, fluide et gracieuse).
 * 2. AUCUNE percussion entre particules (elles glissent librement les unes à côté des autres).
 * 3. Au survol d'un élément cliquable (boutons, cartes, liens), le champ bascule en dérive autonome ("random").
 * 4. Dérive continue et bouclage torique doux pour un effet aérien et perpétuel.
 */
export default function GlobalAmbientBackground() {
  const canvasRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // ── Détection de la souris & zones de clic ──
    const mouseState = {
      x: width * 0.5,
      y: height * 0.4,
      isClickable: false,
      active: false,
    };

    const isInteractive = (elem) => {
      if (!elem) return false;
      return !!elem.closest(
        'a, button, input, textarea, select, [role="button"], [role="link"], [data-clickable="true"], .cursor-pointer, .btn-primary, .btn-secondary, .bento-card, .card, video, iframe'
      );
    };

    const handleMouseMove = (e) => {
      mouseState.x = e.clientX;
      mouseState.y = e.clientY;
      mouseState.active = true;

      const elem = document.elementFromPoint(e.clientX, e.clientY);
      mouseState.isClickable = isInteractive(elem);
    };

    const handleMouseLeave = () => {
      mouseState.active = false;
      mouseState.isClickable = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // ── Parallaxe au scroll ──
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      scrollVelocity += delta * 0.12;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ── Génération des particules bokeh (52 particules fluides) ──
    const PARTICLE_COUNT = Math.min(Math.floor(width / 26), 55);
    const particles = [];

    const PALETTE = [
      { r: 255, g: 255, b: 255, glow: '#FFFFFF' }, // Blanc pur
      { r: 142, g: 175, b: 255, glow: '#8EAFFF' }, // Bleu studio glacé
      { r: 129, g: 140, b: 248, glow: '#818CF8' }, // Indigo cyber
      { r: 52, g: 211, b: 153, glow: '#34D399' },  // Émeraude DaVinci
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const radius = Math.random() * 1.8 + 1.5; // 1.5px à 3.3px
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseVx: (Math.random() - 0.5) * 0.3,
        baseVy: -(Math.random() * 0.35 + 0.15), // Dérive naturelle douce vers le haut
        vx: 0,
        vy: 0,
        radius,
        baseAlpha: Math.random() * 0.3 + 0.25,
        pulseSpeed: Math.random() * 0.015 + 0.006,
        pulsePhase: Math.random() * Math.PI * 2,
        r: col.r,
        g: col.g,
        b: col.b,
        glow: col.glow,
      });
    }

    // ── Point focal d'attraction ──
    let focalX = width * 0.5;
    let focalY = height * 0.4;

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ── Moteur d'animation fluide ──
    const render = (time) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      scrollVelocity *= 0.93;

      // ── Position du point focal (Souris vs Mode Dérive Aléatoire) ──
      const isRandomMode = !mouseState.active || mouseState.isClickable;
      let targetX, targetY;

      if (!isRandomMode) {
        targetX = mouseState.x;
        targetY = mouseState.y;
      } else {
        // En mode random (survol bouton ou curseur inactif) : dérive autonome apaisée
        const t1 = time * 0.0004;
        const t2 = time * 0.0007;
        const t3 = time * 0.0011;
        targetX = width * 0.5 + Math.sin(t1) * (width * 0.34) + Math.cos(t3) * 70;
        targetY = height * 0.45 + Math.cos(t2) * (height * 0.28) + Math.sin(t3) * 50;
      }

      focalX += (targetX - focalX) * 0.06;
      focalY += (targetY - focalY) * 0.06;

      // ── Spotlight lumineux vaporeux ──
      const spotRadius = isRandomMode ? 340 : 420;
      const spotGlow = ctx.createRadialGradient(
        focalX,
        focalY,
        0,
        focalX,
        focalY,
        spotRadius
      );
      spotGlow.addColorStop(0, 'rgba(142, 175, 255, 0.20)');
      spotGlow.addColorStop(0.35, 'rgba(99, 102, 241, 0.10)');
      spotGlow.addColorStop(0.75, 'rgba(79, 70, 229, 0.02)');
      spotGlow.addColorStop(1, 'transparent');

      ctx.save();
      ctx.fillStyle = spotGlow;
      ctx.beginPath();
      ctx.arc(focalX, focalY, spotRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ── Mise à jour & Rendu des Particules (Attraction douce, sans percussion) ──
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = focalX - p.x;
        const dy = focalY - p.y;
        const dist = Math.hypot(dx, dy);

        if (!isRandomMode) {
          // Attraction douce avec force allégée ("moins de force")
          if (dist < 320 && dist > 35) {
            const factor = (320 - dist) / 320;
            const pull = factor * factor * 0.10; // Force douce et apaisée
            p.vx += (dx / dist) * pull;
            p.vy += (dy / dist) * pull;
          } else if (dist <= 35 && dist > 0.01) {
            // Ralentissement soyeux au centre sans collision
            p.vx *= 0.94;
            p.vy *= 0.94;
          }
        } else {
          // En mode aléatoire : attraction très subtile vers le point flottant
          if (dist < 260 && dist > 40) {
            const factor = (260 - dist) / 260;
            const pull = factor * factor * 0.05;
            p.vx += (dx / dist) * pull;
            p.vy += (dy / dist) * pull;
          }
        }

        // Amortissement doux de la vitesse induite
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Déplacement : dérive naturelle + impulsion douce + scroll
        p.x += p.baseVx + p.vx + Math.sin(time * 0.0008 + p.pulsePhase) * 0.14;
        p.y += p.baseVy + p.vy + scrollVelocity * 0.14;

        // Bouclage torique continu (flottement infini sans rebond agressif)
        if (p.y < -15) p.y = height + 15;
        if (p.y > height + 15) p.y = -15;
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        // Brillance & éclat à proximité de la lumière
        p.pulsePhase += p.pulseSpeed;
        const pulse = Math.sin(p.pulsePhase) * 0.12;
        const proximity = Math.max(0, 1 - dist / 320) * 0.32;
        const finalAlpha = Math.min(
          0.92,
          Math.max(0.18, p.baseAlpha + pulse + proximity)
        );

        // Dessin de la particule
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${finalAlpha.toFixed(3)})`;
        ctx.shadowBlur = 8 + proximity * 8;
        ctx.shadowColor = p.glow;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
      style={{ background: '#0B0D12' }}
      aria-hidden="true"
    >
      {/* ── 1. AURAS LUMINEUSES DÉRIVANTES HAUTE COUTURE ── */}
      <div
        className="absolute -top-36 -left-20 w-[680px] sm:w-[920px] h-[680px] sm:h-[920px] rounded-full blur-[130px] opacity-90 animate-ambient-float-1 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(142, 175, 255, 0.18) 0%, rgba(99, 102, 241, 0.10) 45%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/4 -right-32 w-[620px] sm:w-[800px] h-[620px] sm:h-[800px] rounded-full blur-[140px] opacity-85 animate-ambient-float-2 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(79, 70, 229, 0.16) 0%, rgba(129, 140, 248, 0.08) 50%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-28 left-1/4 w-[560px] sm:w-[740px] h-[560px] sm:h-[740px] rounded-full blur-[130px] opacity-80 animate-ambient-float-3 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.11) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)',
        }}
      />

      {/* ── 2. GRILLE TECHNIQUE DE RÉGIE DAVINCI (48px) ── */}
      <div
        className="absolute inset-0 opacity-[0.065]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.22) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.22) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── 3. SCANNER LUMINEUX VERTICAL DE STUDIO ── */}
      <div className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#8EAFFF]/35 to-transparent blur-[2px] animate-ambient-scan pointer-events-none" />

      {/* ── 4. CANVAS INTERACTIF (ATTRACTION DOUCE, FLUIDE SANS PERCUSSION) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* ── 5. VIGNETTAGE RADIAL SOYEUX (LISIBILITÉ PARFAITE) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, rgba(11, 13, 18, 0.20) 65%, rgba(11, 13, 18, 0.75) 100%)',
        }}
      />
    </div>
  );
}
