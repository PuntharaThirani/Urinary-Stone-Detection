import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate   = useNavigate();
  const [stats, setStats]           = useState(null);
  const [users, setUsers]           = useState([]);
  const [auditLogs, setAuditLogs]   = useState([]);
  const [activeTab, setActiveTab]   = useState('stats');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchAuditLogs();
  }, []);

  // ───── Fetch Stats ─────
  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  // ───── Fetch Users ─────
  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ───── Fetch Audit Logs ─────
  const fetchAuditLogs = async () => {
    try {
      const res = await api.get('/admin/audit-logs');
      setAuditLogs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ───── Update Role ─────
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
      alert('Role updated successfully!');
    } catch (err) {
      alert('Failed to update role');
    }
  };

  // ───── Delete User ─────
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
      alert('User deleted successfully!');
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin:   'bg-purple-100 text-purple-700',
      doctor:  'bg-blue-100 text-blue-700',
      staff:   'bg-yellow-100 text-yellow-700',
      patient: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[role] || 'bg-gray-100'}`}>
        {role?.toUpperCase()}
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ───── Header ───── */}
      <div className="bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            🛡️ Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            UroScan AI — System Management
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200"
        >
          ← Back
        </button>
      </div>

      {/* ───── Tabs ───── */}
      <div className="px-6 pt-6">
        <div className="flex gap-2 mb-6">
          {[
            { id: 'stats', label: '📊 Statistics' },
            { id: 'users', label: '👥 Users' },
            { id: 'logs',  label: '📋 Audit Logs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ───── Stats Tab ───── */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-6">

            {/* User Stats */}
            <div>
              <h2 className="text-lg font-bold text-slate-700 mb-3">
                👤 User Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users',  value: stats.users.total,    color: 'blue'   },
                  { label: 'Doctors',      value: stats.users.doctors,  color: 'indigo' },
                  { label: 'Patients',     value: stats.users.patients, color: 'green'  },
                  { label: 'Staff',        value: stats.users.staff,    color: 'yellow' },
                ].map((stat) => (
                  <div key={stat.label}
                    className="bg-white rounded-2xl border p-4 shadow-sm">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-black mt-1 text-${stat.color}-600`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scan Stats */}
            <div>
              <h2 className="text-lg font-bold text-slate-700 mb-3">
                🔬 Scan Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Scans',      value: stats.scans.total,          color: 'blue'   },
                  { label: "Today's Scans",     value: stats.scans.today,          color: 'purple' },
                  { label: 'This Week',         value: stats.scans.thisWeek,       color: 'indigo' },
                  { label: 'Stones Detected',   value: stats.scans.stonesDetected, color: 'red'    },
                ].map((stat) => (
                  <div key={stat.label}
                    className="bg-white rounded-2xl border p-4 shadow-sm">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-black mt-1 text-${stat.color}-600`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Stats */}
            <div className="bg-white rounded-2xl border p-4 shadow-sm w-fit">
              <p className="text-xs font-bold uppercase text-slate-400">
                📄 Total Reports
              </p>
              <p className="text-3xl font-black mt-1 text-orange-600">
                {stats.reports.total}
              </p>
            </div>
          </div>
        )}

        {/* ───── Users Tab ───── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h2 className="text-lg font-bold text-slate-700">
                👥 All Users ({users.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Name', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                      <th key={h}
                        className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {/* Role Change */}
                          <select
                            defaultValue={user.role}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                            className="text-xs border rounded-lg px-2 py-1 bg-white"
                          >
                            {['doctor','patient','staff','admin'].map((r) => (
                              <option key={r} value={r}>
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                              </option>
                            ))}
                          </select>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100"
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

        {/* ───── Audit Logs Tab ───── */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h2 className="text-lg font-bold text-slate-700">
                📋 Audit Logs
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['User', 'Action', 'Date & Time'].map((h) => (
                      <th key={h}
                        className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">
                          {log.user_id?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {log.user_id?.role}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                          {log.action_type || log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;