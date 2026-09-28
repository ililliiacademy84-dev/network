/**
 * Haramaya University Security Operations Center (HU SOC) & Firewall Manager
 * Real-time event timeline, stateful firewall rule editor, IDS/IPS alerts,
 * and live cyber threat simulator (Port scan, DoS, Brute force).
 */

import React, { useState } from 'react';
import { FirewallRule, SecurityEvent } from '../../types/network';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Filter, 
  Activity, 
  Play, 
  Lock, 
  Flame, 
  Search,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SocDashboardProps {
  firewallRules: FirewallRule[];
  onUpdateRules: (rules: FirewallRule[]) => void;
  securityEvents: SecurityEvent[];
  onTriggerThreatSimulation: (type: 'PORT_SCAN' | 'BRUTE_FORCE' | 'DOS_ATTEMPT') => void;
}

export const SocDashboard: React.FC<SocDashboardProps> = ({
  firewallRules,
  onUpdateRules,
  securityEvents,
  onTriggerThreatSimulation
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'events' | 'simulator'>('rules');
  const [searchEvent, setSearchEvent] = useState<string>('');

  // Add Rule state
  const [newRuleName, setNewRuleName] = useState<string>('');
  const [newSrcZone, setNewSrcZone] = useState<'inside' | 'outside' | 'dmz'>('outside');
  const [newDstZone, setNewDstZone] = useState<'inside' | 'outside' | 'dmz'>('dmz');
  const [newSrcIp, setNewSrcIp] = useState<string>('any');
  const [newDstIp, setNewDstIp] = useState<string>('10.10.150.6');
  const [newProtocol, setNewProtocol] = useState<'TCP' | 'UDP' | 'ICMP' | 'ESP'>('TCP');
  const [newPort, setNewPort] = useState<string>('443');
  const [newAction, setNewAction] = useState<'allow' | 'deny'>('allow');

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName) return;

    const newRule: FirewallRule = {
      id: `fw-${Date.now()}`,
      name: newRuleName.toUpperCase().replace(/\s+/g, '_'),
      sourceZone: newSrcZone,
      destZone: newDstZone,
      sourceIp: newSrcIp,
      destIp: newDstIp,
      protocol: newProtocol,
      port: newPort,
      action: newAction,
      enabled: true,
      hits: 0
    };

    onUpdateRules([...firewallRules, newRule]);
    setNewRuleName('');
  };

  const handleToggleRule = (id: string) => {
    onUpdateRules(
      firewallRules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    onUpdateRules(firewallRules.filter((r) => r.id !== id));
  };

  const filteredEvents = securityEvents.filter((ev) => {
    if (!searchEvent) return true;
    return (
      ev.description.toLowerCase().includes(searchEvent.toLowerCase()) ||
      ev.sourceIp.includes(searchEvent) ||
      ev.type.toLowerCase().includes(searchEvent.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-600/20 shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Haramaya University Security Operations Center (HU SOC)
              </h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE DEFENSE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cisco ASA 5506-X Stateful Packet Inspection, Zone-Based Access-Lists & Threat Mitigation
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'rules' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Firewall Rules ({firewallRules.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'events' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SOC Threat Feed ({securityEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'simulator' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Threat Simulator
          </button>
        </div>
      </div>

      {/* ── TAB 1: EDITABLE FIREWALL RULES ── */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* Add Rule Form */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Add Stateful ASA Firewall Rule</span>
            </h4>

            <form onSubmit={handleAddRule} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 items-end text-xs">
              <div className="lg:col-span-2">
                <label className="text-slate-400 block mb-1">Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g. ALLOW_PORTAL_HTTPS"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Src Zone</label>
                <select
                  value={newSrcZone}
                  onChange={(e) => setNewSrcZone(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                >
                  <option value="outside">outside (0)</option>
                  <option value="dmz">dmz (70)</option>
                  <option value="inside">inside (100)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Dst Zone</label>
                <select
                  value={newDstZone}
                  onChange={(e) => setNewDstZone(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                >
                  <option value="dmz">dmz (70)</option>
                  <option value="inside">inside (100)</option>
                  <option value="outside">outside (0)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Protocol</label>
                <select
                  value={newProtocol}
                  onChange={(e) => setNewProtocol(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                >
                  <option value="TCP">TCP</option>
                  <option value="UDP">UDP</option>
                  <option value="ICMP">ICMP</option>
                  <option value="ESP">ESP (VPN)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Port</label>
                <input
                  type="text"
                  placeholder="443"
                  value={newPort}
                  onChange={(e) => setNewPort(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Action</label>
                <select
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                >
                  <option value="allow">ALLOW</option>
                  <option value="deny">DENY</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>

          {/* Rules Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">State</th>
                    <th className="p-3">Rule Name</th>
                    <th className="p-3">Zones</th>
                    <th className="p-3">Source IP</th>
                    <th className="p-3">Dest IP : Port</th>
                    <th className="p-3">Protocol</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Hit Count</th>
                    <th className="p-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {firewallRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleRule(rule.id)}
                          className={`w-3 h-3 rounded-full cursor-pointer transition-transform ${
                            rule.enabled ? 'bg-emerald-400 ring-2 ring-emerald-500/20' : 'bg-slate-600'
                          }`}
                          title={rule.enabled ? 'Click to disable' : 'Click to enable'}
                        />
                      </td>
                      <td className="p-3 font-semibold text-white">{rule.name}</td>
                      <td className="p-3 text-slate-400">
                        {rule.sourceZone} &rarr; {rule.destZone}
                      </td>
                      <td className="p-3 text-indigo-300">{rule.sourceIp}</td>
                      <td className="p-3 text-cyan-300">
                        {rule.destIp}:{rule.port}
                      </td>
                      <td className="p-3">{rule.protocol}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rule.action === 'allow'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {rule.action.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{rule.hits} pkts</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-1 hover:text-rose-400 text-slate-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: SOC THREAT FEED ── */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search threat events..."
                value={searchEvent}
                onChange={(e) => setSearchEvent(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-64"
              />
            </div>
            <span className="text-xs font-mono text-slate-400">Showing {filteredEvents.length} events</span>
          </div>

          <div className="space-y-3">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      ev.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : ev.severity === 'HIGH'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white font-mono">{ev.type}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {ev.timestamp}
                      </span>
                      <span className="text-[10px] font-mono text-rose-400">Action: {ev.actionTaken}</span>
                    </div>
                    <p className="text-xs text-slate-300">{ev.description}</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      Target: {ev.sourceIp} &rarr; {ev.destIp} &bull; <span className="text-emerald-400">Remediation: {ev.remediation}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: THREAT SIMULATOR ── */}
      {activeTab === 'simulator' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h4 className="font-bold text-white text-base">Cybersecurity Threat Simulation Sandbox</h4>
            <p className="text-xs text-slate-400">
              Trigger simulated attack vectors to test ASA firewall rules and SOC alert triggers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h5 className="font-bold text-white text-sm">Port Scan Attack</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulates nmap SYN stealth probe against all DMZ servers across ports 1-1024.
              </p>
              <button
                onClick={() => {
                  onTriggerThreatSimulation('PORT_SCAN');
                  try {
                    confetti({ particleCount: 20, spread: 40 });
                  } catch {}
                }}
                className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-600/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Port Scan</span>
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h5 className="font-bold text-white text-sm">SMTP Brute-Force</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulates automated password spraying dictionary assault against Mail Server (10.10.150.7).
              </p>
              <button
                onClick={() => {
                  onTriggerThreatSimulation('BRUTE_FORCE');
                  try {
                    confetti({ particleCount: 20, spread: 40 });
                  } catch {}
                }}
                className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-600/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Brute-Force</span>
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h5 className="font-bold text-white text-sm">ICMP Flooding (DoS)</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sends high-frequency ping burst to test ASA TCP state tracking and interface policing.
              </p>
              <button
                onClick={() => {
                  onTriggerThreatSimulation('DOS_ATTEMPT');
                  try {
                    confetti({ particleCount: 20, spread: 40 });
                  } catch {}
                }}
                className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-600/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simulate DoS Flood</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
