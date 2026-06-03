import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Key, Shield, Loader2, Camera } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Viewer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });

      const { accessToken, user } = response.data.data;
      login(accessToken, user);
      navigate('/profile'); // Redirect straight to profile to register reference selfie face matching!
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-dark-100 flex items-center justify-center relative overflow-hidden px-4">
      {/* Background radial glow */}
      <div className="absolute top-[-30%] right-[-20%] w-[70%] h-[70%] rounded-full bg-brand-500/5 blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl bg-glass-card shadow-glass-card border border-glass-border select-none"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 animate-pulse">
            <Camera size={24} />
          </div>
          <h2 className="text-2xl font-black text-white">Create Account</h2>
          <p className="text-dark-300 text-sm mt-1">Join EventSphere and link event highlights</p>
        </div>

        {/* Errors display */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-dark-300 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-5 w-5 text-dark-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-950 border border-glass-border text-white pl-11 pr-4 py-2.5 rounded-xl outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all font-medium"
                placeholder="Jay James"
              />
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-dark-300 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-5 w-5 text-dark-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-950 border border-glass-border text-white pl-11 pr-4 py-2.5 rounded-xl outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all font-medium"
                placeholder="you@society.com"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-dark-300 uppercase tracking-wider block">
              Security Password
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3 h-5 w-5 text-dark-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-950 border border-glass-border text-white pl-11 pr-4 py-2.5 rounded-xl outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Role selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-dark-300 uppercase tracking-wider block">
              Organization Role
            </label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-3.5 h-5 w-5 text-dark-400" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-dark-950 border border-glass-border text-white pl-11 pr-4 py-2.5 rounded-xl outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all font-medium cursor-pointer appearance-none"
              >
                <option value="Viewer">Viewer (Public gallery only)</option>
                <option value="ClubMember">Club Member (Access private albums)</option>
                <option value="Photographer">Photographer (Upload media & albums)</option>
              </select>
            </div>
          </div>

          {/* Submit register */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold tracking-wide flex items-center justify-center gap-2 shadow-glass-glow hover:shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Registering profile...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Redirection */}
        <div className="mt-6 text-center text-sm text-dark-300 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-bold ml-1">
            Sign In Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
