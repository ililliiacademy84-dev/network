import React, { useState } from 'react';
import { NetworkDevice, NetworkLink, VlanInfo, FirewallRule } from '../../types/network';
import { FileText, Download, Printer, CheckCircle2, ShieldCheck, Network, Cpu, Database } from 'lucide-react';

interface DocumentationGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: NetworkDevice[];
  links: NetworkLink[];
  vlans: VlanInfo[];
  firewallRules: FirewallRule[];
}

export const DocumentationGeneratorModal: React.FC<DocumentationGeneratorModalProps> = ({
  isOpen,
  onClose,
  devices,
  links,
  vlans,
  firewallRules
}) => {
  const [docType, setDocType] = useState<'full' | 'ipam' | 'vlans' | 'firewall'>('full');

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportJson = () => {
    const data = {
      title: 'Haramaya University Secure & Smart Advanced Network (HU-SSAN) Technical Design Document',
      generatedAt: new Date().toISOString(),
      summary: {
        totalDevices: devices.length,
        totalLinks: links.length,
        totalVlans: vlans.length,
        totalFirewallRules: firewallRules.length
      },
      devices,
      links,
      vlans,
      firewallRules
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HU-SSAN_Technical_Network_Design_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    let csv = 'Device Hostname,Type,Campus,Management IP,VLAN,Status\n';
    devices.forEach(d => {
      csv += `"${d.name}","${d.type}","${d.campus}","${d.managementIp || 'DHCP'}","${d.vlan || 1}","${d.power ? 'UP' : 'DOWN'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HU-SSAN_Device_Inventory_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0c0c] border border-slate-800 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-2">
                <span>TECHNICAL NETWORK DESIGN DOCUMENTATION GENERATOR</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Automated engineering spec, IPAM plan, VLAN directory & ASA firewall matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2 rounded-xl bg-[#00ff87] text-slate-950 text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#00ff87]/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Preview Document */}
        <div className="p-8 overflow-y-auto space-y-8 bg-[#050505] text-slate-200 font-mono text-xs printable-area">
          {/* Document Header */}
          <div className="border-b border-slate-800 pb-6 space-y-2">
            <div className="inline-block px-3 py-1 rounded-md bg-[#00ff87]/20 text-[#00ff87] text-[10px] font-bold uppercase tracking-widest">
              Haramaya University Enterprise Infrastructure Spec
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              HARAMAYA UNIVERSITY SECURE & SMART ADVANCED NETWORK (HU-SSAN)
            </h1>
            <p className="text-slate-400">
              Campus Locations: Main Campus (Bati) &bull; HiT Engineering &bull; CVM Station &bull; Harar Health CHMS
            </p>
          </div>

          {/* Executive Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Active Devices</span>
              <span className="text-xl font-black text-white">{devices.length} Nodes</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Physical Links</span>
              <span className="text-xl font-black text-[#00ff87]">{links.length} Active Connections</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">VLAN Segments</span>
              <span className="text-xl font-black text-cyan-300">{vlans.length} VLANs Configured</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Firewall Rules</span>
              <span className="text-xl font-black text-emerald-400">{firewallRules.length} ASA Policies</span>
            </div>
          </div>

          {/* Section 1: Device Inventory Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider text-[#00ff87]">
              1.0 Infrastructure Device Inventory
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Hostname</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Campus</th>
                    <th className="p-3">Management IP</th>
                    <th className="p-3">Default Gateway</th>
                    <th className="p-3">Power</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950">
                  {devices.map(d => (
                    <tr key={d.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white">{d.name}</td>
                      <td className="p-3 uppercase text-slate-300">{d.type}</td>
                      <td className="p-3 uppercase text-cyan-300 font-bold">{d.campus}</td>
                      <td className="p-3 text-[#00ff87]">{d.managementIp || '10.10.1.1'}</td>
                      <td className="p-3 text-slate-400">{d.gateway || '10.10.1.1'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${d.power ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                          {d.power ? 'ONLINE' : 'OFFLINE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: VLAN Directory */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider text-cyan-300">
              2.0 VLAN Allocation & Subnet Directory (IPAM)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vlans.map(v => (
                <div key={v.id} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-sm">VLAN {v.id}: {v.name}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">{v.campus}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{v.description}</p>
                  <div className="pt-2 text-[10px] text-slate-300 flex items-center justify-between">
                    <span>Subnet: <strong className="text-[#00ff87]">{v.subnet}/{v.subnetMask}</strong></span>
                    <span>Gateway: <strong className="text-white">{v.gateway}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
