import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Key, Camera, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Button, Card, CardBody } from '@/design';
import { slideInUpVariants, fadeInVariants } from '@/design';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data.data;
      login(accessToken, user);
      navigate('/events');
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-dark-100 flex items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/20 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-30%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[100px]"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Brand & Header */}
          <motion.div
            variants={slideInUpVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
            className="text-center space-y-3"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/30 to-indigo-500/20 border border-brand-500/30 flex items-center justify-center mx-auto shadow-lg"
            >
              <Camera size={32} className="text-brand-400" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-black text-white">Welcome Back</h1>
              <p className="text-dark-300 text-sm mt-1">
                Sign in to access your events and media library
              </p>
            </div>
          </motion.div>

          {/* Main Card */}
          <Card variant="glass" padding="lg" className="border border-glass-border">
            <CardBody className="space-y-5">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/30 text-danger-400 text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <motion.div
                  variants={fadeInVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold text-dark-300 uppercase tracking-widest block">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400 group-focus-within:text-brand-400 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                      placeholder="you@society.com"
                    />
                  </div>
                </motion.div>

                {/* Password Input */}
                <motion.div
                  variants={fadeInVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold text-dark-300 uppercase tracking-widest block">
                    Password
                  </label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400 group-focus-within:text-brand-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 text-white pl-12 pr-12 py-3 rounded-xl outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-brand-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  variants={fadeInVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.4 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    rightIcon={loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                    disabled={loading}
                    className="font-bold tracking-wide"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </motion.div>
              </form>
            </CardBody>
          </Card>

          {/* Register CTA */}
          <motion.div
            variants={slideInUpVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.5 }}
            className="text-center space-y-3"
          >
            <div className="text-sm text-dark-300 font-medium">
              New to EventSphere?{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
                Create account
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-dark-700" />
              <span className="text-xs text-dark-500 font-medium">OR</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-dark-700" />
            </div>
            <Link to="/" className="inline-block text-sm text-dark-400 hover:text-dark-300 transition-colors">
              ← Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
