import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { ClippingOption } from './utils/models.js';

const SEED_OPTIONS = [
  {
    title: 'Livraison Express',
    description:
      'Traitement prioritaire en haut de pile et livraison de vos extraits sous 24h ouvrées.',
    price: '',
    tag: 'Urgent',
    order: 1,
    active: true,
  },
  {
    title: 'Sous-titres dynamiques sur-mesure',
    description:
      'Animation mot à mot calibrée selon votre charte graphique (typographie de marque, palette de couleurs, emojis ciblés).',
    price: '',
    tag: 'Branding',
    order: 2,
    active: true,
  },
  {
    title: 'Cadrage dynamique / Multicam & Split-Screen',
    description:
      'Suivi automatique de la prise de parole, découpe multi-angles ou split-screen vertical (facecam + rush démonstration).',
    price: '',
    tag: 'Technique',
    order: 3,
    active: true,
  },
  {
    title: 'Habillage & Musique de fond',
    description:
      'Zooms lents de rétention, bande-son libre de droits mixée avec soin, sound design discret et barre de rétention.',
    price: '',
    tag: 'Rétention',
    order: 4,
    active: true,
  },
  {
    title: 'Pack prêt à poster',
    description:
      'Miniature dédiée par extrait + titre percutant + suggestion de description et hashtags SEO prêts à copier/coller.',
    price: '',
    tag: 'Clé en main',
    order: 5,
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
      let count = await ClippingOption.countDocuments();
      if (count === 0) {
        // Auto-seed default options
        await ClippingOption.insertMany(SEED_OPTIONS);
      }

      const adminCode = event.headers['x-admin-code'];
      const expectedCode = process.env.ADMIN_ACCESS_CODE;
      const isAdmin = adminCode && expectedCode && adminCode === expectedCode;

      const filter = isAdmin ? {} : { active: true };
      const options = await ClippingOption.find(filter).sort({ order: 1, createdAt: 1 });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(options),
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
          body: JSON.stringify({ error: 'Le titre de l’option est obligatoire.' }),
        };
      }

      const option = await ClippingOption.create(data);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(option),
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
          body: JSON.stringify({ error: 'ID de l’option manquant.' }),
        };
      }

      const updated = await ClippingOption.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Option introuvable.' }),
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
          body: JSON.stringify({ error: 'ID de l’option manquant.' }),
        };
      }

      const deleted = await ClippingOption.findByIdAndDelete(id);
      if (!deleted) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Option introuvable.' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Option supprimée avec succès', id }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('clipping-options error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
