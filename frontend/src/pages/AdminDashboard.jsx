import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/images/logo-removebg-preview.png';

const StatCard = ({ title, value, icon, color }) => (
  <div
    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <div
      className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>

    <h3 className="mt-5 text-4xl font-black tracking-tight text-slate-900">
      {value}
    </h3>

    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
      {title}
    </p>
  </div>
);

const RoleBadge = ({ role }) => {
  const styles = {
    admin: 'bg-violet-100 text-violet-700',
    doctor: 'bg-blue-100 text-blue-700',
    patient: 'bg-emerald-100 text-emerald-700',
    staff: 'bg-amber-100 text-amber-700',
  };

  return (
    <span
      className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${styles[role]}`}
    >
      {role}
    </span>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminName =
    localStorage.getItem('userName') || 'Admin';

  const currentUserId =
    localStorage.getItem('userId');

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [statsRes, usersRes, logsRes] =
        await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/audit-logs'),
        ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
      setAuditLogs(logsRes.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDeleteUser = async (
    userId,
    userName
  ) => {
    if (userId === currentUserId) {
      alert('Cannot delete your own account');
      return;
    }

    const confirmed = window.confirm(
      `Delete ${userName}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/users/${userId}`);

      fetchAll();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      u.email
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      u.role
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">

      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="sticky top-0 flex h-screen w-[280px] flex-col bg-slate-950 px-5 py-6 text-white shadow-2xl">

          <div className="mb-8 flex items-center gap-4 border-b border-slate-800 pb-6">
            <img
  src={logo}
  alt="UroScan AI Logo"
  className="h-21 w-auto object-contain"
/>

          </div>

          <nav className="flex flex-1 flex-col gap-3">

            {[
              {
                id: 'overview',
                label: 'Overview',
                icon: '📊',
              },
              {
                id: 'users',
                label: 'Users',
                icon: '👥',
              },
              {
                id: 'logs',
                label: 'Audit Logs',
                icon: '📋',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-left text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span className="text-xl">
                  {tab.icon}
                </span>

                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-xl font-black shadow-lg">
                {adminName[0]?.toUpperCase()}
              </div>

              <div>
                <p className="font-bold">
                  {adminName}
                </p>

                <p className="text-sm text-slate-400">
                  System Administrator
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-5 w-full rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-hidden">

          {/* Header */}
          <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-10 py-10 text-white shadow-2xl">

            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-cyan-300 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-100">
                  Administration Portal
                </p>

                <h1 className="mt-3 text-5xl font-black tracking-tight">
                  Welcome, {adminName} 👋
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-8 text-blue-100">
                  Manage users, monitor reports, review system activity,
                  and oversee the entire urinary stone detection platform.
                </p>
              </div>

              <button
                onClick={() => navigate('/')}
                className="inline-flex h-fit items-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-bold backdrop-blur-md transition hover:bg-white/20"
              >
                ← Back to Home
              </button>
            </div>
          </section>

          <div className="p-8">

            {/* OVERVIEW */}
            {activeTab === 'overview' && stats && (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                  <StatCard
                    title="Total Users"
                    value={stats.users?.total}
                    icon="👥"
                    color="#DBEAFE"
                  />

                  <StatCard
                    title="Doctors"
                    value={stats.users?.doctors}
                    icon="🩺"
                    color="#EDE9FE"
                  />

                  <StatCard
                    title="Patients"
                    value={stats.users?.patients}
                    icon="🏥"
                    color="#DCFCE7"
                  />

                  <StatCard
                    title="Staff"
                    value={stats.users?.staff}
                    icon="👨‍💼"
                    color="#FEF3C7"
                  />
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                  <StatCard
                    title="Total Scans"
                    value={stats.scans?.total}
                    icon="🔍"
                    color="#CFFAFE"
                  />

                  <StatCard
                    title="Today's Scans"
                    value={stats.scans?.today}
                    icon="📅"
                    color="#EDE9FE"
                  />

                  <StatCard
                    title="This Week"
                    value={stats.scans?.thisWeek}
                    icon="📈"
                    color="#DBEAFE"
                  />

                  <StatCard
                    title="Stone Cases"
                    value={stats.scans?.stonesDetected}
                    icon="🪨"
                    color="#FEE2E2"
                  />
                </div>
              </>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">

                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">
                      User Management
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Manage all registered system users.
                    </p>
                  </div>

                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="rounded-2xl border border-slate-300 px-5 py-3 text-sm outline-none transition focus:border-blue-600"
                  />
                </div>

                <div className="overflow-x-auto rounded-3xl border border-slate-200">
                  <table className="min-w-full text-left">

                    <thead className="bg-slate-50">
                      <tr>
                        {[
                          'Name',
                          'Email',
                          'Role',
                          'Joined',
                          'Actions',
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-5 text-xs font-black uppercase tracking-[0.18em] text-slate-500"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-t border-slate-100 transition hover:bg-slate-50"
                        >

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">

                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-black text-white shadow-lg">
                                {user.name?.[0]?.toUpperCase()}
                              </div>

                              <div>
                                <p className="font-bold text-slate-900">
                                  {user.name}
                                </p>

                                {user._id === currentUserId && (
                                  <p className="text-xs font-semibold text-slate-500">
                                    Current Account
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {user.email}
                          </td>

                          <td className="px-6 py-5">
                            <RoleBadge role={user.role} />
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {new Date(
                              user.createdAt
                            ).toLocaleDateString()}
                          </td>

                          <td className="px-6 py-5">
                            <button
                              onClick={() =>
                                handleDeleteUser(
                                  user._id,
                                  user.name
                                )
                              }
                              disabled={
                                user._id === currentUserId
                              }
                              className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* AUDIT LOGS */}
            {activeTab === 'logs' && (
              <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">

                <div className="mb-6">
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Audit Logs
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    System activity monitoring and tracking.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-slate-200">
                  <table className="min-w-full text-left">

                    <thead className="bg-slate-50">
                      <tr>
                        {[
                          'User',
                          'Role',
                          'Action',
                          'Status',
                          'Date',
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-5 text-xs font-black uppercase tracking-[0.18em] text-slate-500"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {auditLogs.map((log) => (
                        <tr
                          key={log._id}
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >

                          <td className="px-6 py-5 font-semibold text-slate-900">
                            {log.user_id?.name || 'Unknown'}
                          </td>

                          <td className="px-6 py-5">
                            <RoleBadge
                              role={log.user_id?.role}
                            />
                          </td>

                          <td className="px-6 py-5">
                            <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
                              {log.action_type || log.action}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
                              {log.status || 'SUCCESS'}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {new Date(
                              log.createdAt
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;