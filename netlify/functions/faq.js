import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { FAQ } from './utils/models.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    await connectDB();

    // ── GET ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      const faqs = await FAQ.find({ active: true }).sort({ order: 1 });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(faqs),
      };
    }

    // ── POST ───────────────────────────────────────────────────────────────
    if (event.httpMethod === 'POST') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = JSON.parse(event.body);
      const faq = await FAQ.create(data);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(faq),
      };
    }

    // ── PUT ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'PUT') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = JSON.parse(event.body);
      const id = data.id || data._id || event.queryStringParameters?.id;

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing FAQ id' }),
        };
      }

      const faq = await FAQ.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!faq) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'FAQ not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(faq),
      };
    }

    // ── DELETE ──────────────────────────────────────────────────────────────
    if (event.httpMethod === 'DELETE') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = event.body ? JSON.parse(event.body) : {};
      const id = data.id || data._id || event.queryStringParameters?.id;

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing FAQ id' }),
        };
      }

      const faq = await FAQ.findByIdAndDelete(id);

      if (!faq) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'FAQ not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'FAQ deleted', id }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('faq error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
