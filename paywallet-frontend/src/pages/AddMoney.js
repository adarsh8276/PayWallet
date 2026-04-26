import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard, Loader, CheckCircle, IndianRupee } from 'lucide-react';
import { walletAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const presets = [500, 1000, 2000, 5000];

export default function AddMoney() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [method, setMethod] = useState('upi');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) { toast.error('Enter a valid amount'); return; }
    setLoading(true);
    try {
      await walletAPI.addMoney({ userId: user.userId, amt: parseFloat(amount) });
      setSuccess(true);
      toast.success(`₹${amount} added to your wallet!`);
      setTimeout(() => { setSuccess(false); setAmount(''); }, 3000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to add money';
      toast.error(typeof msg === 'string' ? msg : 'Add money endpoint not yet implemented in backend');
    }
    setLoading(false);
  };

  const methods = [
    { id: 'upi', label: 'UPI', icon: '⚡' },
    { id: 'card', label: 'Card', icon: '💳' },
    { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 500, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--text)', marginBottom: 6 }}>Add Money</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Top up your PayWallet balance</p>
      </div>

      {success ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ background: 'var(--card)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 24, padding: '48px', textAlign: 'center' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={40} color="var(--success)" />
            </div>
          </motion.div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--text)', marginBottom: 8 }}>Money Added!</h3>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: 'var(--success)' }}>+₹{parseFloat(amount).toLocaleString('en-IN')}</div>
        </motion.div>
      ) : (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 24, padding: '32px' }}>
          {/* Payment method */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {methods.map(m => (
                <motion.button key={m.id} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setMethod(m.id)}
                  style={{ padding: '12px 8px', background: method === m.id ? 'rgba(0,185,241,0.12)' : 'var(--dark2)', border: method === m.id ? '1px solid rgba(0,185,241,0.4)' : '1px solid var(--border)', borderRadius: 12, color: method === m.id ? 'var(--primary)' : 'var(--text2)', cursor: 'pointer', fontSize: 13, fontWeight: method === m.id ? 600 : 400, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  {m.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Amount presets */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Amount</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {presets.map(p => (
                <motion.button key={p} type="button" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setAmount(String(p))}
                  style={{ padding: '12px 8px', background: amount === String(p) ? 'rgba(0,185,241,0.12)' : 'var(--dark2)', border: amount === String(p) ? '1px solid rgba(0,185,241,0.4)' : '1px solid var(--border)', borderRadius: 12, color: amount === String(p) ? 'var(--primary)' : 'var(--text2)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  ₹{p.toLocaleString('en-IN')}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <form onSubmit={handleAdd}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Custom Amount</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }}><IndianRupee size={16} /></div>
                <input type="number" placeholder="Enter amount" value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{ width: '100%', padding: '14px 16px 14px 40px', background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            </div>

            <div style={{ background: 'var(--dark2)', borderRadius: 12, padding: '14px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text2)' }}>Adding to wallet</span>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>ID #{user?.userId}</span>
            </div>

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ width: '100%', padding: '15px', background: loading ? 'var(--dark3)' : 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: 14, color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'var(--font-display)' }}>
              {loading ? <><Loader size={17} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><Plus size={17} /> Add ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : '0'}</>}
            </motion.button>
          </form>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
