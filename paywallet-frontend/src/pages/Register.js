import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Wallet, ArrowRight, Loader } from 'lucide-react';
import { authAPI, walletAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ userId: '', userName: '', password: '', phoneNo: '', email: '', address: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.userName || !form.password || !form.phoneNo) { toast.error('Please fill required fields'); return; }
    setLoading(true);
    try {
      const payload = { ...form, userId: parseInt(form.userId), phoneNo: parseInt(form.phoneNo) };
      await authAPI.register(payload);
      try { await walletAPI.create(parseInt(form.userId)); } catch {}
      toast.success('Account created! Wallet set up with ₹500. Please login.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Registration failed';
      toast.error(typeof msg === 'string' ? msg : 'Registration failed');
    }
    setLoading(false);
  };

  const fields = [
    { label: 'User ID *', id: 'userId', type: 'number', placeholder: 'Choose a unique ID e.g. 101' },
    { label: 'Username *', id: 'userName', type: 'text', placeholder: 'e.g. john_doe' },
    { label: 'Phone Number *', id: 'phoneNo', type: 'number', placeholder: 'e.g. 9876543210' },
    { label: 'Email', id: 'email', type: 'email', placeholder: 'e.g. john@example.com' },
    { label: 'Address', id: 'address', type: 'text', placeholder: 'e.g. Mumbai, India' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)', padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 460, background: 'var(--card)', borderRadius: 24, padding: '40px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#00b9f1,#0070a8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'white' }}>PayWallet</span>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--text)', marginBottom: 6 }}>Create account</h2>
        <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 28 }}>Get ₹500 welcome bonus in your wallet</p>

        <form onSubmit={handleSubmit}>
          {fields.map(({ label, id, type, placeholder }) => (
            <div key={id} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text2)', marginBottom: 6 }}>{label}</label>
              <input type={type} placeholder={placeholder} value={form[id]}
                onChange={e => setForm(p => ({ ...p, [id]: e.target.value }))}
                style={{ width: '100%', padding: '11px 14px', background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 13, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
          ))}

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text2)', marginBottom: 6 }}>Password *</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} placeholder="Min 8 characters" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ width: '100%', padding: '11px 44px 11px 14px', background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 13, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', display: 'flex' }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ width: '100%', padding: '13px', background: loading ? 'var(--dark3)' : 'linear-gradient(135deg,#00b9f1,#0070a8)', border: 'none', borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-display)' }}>
            {loading ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Creating...</> : <><span>Create Account</span><ArrowRight size={15} /></>}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text2)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
