import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Send, Plus, History, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { walletAPI, transactionAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const wRes = await walletAPI.getByUser(user.userId);
      setWallet(wRes.data);
    } catch {
      try {
        const created = await walletAPI.create(user.userId);
        setWallet(created.data);
        toast.success('Wallet created with ₹500 bonus!');
      } catch {}
    }
    try {
      const tRes = await transactionAPI.getHistory(user.userId);
      setTxns(Array.isArray(tRes.data) ? tRes.data : []);
    } catch { setTxns([]); }
    setLoading(false);
  };

  const quickActions = [
    { label: 'Send Money', icon: Send, color: '#00b9f1', path: '/transfer' },
    { label: 'Add Money', icon: Plus, color: '#10b981', path: '/add-money' },
    { label: 'History', icon: History, color: '#f59e0b', path: '/transactions' },
  ];

  const balance = wallet?.walletBalance ?? 0;
  const sent = txns.filter(t => t.fromUserId === user.userId).reduce((s, t) => s + (t.amtToTransfer || 0), 0);
  const received = txns.filter(t => t.toUserId === user.userId).reduce((s, t) => s + (t.amtToTransfer || 0), 0);

  return (
    <motion.div variants={stagger} initial="initial" animate="animate">
      {/* Header */}
      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--text)' }}>
            Hey, {user?.userName?.split('_')[0] || 'there'} 👋
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>Here's your financial overview</p>
        </div>
        <motion.button whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }} onClick={fetchData}
          style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text2)' }}>
          <RefreshCw size={16} />
        </motion.button>
      </motion.div>

      {/* Wallet Card */}
      <motion.div variants={fadeUp}
        style={{ background: 'linear-gradient(135deg, #0070a8 0%, #00b9f1 50%, #00d4ff 100%)', borderRadius: 24, padding: '32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 3 + i, repeat: Infinity }}
            style={{ position: 'absolute', borderRadius: '50%', background: 'white', width: 200 + i * 100, height: 200 + i * 100, top: `${-30 + i * 10}%`, right: `${-10 + i * 5}%` }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Wallet size={20} color="rgba(255,255,255,0.8)" />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 500 }}>Total Balance</span>
          </div>
          {loading ? (
            <div style={{ height: 52, background: 'rgba(255,255,255,0.2)', borderRadius: 12, width: 200, marginBottom: 20, animation: 'pulse 1.5s infinite' }} />
          ) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, color: 'white', letterSpacing: '-1px', marginBottom: 4 }}>
                ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </motion.div>
          )}
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowUpRight size={14} color="rgba(255,255,255,0.7)" />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Sent: ₹{sent.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowDownLeft size={14} color="rgba(255,255,255,0.7)" />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Received: ₹{received.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
        {quickActions.map(({ label, icon: Icon, color, path }) => (
          <motion.div key={label} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate(path)} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 16px', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Icon size={20} color={color} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Transactions', value: txns.length, icon: TrendingUp, color: '#00b9f1' },
          { label: 'Wallet Status', value: wallet?.status || 'ACTIVE', icon: Wallet, color: '#10b981' },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div key={label} whileHover={{ y: -2 }}
            style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={15} color={color} />
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--text)' }}>{value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={fadeUp} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>Recent Transactions</h3>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/transactions')}
            style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            View all →
          </motion.button>
        </div>
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} style={{ height: 56, background: 'var(--dark2)', borderRadius: 12, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
          ))
        ) : txns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text2)' }}>
            <History size={32} style={{ marginBottom: 10, opacity: 0.4 }} />
            <p style={{ fontSize: 14 }}>No transactions yet</p>
            <p style={{ fontSize: 12, marginTop: 4, opacity: 0.6 }}>Make your first transfer!</p>
          </div>
        ) : (
          txns.slice(0, 5).map((tx, i) => {
            const isSent = tx.fromUserId === user.userId;
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: 12, marginBottom: 6, background: 'var(--dark2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: isSent ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isSent ? <ArrowUpRight size={16} color="var(--danger)" /> : <ArrowDownLeft size={16} color="var(--success)" />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{isSent ? `To User #${tx.toUserId}` : `From User #${tx.fromUserId}`}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>{tx.transactionDate || 'Recent'}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: isSent ? 'var(--danger)' : 'var(--success)' }}>
                  {isSent ? '-' : '+'}₹{(tx.amtToTransfer || 0).toLocaleString('en-IN')}
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </motion.div>
  );
}
