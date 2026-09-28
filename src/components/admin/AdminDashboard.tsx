/**
 * Haramaya University Network Administration & RBAC Management Portal
 * Super Admin, Network Admin, Network Engineer, Instructor, Student, and Viewer roles
 * Complete database entities, user management, audit logs, and project control
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  Key, 
  Database, 
  Layers, 
  FileText, 
  Activity, 
  Award, 
  FolderDown, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Clock, 
  Lock, 
  Unlock, 
  RotateCcw,
  Sparkles,
  Server,
  Network
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type UserRole = 
  | 'Super Admin' 
  | 'Network Administrator' 
  | 'Network Engineer' 
  | 'Instructor' 
  | 'Student' 
  | 'Viewer';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  campus: string;
  status: 'active' | 'suspended';
  lastLogin: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  target: string;
  severity: 'info' | 'warning' | 'security';
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'database' | 'audit' | 'scenarios'>('users');
  const [currentRole, setCurrentRole] = useState<UserRole>('Super Admin');

  // Users State
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: 'u-1',
      name: 'Dr. Alemayehu Worku',
      email: 'alemayehu.w@haramaya.edu.et',
      role: 'Super Admin',
      campus: 'Main (Bati)',
      status: 'active',
      lastLogin: '2026-09-28 08:30:12'
    },
    {
      id: 'u-2',
      name: 'Eng. Bethelhem Tadesse',
      email: 'bethelhem.t@haramaya.edu.et',
      role: 'Network Administrator',
      campus: 'Main DMZ & SOC',
      status: 'active',
      lastLogin: '2026-09-28 09:14:45'
    },
    {
      id: 'u-3',
      name: 'Prof. Girma Kebede',
      email: 'girma.k@hit.haramaya.edu.et',
      role: 'Instructor',
      campus: 'HiT Tech Campus',
      status: 'active',
      lastLogin: '2026-09-27 16:42:00'
    },
    {
      id: 'u-4',
      name: 'Selamawit Desta',
      email: 'selamawit.d@haramaya.edu.et',
      role: 'Network Engineer',
      campus: 'CVM Campus',
      status: 'active',
      lastLogin: '2026-09-28 07:11:20'
    },
    {
      id: 'u-5',
      name: 'Kenenisa Bekele (Student)',
      email: 'kenenisa.b@student.haramaya.edu.et',
      role: 'Student',
      campus: 'Harar Health Campus',
      status: 'active',
      lastLogin: '2026-09-28 09:50:00'
    }
  ]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-101',
      timestamp: '2026-09-28 09:45:11',
      user: 'bethelhem.t',
      role: 'Network Administrator',
      action: 'Updated ASA Firewall Ruleset',
      target: 'HU-MAIN-ASA1 (Outside Interface)',
      severity: 'security'
    },
    {
      id: 'log-102',
      timestamp: '2026-09-28 09:12:04',
      user: 'alemayehu.w',
      role: 'Super Admin',
      action: 'Provisioned HiT Campus VLAN 140 Subnet',
      target: '10.20.140.0/24 Subnet Pool',
      severity: 'info'
    },
    {
      id: 'log-103',
      timestamp: '2026-09-28 08:30:19',
      user: 'girma.k',
      role: 'Instructor',
      action: 'Verified CCNA Lab 03 OSPF Neighbor Adj.',
      target: 'HIT-CORE1 <-> HU-MAIN-CORE1',
      severity: 'info'
    },
    {
      id: 'log-104',
      timestamp: '2026-09-28 07:15:33',
      user: 'selamawit.d',
      role: 'Network Engineer',
      action: 'Re-negotiated IPSec Phase 2 Crypto Map',
      target: 'VPN-TUNNEL-HARAR-01',
      severity: 'warning'
    }
  ]);

  // New User Form State
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Student');
  const [newUserCampus, setNewUserCampus] = useState<string>('Main (Bati)');
  const [userFilter, setUserFilter] = useState<string>('');

  // Database Schema Entities
  const dbEntities = [
    { name: 'users', records: 124, description: 'Authentication accounts and credentials hash' },
    { name: 'roles & permissions', records: 6, description: 'Role-Based Access Control matrix' },
    { name: 'campuses', records: 4, description: 'Main, HiT, Veterinary, Harar Health records' },
    { name: 'projects', records: 48, description: 'Saved Cisco Packet Tracer topology project states' },
    { name: 'devices & chassis', records: 64, description: 'Core, Distribution, ASA, Access switches, Servers' },
    { name: 'device_interfaces', records: 280, description: 'GigabitEthernet, FastEthernet, TenGig port configs' },
    { name: 'links & etherchannels', records: 58, description: 'Fiber links, Cat6 copper, EtherChannel bundles' },
    { name: 'vlans & subnets', records: 15, description: 'IEEE 802.1Q VLAN IDs and IP pools' },
    { name: 'routes & ospf_neighbors', records: 32, description: 'Static & dynamic OSPF routing table entries' },
    { name: 'acl_rules & firewall', records: 24, description: 'Cisco ASA 5506-X security inspection policies' },
    { name: 'vpn_tunnels', records: 3, description: 'Site-to-Site IPSec tunnels (IKE Phase 1 & 2)' },
    { name: 'labs & lab_attempts', records: 12, description: 'Hands-on networking educational modules' },
    { name: 'audit_logs', records: 412, description: 'Administrative action logs and security events' }
  ];

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: AdminUser = {
      id: `u-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      campus: newUserCampus,
      status: 'active',
      lastLogin: 'Never (Invited)'
    };

    setUsers((prev) => [newUser, ...prev]);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: currentRole.toLowerCase().replace(' ', '.'),
        role: currentRole,
        action: `Created new user: ${newUserName}`,
        target: `${newUserEmail} (${newUserRole})`,
        severity: 'info'
      },
      ...prev
    ]);

    setNewUserName('');
    setNewUserEmail('');
    try {
      confetti({ particleCount: 25, spread: 50 });
    } catch {}
  };

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: newStatus };
      })
    );
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: currentRole.toLowerCase().replace(' ', '.'),
        role: currentRole,
        action: `Deleted User: ${name}`,
        target: `User ID ${id}`,
        severity: 'warning'
      },
      ...prev
    ]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 p-6 rounded-3xl border border-indigo-500/20 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Haramaya University Administration & RBAC</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/30">
                  SYSTEM PRIVILEGE ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage user access, security roles, database entities, simulation templates, and audit trails.
              </p>
            </div>
          </div>
        </div>

        {/* Current Active Role Switcher */}
        <div className="flex items-center gap-3 bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800">
          <Key className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Simulated Role</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="Super Admin" className="bg-slate-900">Super Admin (Full Control)</option>
              <option value="Network Administrator" className="bg-slate-900">Network Administrator</option>
              <option value="Network Engineer" className="bg-slate-900">Network Engineer</option>
              <option value="Instructor" className="bg-slate-900">Instructor (Labs & Grading)</option>
              <option value="Student" className="bg-slate-900">Student (Simulation & Labs)</option>
              <option value="Viewer" className="bg-slate-900">Viewer (Read-Only)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs overflow-x-auto shadow-inner">
        {[
          { id: 'users', label: 'User Directory & Access', icon: Users },
          { id: 'roles', label: 'Role-Based Access Control (RBAC)', icon: ShieldAlert },
          { id: 'database', label: 'Database Entities & Schemas', icon: Database },
          { id: 'audit', label: 'Security & Action Audit Logs', icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: USER MANAGEMENT ── */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Add User Form */}
          <form onSubmit={handleAddUser} className="bg-slate-900/70 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#00ff87]" />
              Provision New University User Account
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                placeholder="Full Name (e.g. Dr. Haile Geremew)"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <input
                type="email"
                placeholder="Institutional Email (e.g. haile.g@haramaya.edu.et)"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Student">Role: Student</option>
                <option value="Instructor">Role: Instructor</option>
                <option value="Network Engineer">Role: Network Engineer</option>
                <option value="Network Administrator">Role: Network Administrator</option>
                <option value="Super Admin">Role: Super Admin</option>
                <option value="Viewer">Role: Viewer</option>
              </select>

              <select
                value={newUserCampus}
                onChange={(e) => setNewUserCampus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Main (Bati)">Campus: Main (Bati)</option>
                <option value="HiT Tech Campus">Campus: HiT Tech Campus</option>
                <option value="CVM Veterinary">Campus: CVM Veterinary</option>
                <option value="Harar Health">Campus: Harar Health</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#00ff87] hover:bg-[#00e575] text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#00ff87]/25 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create User</span>
              </button>
            </div>
          </form>

          {/* User Directory Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Active University Accounts ({users.length})
              </h3>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Institutional Email</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Campus Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Activity</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {users
                    .filter((u) => u.name.toLowerCase().includes(userFilter.toLowerCase()) || u.email.toLowerCase().includes(userFilter.toLowerCase()))
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-sans font-bold text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <span>{user.name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-300 font-sans font-semibold">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-300">{user.campus}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {user.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">{user.lastLogin}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                              title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                            >
                              {user.status === 'active' ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-rose-400" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: RBAC MATRIX ── */}
      {activeTab === 'roles' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              University Role-Based Access Control (RBAC) Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Granular permission gates enforced across Cisco CLI, ASA Firewall, Lab Evaluation, and Database exports.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Permission Scope</th>
                  <th className="py-3 px-4 text-center">Super Admin</th>
                  <th className="py-3 px-4 text-center">Network Admin</th>
                  <th className="py-3 px-4 text-center">Network Engineer</th>
                  <th className="py-3 px-4 text-center">Instructor</th>
                  <th className="py-3 px-4 text-center">Student</th>
                  <th className="py-3 px-4 text-center">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {[
                  { name: 'Topology Design & Add Devices', p: [true, true, true, true, true, false] },
                  { name: 'Cisco IOS CLI Privilege Exec (#)', p: [true, true, true, true, true, false] },
                  { name: 'Global Config Mode (config t)', p: [true, true, true, false, false, false] },
                  { name: 'ASA 5506-X Security Ruleset Edit', p: [true, true, false, false, false, false] },
                  { name: 'Create & Grade Hands-on Labs', p: [true, true, false, true, false, false] },
                  { name: 'Attempt & Submit CCNA Labs', p: [true, true, true, true, true, false] },
                  { name: 'Save & Export JSON Topology Projects', p: [true, true, true, true, true, false] },
                  { name: 'User & RBAC Account Administration', p: [true, false, false, false, false, false] },
                  { name: 'Database Entity Backup & Audit', p: [true, true, false, false, false, false] }
                ].map((perm, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-sans font-semibold text-white">{perm.name}</td>
                    {perm.p.map((allowed, j) => (
                      <td key={j} className="py-3 px-4 text-center">
                        {allowed ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-slate-600">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: DATABASE SCHEMAS ── */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              Relational Database Entities & Schemas
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Full enterprise database structure backing the Haramaya University simulation engine.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dbEntities.map((ent, i) => (
                <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-300 font-bold text-xs">{ent.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {ent.records} records
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{ent.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: AUDIT LOGS ── */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Real-time Administrative Audit Logs ({auditLogs.length})
            </h3>
            <span className="text-xs font-mono text-slate-400">Immutable Hash Trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-white">{log.user}</td>
                    <td className="py-3 px-4 text-cyan-300">{log.action}</td>
                    <td className="py-3 px-4 text-slate-300">{log.target}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.severity === 'security'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : log.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      }`}>
                        {log.severity.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
