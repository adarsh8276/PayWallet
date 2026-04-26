import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Wallet, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI, walletAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ userId: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await userAPI.getById(parseInt(form.userId));
      const userData = res.data;
      if (userData.password !== form.password) { toast.error('Invalid credentials'); setLoading(false); return; }
      const fakeToken = btoa(JSON.stringify({ userId: userData.userId, userName: userData.userName, exp: Date.now() + 86400000 }));
      login(userData, fakeToken);
      toast.success(`Welcome back, ${userData.userName}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'User not found. Please check your ID.';
      toast.error(typeof msg === 'string' ? msg : 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--dark)' }}>
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ flex: 1, background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #061018 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }}
      >
        {/* Animated bg circles */}
        {[...Array(3)].map((_, i) => (
          <motion.div key={i}
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 4 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', borderRadius: '50%', background: 'var(--primary)', width: 300 + i * 150, height: 300 + i * 150, top: `${-20 + i * 15}%`, left: `${-10 + i * 5}%`, filter: 'blur(60px)' }}
          />
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#00b9f1,#0070a8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={24} color="white" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'white' }}>PayWallet</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, lineHeight: 1.1, color: 'white', marginBottom: 20 }}>
              Fast. Secure.<br /><span style={{ color: 'var(--primary)' }}>Digital.</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 380 }}>
              Send money instantly, manage your wallet, and track every transaction — all in one place.
            </p>
            {['Instant transfers', 'Real-time notifications', 'Secure & encrypted'].map((feat, i) => (
              <motion.div key={feat} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                <span style={{ fontSize: 14, color: 'var(--text2)' }}>{feat}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--dark2)' }}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--text)', marginBottom: 8 }}>Welcome back</h2>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 32 }}>Sign in to your PayWallet account</p>

            <form onSubmit={handleSubmit}>
              {[
                { label: 'User ID', id: 'userId', type: 'number', placeholder: 'Enter your user ID' },
              ].map(({ label, id, type, placeholder }) => (
                <div key={id} style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text2)', marginBottom: 8 }}>{label}</label>
                  <input
                    type={type} placeholder={placeholder} value={form[id]}
                    onChange={e => setForm(p => ({ ...p, [id]: e.target.value }))}
                    style={{ width: '100%', padding: '13px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text2)', marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    style={{ width: '100%', padding: '13px 48px 13px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', display: 'flex' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '14px', background: loading ? 'var(--dark3)' : 'linear-gradient(135deg,#00b9f1,#0070a8)', border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-display)' }}>
                {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : <><span>Sign In</span><ArrowRight size={16} /></>}
              </motion.button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text2)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
