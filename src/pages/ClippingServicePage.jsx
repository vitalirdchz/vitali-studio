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

  const sortedPacks = [...packs].sort((a, b) => (a.order || 0) - (b.order || 0));
  const sortedOptions = [...options].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="relative overflow-hidden">
      {/* Halo radial diffus en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none radial-halo opacity-90 z-0" />

      <div className="relative z-10 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
        {/* ── EN-TÊTE & RETOUR ──────────────────────────────────────── */}
        <section>
          <div className="mb-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1A1F2B] hover:bg-[#232A38] border border-[#394150] text-[#B6C0D0] hover:text-[#F5F6F8] text-xs font-mono transition"
            >
              <HiArrowLeft className="w-4 h-4 text-[#8EAFFF]" />
              <span>Retour au catalogue des services</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1F2B] border border-[#8EAFFF]/40 text-xs font-mono text-[#8EAFFF] mb-4">
              <span>● Format 9:16 Haute Rétention</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F6F8] mb-4">
              Clipping Vidéo (TikTok / Reels / Shorts)
            </h1>

            <p className="text-[#D6DCE6] text-base leading-relaxed font-sans mb-6">
              Transformez vos contenus longs (lives, podcasts, conférences, vidéos YouTube) en extraits verticaux percutants. Formules claires avec paiement unique au nombre d’extraits livrés. Aucun abonnement récurrent.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#B6C0D0]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                Paiement unique au clip
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                Export HD 1080x1920
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF]" />
                Commande sécurisée Fiverr
              </span>
            </div>
          </motion.div>
        </section>

        {/* ── SECTION 1 : LES 3 PACKS (GRILLE TARIFAIRE) ───────────── */}
        <section>
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] block mb-2 font-medium">
              GRILLE DES FORMULES
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8]">
              Choisissez le volume adapté à votre contenu
            </h2>
            <p className="text-[#B6C0D0] text-sm mt-2 font-sans">
              Tous nos packs incluent le recadrage 9:16, la sélection des meilleurs moments et l'export HD.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {sortedPacks.map((pack) => {
              const packTargetUrl = pack.fiverrUrl?.trim() || globalFiverr;
              const isFeatured = pack.isFeatured;

              return (
                <div
                  key={pack._id || pack.id || pack.order}
                  className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    isFeatured
                      ? 'bg-[#232A38] border-2 border-[#8EAFFF] shadow-2xl shadow-[#8EAFFF]/10 lg:-translate-y-2'
                      : 'bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/60 hover:bg-[#232A38]'
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8EAFFF] text-[#0B0D12] text-[11px] font-mono font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                      Recommandé
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-[#8EAFFF] uppercase tracking-wider font-medium">
                        {pack.price || 'Paiement unique'}
                      </span>
                      <span className="text-xs font-mono text-[#B6C0D0]">
                        0 abonnement
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-[#F5F6F8] mb-1">
                      {pack.title}
                    </h3>

                    <div className="text-3xl font-extrabold text-[#8EAFFF] font-display mb-4">
                      {pack.clipCount}
                    </div>

                    <p className="text-[#D6DCE6] text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                      {pack.description}
                    </p>

                    <div className="pt-6 border-t border-[#394150] space-y-3 mb-8">
                      <span className="text-[11px] font-mono text-[#B6C0D0] uppercase tracking-wider block font-medium">
                        Ce qui est inclus :
                      </span>
                      <ul className="space-y-2.5">
                        {pack.features &&
                          pack.features.map((feat, fIdx) => (
                            <li
                              key={fIdx}
                              className="text-xs text-[#D6DCE6] flex items-start gap-2.5 leading-relaxed font-sans"
                            >
                              <HiCheck className="w-4 h-4 text-[#8EAFFF] flex-shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href={packTargetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 px-6 rounded-xl font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] ${
                      isFeatured
                        ? 'bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] shadow-[#8EAFFF]/15'
                        : 'bg-[#11151D] hover:bg-[#232A38] border border-[#394150] hover:border-[#8EAFFF]/60 text-[#F5F6F8]'
                    }`}
                  >
                    <span>Commander sur Fiverr</span>
                    <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 2 : OPTIONS À LA CARTE (EXTRAS) ──────────────── */}
        <section>
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] block mb-2 font-medium">
              OPTIONS À LA CARTE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F6F8]">
              Personnalisez votre commande
            </h2>
            <p className="text-[#B6C0D0] text-sm mt-2 font-sans">
              Ajoutables en extra directement lors de la configuration de votre commande sur Fiverr.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOptions.map((opt, idx) => {
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
                  className="p-6 rounded-2xl bg-[#1A1F2B] border border-[#394150] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#11151D] border border-[#394150] flex items-center justify-center text-[#8EAFFF]">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        {opt.price && (
                          <span className="text-[11px] font-mono text-[#8EAFFF] font-medium">
                            {opt.price}
                          </span>
                        )}
                        {opt.tag && (
                          <span className="px-2.5 py-0.5 rounded-md bg-[#11151D] border border-[#394150] text-[10px] font-mono text-[#B6C0D0] uppercase tracking-wider font-medium">
                            {opt.tag}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-display text-base font-bold text-[#F5F6F8] mb-2 group-hover:text-[#8EAFFF] transition-colors">
                      {opt.title}
                    </h3>

                    <p className="text-[#B6C0D0] text-xs leading-relaxed font-sans">
                      {opt.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#394150] text-[11px] font-mono text-[#B6C0D0] flex items-center justify-between">
                    <span>Option à la carte</span>
                    <span className="text-[#8EAFFF]">À sélectionner sur Fiverr</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 3 : ENCART CONSEIL QUALITÉ (SOBRE & TRANSPARENT) */}
        <section className="pt-12 border-t border-[#394150]">
          <div className="rounded-2xl bg-[#1A1F2B] border border-[#394150] p-8 sm:p-10 relative overflow-hidden shadow-2xl">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-[#8EAFFF]/30 text-[#8EAFFF] flex items-center justify-center flex-shrink-0">
                <HiShieldExclamation className="w-6 h-6" />
              </div>

              <div className="space-y-4 max-w-4xl">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#8EAFFF] font-medium">
                    RECOMMANDATION TECHNIQUE
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F5F6F8] mt-1">
                    Conseil Qualité & Fichiers Sources
                  </h3>
                </div>

                <div className="space-y-3 text-sm text-[#D6DCE6] leading-relaxed font-sans">
                  <p>
                    <strong className="text-[#F5F6F8]">Résolution recommandée :</strong>{' '}
                    La résolution 1080p (Full HD) n’est pas strictement obligatoire, mais elle est{' '}
                    <span className="text-[#8EAFFF] font-medium">fortement conseillée</span>{' '}
                    pour garantir un rendu net, professionnel et lisible après le recadrage vertical au format 9:16.
                  </p>

                  <p>
                    <strong className="text-[#F5F6F8]">Fichiers basse qualité :</strong>{' '}
                    Si votre vidéo source est de basse qualité (ex : 720p compressé, stream instable ou webcam floue), le recadrage 9:16 peut accentuer les défauts sur les écrans récents.
                  </p>

                  <div className="p-4 rounded-xl bg-[#11151D] border border-[#394150] text-xs text-[#B6C0D0]">
                    <span className="text-[#F5F6F8] font-mono uppercase tracking-wider block mb-1 font-medium">
                      Option d’amélioration par IA :
                    </span>
                    Il est possible de demander une tentative d’amélioration de netteté par intelligence artificielle (upscaling / débruitage). Toutefois, par souci d'honnêteté et de rigueur, nous précisons qu’
                    <strong className="text-[#F5F6F8]">
                      aucune promesse ni garantie
                    </strong>{' '}
                    ne peut être formulée quant au résultat final, celui-ci dépendant intrinsèquement de l’information disponible dans le fichier d'origine.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
