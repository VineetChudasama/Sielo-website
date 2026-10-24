import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Download,
  Eye,
  Activity,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle,
  Smartphone,
  Globe,
  Radio,
  Lock,
  ExternalLink,
  Shield,
  Music,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  KeyRound,
  Trash2,
  Info
} from 'lucide-react';
import { getStoredAnalytics, resetAnalyticsData, fetchLiveAnalytics } from '../../utils/analyticsTracker';
import { getAdminUser, adminLogout, changeAdminCredentials } from '../../utils/adminAuth';
import { INITIAL_APP_USERS, fetchLiveAppUsers, saveLocalUser, deleteLocalUser, getStoredLocalUsers } from '../../data/appUsersData';

function UserAvatar({ user, size = 52, borderRadius = '16px' }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initial = (user.name || user.email || 'U').trim().charAt(0).toUpperCase();

  if (user.avatar && !imgFailed) {
    return (
      <img
        src={user.avatar}
        alt={user.name || 'User'}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius,
          objectFit: 'cover',
          border: '2px solid rgba(212, 175, 55, 0.35)',
          flexShrink: 0
        }}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius,
        background: 'linear-gradient(135deg, rgba(229, 195, 101, 0.25) 0%, rgba(212, 175, 55, 0.1) 100%)',
        border: '2px solid rgba(212, 175, 55, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#E5C365',
        fontWeight: 700,
        fontSize: `${Math.round(size * 0.42)}px`,
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
      }}
      title={user.name || user.email}
    >
      {initial}
    </div>
  );
}

export default function AdminDashboard({ onLogout, onBackToSite }) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'users' | 'events' | 'settings'
  const [analytics, setAnalytics] = useState(() => getStoredAnalytics());
  const [appUsers, setAppUsers] = useState(() => getStoredLocalUsers());
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [userFilter, setUserFilter] = useState('all'); // 'all' | 'google' | 'email' | 'active'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState('');
  const [newUserStreams, setNewUserStreams] = useState('');
  const [newUserLiked, setNewUserLiked] = useState('');
  const [newUserProvider, setNewUserProvider] = useState('Google');
  const [newUserArtists, setNewUserArtists] = useState('');

  const handleDeleteUser = (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to remove the record for ${userEmail}?`)) {
      const remaining = deleteLocalUser(userId || userEmail);
      setAppUsers(remaining);
    }
  };

  const handleManualAddUser = async (e) => {
    e.preventDefault();
    if (!newUserEmail.trim()) return;

    const userObj = {
      id: 'usr_' + Date.now(),
      name: newUserName.trim() || newUserEmail.split('@')[0],
      email: newUserEmail.trim().toLowerCase(),
      avatar: newUserAvatar.trim() || null,
      provider: newUserProvider,
      createdAt: Date.now(),
      lastSyncedAt: Date.now(),
      favoriteArtists: newUserArtists ? newUserArtists.split(',').map(a => a.trim()).filter(Boolean) : ['The Weeknd'],
      streamCount: parseInt(newUserStreams, 10) >= 0 ? parseInt(newUserStreams, 10) : 0,
      likedCount: parseInt(newUserLiked, 10) >= 0 ? parseInt(newUserLiked, 10) : 0,
      status: 'Active Now',
      appVersion: '11.5.5',
      device: 'Android'
    };

    saveLocalUser(userObj);
    setAppUsers(prev => [userObj, ...prev.filter(u => u.email !== userObj.email)]);
    setShowAddUserForm(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserAvatar('');
    setNewUserStreams('');
    setNewUserLiked('');
    setNewUserArtists('');

    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userObj)
      });
    } catch {}
  };

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [passMessage, setPassMessage] = useState({ text: '', isError: false });
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const adminName = getAdminUser();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [liveUsers, liveStats] = await Promise.all([
        fetchLiveAppUsers(),
        fetchLiveAnalytics()
      ]);
      if (liveUsers && Array.isArray(liveUsers)) {
        setAppUsers(liveUsers);
      }
      if (liveStats) {
        setAnalytics(liveStats);
      }
    } catch (e) {
      console.warn('Refresh error:', e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoadingUsers(true);

    const refreshAll = async () => {
      try {
        const [liveUsers, liveStats] = await Promise.all([
          fetchLiveAppUsers(),
          fetchLiveAnalytics()
        ]);
        if (isMounted) {
          if (liveUsers && Array.isArray(liveUsers)) setAppUsers(liveUsers);
          if (liveStats) setAnalytics(liveStats);
          setIsLoadingUsers(false);
        }
      } catch (_) {
        if (isMounted) setIsLoadingUsers(false);
      }
    };

    refreshAll();

    // 30-second live tracking auto-update loop
    const liveTrackingInterval = setInterval(refreshAll, 30000);
    return () => {
      isMounted = false;
      clearInterval(liveTrackingInterval);
    };
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (isUpdatingPass) return;
    setIsUpdatingPass(true);
    setPassMessage({ text: '', isError: false });

    try {
      await changeAdminCredentials(currentPass, newPass, newUsername || adminName);
      setPassMessage({ text: 'Admin credentials successfully updated and securely re-hashed.', isError: false });
      setCurrentPass('');
      setNewPass('');
      setNewUsername('');
    } catch (err) {
      setPassMessage({ text: err.message || 'Failed to update password.', isError: true });
    } finally {
      setIsUpdatingPass(false);
    }
  };

  // Filter app users
  const filteredUsers = appUsers.filter(u => {
    if (!u) return false;
    const nameStr = (u.name || '').toLowerCase();
    const emailStr = (u.email || '').toLowerCase();
    const userHandleStr = (u.username || '').toLowerCase();
    const q = (searchUserQuery || '').toLowerCase().trim();

    const matchesSearch = !q ||
      nameStr.includes(q) ||
      emailStr.includes(q) ||
      userHandleStr.includes(q) ||
      (Array.isArray(u.favoriteArtists) && u.favoriteArtists.some(a => (a || '').toLowerCase().includes(q)));

    if (!matchesSearch) return false;
    const providerStr = (u.provider || '').toLowerCase();
    if (userFilter === 'google') return providerStr.includes('google');
    if (userFilter === 'email') return providerStr.includes('email') || providerStr.includes('password');
    if (userFilter === 'active') {
      const lastActive = u.lastHeartbeat || u.lastSyncedAt || 0;
      return (Date.now() - lastActive) < 90000;
    }
    return true;
  });

  const conversionRate = analytics.totalVisitors > 0
    ? ((analytics.totalDownloads / analytics.totalVisitors) * 100).toFixed(1)
    : '0.0';

  const maxVisitorsInDaily = Math.max(...(analytics.dailyHistory?.map(d => d.visitors) || [1]), 1);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#070B12',
        color: '#F4F1DE',
        fontFamily: 'var(--font-body)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(13, 27, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 196, 168, 0.15)',
          padding: '16px clamp(16px, 4vw, 36px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #E5C365 0%, #D4AF37 100%)',
              color: '#070B12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(212, 175, 55, 0.25)'
            }}
          >
            <Shield size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: '#F4F1DE' }}>
                Sielo Command Center
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(119, 141, 122, 0.2)',
                  color: '#90BE6D',
                  border: '1px solid rgba(119, 141, 122, 0.4)'
                }}
              >
                LIVE VAULT
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(212, 196, 168, 0.65)' }}>
              Logged in as <strong style={{ color: '#D4AF37' }}>{adminName}</strong> • Authenticated Session
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'rgba(144, 190, 109, 0.12)',
              border: '1px solid rgba(144, 190, 109, 0.3)',
              color: '#90BE6D',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
            title="User directory and telemetry refresh every 30 seconds"
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#90BE6D',
                boxShadow: '0 0 8px #90BE6D',
                display: 'inline-block'
              }}
            />
            <span>LIVE 30s</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(212, 196, 168, 0.2)',
              borderRadius: '10px',
              padding: '8px 14px',
              color: 'rgba(244, 241, 222, 0.85)',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={onBackToSite}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(212, 196, 168, 0.2)',
              borderRadius: '10px',
              padding: '8px 14px',
              color: 'rgba(244, 241, 222, 0.85)',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ExternalLink size={14} />
            <span>View Site</span>
          </button>

          <button
            onClick={onLogout}
            style={{
              background: 'rgba(230, 57, 70, 0.15)',
              border: '1px solid rgba(230, 57, 70, 0.35)',
              borderRadius: '10px',
              padding: '8px 14px',
              color: '#FFB4B4',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={14} />
            <span>Lock & Exit</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: 'clamp(20px, 4vw, 36px)', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Top 4 KPI Cards */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
            marginBottom: '32px'
          }}
        >
          {/* Card 1: Total Visitors */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(27, 38, 59, 0.6) 0%, rgba(13, 27, 42, 0.85) 100%)',
              border: '1px solid rgba(212, 196, 168, 0.18)',
              borderRadius: '20px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(212, 196, 168, 0.75)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total Website Visitors
              </span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye size={18} color="#D4AF37" />
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F4F1DE', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {analytics.totalVisitors.toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.8rem', color: '#90BE6D' }}>
              <TrendingUp size={14} />
              <span>{analytics.totalPageViews.toLocaleString()} total page views</span>
            </div>
          </div>

          {/* Card 2: Total APK Downloads */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(27, 38, 59, 0.6) 0%, rgba(13, 27, 42, 0.85) 100%)',
              border: '1px solid rgba(212, 196, 168, 0.18)',
              borderRadius: '20px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(212, 196, 168, 0.75)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                APK Downloaders
              </span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(119, 141, 122, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Download size={18} color="#778D7A" />
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F4F1DE', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {analytics.totalDownloads.toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.8rem', color: '#D4AF37' }}>
              <ArrowUpRight size={14} />
              <span>{conversionRate}% conversion rate</span>
            </div>
          </div>

          {/* Card 3: App Registered Users */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(27, 38, 59, 0.6) 0%, rgba(13, 27, 42, 0.85) 100%)',
              border: '1px solid rgba(212, 196, 168, 0.18)',
              borderRadius: '20px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(212, 196, 168, 0.75)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Registered App Users
              </span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(65, 90, 119, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} color="#415A77" />
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F4F1DE', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {appUsers.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.8rem', color: '#90BE6D' }}>
              <CheckCircle size={14} />
              <span>Cloud Firestore Synced</span>
            </div>
          </div>

          {/* Card 4: Current Active Status */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(27, 38, 59, 0.6) 0%, rgba(13, 27, 42, 0.85) 100%)',
              border: '1px solid rgba(212, 196, 168, 0.18)',
              borderRadius: '20px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(212, 196, 168, 0.75)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Active Listeners
              </span>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(230, 57, 70, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={18} color="#E63946" />
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F4F1DE', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {appUsers.filter(u => {
                const last = u.lastHeartbeat || u.lastSyncedAt || 0;
                return (Date.now() - last < 90000) && (u.isPlaying || u.status === 'Listening Now');
              }).length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.8rem', color: '#D4AF37' }}>
              <Radio size={14} />
              <span>
                {(() => {
                  const activeCount = appUsers.filter(u => {
                    const last = u.lastHeartbeat || u.lastSyncedAt || 0;
                    return (Date.now() - last < 90000) && (u.isPlaying || u.status === 'Listening Now');
                  }).length;
                  return activeCount > 0 ? `${activeCount} actively streaming songs` : '0 listeners streaming right now';
                })()}
              </span>
            </div>
          </div>
        </section>

        {/* Tab Controls */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid rgba(212, 196, 168, 0.15)',
            marginBottom: '28px',
            paddingBottom: '2px',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'analytics', label: 'Website & Download Analytics', icon: <TrendingUp size={16} /> },
            { id: 'users', label: `App Users Directory (${appUsers.length})`, icon: <Users size={16} /> },
            { id: 'events', label: 'Live Activity Stream', icon: <Clock size={16} /> },
            { id: 'settings', label: 'Admin Security & Vault', icon: <KeyRound size={16} /> }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                  padding: '12px 18px',
                  color: isActive ? '#D4AF37' : 'rgba(244, 241, 222, 0.7)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  borderRadius: '8px 8px 0 0',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: WEBSITE & DOWNLOAD ANALYTICS */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* 14-Day Visual Trend Chart */}
            <div
              style={{
                background: 'rgba(13, 27, 42, 0.7)',
                border: '1px solid rgba(212, 196, 168, 0.18)',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#F4F1DE' }}>
                    14-Day Traffic & APK Downloads Flow
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'rgba(212, 196, 168, 0.65)' }}>
                    Daily unique visitor sessions versus completed APK downloads
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#D4AF37' }} />
                    <span>Visitors</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#778D7A' }} />
                    <span>Downloads</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart Columns */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${analytics.dailyHistory?.length || 14}, 1fr)`,
                  gap: 'clamp(6px, 1.2vw, 16px)',
                  alignItems: 'flex-end',
                  minHeight: '220px',
                  paddingTop: '20px',
                  borderBottom: '1px solid rgba(212, 196, 168, 0.15)'
                }}
              >
                {analytics.dailyHistory?.map((day, idx) => {
                  const visitorHeight = day.visitors > 0 ? Math.max(Math.round((day.visitors / maxVisitorsInDaily) * 160), 12) : 2;
                  const downloadHeight = day.downloads > 0 ? Math.max(Math.round((day.downloads / maxVisitorsInDaily) * 160), 6) : 2;
                  return (
                    <div
                      key={day.date || idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: 'rgba(212, 196, 168, 0.6)', fontWeight: 600 }}>
                        {day.downloads}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', width: '100%', justifyContent: 'center' }}>
                        {/* Visitors bar */}
                        <div
                          title={`${day.label}: ${day.visitors} visitors`}
                          style={{
                            width: '45%',
                            maxWidth: '16px',
                            height: `${visitorHeight}px`,
                            background: 'linear-gradient(to top, rgba(212, 175, 55, 0.5), #D4AF37)',
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.4s ease'
                          }}
                        />
                        {/* Downloads bar */}
                        <div
                          title={`${day.label}: ${day.downloads} downloads`}
                          style={{
                            width: '45%',
                            maxWidth: '16px',
                            height: `${downloadHeight}px`,
                            background: 'linear-gradient(to top, rgba(119, 141, 122, 0.5), #778D7A)',
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.4s ease'
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          color: 'rgba(244, 241, 222, 0.5)',
                          marginTop: '6px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {day.label.split(',')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Telemetry Breakdown: Devices, Browsers & Referrers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {/* Devices */}
              <div
                style={{
                  background: 'rgba(13, 27, 42, 0.7)',
                  border: '1px solid rgba(212, 196, 168, 0.18)',
                  borderRadius: '20px',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                  <Smartphone size={18} color="#D4AF37" />
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#F4F1DE' }}>Visitor Operating Systems</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(analytics.devices || {}).map(([dev, count]) => {
                    const pct = analytics.totalVisitors > 0 ? Math.round((count / analytics.totalVisitors) * 100) : 0;
                    return (
                      <div key={dev}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                          <span style={{ textTransform: 'capitalize', color: 'rgba(244, 241, 222, 0.85)' }}>{dev}</span>
                          <span style={{ color: '#D4AF37', fontWeight: 600 }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: '#D4AF37', borderRadius: '3px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Referrers */}
              <div
                style={{
                  background: 'rgba(13, 27, 42, 0.7)',
                  border: '1px solid rgba(212, 196, 168, 0.18)',
                  borderRadius: '20px',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                  <Globe size={18} color="#778D7A" />
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#F4F1DE' }}>Traffic Acquisition Sources</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(analytics.referrers || {}).map(([ref, count]) => {
                    const pct = analytics.totalVisitors > 0 ? Math.round((count / analytics.totalVisitors) * 100) : 0;
                    return (
                      <div key={ref}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                          <span style={{ textTransform: 'capitalize', color: 'rgba(244, 241, 222, 0.85)' }}>{ref}</span>
                          <span style={{ color: '#778D7A', fontWeight: 600 }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: '#778D7A', borderRadius: '3px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APP USERS & DIRECTORY */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Search and Filters Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                background: 'rgba(13, 27, 42, 0.7)',
                border: '1px solid rgba(212, 196, 168, 0.18)',
                borderRadius: '18px',
                padding: '16px 20px'
              }}
            >
              {/* Search Box */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                <Search size={16} color="rgba(212, 196, 168, 0.5)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  placeholder="Search app users by name, email, artist..."
                  style={{
                    width: '100%',
                    background: 'rgba(7, 11, 18, 0.7)',
                    border: '1px solid rgba(212, 196, 168, 0.2)',
                    borderRadius: '12px',
                    padding: '10px 14px 10px 40px',
                    color: '#F4F1DE',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={() => setShowAddUserForm(!showAddUserForm)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid #D4AF37',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    color: '#D4AF37',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <UserPlus size={14} />
                  <span>+ Add App Account</span>
                </button>
                {[
                  { id: 'all', label: `All Users (${appUsers.length})` },
                  { id: 'google', label: 'Google Auth' },
                  { id: 'email', label: 'Email Accounts' },
                  { id: 'active', label: 'Active Recently' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setUserFilter(f.id)}
                    style={{
                      background: userFilter === f.id ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: userFilter === f.id ? '1px solid #D4AF37' : '1px solid rgba(212, 196, 168, 0.15)',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      color: userFilter === f.id ? '#D4AF37' : 'rgba(244, 241, 222, 0.75)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {showAddUserForm && (
              <form
                onSubmit={handleManualAddUser}
                style={{
                  background: 'rgba(13, 27, 42, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, color: '#F4F1DE', fontSize: '0.94rem' }}>
                    Register Existing Sielo Account
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'rgba(212, 196, 168, 0.6)' }}>
                    Add real account details from your phone
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Account Name (e.g. Harsh Vardhan)"
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    style={{
                      background: 'rgba(7, 11, 18, 0.7)',
                      border: '1px solid rgba(212, 196, 168, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F4F1DE',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Account Email (e.g. harsh@gmail.com)"
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                    style={{
                      background: 'rgba(7, 11, 18, 0.7)',
                      border: '1px solid rgba(212, 196, 168, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F4F1DE',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  />
                  <select
                    value={newUserProvider}
                    onChange={e => setNewUserProvider(e.target.value)}
                    style={{
                      background: 'rgba(7, 11, 18, 0.7)',
                      border: '1px solid rgba(212, 196, 168, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F4F1DE',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  >
                    <option value="Google">Google Account</option>
                    <option value="Email">Email / Password</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Top Artists (comma separated)"
                    value={newUserArtists}
                    onChange={e => setNewUserArtists(e.target.value)}
                    style={{
                      background: 'rgba(7, 11, 18, 0.7)',
                      border: '1px solid rgba(212, 196, 168, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F4F1DE',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="url"
                    placeholder="Avatar / PFP URL (optional Google photo link)"
                    value={newUserAvatar}
                    onChange={e => setNewUserAvatar(e.target.value)}
                    style={{
                      background: 'rgba(7, 11, 18, 0.7)',
                      border: '1px solid rgba(212, 196, 168, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F4F1DE',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Streams count (e.g. 15)"
                    value={newUserStreams}
                    onChange={e => setNewUserStreams(e.target.value)}
                    style={{
                      background: 'rgba(7, 11, 18, 0.7)',
                      border: '1px solid rgba(212, 196, 168, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F4F1DE',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Liked tracks count (e.g. 5)"
                    value={newUserLiked}
                    onChange={e => setNewUserLiked(e.target.value)}
                    style={{
                      background: 'rgba(7, 11, 18, 0.7)',
                      border: '1px solid rgba(212, 196, 168, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F4F1DE',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddUserForm(false)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(212, 196, 168, 0.3)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: '#F4F1DE',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: '#D4AF37',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 18px',
                      color: '#070B12',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Save & Display Account
                  </button>
                </div>
              </form>
            )}
            {/* Users Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '18px'
              }}
            >
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  style={{
                    background: 'rgba(13, 27, 42, 0.75)',
                    border: '1px solid rgba(212, 196, 168, 0.18)',
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Delete / Remove Action */}
                  <button
                    onClick={() => handleDeleteUser(user.id, user.email)}
                    title="Remove user record"
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(230, 57, 70, 0.12)',
                      border: '1px solid rgba(230, 57, 70, 0.3)',
                      borderRadius: '8px',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFB4B4',
                      cursor: 'pointer',
                      zIndex: 2,
                      transition: 'all 0.2s'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>

                  {/* User Profile Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingRight: '28px' }}>
                    <UserAvatar user={user} size={52} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#F4F1DE', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.name}
                        </h4>
                        {user.username && (
                          <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600, background: 'rgba(212, 175, 55, 0.12)', padding: '1px 6px', borderRadius: '4px' }}>
                            @{user.username.replace(/^@/, '')}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(212, 196, 168, 0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </div>
                      {(() => {
                        const now = Date.now();
                        const lastActive = user.lastHeartbeat || user.lastSyncedAt || 0;
                        const isRecentlyActive = (now - lastActive) < 90000;
                        if (isRecentlyActive && user.currentTrack) {
                          return (
                            <div style={{ marginTop: '5px', fontSize: '0.74rem', color: '#90BE6D', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Music size={12} className="animate-pulse" />
                              <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                Streaming: {user.currentTrack} {user.currentArtist ? `• ${user.currentArtist}` : ''}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.74rem' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: user.provider === 'Google' ? 'rgba(66, 133, 244, 0.18)' : 'rgba(119, 141, 122, 0.18)',
                        color: user.provider === 'Google' ? '#8AB4F8' : '#A3C9A8',
                        fontWeight: 600
                      }}
                    >
                      {user.provider}
                    </span>

                    {(() => {
                      const now = Date.now();
                      const lastActive = user.lastHeartbeat || user.lastSyncedAt || 0;
                      const isRecentlyActive = (now - lastActive) < 90000;
                      const isListening = isRecentlyActive && (user.isPlaying || user.status === 'Listening Now');
                      const isActiveInApp = isRecentlyActive && !isListening;

                      if (isListening) {
                        return (
                          <span
                            style={{
                              padding: '3px 9px',
                              borderRadius: '6px',
                              background: 'rgba(230, 57, 70, 0.18)',
                              color: '#FF6B6B',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              border: '1px solid rgba(230, 57, 70, 0.35)'
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF6B6B', boxShadow: '0 0 6px #FF6B6B' }} />
                            <span>Listening Now</span>
                          </span>
                        );
                      }
                      if (isActiveInApp) {
                        return (
                          <span
                            style={{
                              padding: '3px 9px',
                              borderRadius: '6px',
                              background: 'rgba(144, 190, 109, 0.2)',
                              color: '#90BE6D',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              border: '1px solid rgba(144, 190, 109, 0.35)'
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#90BE6D', boxShadow: '0 0 6px #90BE6D' }} />
                            <span>Active in App</span>
                          </span>
                        );
                      }
                      return (
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: 'rgba(244, 241, 222, 0.55)',
                            fontWeight: 600
                          }}
                          title={lastActive ? `Last active ${formatTimeAgo(lastActive)}` : 'Offline'}
                        >
                          Offline
                        </span>
                      );
                    })()}

                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(212, 175, 55, 0.12)',
                        color: '#D4AF37',
                        fontWeight: 600
                      }}
                      title="Real App Version Installed on User Device"
                    >
                      v{user.appVersion || '11.5.6'}
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      background: 'rgba(7, 11, 18, 0.5)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div title="Streams: Total songs played / listened to in Sielo">
                      <span style={{ color: 'rgba(212, 196, 168, 0.6)' }}>Streams: </span>
                      <strong style={{ color: '#F4F1DE' }}>{(typeof user.streamCount === 'number' ? user.streamCount : user.totalStreams) || 0}</strong>
                    </div>
                    <div title="Liked: Total tracks saved to library">
                      <span style={{ color: 'rgba(212, 196, 168, 0.6)' }}>Liked: </span>
                      <strong style={{ color: '#F4F1DE' }}>{(typeof user.likedCount === 'number' ? user.likedCount : user.totalLiked) || 0}</strong>
                    </div>
                  </div>

                  {/* Favorite Artists */}
                  {user.favoriteArtists && user.favoriteArtists.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(212, 196, 168, 0.55)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                        Top Taste Artists
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {user.favoriteArtists.map(artist => (
                          <span
                            key={artist}
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(212, 196, 168, 0.12)',
                              color: 'rgba(244, 241, 222, 0.85)'
                            }}
                          >
                            {artist}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {appUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(13, 27, 42, 0.5)', borderRadius: '24px', border: '1px solid rgba(212, 196, 168, 0.15)' }}>
                <Users size={48} color="#D4AF37" style={{ margin: '0 auto 16px', opacity: 0.8 }} />
                <h3 style={{ color: '#F4F1DE', fontSize: '1.2rem', marginBottom: '8px' }}>No Registered App Users Yet</h3>
                <p style={{ maxWidth: '480px', margin: '0 auto 20px', color: 'rgba(212, 196, 168, 0.65)', fontSize: '0.86rem', lineHeight: 1.5 }}>
                  Real user accounts will automatically appear here when listeners sign in to the Sielo Android app via Google or Email.
                </p>
                <button
                  onClick={handleRefresh}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '12px',
                    color: '#F4F1DE',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
                  <span>Check For Synced App Users</span>
                </button>
                <button
                  onClick={() => setShowAddUserForm(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'rgba(212, 175, 55, 0.85)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#070B12',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <UserPlus size={14} />
                  <span>+ Register App Account Now</span>
                </button>
              </div>
            ) : filteredUsers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(212, 196, 168, 0.6)' }}>
                No users found matching your search.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE EVENT STREAM */}
        {activeTab === 'events' && (
          <div
            style={{
              background: 'rgba(13, 27, 42, 0.7)',
              border: '1px solid rgba(212, 196, 168, 0.18)',
              borderRadius: '24px',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#F4F1DE' }}>
                  Real-Time Event Stream
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'rgba(212, 196, 168, 0.65)' }}>
                  Live stream of visits and APK downloads logged by the Sielo telemetry engine
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(!analytics.recentEvents || analytics.recentEvents.length === 0) && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(212, 196, 168, 0.55)' }}>
                  <Activity size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <div style={{ fontWeight: 600, color: '#F4F1DE', marginBottom: '4px' }}>No Telemetry Events Logged Yet</div>
                  <div style={{ fontSize: '0.82rem' }}>
                    Live tracking is active. Real page views and APK downloads will stream here in real time.
                  </div>
                </div>
              )}
              {analytics.recentEvents?.map(event => {
                const isDownload = event.type === 'download';
                const timeAgo = formatTimeAgo(event.time);
                return (
                  <div
                    key={event.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(7, 11, 18, 0.5)',
                      border: '1px solid rgba(212, 196, 168, 0.12)',
                      borderRadius: '12px',
                      padding: '12px 18px',
                      fontSize: '0.84rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: isDownload ? 'rgba(119, 141, 122, 0.2)' : 'rgba(212, 175, 55, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isDownload ? <Download size={16} color="#778D7A" /> : <Eye size={16} color="#D4AF37" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#F4F1DE' }}>
                          {isDownload ? `APK Downloaded (${event.version || 'v11.5.6'})` : `Page Visited (${event.path || '/'})`}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'rgba(212, 196, 168, 0.6)' }}>
                          Device: {event.device || 'Android'}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'rgba(212, 196, 168, 0.5)' }}>
                      {timeAgo}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ADMIN SECURITY & VAULT SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                background: 'rgba(13, 27, 42, 0.7)',
                border: '1px solid rgba(212, 196, 168, 0.18)',
                borderRadius: '24px',
                padding: '28px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <KeyRound size={22} color="#D4AF37" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#F4F1DE' }}>
                  Update Admin Master Password
                </h3>
              </div>
              <p style={{ margin: '0 0 20px', fontSize: '0.84rem', color: 'rgba(212, 196, 168, 0.7)', lineHeight: 1.5 }}>
                Generates a fresh 24-byte cryptographic salt and computes the one-way SHA-256 hash. The new hash will be saved in your private cloud vault.
              </p>

              {passMessage.text && (
                <div
                  style={{
                    background: passMessage.isError ? 'rgba(230, 57, 70, 0.15)' : 'rgba(144, 190, 109, 0.15)',
                    border: `1px solid ${passMessage.isError ? 'rgba(230, 57, 70, 0.4)' : 'rgba(144, 190, 109, 0.4)'}`,
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '18px',
                    fontSize: '0.84rem',
                    color: passMessage.isError ? '#FFB4B4' : '#A3C9A8'
                  }}
                >
                  {passMessage.text}
                </div>
              )}

              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(212, 196, 168, 0.8)', marginBottom: '6px' }}>
                    Current Master Password
                  </label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(7, 11, 18, 0.7)',
                      border: '1px solid rgba(212, 196, 168, 0.2)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      color: '#F4F1DE',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(212, 196, 168, 0.8)', marginBottom: '6px' }}>
                    New Master Password (min 8 chars)
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter new strong password"
                    required
                    minLength={8}
                    style={{
                      width: '100%',
                      background: 'rgba(7, 11, 18, 0.7)',
                      border: '1px solid rgba(212, 196, 168, 0.2)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      color: '#F4F1DE',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(212, 196, 168, 0.8)', marginBottom: '6px' }}>
                    Admin Username (optional change)
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder={adminName}
                    style={{
                      width: '100%',
                      background: 'rgba(7, 11, 18, 0.7)',
                      border: '1px solid rgba(212, 196, 168, 0.2)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      color: '#F4F1DE',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPass}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #E5C365 0%, #D4AF37 100%)',
                    color: '#070B12',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: isUpdatingPass ? 'wait' : 'pointer',
                    marginTop: '8px'
                  }}
                >
                  {isUpdatingPass ? 'Hashing & Updating...' : 'Save New Credentials'}
                </button>
              </form>
            </div>

            {/* Danger Zone: Reset Analytics */}
            <div
              style={{
                background: 'rgba(13, 27, 42, 0.5)',
                border: '1px solid rgba(230, 57, 70, 0.25)',
                borderRadius: '20px',
                padding: '24px'
              }}
            >
              <h4 style={{ margin: '0 0 8px', color: '#FFB4B4', fontSize: '0.96rem' }}>
                Reset Analytics Data
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: 'rgba(244, 241, 222, 0.65)' }}>
                Clears local visitor session caches and re-initializes telemetry counters.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset analytics data?')) {
                    const fresh = resetAnalyticsData();
                    setAnalytics(fresh);
                  }
                }}
                style={{
                  background: 'rgba(230, 57, 70, 0.15)',
                  border: '1px solid rgba(230, 57, 70, 0.4)',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  color: '#FFB4B4',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reset Analytics
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'just now';
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDays = Math.floor(diffHour / 24);
  return `${diffDays}d ago`;
}
