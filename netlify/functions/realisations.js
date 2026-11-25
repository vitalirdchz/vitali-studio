import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { Realisation } from './utils/models.js';

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    await connectDB();

    // ── GET ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      const adminCode = event.headers['x-admin-code'];
      const expectedCode = process.env.ADMIN_ACCESS_CODE;
      const isAdmin = adminCode && expectedCode && adminCode === expectedCode;
      const shareId = event.queryStringParameters?.share || event.queryStringParameters?.id;

      let filter = {};
      if (!isAdmin) {
        if (shareId) {
          // Vidéo privée accessible via son lien de partage direct (les brouillons restent privés admin)
          filter = { _id: shareId, visibility: { $ne: 'draft' } };
        } else {
          // Affichage public standard : uniquement les vidéos publiées
          filter = {
            active: true,
            $or: [{ visibility: 'public' }, { visibility: { $exists: false } }],
          };
        }
      }

      const category = event.queryStringParameters?.category;

      if (category && category !== 'Tous') {
        filter.category = category;
      }

      const realisations = await Realisation.find(filter).sort({ order: 1, createdAt: -1 });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(realisations),
      };
    }

    // ── POST ───────────────────────────────────────────────────────────────
    if (event.httpMethod === 'POST') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
      const realisation = await Realisation.create(data);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(realisation),
      };
    }

    // ── PUT ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'PUT') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
      const id = data.id || data._id || event.queryStringParameters?.id;

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID de la réalisation manquant' }),
        };
      }

      const realisation = await Realisation.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!realisation) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Réalisation introuvable' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(realisation),
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
          body: JSON.stringify({ error: 'ID de la réalisation manquant' }),
        };
      }

      const realisation = await Realisation.findByIdAndDelete(id);

      if (!realisation) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Réalisation introuvable' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Réalisation supprimée', id }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('realisations error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
