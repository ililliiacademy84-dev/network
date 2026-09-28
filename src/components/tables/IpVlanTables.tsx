/**
 * Interactive IP Addressing & VLAN Scheme Explorer
 * Replicates and extends Tables 7.1 - 7.8 from the thesis
 * Supports all 4 Haramaya University Campuses: Main, HiT, CVM, and Harar
 */

import React, { useState } from 'react';
import { HARAMAYA_ENTERPRISE_VLANS } from '../../data/haramayaNetworkData';
import { ALL_HARAMAYA_DEPARTMENTS, ALL_HARAMAYA_COLLEGES } from '../../data/haramayaCollegesData';
import { Search, Table, Copy, Check, Filter, GraduationCap, Monitor } from 'lucide-react';

export const IpVlanTables: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState<'main' | 'hit' | 'cvm' | 'harar'>('main');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const campusOctetMap: Record<string, string> = {
    main: '10',
    hit: '20',
    cvm: '30',
    harar: '40'
  };

  const campusNameMap: Record<string, string> = {
    main: 'Main Campus (Bati)',
    hit: 'HiT Technology Campus',
    cvm: 'CVM Veterinary Campus',
    harar: 'Harar Health Campus (CHMS & HFSUH)'
  };

  const campusSubnetMap: Record<string, string> = {
    main: '10.10.0.0/16 (DMZ: 10.10.150.0/24)',
    hit: '10.20.0.0/16',
    cvm: '10.30.0.0/16',
    harar: '10.40.0.0/16'
  };

  // Device IP Addressing per campus (Tables 7.1, 7.3, 7.5, 7.7)
  const deviceListMap: Record<string, { dev: string; iface: string; ip: string; mask: string; desc: string }[]> = {
    main: [
      { dev: 'HU-MAIN-ASA1', iface: 'Gi1/1 (OUTSIDE)', ip: '10.100.1.2', mask: '255.255.255.252', desc: 'ISP WAN Gateway' },
      { dev: 'HU-MAIN-ASA1', iface: 'Gi1/2 (DMZ)', ip: '10.10.150.1', mask: '255.255.255.0', desc: 'DMZ Farm Firewall Gateway' },
      { dev: 'HU-MAIN-ASA1', iface: 'Gi1/3 (INSIDE1)', ip: '10.10.0.50', mask: '255.255.255.252', desc: 'Inside Core Link 1' },
      { dev: 'HU-MAIN-ASA1', iface: 'Gi1/4 (INSIDE2)', ip: '10.10.0.58', mask: '255.255.255.252', desc: 'Inside Core Link 2' },
      { dev: 'HU-MAIN-DMZ', iface: 'Gi0/0/0', ip: '10.10.150.1', mask: '255.255.255.0', desc: 'DMZ Gateway Router' },
      { dev: 'HU-MAIN-CS1', iface: 'Po1', ip: '10.10.0.1', mask: '255.255.255.240', desc: 'Core Inter-Switch Link' },
      { dev: 'HU-MAIN-CS1', iface: 'Po2', ip: '10.10.0.17', mask: '255.255.255.248', desc: 'Downlink to Dist Switch 1' },
      { dev: 'HU-MAIN-CS1', iface: 'Gi1/0/1', ip: '10.10.0.49', mask: '255.255.255.252', desc: 'Uplink to ASA Firewall' },
      { dev: 'HU-MAIN-DS1', iface: 'Po1', ip: '10.10.1.1', mask: '255.255.255.248', desc: 'Dist Inter-Switch Link' },
      { dev: 'HU-MAIN-DS1', iface: 'Po2', ip: '10.10.0.18', mask: '255.255.255.248', desc: 'Uplink to Core Switch 1' },
      { dev: 'HU-MAIN-VOIP', iface: 'Fa0/0', ip: '10.10.80.254', mask: '255.255.255.0', desc: 'Cisco 2811 CME Telephony CallManager' }
    ],
    hit: [
      { dev: 'HU-HIT-CORE', iface: 'Gi1/0/1', ip: '10.100.2.2', mask: '255.255.255.252', desc: 'ISP WAN Uplink (IPSec VPN Peer)' },
      { dev: 'HU-HIT-CORE', iface: 'Gi1/0/2', ip: '10.20.0.1', mask: '255.255.255.0', desc: 'HiT Campus L3 Core Backbone' },
      { dev: 'SW-HIT-CYBER', iface: 'Gi0/1', ip: '10.20.40.2', mask: '255.255.255.0', desc: 'Cybersecurity Lab Trunk Uplink' },
      { dev: 'SW-HIT-IOT', iface: 'Gi0/1', ip: '10.20.100.2', mask: '255.255.255.0', desc: 'IoT & Robotics Lab Trunk Uplink' },
      { dev: 'HU-HIT-CORE', iface: 'VLAN 80 (Voice)', ip: '10.20.80.1', mask: '255.255.255.0', desc: 'HiT Engineering CME VoIP Gateway' }
    ],
    cvm: [
      { dev: 'HU-CVM-CORE', iface: 'Gi1/0/1', ip: '10.100.3.2', mask: '255.255.255.252', desc: 'ISP WAN Uplink (IPSec VPN Peer)' },
      { dev: 'HU-CVM-CORE', iface: 'Gi1/0/2', ip: '10.30.0.1', mask: '255.255.255.0', desc: 'CVM Campus L3 Core Backbone' },
      { dev: 'SW-CVM-HOSP', iface: 'Gi0/1', ip: '10.30.140.2', mask: '255.255.255.0', desc: 'Veterinary Hospital Switch Uplink' },
      { dev: 'SW-CVM-PATH', iface: 'Gi0/1', ip: '10.30.40.2', mask: '255.255.255.0', desc: 'Diagnostic Pathology Lab Uplink' },
      { dev: 'HU-CVM-CORE', iface: 'VLAN 80 (Voice)', ip: '10.30.80.1', mask: '255.255.255.0', desc: 'CVM Clinic Emergency VoIP Gateway' }
    ],
    harar: [
      { dev: 'HU-HARAR-ASA1', iface: 'Gi1/1 (OUTSIDE)', ip: '10.100.4.2', mask: '255.255.255.252', desc: 'ISP WAN Uplink (IPSec VPN to Main)' },
      { dev: 'HU-HARAR-ASA1', iface: 'Gi1/2 (INSIDE)', ip: '10.40.0.1', mask: '255.255.255.0', desc: 'Inside Core Router Link' },
      { dev: 'HU-HARAR-CS1', iface: 'Gi1/0/1', ip: '10.40.0.1', mask: '255.255.255.0', desc: 'Catalyst 3650 Core Switch' },
      { dev: 'SW-HARAR-HOSP', iface: 'Gi0/1', ip: '10.40.30.2', mask: '255.255.255.0', desc: 'Hiwot Fana Hospital Clinical Care SW' },
      { dev: 'SW-HARAR-MED', iface: 'Gi0/1', ip: '10.40.40.2', mask: '255.255.255.0', desc: 'Medical School & Telehealth SW' }
    ]
  };

  // Dedicated Servers per campus (Table 7.4 & 7.8)
  const serverListMap: Record<string, { name: string; ip: string; mask: string; gw: string; dns: string; role: string }[]> = {
    main: [
      { name: 'HU-DNS', ip: '10.10.150.4', mask: '255.255.255.0', gw: '10.10.150.1', dns: '10.10.150.4', role: 'Authoritative DNS (haramaya.edu.et)' },
      { name: 'HU-DHCP', ip: '10.10.150.5', mask: '255.255.255.0', gw: '10.10.150.1', dns: '10.10.150.4', role: 'Campus Dynamic DHCP Server' },
      { name: 'HU-WEB', ip: '10.10.150.6', mask: '255.255.255.0', gw: '10.10.150.1', dns: '10.10.150.4', role: 'Official Academic Portal (HTTPS 443)' },
      { name: 'HU-MAIL', ip: '10.10.150.7', mask: '255.255.255.0', gw: '10.10.150.1', dns: '10.10.150.4', role: 'Enterprise Mail Agent (SMTP/POP3)' },
      { name: 'HU-NTP', ip: '10.10.150.8', mask: '255.255.255.0', gw: '10.10.150.1', dns: '10.10.150.4', role: 'Stratum-2 Time Synchronization' },
      { name: 'HU-SYSLOG', ip: '10.10.150.9', mask: '255.255.255.0', gw: '10.10.150.1', dns: '10.10.150.4', role: 'SOC Central Security Logging' },
      { name: 'HU-FTP', ip: '10.10.150.10', mask: '255.255.255.0', gw: '10.10.150.1', dns: '10.10.150.4', role: 'Cisco IOS Image & Config Archive' },
      { name: 'HU-IOT-REG', ip: '10.10.150.12', mask: '255.255.255.0', gw: '10.10.150.1', dns: '10.10.150.4', role: 'Smart Campus IoT Controller' }
    ],
    hit: [
      { name: 'HIT-DNS-CACHE', ip: '10.20.70.4', mask: '255.255.255.0', gw: '10.20.0.1', dns: '10.10.150.4', role: 'HiT Local DNS Forwarder' },
      { name: 'HIT-DHCP-RELAY', ip: '10.20.70.5', mask: '255.255.255.0', gw: '10.20.0.1', dns: '10.10.150.4', role: 'Engineering VLAN DHCP Helper' },
      { name: 'HIT-ROBOTICS-SRV', ip: '10.20.70.15', mask: '255.255.255.0', gw: '10.20.0.1', dns: '10.10.150.4', role: 'HiT Embedded Systems Telemetry' }
    ],
    cvm: [
      { name: 'CVM-CLINIC-SRV', ip: '10.30.70.10', mask: '255.255.255.0', gw: '10.30.0.1', dns: '10.10.150.4', role: 'Animal Hospital Patient EMR' },
      { name: 'CVM-COLD-MONITOR', ip: '10.30.70.25', mask: '255.255.255.0', gw: '10.30.0.1', dns: '10.10.150.4', role: 'Vaccine Cold Storage Telemetry' }
    ],
    harar: [
      { name: 'HARAR-EHR-SRV', ip: '10.40.70.20', mask: '255.255.255.0', gw: '10.40.0.1', dns: '10.10.150.4', role: 'HFSUH Hospital Records System' },
      { name: 'HARAR-PACS-PACS', ip: '10.40.70.30', mask: '255.255.255.0', gw: '10.40.0.1', dns: '10.10.150.4', role: 'Radiology PACS Telemedicine Server' }
    ]
  };

  const currentDeviceList = (deviceListMap[selectedCampus] || []).filter(
    (d) =>
      !searchQuery ||
      d.dev.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentServerList = (serverListMap[selectedCampus] || []).filter(
    (s) =>
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const octet = campusOctetMap[selectedCampus] || '10';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Filter and Campus Selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedCampus('main')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedCampus === 'main'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Main Campus (10.10.0.0/16)
          </button>
          <button
            onClick={() => setSelectedCampus('hit')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedCampus === 'hit'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HiT Campus (10.20.0.0/16)
          </button>
          <button
            onClick={() => setSelectedCampus('cvm')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedCampus === 'cvm'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CVM Campus (10.30.0.0/16)
          </button>
          <button
            onClick={() => setSelectedCampus('harar')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedCampus === 'harar'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Harar Health (10.40.0.0/16)
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full sm:w-72 text-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search IP, device, VLAN, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white w-full font-mono text-xs"
          />
        </div>
      </div>

      {/* ── SECTION 1: VLAN IP ADDRESSING ── */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              VLAN IP Addressing Scheme &bull; {campusNameMap[selectedCampus]}
            </h3>
            <p className="text-xs text-slate-400">15 Standardized Enterprise VLANs with Default Gateways, Subnet Mask & Host Ranges</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-indigo-300 font-semibold">
            {campusSubnetMap[selectedCampus]}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Department (VLAN)</th>
                <th className="p-3">Network & Mask</th>
                <th className="p-3">Valid Host Range</th>
                <th className="p-3">Default Gateway</th>
                <th className="p-3">Broadcast</th>
                <th className="p-3">DHCP Pool</th>
                <th className="p-3 text-right">Copy GW</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {HARAMAYA_ENTERPRISE_VLANS
                .filter(
                  (v) =>
                    !searchQuery ||
                    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    String(v.id).includes(searchQuery)
                )
                .map((v) => {
                  const net = `10.${octet}.${v.id}.0/24`;
                  const gw = `10.${octet}.${v.id}.1`;
                  const validRange = `10.${octet}.${v.id}.2 - 10.${octet}.${v.id}.254`;
                  const bcast = `10.${octet}.${v.id}.255`;

                  return (
                    <tr key={v.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">
                        {v.name} <span className="text-indigo-400">(VLAN {v.id})</span>
                        <span className="block text-[10px] text-slate-400 font-sans mt-0.5">{v.description}</span>
                      </td>
                      <td className="p-3 text-emerald-400">{net}</td>
                      <td className="p-3 text-slate-300">{validRange}</td>
                      <td className="p-3 text-cyan-300 font-bold">{gw}</td>
                      <td className="p-3 text-slate-400">{bcast}</td>
                      <td className="p-3 text-amber-300">{v.dhcpPoolName}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => copyText(gw, `vlan-${v.id}`)}
                          className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                          title="Copy Gateway IP"
                        >
                          {copiedKey === `vlan-${v.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION 2: SERVER IP ADDRESSING ── */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Server IP Addressing &bull; {campusNameMap[selectedCampus]}
            </h3>
            <p className="text-xs text-slate-400">Core Network Daemons, DNS, Web Portals, Telehealth & IoT Controllers</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-emerald-300 font-semibold">
            {currentServerList.length} Server Instances
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Server Name</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Subnet Mask</th>
                <th className="p-3">Default Gateway</th>
                <th className="p-3">DNS Server</th>
                <th className="p-3">Role & Function</th>
                <th className="p-3 text-right">Copy IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {currentServerList.map((srv, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{srv.name}</td>
                  <td className="p-3 text-emerald-400 font-bold">{srv.ip}</td>
                  <td className="p-3 text-slate-400">{srv.mask}</td>
                  <td className="p-3 text-cyan-300">{srv.gw}</td>
                  <td className="p-3 text-indigo-300">{srv.dns}</td>
                  <td className="p-3 text-slate-300">{srv.role}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => copyText(srv.ip, `srv-${idx}`)}
                      className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                      title="Copy Server IP"
                    >
                      {copiedKey === `srv-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION 3: DEVICE & PORT IP ADDRESSING ── */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Device Port & Interconnect Addressing &bull; {campusNameMap[selectedCampus]}
            </h3>
            <p className="text-xs text-slate-400">Cisco ASA Firewalls, ISR Routers, Core & Distribution Multi-Layer Switches</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-indigo-300 font-semibold">
            {currentDeviceList.length} Monitored Ports
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Device</th>
                <th className="p-3">Interface / Port</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Subnet Mask</th>
                <th className="p-3">Function / Peer Connection</th>
                <th className="p-3 text-right">Copy IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {currentDeviceList.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{d.dev}</td>
                  <td className="p-3 text-indigo-300">{d.iface}</td>
                  <td className="p-3 text-emerald-400 font-bold">{d.ip}</td>
                  <td className="p-3 text-slate-400">{d.mask}</td>
                  <td className="p-3 text-slate-300">{d.desc}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => copyText(d.ip, `dev-${idx}`)}
                      className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                      title="Copy Interface IP"
                    >
                      {copiedKey === `dev-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION 4: COLLEGE & DEPARTMENT WORKSTATION DIRECTORY ── */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>College & Department Workstation Addressing Directory &bull; {campusNameMap[selectedCampus]}</span>
            </h3>
            <p className="text-xs text-slate-400">All Academic Departments, Access Switch Interfaces, VLANs, Gateways & Workstation MACs</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-300 font-semibold">
            {ALL_HARAMAYA_DEPARTMENTS.filter((d) => d.campusId === selectedCampus).length} Departments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Department & School</th>
                <th className="p-3">Assigned College</th>
                <th className="p-3">Workstation Host</th>
                <th className="p-3">Workstation IP</th>
                <th className="p-3">VLAN & Gateway</th>
                <th className="p-3">Switch & Port</th>
                <th className="p-3">MAC Address</th>
                <th className="p-3 text-right">Copy IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {ALL_HARAMAYA_DEPARTMENTS
                .filter((d) => d.campusId === selectedCampus)
                .filter(
                  (d) =>
                    !searchQuery ||
                    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    d.workstationIp.includes(searchQuery) ||
                    String(d.vlan).includes(searchQuery)
                )
                .map((d) => {
                  const college = ALL_HARAMAYA_COLLEGES.find((c) => c.id === d.collegeId);

                  return (
                    <tr key={d.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">
                        {d.name} <span className="text-indigo-400">({d.code})</span>
                      </td>
                      <td className="p-3 text-slate-400">{college?.shortName || d.collegeId}</td>
                      <td className="p-3 text-cyan-300 font-bold">{d.workstationName}</td>
                      <td className="p-3 text-emerald-400 font-bold">{d.workstationIp}</td>
                      <td className="p-3 text-slate-300">
                        <span className="text-amber-300 font-semibold">VLAN {d.vlan}</span> &bull; {d.gateway}
                      </td>
                      <td className="p-3 text-indigo-300">
                        {d.switchId.toUpperCase()} [{d.switchPort}]
                      </td>
                      <td className="p-3 text-slate-400">{d.workstationMac}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => copyText(d.workstationIp, `dept-ip-${d.id}`)}
                          className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                          title="Copy Workstation IP"
                        >
                          {copiedKey === `dept-ip-${d.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
