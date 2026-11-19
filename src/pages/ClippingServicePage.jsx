import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiArrowLeft,
  HiCheck,
  HiArrowTopRightOnSquare,
  HiBolt,
  HiLanguage,
  HiArrowsPointingOut,
  HiSpeakerWave,
  HiPhoto,
  HiShieldExclamation,
} from 'react-icons/hi2';
import {
  getClippingPacks,
  getClippingOptions,
  getSettings,
} from '../utils/api';

const DEFAULT_PACKS = [
  {
    _id: 'seed-pack-1',
    title: 'Pack Découverte',
    clipCount: '3 à 5 extraits',
    price: 'Paiement unique',
    description:
      'Idéal pour tester le format ou extraire l’essentiel d’une courte vidéo sans engagement.',
    features: [
      '3 à 5 clips verticaux au format 9:16',
      'Sélection chirurgicale des meilleurs moments & punchlines',
      'Recadrage dynamique centré sur le sujet principal',
      'Export haute définition (1080x1920) optimisé mobile',
      'Paiement unique au clip (aucun abonnement requis)',
    ],
    isFeatured: false,
    fiverrUrl: '',
    order: 1,
  },
  {
    _id: 'seed-pack-2',
    title: 'Pack Standard',
    clipCount: '8 à 10 extraits',
    price: 'Paiement unique',
    description:
      'Idéal pour podcast ou vidéo longue, couverture complète des moments forts, prêt à publier.',
    features: [
      '8 à 10 clips verticaux au format 9:16',
      'Couverture exhaustive et rythmée des temps forts',
      'Recadrage dynamique et transitions soignées',
      'Sous-titres synchronisés haute visibilité',
      'Fichiers calibrés pour TikTok, Reels et YouTube Shorts',
      'Paiement unique au nombre d’extraits (aucun abonnement)',
    ],
    isFeatured: true,
    fiverrUrl: '',
    order: 2,
  },
  {
    _id: 'seed-pack-3',
    title: 'Pack Volume',
    clipCount: '15 extraits',
    price: 'Paiement unique',
    description:
      'Idéal pour live, conférence ou long podcast, exploitation maximale d’une vidéo source.',
    features: [
      '15 clips verticaux au format 9:16',
      'Exploitation maximale et chirurgicale de votre vidéo source',
      'Diversité des angles d’intérêt & hooks percutants',
      'Rythme et rétention optimisés pour l’engagement',
      'Pack complet de fichiers organisés et prêts à programmer',
      'Paiement unique au nombre d’extraits (aucun abonnement)',
    ],
    isFeatured: false,
    fiverrUrl: '',
    order: 3,
  },
];

const DEFAULT_OPTIONS = [
  {
    _id: 'seed-opt-1',
    title: 'Livraison Express',
    description:
      'Traitement prioritaire en haut de pile et livraison de vos extraits sous 24h ouvrées.',
    tag: 'Urgent',
    order: 1,
  },
  {
    _id: 'seed-opt-2',
    title: 'Sous-titres dynamiques sur-mesure',
    description:
      'Animation mot à mot calibrée selon votre charte graphique (typographie de marque, palette de couleurs, emojis ciblés).',
    tag: 'Branding',
    order: 2,
  },
  {
    _id: 'seed-opt-3',
    title: 'Cadrage dynamique / Multicam & Split-Screen',
    description:
      'Suivi automatique de la prise de parole, découpe multi-angles ou split-screen vertical (facecam + rush démonstration).',
    tag: 'Technique',
    order: 3,
  },
  {
    _id: 'seed-opt-4',
    title: 'Habillage & Musique de fond',
    description:
      'Zooms lents de rétention, bande-son libre de droits mixée avec soin, sound design discret et barre de rétention.',
    tag: 'Rétention',
    order: 4,
  },
  {
    _id: 'seed-opt-5',
    title: 'Pack prêt à poster',
    description:
      'Miniature dédiée par extrait + titre percutant + suggestion de description et hashtags SEO prêts à copier/coller.',
    tag: 'Clé en main',
    order: 5,
  },
];

export default function ClippingServicePage() {
  const [packs, setPacks] = useState(DEFAULT_PACKS);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [globalFiverr, setGlobalFiverr] = useState('https://www.fiverr.com');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getClippingPacks(),
      getClippingOptions(),
      getSettings(),
    ])
      .then(([packsRes, optionsRes, settingsRes]) => {
        if (settingsRes.status === 'fulfilled' && settingsRes.value?.fiverrUrl) {
          setGlobalFiverr(settingsRes.value.fiverrUrl);
        }

        if (packsRes.status === 'fulfilled' && Array.isArray(packsRes.value) && packsRes.value.length > 0) {
          setPacks(packsRes.value);
        }

        if (optionsRes.status === 'fulfilled' && Array.isArray(optionsRes.value) && optionsRes.value.length > 0) {
          setOptions(optionsRes.value);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getFiverrLink = (pack) => {
    return pack.fiverrUrl?.trim() || globalFiverr;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Halo radial diffus en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none radial-halo opacity-90 z-0" />

      <div className="relative z-10 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ── RETOUR VERS /SERVICES ───────────────────────────────── */}
        <div className="mb-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white transition group py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-500/30"
          >
            <HiArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Retour aux services</span>
          </Link>
        </div>

        {/* ── EN-TÊTE DU SERVICE ──────────────────────────────────── */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono uppercase mb-3 font-medium">
            ● Service Actif & Prêt à la commande
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Clipping Vidéo (Shorts / Reels / TikTok)
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Transformez vos vidéos longues, podcasts, replays de lives et conférences en extraits verticaux (9:16) haute performance. Des packs clairs et calibrés par nombre d’extraits, avec commande directe et sécurisée.
          </p>

          {/* Note importante : AUCUN abonnement */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-gray-400 bg-[#111113] px-3.5 py-1.5 rounded-lg border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Paiement unique au pack • Aucun abonnement mensuel imposé</span>
          </div>
        </div>

        {/* ── SECTION 1 : LES 3 PACKS (PAIEMENT UNIQUE) ───────────── */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
                FORMULES AU NOMBRE D’EXTRAITS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                Les 3 Packs Clés en Main
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-500 hidden sm:inline">
              Tarifs transparents • Prêt à poster
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {packs.map((pack, idx) => {
              const isHighlight = pack.isFeatured ?? pack.highlight;
              const targetUrl = getFiverrLink(pack);
              const packTitle = pack.title || pack.name;
              const packCount = pack.clipCount || pack.clipsCount || pack.badge;

              return (
                <motion.div
                  key={pack._id || pack.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`bento-card p-8 flex flex-col justify-between relative ${
                    isHighlight
                      ? 'border-indigo-500/40 bg-[#131317] shadow-2xl shadow-indigo-500/[0.04]'
                      : 'bg-[#111113] border-white/10 hover:border-indigo-500/30'
                  }`}
                >
                  {isHighlight && (
                    <div className="absolute -top-3.5 right-6 bg-indigo-500 text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                      Recommandé
                    </div>
                  )}

                <div>
                  {/* Badge & Nom */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                      Formule {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-indigo-300 font-medium">
                      {packCount}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    {packTitle}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed mb-6 min-h-[36px]">
                    {pack.description}
                  </p>

                  {/* Specs & Facturation */}
                  <div className="space-y-2.5 py-4 border-y border-white/10 mb-6 text-xs font-mono text-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Volume :</span>
                      <span className="font-semibold text-white">
                        {packCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Tarification :</span>
                      <span className="text-indigo-400 font-medium">
                        {pack.price || 'Paiement unique'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Engagement :</span>
                      <span className="text-gray-400">Zéro abonnement</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block">
                      Inclus dans l’offre :
                    </span>
                    <ul className="space-y-2.5">
                      {(pack.features || []).map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed"
                        >
                          <HiCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button towards Fiverr */}
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2 transition ${
                    isHighlight
                      ? 'bg-white text-black hover:bg-gray-200 shadow-md'
                      : 'bg-[#18181C] text-white hover:bg-[#222228] border border-white/10 hover:border-indigo-500/30'
                  }`}
                >
                  <span>Commander sur Fiverr</span>
                  <HiArrowTopRightOnSquare className="w-4 h-4" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 2 : OPTIONS (À LA CARTE) ────────────────────── */}
      <section className="mb-24 pt-12 border-t border-white/10">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
            PERSONNALISATION ADDITIONNELLE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Options à la Carte
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Modules optionnels activables lors de votre commande pour affiner l'habillage, la rapidité ou l'impact de vos vidéos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((opt, idx) => {
            const fallbackIcons = [
              HiBolt,
              HiLanguage,
              HiArrowsPointingOut,
              HiSpeakerWave,
              HiPhoto,
            ];
            const IconComponent = opt.icon || fallbackIcons[idx % fallbackIcons.length];

            return (
              <div
                key={opt._id || opt.id || idx}
                className="bento-card p-6 bg-[#111113] border-white/10 hover:border-indigo-500/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#161619] border border-white/10 flex items-center justify-center text-indigo-400">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      {opt.price && (
                        <span className="text-[11px] font-mono text-indigo-400 font-medium">
                          {opt.price}
                        </span>
                      )}
                      {opt.tag && (
                        <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                          {opt.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-display text-base font-bold text-white mb-2">
                    {opt.title}
                  </h3>

                  <p className="text-gray-400 text-xs leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 text-[11px] font-mono text-gray-500 flex items-center justify-between">
                  <span>Option à la carte</span>
                  <span className="text-gray-400">À sélectionner sur Fiverr</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 3 : ENCART CONSEIL QUALITÉ (SOBRE & TRANSPARENT) */}
      <section className="pt-12 border-t border-white/10">
        <div className="rounded-2xl bg-[#0D0D0D] border border-white/15 p-8 sm:p-10 relative overflow-hidden">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <HiShieldExclamation className="w-6 h-6" />
            </div>

            <div className="space-y-4 max-w-4xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400/90">
                  RECOMMANDATION TECHNIQUE
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                  Conseil Qualité & Fichiers Sources
                </h3>
              </div>

              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">Résolution recommandée :</strong>{' '}
                  La résolution 1080p (Full HD) n’est pas strictement obligatoire, mais elle est{' '}
                  <span className="text-white font-medium">fortement conseillée</span>{' '}
                  pour garantir un rendu net, professionnel et lisible après le recadrage vertical au format 9:16.
                </p>

                <p>
                  <strong className="text-white">Fichiers basse qualité :</strong>{' '}
                  Si votre vidéo source est de basse qualité (ex : 720p fortement compressé, stream instable ou webcam floue), le recadrage 9:16 peut accentuer les défauts et dégrader le rendu final sur les écrans de smartphone récents.
                </p>

                <p className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-400">
                  <span className="text-white font-mono uppercase tracking-wider block mb-1">
                    Option d’amélioration par IA :
                  </span>
                  Il est possible de demander une tentative d’amélioration de la netteté par intelligence artificielle (upscaling / débruitage). Toutefois, par souci d'honnêteté et de rigueur, nous précisons qu’
                  <strong className="text-gray-200">
                    aucune promesse ni garantie
                  </strong>{' '}
                  ne peut être formulée quant au résultat final, celui-ci dépendant intrinsèquement de l’information visuelle disponible dans le fichier d'origine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
