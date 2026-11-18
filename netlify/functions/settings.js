import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { SiteSetting } from './utils/models.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    await connectDB();

    // ── GET ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      let settings = await SiteSetting.findOne({ key: 'global' });
      if (!settings) {
        settings = await SiteSetting.create({ key: 'global' });
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(settings),
      };
    }

    // ── PUT ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'PUT' || event.httpMethod === 'POST') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : event.body;

      const settings = await SiteSetting.findOneAndUpdate(
        { key: 'global' },
        { $set: data },
        { new: true, upsert: true }
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(settings),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('settings error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
