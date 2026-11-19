import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { ClippingConfig, SiteSetting } from './utils/models.js';

const DEFAULT_CLIPPING_CONFIG = {
  key: 'clipping',
  title: 'Clipping Vidéo (TikTok / Reels / Shorts)',
  subtitle:
    'Transformez vos vidéos longues en formats courts viraux et percutants sans aucun abonnement.',
  fiverrUrl: 'https://www.fiverr.com',
  packs: [
    {
      id: 'pack-decouverte',
      name: 'Pack Découverte',
      badge: '3 à 5 extraits',
      clipsCount: '3 à 5 extraits (9:16)',
      price: 'Paiement unique',
      description:
        'Idéal pour tester le format ou extraire l’essentiel d’une courte vidéo sans engagement.',
      tagline: 'Idéal vidéo courte / test',
      delivery: '24h à 48h ouvrées',
      features: [
        '3 à 5 clips verticaux au format 9:16',
        'Sélection chirurgicale des meilleurs moments & punchlines',
        'Recadrage dynamique centré sur le sujet principal',
        'Export haute définition 1080x1920 optimisé mobile',
        'Paiement unique au nombre d’extraits (aucun abonnement)',
      ],
      fiverrUrl: '',
      highlight: false,
    },
    {
      id: 'pack-standard',
      name: 'Pack Standard',
      badge: '8 à 10 extraits',
      clipsCount: '8 à 10 extraits (9:16)',
      price: 'Paiement unique',
      description:
        'Idéal pour podcast ou vidéo longue, couverture complète des moments forts, prêt à publier.',
      tagline: 'Idéal podcast ou vidéo longue',
      delivery: '48h ouvrées',
      features: [
        '8 à 10 clips verticaux au format 9:16',
        'Couverture complète et rythmée des moments forts',
        'Recadrage dynamique et transitions soignées',
        'Sous-titres synchronisés haute lisibilité',
        'Fichiers calibrés pour TikTok, Reels et YouTube Shorts',
        'Paiement unique au nombre d’extraits (aucun abonnement)',
      ],
      fiverrUrl: '',
      highlight: true,
    },
    {
      id: 'pack-volume',
      name: 'Pack Volume',
      badge: '15 extraits',
      clipsCount: '15 extraits (9:16)',
      price: 'Paiement unique',
      description:
        'Idéal pour live, conférence ou long podcast, exploitation maximale d’une vidéo source.',
      tagline: 'Idéal live, conférence & long format',
      delivery: '72h ouvrées',
      features: [
        '15 clips verticaux au format 9:16',
        'Exploitation maximale et exhaustive de votre vidéo source',
        'Diversité des angles d’intérêt & crochets (hooks)',
        'Rythme et rétention optimisés pour l’engagement',
        'Pack de fichiers organisés et prêts à programmer',
        'Paiement unique au nombre d’extraits (aucun abonnement)',
      ],
      fiverrUrl: '',
      highlight: false,
    },
  ],
  options: [
    {
      id: 'opt-express',
      title: 'Livraison Express',
      description:
        'Traitement prioritaire en haut de pile et livraison de vos extraits sous 24h ouvrées.',
      tag: 'Rapide',
    },
    {
      id: 'opt-subtitles',
      title: 'Sous-titres dynamiques sur-mesure',
      description:
        'Animation mot par mot selon votre charte graphique (typographie de marque, couleurs, emojis ciblés).',
      tag: 'Branding',
    },
    {
      id: 'opt-multicam',
      title: 'Cadrage dynamique / Multicam & Split-Screen',
      description:
        'Suivi dynamique des intervenants, bascule multicaméras ou split-screen vertical (facecam + rush démonstration).',
      tag: 'Technique',
    },
    {
      id: 'opt-sound-fx',
      title: 'Habillage & Musique de fond',
      description:
        'Zooms lents de rétention, bande-son libre de droits adaptée au rythme et barre de progression visuelle.',
      tag: 'Rétention',
    },
    {
      id: 'opt-ready-to-post',
      title: 'Pack prêt à poster',
      description:
        'Miniature dédiée par extrait + titre percutant + suggestion de description et hashtags SEO.',
      tag: 'Clé en main',
    },
  ],
  qualityAdvice:
    "La résolution 1080p n'est pas obligatoire mais fortement conseillée pour obtenir un rendu net après recadrage vertical (9:16). Prévenir qu'avec une source de basse qualité, le rendu peut être dégradé. Il est possible de tenter une amélioration de qualité par IA, mais sans aucune promesse ni garantie sur le résultat final.",
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    await connectDB();

    // ── GET ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      let config = await ClippingConfig.findOne({ key: 'clipping' });

      // Synchronize default global fiverrUrl if config doesn't have custom one
      const globalSetting = await SiteSetting.findOne({ key: 'global' });
      const fallbackFiverr = globalSetting?.fiverrUrl || 'https://www.fiverr.com';

      if (!config) {
        config = await ClippingConfig.create({
          ...DEFAULT_CLIPPING_CONFIG,
          fiverrUrl: fallbackFiverr,
        });
      } else if (!config.fiverrUrl) {
        config.fiverrUrl = fallbackFiverr;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(config),
      };
    }

    // ── PUT / POST (Admin) ─────────────────────────────────────────────────
    if (event.httpMethod === 'PUT' || event.httpMethod === 'POST') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data =
        typeof event.body === 'string'
          ? JSON.parse(event.body || '{}')
          : event.body;

      const updated = await ClippingConfig.findOneAndUpdate(
        { key: 'clipping' },
        { $set: data },
        { new: true, upsert: true }
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updated),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('clipping-config error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
