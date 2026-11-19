import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { ServiceProposal } from './utils/models.js';

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    await connectDB();

    // ── POST (Public: soumission d'une proposition client) ───────────────
    if (event.httpMethod === 'POST') {
      const data =
        typeof event.body === 'string'
          ? JSON.parse(event.body || '{}')
          : event.body || {};

      const { contact, title, description } = data;

      if (!contact?.trim() || !title?.trim() || !description?.trim()) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Veuillez remplir votre contact, le service souhaité et la description.',
          }),
        };
      }

      const proposal = await ServiceProposal.create({
        contact: contact.trim(),
        title: title.trim(),
        description: description.trim(),
        status: 'Nouveau',
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'Proposition enregistrée avec succès',
          proposal,
        }),
      };
    }

    // ── GET (Admin: liste des propositions) ──────────────────────────────
    if (event.httpMethod === 'GET') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const proposals = await ServiceProposal.find().sort({ createdAt: -1 });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(proposals),
      };
    }

    // ── PUT (Admin: mise à jour du statut Lu / Nouveau / Traité) ─────────
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
          body: JSON.stringify({ error: 'ID de la proposition manquant' }),
        };
      }

      const proposal = await ServiceProposal.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!proposal) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Proposition introuvable' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(proposal),
      };
    }

    // ── DELETE (Admin: suppression) ──────────────────────────────────────
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
          body: JSON.stringify({ error: 'ID de la proposition manquant' }),
        };
      }

      const proposal = await ServiceProposal.findByIdAndDelete(id);

      if (!proposal) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Proposition introuvable' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Proposition supprimée', id }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('service-proposals error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
