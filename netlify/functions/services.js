import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { Service } from './utils/models.js';

const SEED_SERVICES = [
  {
    title: 'Clipping Vidéo (TikTok / Reels / Shorts)',
    slug: 'clipping',
    category: 'Vidéo 9:16',
    description:
      'Extraction chirurgicale de vos meilleurs moments à partir de rushs, podcasts, conférences et lives. Recadrage dynamique au ratio vertical 9:16, rythme soutenu et formats optimisés pour maximiser la rétention algorithmique.',
    icon: 'HiVideoCamera',
    features: [
      '3 Packs disponibles (3 à 15 extraits)',
      'Paiement unique au nombre d’extraits',
      'Export HD 1080x1920 calibré mobile',
      'Sous-titres synchronisés haute visibilité',
      'Commande sécurisée via Fiverr ou direct',
    ],
    ctaLink: '/services/clipping',
    ctaText: 'Voir les packs & options',
    order: 1,
    active: true,
  },
  {
    title: 'Web Scraping & Pipelines de Données',
    slug: 'web-scraping',
    category: 'Data & Automatisation',
    description:
      'Extraction automatisée et structurée de données web à grande échelle : leads qualifiés, surveillance de catalogues concurrents et agrégation de prix. Gestion avancée des sessions, headless browsers et contournements anti-bot.',
    icon: 'HiCircleStack',
    features: [
      'Exports sur-mesure (JSON, CSV, PostgreSQL)',
      'Tâches planifiées et scripts autonomes',
      'Surveillance continue et alertes',
      'Données nettoyées et prêtes à l’emploi',
    ],
    ctaLink: '/contact',
    ctaText: 'Étudier un besoin',
    order: 2,
    active: true,
  },
  {
    title: 'Automatisations & Scripts Sur-Mesure',
    slug: 'automation',
    category: 'Data & Automatisation',
    description:
      'Suppression des points de friction et des tâches manuelles récurrentes : traitement batch de fichiers médias par FFmpeg, intégration de micro-APIs (OpenAI, Whisper) et bots de monitoring temps réel (Discord, Telegram).',
    icon: 'HiCommandLine',
    features: [
      'Scripts Python ultra-légers et documentés',
      'Connecteurs sans intermédiaire pour vos flux',
      'Traitement automatique audio / vidéo',
      'Gain de temps massif et fiabilité 100%',
    ],
    ctaLink: '/contact',
    ctaText: 'Étudier un besoin',
    order: 3,
    active: true,
  },
  {
    title: 'Montage Dynamique YouTube (16:9)',
    slug: 'montage-youtube',
    category: 'Montage Long',
    description:
      'Rythme millimétré, rétention maximale et color grading professionnel pour propulser le taux de complétion de vos vidéos YouTube.',
    icon: 'HiVideoCamera',
    features: [
      'Dérushage & découpage sans temps mort',
      'Animations graphiques & zooms dynamiques',
      'Mixage audio & mastering voix cristallin',
      'Colorimétrie & étalonnage cinématique',
    ],
    ctaLink: 'https://www.fiverr.com',
    ctaText: 'Commander sur Fiverr',
    order: 4,
    active: true,
  },
];

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    await connectDB();

    // ── GET ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      const count = await Service.countDocuments();
      if (count === 0) {
        await Service.insertMany(SEED_SERVICES);
      }

      const adminCode = event.headers['x-admin-code'];
      const expectedCode = process.env.ADMIN_ACCESS_CODE;
      const isAdmin = adminCode && expectedCode && adminCode === expectedCode;

      const filter = isAdmin ? {} : { active: true };
      const services = await Service.find(filter).sort({ order: 1, createdAt: 1 });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(services),
      };
    }

    // ── POST ───────────────────────────────────────────────────────────────
    if (event.httpMethod === 'POST') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      const service = await Service.create(data);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(service),
      };
    }

    // ── PUT ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'PUT') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      const id = data.id || data._id || event.queryStringParameters?.id;

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing service id' }),
        };
      }

      const service = await Service.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!service) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Service not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(service),
      };
    }

    // ── DELETE ──────────────────────────────────────────────────────────────
    if (event.httpMethod === 'DELETE') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {};
      const id = data.id || data._id || event.queryStringParameters?.id;

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing service id' }),
        };
      }

      const service = await Service.findByIdAndDelete(id);

      if (!service) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Service not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Service deleted', id }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('services error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
