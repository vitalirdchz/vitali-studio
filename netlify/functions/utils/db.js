import mongoose from 'mongoose';

let cached = global.__mongooseConnection;

if (!cached) {
  cached = global.__mongooseConnection = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const rawUri = process.env.MONGODB_URI;

    if (!rawUri) {
      throw new Error('La variable d’environnement MONGODB_URI n’est pas configurée sur Netlify.');
    }

    const uri = rawUri.toString().trim().replace(/^["']|["']$/g, '');

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
      })
      .then((m) => {
        cached.conn = m;
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        console.error('Erreur de connexion MongoDB:', err.message);
        throw new Error(`Échec de connexion MongoDB: ${err.message}`);
      });
  }

  await cached.promise;
  return cached.conn;
}
