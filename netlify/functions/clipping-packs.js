import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { ClippingPack } from './utils/models.js';

const SEED_PACKS = [
  {
    title: 'Pack Découverte',
    clipCount: '3 à 5 extraits',
    description:
      'Idéal pour vidéo courte / test, sélection des meilleurs moments, recadrage 9:16, export HD.',
    features: [
      '3 à 5 clips verticaux au format 9:16',
      'Sélection chirurgicale des meilleurs moments & punchlines',
      'Recadrage dynamique centré sur le sujet principal',
      'Export haute définition 1080x1920 optimisé mobile',
      'Paiement unique au clip (aucun abonnement requis)',
    ],
    price: 'Paiement unique',
    fiverrUrl: '',
    isFeatured: false,
    order: 1,
    active: true,
  },
  {
    title: 'Pack Standard',
    clipCount: '8 à 10 extraits',
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
    price: 'Paiement unique',
    fiverrUrl: '',
    isFeatured: true,
    order: 2,
    active: true,
  },
  {
    title: 'Pack Volume',
    clipCount: '15 extraits',
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
    price: 'Paiement unique',
    fiverrUrl: '',
    isFeatured: false,
    order: 3,
    active: true,
  },
];

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    await connectDB();

    // ── GET ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      let count = await ClippingPack.countDocuments();
      if (count === 0) {
        // Auto-seed default packs
        await ClippingPack.insertMany(SEED_PACKS);
      }

      const adminCode = event.headers['x-admin-code'];
      const expectedCode = process.env.ADMIN_ACCESS_CODE;
      const isAdmin = adminCode && expectedCode && adminCode === expectedCode;

      const filter = isAdmin ? {} : { active: true };
      const packs = await ClippingPack.find(filter).sort({ order: 1, createdAt: 1 });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(packs),
      };
    }

    // ── POST ───────────────────────────────────────────────────────────────
    if (event.httpMethod === 'POST') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data =
        typeof event.body === 'string'
          ? JSON.parse(event.body || '{}')
          : event.body || {};

      if (!data.title?.trim()) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Le titre du pack est obligatoire.' }),
        };
      }

      if (typeof data.features === 'string') {
        data.features = data.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean);
      }

      const pack = await ClippingPack.create(data);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(pack),
      };
    }

    // ── PUT ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'PUT') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data =
        typeof event.body === 'string'
          ? JSON.parse(event.body || '{}')
          : event.body || {};
      const id = data.id || data._id || event.queryStringParameters?.id;

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID du pack manquant.' }),
        };
      }

      if (typeof data.features === 'string') {
        data.features = data.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean);
      }

      const updated = await ClippingPack.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Pack introuvable.' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updated),
      };
    }

    // ── DELETE ──────────────────────────────────────────────────────────────
    if (event.httpMethod === 'DELETE') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = event.body
        ? typeof event.body === 'string'
          ? JSON.parse(event.body || '{}')
          : event.body
        : {};
      const id = data.id || data._id || event.queryStringParameters?.id;

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID du pack manquant.' }),
        };
      }

      const deleted = await ClippingPack.findByIdAndDelete(id);
      if (!deleted) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Pack introuvable.' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Pack supprimé avec succès', id }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('clipping-packs error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
