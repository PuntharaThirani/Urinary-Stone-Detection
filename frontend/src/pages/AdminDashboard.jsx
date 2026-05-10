import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// ── Stat Card ──────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, bg, delay = 0 }) => (
  <div
    className="stat-card"
    style={{ animationDelay: `${delay}ms`, '--accent': color, '--bg': bg }}
  >
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value ?? 0}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-bar" />
  </div>
);

// ── Role Badge ─────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const map = {
    admin:   { bg: '#ede9fe', color: '#7c3aed', label: 'Admin'   },
    doctor:  { bg: '#dbeafe', color: '#1d4ed8', label: 'Doctor'  },
    staff:   { bg: '#fef9c3', color: '#a16207', label: 'Staff'   },
    patient: { bg: '#dcfce7', color: '#15803d', label: 'Patient' },
  };
  const s = map[role] || { bg: '#f1f5f9', color: '#475569', label: role };
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '.04em' }}>
      {s.label.toUpperCase()}
    </span>
  );
};

// ── Main Component ─────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');
  const adminName     = localStorage.getItem('userName') || 'Admin';

  const [stats,     setStats]     = useState(null);
  const [users,     setUsers]     = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [toast,     setToast]     = useState({ show: false, message: '', type: '' });
  const [search,    setSearch]    = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true); setError(null);
    await Promise.all([fetchStats(), fetchUsers(), fetchAuditLogs()]);
    setLoading(false);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const fetchStats     = async () => { try { const r = await api.get('/admin/stats');      setStats(r.data.data);         } catch { setError('Failed to load statistics'); } };
  const fetchUsers     = async () => { try { const r = await api.get('/admin/users');      setUsers(r.data.data || []);   } catch (e) { console.error(e); } };
  const fetchAuditLogs = async () => { try { const r = await api.get('/admin/audit-logs'); setAuditLogs(r.data.data || []); } catch (e) { console.error(e); } };

  const handleRoleChange = async (userId, newRole, currentRole) => {
    if (newRole === currentRole) return;
    if (userId === currentUserId) { showToast('Cannot change your own role', 'error'); return; }
    if (!window.confirm(`Change role to "${newRole.toUpperCase()}"?`)) return;
    try { await api.put(`/admin/users/${userId}/role`, { role: newRole }); await fetchUsers(); showToast('Role updated'); }
    catch (e) { showToast(e?.response?.data?.message || 'Failed to update role', 'error'); }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentUserId) { showToast('Cannot delete your own account', 'error'); return; }
    if (!window.confirm(`Delete "${userName}"? This cannot be undone.`)) return;
    try { await api.delete(`/admin/users/${userId}`); await fetchUsers(); showToast('User deleted'); }
    catch (e) { showToast(e?.response?.data?.message || 'Failed to delete user', 'error'); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-ring" />
      <p>Loading dashboard...</p>
      <style>{loadingCSS}</style>
    </div>
  );

  if (error) return (
    <div className="loading-screen">
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <p style={{ color: '#ef4444', fontWeight: 700, marginTop: 12 }}>{error}</p>
        <button onClick={fetchAll} style={{ marginTop: 16, padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>Retry</button>
      </div>
      <style>{loadingCSS}</style>
    </div>
  );

  return (
    <>
      <style>{css}</style>

      {/* Toast */}
      {toast.show && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.type === 'error' ? '⚠️' : '✅'} {toast.message}
        </div>
      )}

      <div className="dash-root">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">🛡️</div>
            <div>
              <div className="logo-title">UroScan AI</div>
              <div className="logo-sub">Admin Panel</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {[
              { id: 'stats', icon: '📊', label: 'Statistics'  },
              { id: 'users', icon: '👥', label: 'Users'        },
              { id: 'logs',  icon: '📋', label: 'Audit Logs'   },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-item ${activeTab === tab.id ? 'nav-active' : ''}`}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="admin-info">
              <div className="admin-avatar">{adminName[0]?.toUpperCase()}</div>
              <div>
                <div className="admin-name">{adminName}</div>
                <div className="admin-role">Administrator</div>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <span>⏻</span> Logout
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="main-content">

          {/* Header */}
          <div className="main-header">
            <div>
              <div className="greeting">{greeting}, {adminName} 👋</div>
              <div className="header-sub">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <button onClick={() => navigate('/')} className="home-btn">← Home</button>
          </div>

          {/* ── Stats Tab ── */}
          {activeTab === 'stats' && stats && (
            <div className="tab-content">

              <div className="section-title">👤 User Overview</div>
              <div className="stats-grid">
                <StatCard label="Total Users" value={stats.users?.total}    icon="👤" color="#2563eb" bg="linear-gradient(135deg,#eff6ff,#dbeafe)" delay={0}   />
                <StatCard label="Doctors"     value={stats.users?.doctors}  icon="🩺" color="#7c3aed" bg="linear-gradient(135deg,#f5f3ff,#ede9fe)" delay={60}  />
                <StatCard label="Patients"    value={stats.users?.patients} icon="🏥" color="#059669" bg="linear-gradient(135deg,#f0fdf4,#dcfce7)" delay={120} />
                <StatCard label="Staff"       value={stats.users?.staff}    icon="👨‍💼" color="#d97706" bg="linear-gradient(135deg,#fffbeb,#fef3c7)" delay={180} />
              </div>

              <div className="section-title" style={{ marginTop: 32 }}>🔬 Scan Overview</div>
              <div className="stats-grid">
                <StatCard label="Total Scans"  value={stats.scans?.total}          icon="🔍" color="#0891b2" bg="linear-gradient(135deg,#ecfeff,#cffafe)" delay={0}   />
                <StatCard label="Today's Scans" value={stats.scans?.today}         icon="📅" color="#7c3aed" bg="linear-gradient(135deg,#f5f3ff,#ede9fe)" delay={60}  />
                <StatCard label="This Week"    value={stats.scans?.thisWeek}       icon="📈" color="#2563eb" bg="linear-gradient(135deg,#eff6ff,#dbeafe)" delay={120} />
                <StatCard label="Stones Found" value={stats.scans?.stonesDetected} icon="🪨" color="#dc2626" bg="linear-gradient(135deg,#fff1f2,#fee2e2)" delay={180} />
              </div>

              <div className="section-title" style={{ marginTop: 32 }}>📄 Reports</div>
              <div className="report-card">
                <div className="report-icon">📄</div>
                <div>
                  <div className="report-count">{stats.reports?.total ?? 0}</div>
                  <div className="report-label">Total Reports Generated</div>
                </div>
              </div>

            </div>
          )}

          {/* ── Users Tab ── */}
          {activeTab === 'users' && (
            <div className="tab-content">
              <div className="table-header">
                <div className="section-title" style={{ margin: 0 }}>👥 All Users ({users.length})</div>
                <input
                  className="search-input"
                  placeholder="Search by name, email or role..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      {['Name', 'Email', 'Role', 'Last Login', 'Joined', 'Actions'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No users found</td></tr>
                    ) : filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
                            <div>
                              <div className="user-name">{user.name}</div>
                              {user._id === currentUserId && <div className="you-badge">You</div>}
                            </div>
                          </div>
                        </td>
                        <td className="email-cell">{user.email}</td>
                        <td><RoleBadge role={user.role} /></td>
                        <td className="date-cell">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                        <td className="date-cell">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-cell">
                            <select
                              value={user.role}
                              onChange={e => handleRoleChange(user._id, e.target.value, user.role)}
                              disabled={user._id === currentUserId}
                              className="role-select"
                            >
                              {['doctor','patient','staff','admin'].map(r => (
                                <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleDeleteUser(user._id, user.name)}
                              disabled={user._id === currentUserId}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Audit Logs Tab ── */}
          {activeTab === 'logs' && (
            <div className="tab-content">
              <div className="section-title">📋 Audit Logs ({auditLogs.length})</div>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      {['User', 'Role', 'Action', 'Status', 'Date & Time'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No audit logs found</td></tr>
                    ) : auditLogs.map(log => (
                      <tr key={log._id}>
                        <td className="user-name">{log.user_id?.name || 'Unknown'}</td>
                        <td><RoleBadge role={log.user_id?.role} /></td>
                        <td><span className="action-badge">{log.action_type || log.action}</span></td>
                        <td>
                          <span className={log.status === 'SUCCESS' ? 'status-success' : 'status-error'}>
                            {log.status || 'SUCCESS'}
                          </span>
                        </td>
                        <td className="date-cell">{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
};

// ── CSS ────────────────────────────────────────────────────
const loadingCSS = `
  .loading-screen { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; background:#f8fafc; gap:16px; font-family:'Segoe UI',sans-serif; }
  .loading-ring { width:48px; height:48px; border:4px solid #e2e8f0; border-top-color:#2563eb; border-radius:50%; animation:spin .8s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
`;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dash-root {
    display: flex;
    min-height: 100vh;
    background: #f1f5f9;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 260px;
    min-height: 100vh;
    background: #0f172a;
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px 24px;
    border-bottom: 1px solid #1e293b;
    margin-bottom: 24px;
  }

  .logo-icon { font-size: 28px; }
  .logo-title { font-size: 16px; font-weight: 800; color: #f8fafc; letter-spacing: -.02em; }
  .logo-sub   { font-size: 11px; color: #64748b; font-weight: 500; margin-top: 1px; }

  .sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: 12px;
    border: none;
    background: transparent;
    color: #94a3b8;
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all .2s;
    text-align: left;
    width: 100%;
  }
  .nav-item:hover  { background: #1e293b; color: #f1f5f9; }
  .nav-active      { background: #1d4ed8 !important; color: #fff !important; box-shadow: 0 4px 12px rgba(29,78,216,.35); }
  .nav-icon        { font-size: 18px; }

  .sidebar-footer {
    border-top: 1px solid #1e293b;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .admin-info { display: flex; align-items: center; gap: 10px; }
  .admin-avatar {
    width: 38px; height: 38px;
    background: linear-gradient(135deg,#2563eb,#7c3aed);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }
  .admin-name { font-size: 13px; font-weight: 700; color: #f1f5f9; }
  .admin-role { font-size: 11px; color: #64748b; margin-top: 1px; }

  .logout-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px; border-radius: 10px;
    background: #7f1d1d; border: none;
    color: #fca5a5; font-size: 13px; font-weight: 700; font-family: inherit;
    cursor: pointer; transition: background .2s;
  }
  .logout-btn:hover { background: #991b1b; }

  /* ── Main ── */
  .main-content { flex: 1; display: flex; flex-direction: column; overflow: auto; }

  .main-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 32px 20px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
  }
  .greeting    { font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -.03em; }
  .header-sub  { font-size: 13px; color: #94a3b8; margin-top: 3px; }
  .home-btn {
    padding: 9px 18px; border-radius: 10px;
    border: 1.5px solid #e2e8f0; background: #fff;
    color: #475569; font-size: 13px; font-weight: 700; font-family: inherit;
    cursor: pointer; transition: all .2s;
  }
  .home-btn:hover { border-color: #2563eb; color: #2563eb; }

  .tab-content { padding: 28px 32px; }

  .section-title {
    font-size: 15px; font-weight: 800; color: #1e293b;
    letter-spacing: -.02em; margin-bottom: 16px;
  }

  /* ── Stat Cards ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .stat-card {
    background: var(--bg);
    border-radius: 18px;
    padding: 22px 20px 18px;
    position: relative;
    overflow: hidden;
    animation: fadeUp .5s both;
    border: 1.5px solid rgba(255,255,255,.8);
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
    transition: transform .2s, box-shadow .2s;
  }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.10); }

  .stat-icon  { font-size: 26px; margin-bottom: 12px; }
  .stat-value { font-size: 36px; font-weight: 800; color: var(--accent); letter-spacing: -.04em; line-height: 1; }
  .stat-label { font-size: 12px; font-weight: 700; color: #64748b; margin-top: 6px; text-transform: uppercase; letter-spacing: .06em; }
  .stat-bar   {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: var(--accent); opacity: .3; border-radius: 0 0 18px 18px;
  }

  .report-card {
    display: flex; align-items: center; gap: 20px;
    background: linear-gradient(135deg,#fff7ed,#ffedd5);
    border: 1.5px solid #fed7aa;
    border-radius: 18px; padding: 22px 28px;
    width: fit-content;
  }
  .report-icon  { font-size: 32px; }
  .report-count { font-size: 40px; font-weight: 800; color: #ea580c; letter-spacing: -.04em; }
  .report-label { font-size: 12px; font-weight: 700; color: #9a3412; text-transform: uppercase; letter-spacing: .06em; margin-top: 2px; }

  /* ── Table ── */
  .table-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px; flex-wrap: wrap; gap: 12px;
  }

  .search-input {
    padding: 9px 16px; border-radius: 10px;
    border: 1.5px solid #e2e8f0; background: #fff;
    font-size: 13px; font-family: inherit; outline: none;
    width: 260px; transition: border-color .2s;
  }
  .search-input:focus { border-color: #2563eb; }

  .table-wrap {
    background: #fff; border-radius: 16px;
    border: 1px solid #e2e8f0;
    overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.05);
  }

  .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .data-table thead { background: #f8fafc; }
  .data-table th {
    padding: 12px 16px; text-align: left;
    font-size: 11px; font-weight: 800; color: #94a3b8;
    text-transform: uppercase; letter-spacing: .07em;
    border-bottom: 1px solid #e2e8f0;
  }
  .data-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: #f8fafc; }

  .user-cell  { display: flex; align-items: center; gap: 10px; }
  .user-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg,#2563eb,#7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .user-name  { font-weight: 700; color: #1e293b; font-size: 13px; }
  .you-badge  { font-size: 10px; color: #64748b; font-weight: 600; margin-top: 1px; }
  .email-cell { color: #64748b; font-size: 12px; }
  .date-cell  { color: #94a3b8; font-size: 12px; }

  .action-cell { display: flex; align-items: center; gap: 8px; }

  .role-select {
    padding: 5px 8px; border-radius: 8px;
    border: 1.5px solid #e2e8f0; background: #fff;
    font-size: 12px; font-family: inherit; cursor: pointer;
    outline: none; transition: border-color .2s;
  }
  .role-select:focus   { border-color: #2563eb; }
  .role-select:disabled { opacity: .45; cursor: not-allowed; }

  .delete-btn {
    padding: 5px 12px; border-radius: 8px;
    background: #fff1f2; border: 1.5px solid #fecdd3;
    color: #e11d48; font-size: 12px; font-weight: 700; font-family: inherit;
    cursor: pointer; transition: all .2s;
  }
  .delete-btn:hover    { background: #ffe4e6; }
  .delete-btn:disabled { opacity: .4; cursor: not-allowed; }

  .action-badge {
    padding: 4px 10px; border-radius: 8px;
    background: #eff6ff; color: #1d4ed8;
    font-size: 11px; font-weight: 700; letter-spacing: .04em;
  }
  .status-success { padding: 4px 10px; border-radius: 8px; background: #f0fdf4; color: #15803d; font-size: 11px; font-weight: 700; }
  .status-error   { padding: 4px 10px; border-radius: 8px; background: #fff1f2; color: #e11d48; font-size: 11px; font-weight: 700; }

  /* ── Toast ── */
  .toast {
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    padding: 12px 20px; border-radius: 14px;
    font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 8px 24px rgba(0,0,0,.15);
    animation: fadeUp .3s both;
  }
  .toast-success { background: #052e16; color: #86efac; }
  .toast-error   { background: #450a0a; color: #fca5a5; }

  @media (max-width: 900px) {
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .sidebar    { width: 200px; }
  }
`;

export default AdminDashboard;