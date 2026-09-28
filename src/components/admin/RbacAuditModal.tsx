import React, { useState } from 'react';
import { ShieldAlert, Users, Key, History, CheckCircle2, Lock } from 'lucide-react';

interface RbacAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RbacAuditModal: React.FC<RbacAuditModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'roles' | 'audit'>('roles');

  const [roles] = useState([
    { name: 'SUPER ADMIN', usersCount: 2, permissions: 'Full Read/Write, Network Topology, Security Policies, User Management' },
    { name: 'NETWORK ADMIN', usersCount: 5, permissions: 'Topology Edit, Interface Config, OSPF/BGP Routing, VLANs, Services' },
    { name: 'SECURITY ADMIN', usersCount: 3, permissions: 'Cisco ASA Firewall, ACLs, IPSec VPN, SOC Guard, Threat Logs' },
    { name: 'INSTRUCTOR', usersCount: 12, permissions: 'Lab Creation, Scenario Engine, Grading, Student Assignment Review' },
    { name: 'STUDENT', usersCount: 450, permissions: 'Interactive Simulator, CLI Execution, Educational Labs, Packet Trace' }
  ]);

  const [auditLogs] = useState([
    { id: '1', timestamp: new Date().toISOString(), user: 'admin@haramaya.edu.et', action: 'FIREWALL_POLICY_CHANGE', details: 'Added ASA Rule: Permit Student VLAN to Web Server TCP/443' },
    { id: '2', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'neteng@haramaya.edu.et', action: 'OSPF_NEIGHBOR_UP', details: 'Core Router R-BATI-CORE established OSPF Area 0 with R-HIT-CORE' },
    { id: '3', timestamp: new Date(Date.now() - 7200000).toISOString(), user: 'secadmin@haramaya.edu.et', action: 'IPSEC_TUNNEL_ESTABLISHED', details: 'IPSec VPN Tunnel Harar-Health-Main-Bati status set to ACTIVE' }
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0c0c] border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00ff87]/20 border border-[#00ff87]/40 flex items-center justify-center text-[#00ff87]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-2">
                <span>HU-SSAN ROLE-BASED ACCESS CONTROL & SECURITY AUDIT</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Granular RBAC privileges & immutable administrative event logs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 flex border-b border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('roles')}
            className={`pb-3 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'roles' ? 'border-[#00ff87] text-[#00ff87]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Role Permissions ({roles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'audit' ? 'border-[#00ff87] text-[#00ff87]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'roles' ? (
            <div className="space-y-3">
              {roles.map((r, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-sm tracking-wide text-[#00ff87]">{r.name}</span>
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-bold">
                      {r.usersCount} Active Users
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">{r.permissions}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {auditLogs.map(log => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-cyan-300 font-bold">{log.user}</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="font-bold text-white uppercase text-xs">{log.action}</div>
                  <p className="text-slate-300 text-[11px]">{log.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
