import crypto from 'crypto';
import { connectDB } from './utils/db.js';
import { verifyAuth, headers } from './utils/auth.js';
import { SiteSetting } from './utils/models.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Seul un administrateur authentifié peut demander un jeton de téléversement
  const auth = verifyAuth(event);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    await connectDB();
    const settings = await SiteSetting.findOne({ key: 'global' });

    const privateKey =
      process.env.IMAGEKIT_PRIVATE_KEY ||
      settings?.imagekitPrivateKey?.trim() ||
      'private_tBpBG2BN7oolMBnnRCht4XrdiEs=';
    const publicKey =
      process.env.IMAGEKIT_PUBLIC_KEY ||
      settings?.imagekitPublicKey?.trim() ||
      'public_Hz1WiYFUAQ0FFYMhwooiDoGWUSg=';
    const urlEndpoint =
      process.env.IMAGEKIT_URL_ENDPOINT ||
      settings?.imagekitUrlEndpoint?.trim() ||
      'https://ik.imagekit.io/qv6svz4aq';

    if (!privateKey || !publicKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error:
            'ImageKit n’est pas encore configuré. Renseignez votre Public Key et Private Key dans l’onglet « Paramètres » du panel admin.',
        }),
      };
    }

    const token = crypto.randomUUID
      ? crypto.randomUUID()
      : crypto.randomBytes(16).toString('hex');
    const expire = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutes de validité

    // Signature officielle ImageKit : HMAC-SHA1(token + expire, privateKey)
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token,
        expire,
        signature,
        publicKey,
        urlEndpoint,
      }),
    };
  } catch (error) {
    console.error('imagekit-auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Erreur interne' }),
    };
  }
};
