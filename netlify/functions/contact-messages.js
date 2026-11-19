import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { ContactMessage } from './utils/models.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    await connectDB();

    // ── POST (Public: soumission formulaire de contact) ──────────────────
    if (event.httpMethod === 'POST') {
      const data =
        typeof event.body === 'string'
          ? JSON.parse(event.body || '{}')
          : event.body || {};

      const { name, email, message, service } = data;

      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Veuillez remplir votre nom, email et votre message.',
          }),
        };
      }

      const msg = await ContactMessage.create({
        name: name.trim(),
        email: email.trim(),
        service: service || 'Clipping Vidéo',
        message: message.trim(),
        isRead: false,
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'Message enregistré avec succès',
          contactMessage: msg,
        }),
      };
    }

    // ── GET (Admin: liste des messages) ──────────────────────────────────
    if (event.httpMethod === 'GET') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const messages = await ContactMessage.find().sort({ createdAt: -1 });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(messages),
      };
    }

    // ── PUT (Admin: marquer comme lu ou tout marquer comme lu) ───────────
    if (event.httpMethod === 'PUT') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data =
        typeof event.body === 'string'
          ? JSON.parse(event.body || '{}')
          : event.body || {};

      if (data.markAllRead) {
        await ContactMessage.updateMany({}, { $set: { isRead: true } });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: 'Tous les messages marqués comme lus',
          }),
        };
      }

      const id = data.id || data._id || event.queryStringParameters?.id;
      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID du message manquant' }),
        };
      }

      const updated = await ContactMessage.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Message introuvable' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updated),
      };
    }

    // ── DELETE (Admin: supprimer message) ────────────────────────────────
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
          body: JSON.stringify({ error: 'ID du message manquant' }),
        };
      }

      const deleted = await ContactMessage.findByIdAndDelete(id);
      if (!deleted) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Message introuvable' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Message supprimé', id }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('contact-messages error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
