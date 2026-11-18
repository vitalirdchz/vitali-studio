import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { Service } from './utils/models.js';

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    await connectDB();

    // ── GET ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      const services = await Service.find({ active: true }).sort({ order: 1 });
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

      const data = JSON.parse(event.body);
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

      const data = JSON.parse(event.body);
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

      const data = event.body ? JSON.parse(event.body) : {};
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
