import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowRight, Loader, CheckCircle, User, IndianRupee } from 'lucide-react';
import { transactionAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Transfer() {
  const { user } = useAuth();
  const [form, setForm] = useState({ toUserId: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [toUser, setToUser] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);

  const lookupUser = async () => {
    if (!form.toUserId) return;
    setLookingUp(true);
    try {
      const res = await userAPI.getById(parseInt(form.toUserId));
      setToUser(res.data);
    } catch { setToUser(null); toast.error('User not found'); }
    setLookingUp(false);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!form.toUserId || !form.amount) { toast.error('Fill in all fields'); return; }
    if (parseInt(form.toUserId) === user.userId) { toast.error("Can't transfer to yourself"); return; }
    if (parseFloat(form.amount) <= 0) { toast.error('Amount must be greater than 0'); return; }
    setLoading(true);
    try {
      const res = await transactionAPI.transfer({ fromUserId: user.userId, toUserId: parseInt(form.toUserId), amtToTransfer: parseFloat(form.amount) });
      setSuccess({ amount: form.amount, toUserId: form.toUserId, toUser });
      setForm({ toUserId: '', amount: '' });
      setToUser(null);
      toast.success('Transfer successful! Email notification sent.');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Transfer failed';
      toast.error(typeof msg === 'string' ? msg : 'Transfer failed. Check balance.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: 440, margin: '60px auto', textAlign: 'center' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 24, padding: '48px 32px' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={40} color="var(--success)" />
            </div>
          </motion.div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 8 }}>Transfer Successful!</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>Your money is on its way</p>
          <div style={{ background: 'var(--dark2)', borderRadius: 16, padding: '20px', marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: 'var(--success)', marginBottom: 8 }}>₹{parseFloat(success.amount).toLocaleString('en-IN')}</div>
            <div style={{ color: 'var(--text2)', fontSize: 13 }}>Sent to {success.toUser?.userName || `User #${success.toUserId}`}</div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSuccess(null)}
            style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#00b9f1,#0070a8)', border: 'none', borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
            Make Another Transfer
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 500, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--text)', marginBottom: 6 }}>Send Money</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Transfer funds instantly to any PayWallet user</p>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 24, padding: '32px' }}>
        {/* From card */}
        <div style={{ background: 'var(--dark2)', borderRadius: 16, padding: '16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#00b9f1,#ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'white' }}>
            {user?.userName?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{user?.userName}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>From (You) · ID #{user?.userId}</div>
          </div>
          <div style={{ marginLeft: 'auto', color: 'var(--primary)' }}><Send size={18} /></div>
        </div>

        <form onSubmit={handleTransfer}>
          {/* To User */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recipient User ID</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" placeholder="Enter user ID" value={form.toUserId}
                onChange={e => { setForm(p => ({ ...p, toUserId: e.target.value })); setToUser(null); }}
                style={{ flex: 1, padding: '12px 16px', background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 14, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; if (form.toUserId) lookupUser(); }} />
              <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={lookupUser} disabled={lookingUp}
                style={{ padding: '12px 16px', background: 'rgba(0,185,241,0.1)', border: '1px solid rgba(0,185,241,0.2)', borderRadius: 12, color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {lookingUp ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <User size={16} />}
              </motion.button>
            </div>
            {toUser && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={14} color="var(--success)" />
                <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 500 }}>{toUser.userName} found</span>
                <span style={{ fontSize: 12, color: 'var(--text2)', marginLeft: 'auto' }}>{toUser.email}</span>
              </motion.div>
            )}
          </div>

          {/* Amount */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }}>
                <IndianRupee size={16} />
              </div>
              <input type="number" placeholder="0.00" value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                style={{ width: '100%', padding: '14px 16px 14px 40px', background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {[100, 500, 1000, 2000].map(amt => (
                <motion.button key={amt} type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setForm(p => ({ ...p, amount: String(amt) }))}
                  style={{ padding: '5px 12px', background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text2)', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                  +₹{amt}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ width: '100%', padding: '15px', background: loading ? 'var(--dark3)' : 'linear-gradient(135deg,#00b9f1,#0070a8)', border: 'none', borderRadius: 14, color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'var(--font-display)' }}>
            {loading ? <><Loader size={17} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><Send size={17} /> Send ₹{form.amount || '0'}</>}
          </motion.button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
