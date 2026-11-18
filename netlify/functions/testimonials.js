import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { Testimonial } from './utils/models.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    await connectDB();

    // ── GET ────────────────────────────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      const testimonials = await Testimonial.find({ active: true }).sort({ createdAt: -1 });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(testimonials),
      };
    }

    // ── POST ───────────────────────────────────────────────────────────────
    if (event.httpMethod === 'POST') {
      const auth = verifyAuth(event);
      if (!auth.authorized) return auth.response;

      const data = JSON.parse(event.body);
      const testimonial = await Testimonial.create(data);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(testimonial),
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
          body: JSON.stringify({ error: 'Missing testimonial id' }),
        };
      }

      const testimonial = await Testimonial.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!testimonial) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Testimonial not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(testimonial),
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
          body: JSON.stringify({ error: 'Missing testimonial id' }),
        };
      }

      const testimonial = await Testimonial.findByIdAndDelete(id);

      if (!testimonial) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Testimonial not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Testimonial deleted', id }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('testimonials error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
