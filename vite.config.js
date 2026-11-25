import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function localNetlifyFunctions() {
  const devDbPath = path.resolve(process.cwd(), '.dev-db.json');
  const getDevDb = () => {
    try {
      if (fs.existsSync(devDbPath)) {
        return JSON.parse(fs.readFileSync(devDbPath, 'utf8'));
      }
    } catch {}
    return {
      settings: {
        fiverrUrl: 'https://www.fiverr.com',
        heroTitle: 'Montage Vidéo & Clipping IA Premium',
        heroSubtitle:
          'Transformez vos contenus longs en clips viraux optimisés pour TikTok, Reels & Shorts — propulsés par l’intelligence artificielle.',
        contactEmail: 'vitali.studio.contact@gmail.com',
        imagekitUrlEndpoint: '',
        imagekitPublicKey: '',
        imagekitPrivateKey: '',
      },
      realisations: [],
    };
  };

  const saveDevDb = (data) => {
    try {
      fs.writeFileSync(devDbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch {}
  };

  return {
    name: 'local-netlify-functions',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/.netlify/functions/')) {
          return next();
        }

        const endpoint = req.url.replace('/.netlify/functions/', '').split('?')[0];
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-code');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        // Lecture du corps JSON si présent
        let body = {};
        if (req.method === 'POST' || req.method === 'PUT') {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          try {
            body = JSON.parse(Buffer.concat(buffers).toString() || '{}');
          } catch {}
        }

        const db = getDevDb();

        // 1. Auth Check (accepte le mot de passe en local)
        if (endpoint === 'auth-check') {
          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              success: true,
              message: 'Connexion locale validée avec succès',
            })
          );
        }

        // 2. Settings (ImageKit, Fiverr, email)
        if (endpoint === 'settings') {
          if (req.method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify(db.settings));
          }
          if (req.method === 'POST' || req.method === 'PUT') {
            db.settings = { ...db.settings, ...body };
            saveDevDb(db);
            res.statusCode = 200;
            return res.end(JSON.stringify(db.settings));
          }
        }

        // 3. ImageKit Auth (génère la signature officielle)
        if (endpoint === 'imagekit-auth') {
          const privateKey =
            process.env.IMAGEKIT_PRIVATE_KEY || db.settings.imagekitPrivateKey;
          const publicKey =
            process.env.IMAGEKIT_PUBLIC_KEY || db.settings.imagekitPublicKey;
          const urlEndpoint =
            process.env.IMAGEKIT_URL_ENDPOINT || db.settings.imagekitUrlEndpoint;

          if (!privateKey || !publicKey) {
            res.statusCode = 400;
            return res.end(
              JSON.stringify({
                error:
                  'ImageKit n’est pas configuré. Veuillez renseigner vos clés dans l’onglet Paramètres.',
              })
            );
          }

          const token = crypto.randomUUID
            ? crypto.randomUUID()
            : crypto.randomBytes(16).toString('hex');
          const expire = Math.floor(Date.now() / 1000) + 1800;
          const signature = crypto
            .createHmac('sha1', privateKey)
            .update(token + expire)
            .digest('hex');

          res.statusCode = 200;
          return res.end(
            JSON.stringify({ token, expire, signature, publicKey, urlEndpoint })
          );
        }

        // 4. Réalisations (GET, POST, PUT, DELETE)
        if (endpoint === 'realisations') {
          if (req.method === 'GET') {
            const adminCode = req.headers['x-admin-code'];
            const isAdmin = Boolean(adminCode);
            const urlObj = new URL(req.url, 'http://localhost');
            const shareId = urlObj.searchParams.get('share') || urlObj.searchParams.get('id');

            let list = db.realisations || [];
            if (!isAdmin) {
              if (shareId) {
                list = list.filter((r) => r._id === shareId && r.visibility !== 'draft');
              } else {
                list = list.filter(
                  (r) =>
                    r.active !== false &&
                    (r.visibility === 'public' || !r.visibility)
                );
              }
            }
            res.statusCode = 200;
            return res.end(JSON.stringify(list));
          }
          if (req.method === 'POST') {
            const newItem = {
              _id: 'real_' + Date.now(),
              createdAt: new Date().toISOString(),
              ...body,
            };
            db.realisations = [newItem, ...(db.realisations || [])];
            saveDevDb(db);
            res.statusCode = 201;
            return res.end(JSON.stringify(newItem));
          }
          if (req.method === 'PUT') {
            const urlObj = new URL(req.url, 'http://localhost');
            const id = urlObj.searchParams.get('id') || body.id || body._id;
            db.realisations = (db.realisations || []).map((r) =>
              r._id === id ? { ...r, ...body } : r
            );
            saveDevDb(db);
            res.statusCode = 200;
            return res.end(JSON.stringify(body));
          }
          if (req.method === 'DELETE') {
            const urlObj = new URL(req.url, 'http://localhost');
            const id = urlObj.searchParams.get('id') || body.id;
            db.realisations = (db.realisations || []).filter((r) => r._id !== id);
            saveDevDb(db);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true }));
          }
        }

        // 5. Unread Counts
        if (endpoint === 'unread-counts') {
          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              total: 0,
              proposals: 0,
              messages: 0,
              testimonials: 0,
            })
          );
        }

        // Endpoint générique
        res.statusCode = 200;
        return res.end(JSON.stringify([]));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localNetlifyFunctions()],
});
