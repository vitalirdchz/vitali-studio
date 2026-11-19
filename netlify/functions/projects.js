import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { Project } from './utils/models.js';

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

      const filter = isAdmin ? {} : { active: true };
      const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(projects),
      };
    }

    // ── POST ───────────────────────────────────────────────────────────────
    if (event.httpMethod === 'POST') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
      const project = await Project.create(data);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(project),
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
          body: JSON.stringify({ error: 'ID du projet manquant' }),
        };
      }

      const project = await Project.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!project) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Projet introuvable' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(project),
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
          body: JSON.stringify({ error: 'ID du projet manquant' }),
        };
      }

      const project = await Project.findByIdAndDelete(id);

      if (!project) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Projet introuvable' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Projet supprimé', id }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('projects error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
