/**
 * Enterprise Subnet Calculator & VLSM Planner
 * Haramaya University IP Address Management (IPAM) Tool
 */

import React, { useState } from 'react';
import { 
  Calculator, 
  Layers, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Network, 
  Hash, 
  Zap, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VlsmSubnet {
  id: string;
  name: string;
  hostsNeeded: number;
  allocatedHosts: number;
  prefix: number;
  subnetMask: string;
  networkAddress: string;
  firstHost: string;
  lastHost: string;
  broadcastAddress: string;
  campus: string;
  vlan: number;
}

export const SubnetCalculator: React.FC = () => {
  const [baseIp, setBaseIp] = useState<string>('10.10.0.0');
  const [basePrefix, setBasePrefix] = useState<number>(16);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // VLSM Requirement Input
  const [subnets, setSubnets] = useState<Array<{ id: string; name: string; hostsNeeded: number; campus: string; vlan: number }>>([
    { id: '1', name: 'Main Campus Central Students', hostsNeeded: 2000, campus: 'Main (Bati)', vlan: 30 },
    { id: '2', name: 'HiT Engineering Computer Labs', hostsNeeded: 1000, campus: 'HiT Campus', vlan: 140 },
    { id: '3', name: 'Harar HiOT Referral Hospital Clinics', hostsNeeded: 500, campus: 'Harar Campus', vlan: 40 },
    { id: '4', name: 'CVM Veterinary Clinical Staff', hostsNeeded: 250, campus: 'CVM Campus', vlan: 20 },
    { id: '5', name: 'DMZ Server Farm & Public Services', hostsNeeded: 60, campus: 'Main DMZ', vlan: 150 },
    { id: '6', name: 'Smart IoT Campus Sensors & Relays', hostsNeeded: 120, campus: 'All Campuses', vlan: 100 },
    { id: '7', name: 'University Central Administration', hostsNeeded: 100, campus: 'Main (Bati)', vlan: 10 },
    { id: '8', name: 'Inter-Campus Point-to-Point WAN Link 1', hostsNeeded: 2, campus: 'EthioTelecom WAN', vlan: 99 }
  ]);

  const [newName, setNewName] = useState<string>('');
  const [newHosts, setNewHosts] = useState<number>(50);
  const [newCampus, setNewCampus] = useState<string>('Main (Bati)');
  const [newVlan, setNewVlan] = useState<number>(10);

  // Convert IP string to number
  const ipToLong = (ip: string): number => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  };

  // Convert number to IP string
  const longToIp = (long: number): string => {
    return [
      (long >>> 24) & 255,
      (long >>> 16) & 255,
      (long >>> 8) & 255,
      long & 255
    ].join('.');
  };

  // Convert prefix to subnet mask
  const prefixToMask = (prefix: number): string => {
    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    return longToIp(mask);
  };

  // Calculate VLSM allocations sorted by hosts needed (descending)
  const calculateVlsm = (): VlsmSubnet[] => {
    const sorted = [...subnets].sort((a, b) => b.hostsNeeded - a.hostsNeeded);
    let currentLong = ipToLong(baseIp);

    return sorted.map((item) => {
      // Find power of 2 >= needed + 2 (network + broadcast)
      let bits = 0;
      while (Math.pow(2, bits) - 2 < item.hostsNeeded) {
        bits++;
      }
      bits = Math.max(bits, 2); // Minimum /30
      const prefix = 32 - bits;
      const totalSize = Math.pow(2, bits);
      const allocatedHosts = totalSize - 2;

      // Align currentLong to boundary
      const remainder = currentLong % totalSize;
      if (remainder !== 0) {
        currentLong += (totalSize - remainder);
      }

      const netLong = currentLong;
      const firstLong = netLong + 1;
      const lastLong = netLong + totalSize - 2;
      const bcastLong = netLong + totalSize - 1;

      currentLong += totalSize;

      return {
        id: item.id,
        name: item.name,
        hostsNeeded: item.hostsNeeded,
        allocatedHosts,
        prefix,
        subnetMask: prefixToMask(prefix),
        networkAddress: longToIp(netLong),
        firstHost: longToIp(firstLong),
        lastHost: longToIp(lastLong),
        broadcastAddress: longToIp(bcastLong),
        campus: item.campus,
        vlan: item.vlan
      };
    });
  };

  const calculatedSubnets = calculateVlsm();
  const totalAllocated = calculatedSubnets.reduce((acc, s) => acc + s.allocatedHosts + 2, 0);
  const totalBaseCapacity = Math.pow(2, 32 - basePrefix);

  const handleAddSubnet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newHosts <= 0) return;
    setSubnets((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}`,
        name: newName.trim(),
        hostsNeeded: newHosts,
        campus: newCampus,
        vlan: newVlan
      }
    ]);
    setNewName('');
    setNewHosts(50);
    try {
      confetti({ particleCount: 20, spread: 40 });
    } catch {}
  };

  const handleDeleteSubnet = (id: string) => {
    setSubnets((prev) => prev.filter((s) => s.id !== id));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 p-6 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Haramaya VLSM & IPAM Subnet Calculator</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              RFC 1918 / RFC 1878
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Variable-Length Subnet Masking (VLSM) engine for campus network partitioning, address conservation, and router gateway sizing.
          </p>
        </div>

        {/* Base Network Setup */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
          <div className="flex flex-col">
            <label className="text-[10px] text-slate-400 uppercase font-mono">Major Network IP</label>
            <input
              type="text"
              value={baseIp}
              onChange={(e) => setBaseIp(e.target.value)}
              className="bg-transparent text-sm font-mono font-bold text-white focus:outline-none w-28"
            />
          </div>
          <span className="text-slate-600 text-lg font-mono">/</span>
          <div className="flex flex-col">
            <label className="text-[10px] text-slate-400 uppercase font-mono">Major Prefix</label>
            <select
              value={basePrefix}
              onChange={(e) => setBasePrefix(parseInt(e.target.value, 10))}
              className="bg-transparent text-sm font-mono font-bold text-cyan-400 focus:outline-none cursor-pointer"
            >
              {[8, 12, 16, 20, 24].map((p) => (
                <option key={p} value={p} className="bg-slate-900 text-white">
                  /{p} ({Math.pow(2, 32 - p).toLocaleString()} addresses)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-indigo-400" />
            Address Pool Utilization ({baseIp}/{basePrefix})
          </span>
          <span className="font-mono text-slate-400">
            {totalAllocated.toLocaleString()} / {totalBaseCapacity.toLocaleString()} IPs (
            {((totalAllocated / totalBaseCapacity) * 100).toFixed(2)}% used)
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(2, (totalAllocated / totalBaseCapacity) * 100))}%` }}
          />
        </div>
      </div>

      {/* Add New Department Subnet Form */}
      <form onSubmit={handleAddSubnet} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Department / Service Name (e.g. HiT Mechanical Labs)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="w-32">
          <input
            type="number"
            min="1"
            max="65534"
            placeholder="Hosts Needed"
            value={newHosts}
            onChange={(e) => setNewHosts(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={newCampus}
          onChange={(e) => setNewCampus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="Main (Bati)">Main Campus (Bati)</option>
          <option value="HiT Campus">HiT Tech Campus</option>
          <option value="CVM Campus">CVM Veterinary</option>
          <option value="Harar Campus">Harar Health</option>
          <option value="Main DMZ">Main DMZ</option>
          <option value="EthioTelecom WAN">EthioTelecom WAN</option>
        </select>

        <div className="w-24">
          <input
            type="number"
            min="1"
            max="4094"
            placeholder="VLAN ID"
            value={newVlan}
            onChange={(e) => setNewVlan(parseInt(e.target.value, 10) || 10)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-600/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add VLSM Subnet</span>
        </button>
      </form>

      {/* VLSM Output Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Computed VLSM Allocation Table (Sorted by Largest Host Size)
          </h3>
          <span className="text-xs font-mono text-slate-400">{calculatedSubnets.length} Allocated Subnets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Department / Purpose</th>
                <th className="py-3 px-4">Campus & VLAN</th>
                <th className="py-3 px-4">Hosts (Req/Alloc)</th>
                <th className="py-3 px-4">Network Address</th>
                <th className="py-3 px-4">Prefix / Mask</th>
                <th className="py-3 px-4">Usable Host Range</th>
                <th className="py-3 px-4">Broadcast</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {calculatedSubnets.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-white">
                    {sub.name}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
                      {sub.campus} &bull; VLAN {sub.vlan}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-amber-400">{sub.hostsNeeded} req</span>
                    <span className="text-slate-500"> / </span>
                    <span className="text-emerald-400 font-bold">{sub.allocatedHosts} alloc</span>
                  </td>
                  <td className="py-3 px-4 text-cyan-300 font-bold">
                    {sub.networkAddress}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white font-bold">/{sub.prefix}</span>
                    <span className="text-slate-400 block text-[10px]">{sub.subnetMask}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {sub.firstHost} <span className="text-slate-500">to</span> {sub.lastHost}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {sub.broadcastAddress}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => copyToClipboard(`network ${sub.networkAddress} ${sub.subnetMask}`, sub.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                        title="Copy Cisco Network Statement"
                      >
                        {copiedId === sub.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteSubnet(sub.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                        title="Delete Subnet"
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
  );
};
