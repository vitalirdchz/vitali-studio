import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { PortfolioItem } from './utils/models.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    await connectDB();

    // ── GET ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      const filter = {};
      const category = event.queryStringParameters?.category;

      if (category) {
        filter.category = category;
      }

      const items = await PortfolioItem.find(filter).sort({ order: 1, createdAt: -1 });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(items),
      };
    }

    // ── POST ───────────────────────────────────────────────────────────────
    if (event.httpMethod === 'POST') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = JSON.parse(event.body);
      const item = await PortfolioItem.create(data);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(item),
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
          body: JSON.stringify({ error: 'Missing portfolio item id' }),
        };
      }

      const item = await PortfolioItem.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!item) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Portfolio item not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(item),
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
          body: JSON.stringify({ error: 'Missing portfolio item id' }),
        };
      }

      const item = await PortfolioItem.findByIdAndDelete(id);

      if (!item) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Portfolio item not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Portfolio item deleted', id }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('portfolio error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
