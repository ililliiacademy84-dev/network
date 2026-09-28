/**
 * Cisco Packet Tracer Server Services Configuration GUI Modal
 * Covers HTTP, DHCP, DNS, Email, FTP, NTP, Syslog, and IoT registration services.
 */

import React, { useState } from 'react';
import { NetworkDevice, DnsRecord, FtpFile, SyslogEntry } from '../../types/network';
import { 
  Server, 
  Globe, 
  Network, 
  Mail, 
  FolderDown, 
  Clock, 
  ScrollText, 
  Cpu, 
  X, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle,
  Eye,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ServerServicesModalProps {
  device: NetworkDevice;
  dnsRecords: DnsRecord[];
  onUpdateDns: (records: DnsRecord[]) => void;
  ftpFiles: FtpFile[];
  onUpdateFtp: (files: FtpFile[]) => void;
  syslogLogs: SyslogEntry[];
  onClose: () => void;
}

export const ServerServicesModal: React.FC<ServerServicesModalProps> = ({
  device,
  dnsRecords,
  onUpdateDns,
  ftpFiles,
  onUpdateFtp,
  syslogLogs,
  onClose
}) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  // Pick default tab based on server type/name
  const getInitialTab = () => {
    const id = device.id.toLowerCase();
    if (id.includes('dns')) return 'dns';
    if (id.includes('dhcp')) return 'dhcp';
    if (id.includes('web')) return 'http';
    if (id.includes('mail')) return 'mail';
    if (id.includes('ftp')) return 'ftp';
    if (id.includes('ntp')) return 'ntp';
    if (id.includes('syslog')) return 'syslog';
    if (id.includes('iot')) return 'iot';
    return 'http';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());

  // Services On/Off switches
  const [httpOn, setHttpOn] = useState<boolean>(true);
  const [dnsOn, setDnsOn] = useState<boolean>(true);
  const [dhcpOn, setDhcpOn] = useState<boolean>(true);
  const [mailOn, setMailOn] = useState<boolean>(true);
  const [ftpOn, setFtpOn] = useState<boolean>(true);
  const [ntpOn, setNtpOn] = useState<boolean>(true);
  const [syslogOn, setSyslogOn] = useState<boolean>(true);
  const [iotOn, setIotOn] = useState<boolean>(true);

  // DNS Form state
  const [newDomain, setNewDomain] = useState<string>('');
  const [newTarget, setNewTarget] = useState<string>('');
  const [newType, setNewType] = useState<'A' | 'CNAME'>('A');

  // Web HTML preview state
  const [htmlContent, setHtmlContent] = useState<string>(`<!DOCTYPE html>
<html>
<head>
  <title>Welcome to Haramaya University</title>
</head>
<body style="font-family: sans-serif; background: #0b1329; color: #fff; padding: 20px;">
  <h1 style="color: #6366f1;">Haramaya University Portal</h1>
  <p>Building the Future Through Knowledge & Innovation</p>
  <hr style="border-color: #334155;"/>
  <p><strong>Campus 1 (Main Campus):</strong> Haramaya - Computing, Engineering, Admin</p>
  <p><strong>Campus 2:</strong> Harar Campus - Health & Medical Sciences</p>
  <p>Network status: Operational &bull; IPSec VPN Active</p>
</body>
</html>`);
  const [previewHtml, setPreviewHtml] = useState<boolean>(false);

  // FTP Upload simulation
  const [newFileName, setNewFileName] = useState<string>('');
  const [newFileContent, setNewFileContent] = useState<string>('');

  const handleAddDnsRecord = () => {
    if (!newDomain || !newTarget) return;
    const updated = [...dnsRecords, { domain: newDomain.trim(), type: newType, target: newTarget.trim() }];
    onUpdateDns(updated);
    setNewDomain('');
    setNewTarget('');
  };

  const handleDeleteDnsRecord = (domain: string) => {
    onUpdateDns(dnsRecords.filter((r) => r.domain !== domain));
  };

  const handleAddFtpFile = () => {
    if (!newFileName) return;
    const newFile: FtpFile = {
      name: newFileName.trim(),
      size: `${newFileContent.length} bytes`,
      date: 'Sep 27 2026',
      content: newFileContent || 'Binary or text file payload.'
    };
    onUpdateFtp([...ftpFiles, newFile]);
    setNewFileName('');
    setNewFileContent('');
  };

  const handleDeleteFtpFile = (name: string) => {
    onUpdateFtp(ftpFiles.filter((f) => f.name !== name));
  };

  return (
    <div className={`fixed z-50 inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center ${isFullScreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-200 transition-all ${
        isFullScreen ? 'w-full h-full rounded-none border-none' : 'rounded-2xl w-full max-w-4xl h-[740px]'
      }`}>
        {/* Modal Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">{device.name} ({device.hostname})</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Cisco Server-PT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                IP: {device.managementIp} &bull; Gateway: {device.gateway} &bull; DMZ Zone
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isFullScreen ? 'Restore' : 'Maximize'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Layout: Sidebar & Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Services Navigation Sidebar */}
          <div className="w-52 bg-slate-950/70 border-r border-slate-800 p-3 flex flex-col gap-1 select-none overflow-y-auto">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-2 mb-1">
              Packet Tracer Services
            </span>

            {[
              { id: 'http', label: 'HTTP / Web', icon: Globe, enabled: httpOn },
              { id: 'dhcp', label: 'DHCP Pool', icon: Network, enabled: dhcpOn },
              { id: 'dns', label: 'DNS Service', icon: Globe, enabled: dnsOn },
              { id: 'mail', label: 'EMAIL (SMTP/POP3)', icon: Mail, enabled: mailOn },
              { id: 'ftp', label: 'FTP Server', icon: FolderDown, enabled: ftpOn },
              { id: 'ntp', label: 'NTP Time', icon: Clock, enabled: ntpOn },
              { id: 'syslog', label: 'SYSLOG Logs', icon: ScrollText, enabled: syslogOn },
              { id: 'iot', label: 'IoT Manager', icon: Cpu, enabled: iotOn }
            ].map((srv) => {
              const Icon = srv.icon;
              const isActive = activeTab === srv.id;
              return (
                <button
                  key={srv.id}
                  onClick={() => setActiveTab(srv.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{srv.label}</span>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      srv.enabled ? 'bg-emerald-400 ring-2 ring-emerald-500/20' : 'bg-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Service Configuration Body */}
          <div className="flex-1 bg-slate-900/60 p-6 overflow-y-auto">
            {/* ── HTTP / WEB SERVICE ── */}
            {activeTab === 'http' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-semibold text-white">HTTP & HTTPS Web Server</h4>
                    <p className="text-xs text-slate-400">Hosts the official Haramaya University Academic Portal</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-slate-300">Service:</label>
                    <button
                      onClick={() => setHttpOn(!httpOn)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        httpOn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {httpOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400">File: index.html</span>
                  <button
                    onClick={() => setPreviewHtml(!previewHtml)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{previewHtml ? 'Edit Source' : 'Live Preview'}</span>
                  </button>
                </div>

                {previewHtml ? (
                  <div className="border border-slate-700 rounded-xl bg-slate-950 p-4 h-96 overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                  </div>
                ) : (
                  <textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    rows={15}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 font-mono text-xs text-emerald-400 focus:outline-none focus:border-indigo-500 selection:bg-indigo-500"
                    spellCheck={false}
                  />
                )}
              </div>
            )}

            {/* ── DNS SERVICE ── */}
            {activeTab === 'dns' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-semibold text-white">Domain Name System (DNS) Service</h4>
                    <p className="text-xs text-slate-400">Resolves university domains to IP addresses (Figure 9.9a)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-slate-300">Service:</label>
                    <button
                      onClick={() => setDnsOn(!dnsOn)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        dnsOn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {dnsOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                {/* Add Record Form */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Name (FQDN)</label>
                    <input
                      type="text"
                      placeholder="e.g. portal.haramaya.edu.et"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as 'A' | 'CNAME')}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="A">A Record</option>
                      <option value="CNAME">CNAME</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Target Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 172.16.10.6"
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={handleAddDnsRecord}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Record</span>
                  </button>
                </div>

                {/* DNS Records Table */}
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Resource Name</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Target / IP</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {dnsRecords.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-800/40">
                          <td className="p-3 text-emerald-400">{r.domain}</td>
                          <td className="p-3 text-indigo-300">{r.type} Record</td>
                          <td className="p-3 text-slate-200">{r.target}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteDnsRecord(r.domain)}
                              className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/10 cursor-pointer"
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
            )}

            {/* ── DHCP SERVICE ── */}
            {activeTab === 'dhcp' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-semibold text-white">Dynamic Host Configuration Protocol (DHCP)</h4>
                    <p className="text-xs text-slate-400">Automated address distribution for campus workstations</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-slate-300">Service:</label>
                    <button
                      onClick={() => setDhcpOn(!dhcpOn)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        dhcpOn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {dhcpOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Pool Name</span>
                    <span className="font-mono text-white font-semibold">HARAMAYA_CAMPUS1_POOL</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Default Gateway</span>
                    <span className="font-mono text-emerald-400">192.168.10.1</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">DNS Server</span>
                    <span className="font-mono text-indigo-400">172.16.10.4</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Lease Time</span>
                    <span className="font-mono text-slate-300">7 Days (Standard)</span>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Active Dynamic Leases</h5>
                  <div className="border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Client Device</th>
                          <th className="p-2.5">MAC Address</th>
                          <th className="p-2.5">Assigned IP</th>
                          <th className="p-2.5">VLAN</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        <tr>
                          <td className="p-2.5 text-white">C1-PC-Admin1</td>
                          <td className="p-2.5">00E0.F725.0001</td>
                          <td className="p-2.5 text-emerald-400">192.168.10.25</td>
                          <td className="p-2.5">VLAN 10</td>
                          <td className="p-2.5 text-emerald-400">Active Lease</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-white">C1-PC-Admin2</td>
                          <td className="p-2.5">00E0.F725.0002</td>
                          <td className="p-2.5 text-emerald-400">192.168.10.26</td>
                          <td className="p-2.5">VLAN 10</td>
                          <td className="p-2.5 text-emerald-400">Active Lease</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-white">C1-IPPhone-1001</td>
                          <td className="p-2.5">000B.BE11.1001</td>
                          <td className="p-2.5 text-emerald-400">192.168.10.30</td>
                          <td className="p-2.5">VLAN 10</td>
                          <td className="p-2.5 text-emerald-400">Voice DHCP</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── EMAIL SERVICE ── */}
            {activeTab === 'mail' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-semibold text-white">SMTP / POP3 Mail Server</h4>
                    <p className="text-xs text-slate-400">Official university electronic mail delivery daemon (Figure 9.11)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-slate-300">Service:</label>
                    <button
                      onClick={() => setMailOn(!mailOn)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        mailOn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {mailOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Domain Name:</span>
                    <span className="font-mono text-indigo-400 font-semibold text-sm">haramaya.edu.et</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      SMTP Port: 25
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      POP3 Port: 110
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Registered Mailboxes</h5>
                  <div className="border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Display Name</th>
                          <th className="p-3">Department</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        <tr>
                          <td className="p-3 text-emerald-400">admin1@haramaya.edu.et</td>
                          <td className="p-3 text-white">Main Admin Officer 1</td>
                          <td className="p-3 text-slate-400">Administration</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-emerald-400">admin2@haramaya.edu.et</td>
                          <td className="p-3 text-white">Main Admin Officer 2</td>
                          <td className="p-3 text-slate-400">Administration</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-emerald-400">president@haramaya.edu.et</td>
                          <td className="p-3 text-white">University President</td>
                          <td className="p-3 text-slate-400">Executive Office</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-emerald-400">registrar@haramaya.edu.et</td>
                          <td className="p-3 text-white">Admissions & Records</td>
                          <td className="p-3 text-slate-400">Registrar</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── FTP SERVICE ── */}
            {activeTab === 'ftp' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-semibold text-white">File Transfer Protocol (FTP) Service</h4>
                    <p className="text-xs text-slate-400">File distribution and configuration repository (Figure 9.12)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-slate-300">Service:</label>
                    <button
                      onClick={() => setFtpOn(!ftpOn)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        ftpOn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {ftpOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                {/* Upload Form */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">File Name</label>
                    <input
                      type="text"
                      placeholder="e.g. backup.cfg"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">File Content</label>
                    <input
                      type="text"
                      placeholder="Text or script..."
                      value={newFileContent}
                      onChange={(e) => setNewFileContent(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={handleAddFtpFile}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload File</span>
                  </button>
                </div>

                <div className="border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3">File Name</th>
                        <th className="p-3">File Size</th>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {ftpFiles.map((file, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-3 text-emerald-400">{file.name}</td>
                          <td className="p-3 text-slate-300">{file.size}</td>
                          <td className="p-3 text-slate-400">{file.date}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteFtpFile(file.name)}
                              className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/10 cursor-pointer"
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
            )}

            {/* ── NTP SERVICE ── */}
            {activeTab === 'ntp' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-semibold text-white">Network Time Protocol (NTP)</h4>
                    <p className="text-xs text-slate-400">Stratum 2 authoritative clock for logging & VPN timestamps</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-slate-300">Service:</label>
                    <button
                      onClick={() => setNtpOn(!ntpOn)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        ntpOn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {ntpOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-mono font-bold text-white tracking-wider">
                    {new Date().toLocaleTimeString()} EAT
                  </h3>
                  <p className="text-xs text-slate-400">
                    East Africa Time (UTC+3) &bull; Synchronized with 172.16.10.8 (C1-NTP)
                  </p>
                  <div className="flex gap-4 text-xs font-mono text-slate-400 pt-2">
                    <span>Stratum: 2</span>
                    <span>Precision: 2^-19</span>
                    <span>Reference: GPS-Master</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── SYSLOG SERVICE ── */}
            {activeTab === 'syslog' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-semibold text-white">Central Syslog Daemon</h4>
                    <p className="text-xs text-slate-400">Live RFC 5424 security event logger</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-slate-300">Service:</label>
                    <button
                      onClick={() => setSyslogOn(!syslogOn)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        syslogOn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {syslogOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                <div className="bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs h-96 overflow-y-auto space-y-2">
                  {syslogLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                      <span className="text-cyan-400 font-semibold shrink-0">[{log.source}]</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded shrink-0 ${
                          log.severity === 'EMERG' || log.severity === 'ALERT' || log.severity === 'CRIT'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : log.severity === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-indigo-500/20 text-indigo-300'
                        }`}
                      >
                        {log.severity}
                      </span>
                      <span className="text-slate-300">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── IOT MANAGER ── */}
            {activeTab === 'iot' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-semibold text-white">Campus IoT Registration Server</h4>
                    <p className="text-xs text-slate-400">Controls smart sensors, actuators, alarms, and access doors (Figure 9.15-9.17)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-slate-300">Service:</label>
                    <button
                      onClick={() => setIotOn(!iotOn)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        iotOn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {iotOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {[
                    { name: 'CC Camera (C1-C16)', status: 'Streaming', type: 'Surveillance' },
                    { name: 'Motion Detector (C1-MD16)', status: 'Monitoring', type: 'Sensor' },
                    { name: 'Smart Dimmer Light (C1-L16)', status: 'Auto Trigger', type: 'Actuator' },
                    { name: 'Smart Fan (C1-F16)', status: 'Auto Trigger', type: 'Actuator' },
                    { name: 'RFID Door (C1-D10)', status: 'Armed & Locked', type: 'Access Control' },
                    { name: 'Fire Monitor (C1-FM10)', status: 'Normal (0 PPM)', type: 'Life Safety' },
                    { name: 'Fire Sprinkler (C1-FS10)', status: 'Standby', type: 'Suppression' }
                  ].map((dev, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">{dev.name}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[11px] text-slate-400 block">{dev.type}</span>
                      <span className="text-[10px] text-indigo-400 font-mono mt-1 block">{dev.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
