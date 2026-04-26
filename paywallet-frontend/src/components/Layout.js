import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ArrowLeftRight, History, PlusCircle, LogOut, Wallet, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transfer', icon: ArrowLeftRight, label: 'Transfer' },
  { to: '/add-money', icon: PlusCircle, label: 'Add Money' },
  { to: '/transactions', icon: History, label: 'History' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          width: 240, minWidth: 240, background: 'var(--card)',
          borderRight: '1px solid var(--border)', display: 'flex',
          flexDirection: 'column', padding: '28px 0', position: 'sticky',
          top: 0, height: '100vh', zIndex: 100,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '0 24px 28px', borderBottom: '1px solid var(--border)' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#00b9f1,#0070a8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={20} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.5px' }}>PayWallet</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 1 }}>Digital Payments</div>
            </div>
          </motion.div>
        </div>

        {/* User info */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#00b9f1,#ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'white' }}>
              {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{user?.userName || 'User'}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>ID: #{user?.userId}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 14px', borderRadius: 12, marginBottom: 4,
                    background: isActive ? 'rgba(0,185,241,0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(0,185,241,0.2)' : '1px solid transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text2)',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 14, cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                >
                  <Icon size={17} />
                  {label}
                  {isActive && <motion.div layoutId="nav-indicator" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)', marginLeft: 'auto' }} />}
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0 12px' }}>
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, width: '100%', background: 'transparent', border: '1px solid transparent', color: 'var(--text2)', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={17} />
            Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', minHeight: '100vh' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '36px 40px', maxWidth: 1100, margin: '0 auto' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
