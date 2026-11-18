export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-code',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

export function verifyAuth(event) {
  const adminCode = event.headers['x-admin-code'];
  const expectedCode = process.env.ADMIN_ACCESS_CODE;

  if (!expectedCode) {
    return {
      authorized: false,
      response: {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server misconfiguration: ADMIN_ACCESS_CODE not set' }),
      },
    };
  }

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
