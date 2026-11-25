import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLockClosed, HiArrowRight, HiShieldCheck } from 'react-icons/hi2';
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
      const cleanCode = code.trim();
      const isLocal =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      try {
        const result = await adminLogin(cleanCode);
        if (result && result.success) {
          localStorage.setItem('vitali_admin_token', cleanCode);
          onLogin();
          return;
        } else if (result && result.error) {
          if (!isLocal) {
            setError(result.error);
            return;
          }
        }
      } catch (apiErr) {
        // En local, si le backend Netlify Functions n'est pas joignable, on valide l'accès local
        if (isLocal && cleanCode.length > 0) {
          localStorage.setItem('vitali_admin_token', cleanCode);
          onLogin();
          return;
        }
        throw apiErr;
      }

      // Si on est en local et qu'un code a été saisi
      if (isLocal && cleanCode.length > 0) {
        localStorage.setItem('vitali_admin_token', cleanCode);
        onLogin();
        return;
      }

      setError("Code d'accès incorrect");
    } catch (err) {
      setError(err.message || "Code d'accès incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0D12] text-[#D6DCE6] px-4 relative overflow-hidden">
      {/* Halo radial diffus en fond */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#8EAFFF]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#1A1F2B] border border-[#394150] p-8 sm:p-10 rounded-2xl max-w-md w-full shadow-2xl relative z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11151D] border border-[#394150] text-[11px] font-mono text-[#8EAFFF] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8EAFFF] animate-pulse" />
            <span>ESPACE ADMINISTRATION</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F6F8]">
            <span className="text-[#8EAFFF]">V</span>ITALI STUDIO
          </h1>
          <p className="text-[#B6C0D0] text-xs font-mono uppercase tracking-widest mt-1">
            Back-Office & Gestion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#D6DCE6] mb-2 font-medium">
              Code d'accès confidentiel
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717F9A] w-5 h-5" />
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-[#11151D] border border-[#394150] rounded-xl pl-12 pr-4 py-3.5 w-full text-sm text-[#F5F6F8] placeholder-[#717F9A] focus:border-[#8EAFFF] focus:outline-none transition font-mono"
                placeholder="Entrez votre mot de passe"
                required
                autoFocus
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-mono"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#8EAFFF]/15 transition active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#0B0D12] border-t-transparent animate-spin" />
            ) : (
              <>
                <span>Accéder au panel admin</span>
                <HiArrowRight className="w-4 h-4 text-[#0B0D12]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#394150] flex items-center justify-center gap-2 text-[11px] font-mono text-[#717F9A]">
          <HiShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Session chiffrée & protégée</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
