import { connectDB } from './utils/db.js';
import { headers } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    // Note: We intentionally verify the admin code without requiring an active DB connection
    // so the admin panel can be unlocked even before MongoDB is populated.
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const { code } = JSON.parse(event.body);
    const expectedCode = process.env.ADMIN_ACCESS_CODE;

    if (!expectedCode) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server misconfiguration: ADMIN_ACCESS_CODE not set' }),
      };
    }

    if (!code || code !== expectedCode) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid access code' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, token: code }),
    };
  } catch (error) {
    console.error('auth-check error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
