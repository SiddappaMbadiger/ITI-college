import React, { useState } from 'react';
import { api } from '../services/api';
import { ShieldCheck, Lock, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.adminLogin(password);
      if (res.success) {
        setPassword('');
        onLoginSuccess();
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('System login error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-sm w-full shadow-2xl border border-slate-200 text-left relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#0f2b48] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-sm font-bold font-institutional">
                Developer & Admin Controller
              </h3>
              <p className="text-[10px] text-sky-200">
                Government ITI College, Jewargi · Database & Operations Console
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="text-xs text-slate-600">
            Sign in to access live Supabase database records, manage, edit, approve, or cancel student appointments.
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
              Administrative Key / Password:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0f2b48] bg-white font-mono"
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-between">
              <span>Admin key: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">iti@jewargi2026</code></span>
              <button
                type="button"
                onClick={() => setPassword('iti@jewargi2026')}
                className="text-sky-700 hover:underline cursor-pointer font-medium"
              >
                Auto-fill
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Developer Access Button */}
          <button
            type="button"
            onClick={async () => {
              setPassword('iti@jewargi2026');
              setLoading(true);
              try {
                const res = await api.adminLogin('iti@jewargi2026');
                if (res.success) {
                  onLoginSuccess();
                }
              } finally {
                setLoading(false);
              }
            }}
            className="w-full py-2 px-3 text-xs bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-300 rounded-md font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Developer / Controller 1-Click Access</span>
          </button>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0f2b48] hover:bg-[#153e68] rounded-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
