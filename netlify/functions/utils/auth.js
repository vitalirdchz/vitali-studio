export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-code',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

export function verifyAuth(event) {
  const adminCode = (event.headers['x-admin-code'] || '').toString().trim().replace(/^["']|["']$/g, '');
  const rawExpected = process.env.ADMIN_ACCESS_CODE;

  if (!rawExpected) {
    return {
      authorized: false,
      response: {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server misconfiguration: ADMIN_ACCESS_CODE not set on Netlify' }),
      },
    };
  }

  const expectedCode = rawExpected.toString().trim().replace(/^["']|["']$/g, '');

  if (!adminCode || adminCode !== expectedCode) {
    return {
      authorized: false,
      response: {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized: invalid or missing admin code' }),
      },
    };
  }

  return { authorized: true };
}
