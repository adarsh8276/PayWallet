import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, History, RefreshCw, Search, Filter } from 'lucide-react';
import { transactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Transactions() {
  const { user } = useAuth();
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchTxns(); }, []);

  const fetchTxns = async () => {
    setLoading(true);
    try {
      const res = await transactionAPI.getHistory(user.userId);
      setTxns(Array.isArray(res.data) ? res.data : []);
    } catch {
      setTxns([]);
      toast.error('Could not load transactions. Make sure GET /transactions/user/{id} endpoint exists.');
    }
    setLoading(false);
  };

  const filtered = txns.filter(tx => {
    const matchSearch = search === '' || String(tx.fromUserId).includes(search) || String(tx.toUserId).includes(search);
    const isSent = tx.fromUserId === user.userId;
    if (filter === 'sent') return isSent && matchSearch;
    if (filter === 'received') return !isSent && matchSearch;
    return matchSearch;
  });

  const totalSent = txns.filter(t => t.fromUserId === user.userId).reduce((s, t) => s + (t.amtToTransfer || 0), 0);
  const totalReceived = txns.filter(t => t.toUserId === user.userId).reduce((s, t) => s + (t.amtToTransfer || 0), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--text)', marginBottom: 4 }}>Transactions</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>{txns.length} total transactions</p>
        </div>
        <motion.button whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }} onClick={fetchTxns}
          style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text2)' }}>
          <RefreshCw size={16} />
        </motion.button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Sent', value: `₹${totalSent.toLocaleString('en-IN')}`, color: 'var(--danger)', bg: 'rgba(239,68,68,0.08)' },
          { label: 'Total Received', value: `₹${totalReceived.toLocaleString('en-IN')}`, color: 'var(--success)', bg: 'rgba(16,185,129,0.08)' },
          { label: 'Net Flow', value: `₹${(totalReceived - totalSent).toLocaleString('en-IN')}`, color: totalReceived >= totalSent ? 'var(--success)' : 'var(--danger)', bg: 'var(--card)' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background: bg, border: '1px solid var(--border)', borderRadius: 16, padding: '18px' }}>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }} />
          <input placeholder="Search by user ID..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 34px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 13, outline: 'none' }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'sent', 'received'].map(f => (
            <motion.button key={f} whileTap={{ scale: 0.95 }} onClick={() => setFilter(f)}
              style={{ padding: '9px 16px', borderRadius: 10, border: filter === f ? '1px solid rgba(0,185,241,0.4)' : '1px solid var(--border)', background: filter === f ? 'rgba(0,185,241,0.1)' : 'var(--card)', color: filter === f ? 'var(--primary)' : 'var(--text2)', cursor: 'pointer', fontSize: 12, fontWeight: filter === f ? 600 : 400, textTransform: 'capitalize' }}>
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Transactions list */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--dark2)', animation: 'pulse 1.5s infinite' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, width: '40%', background: 'var(--dark2)', borderRadius: 6, marginBottom: 6, animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: 10, width: '25%', background: 'var(--dark2)', borderRadius: 6, animation: 'pulse 1.5s infinite' }} />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text2)' }}>
            <History size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 15, fontWeight: 500 }}>No transactions found</p>
            <p style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>
              {txns.length === 0 ? 'Make your first transfer to see it here' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          filtered.map((tx, i) => {
            const isSent = tx.fromUserId === user.userId;
            return (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
                whileHover={{ background: 'var(--dark2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: isSent ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isSent ? <ArrowUpRight size={20} color="var(--danger)" /> : <ArrowDownLeft size={20} color="var(--success)" />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                      {isSent ? `Sent to User #${tx.toUserId}` : `Received from User #${tx.fromUserId}`}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
                      {tx.transactionDate || tx.createdAt || 'Recent'} · {isSent ? 'Debit' : 'Credit'}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: isSent ? 'var(--danger)' : 'var(--success)' }}>
                    {isSent ? '-' : '+'}₹{(tx.amtToTransfer || 0).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 99, background: isSent ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: isSent ? 'var(--danger)' : 'var(--success)', fontSize: 10, fontWeight: 600 }}>
                      {tx.status || 'SUCCESS'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </motion.div>
  );
}
