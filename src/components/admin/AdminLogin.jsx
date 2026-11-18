import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLockClosed } from 'react-icons/hi2';
import { adminLogin } from '../../utils/api';

const AdminLogin = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await adminLogin(code);
      if (result.success) {
        localStorage.setItem('vitali_admin_token', code);
        onLogin();
      } else {
        setError("Code d'accès incorrect");
      }
    } catch (err) {
      setError("Code d'accès incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass p-8 rounded-2xl max-w-md w-full mx-4"
      >
        <div className="text-center mb-2">
          <h1 className="font-display text-2xl font-bold">
            <span className="gradient-text">V</span>ITALI STUDIO
          </h1>
        </div>
        <p className="text-gray-400 text-center mb-8">
          Panneau d&apos;Administration
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Code d&apos;accès
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-dark-600 border border-white/10 rounded-xl pl-11 pr-4 py-3 w-full text-white focus:border-accent-rose focus:outline-none transition-colors"
                placeholder="Entrez votre code"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ x: -10 }}
              animate={{ x: [-10, 10, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className="text-red-400 text-sm mb-4 text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
