/**
 * Cisco Packet Tracer End Device (PC / Laptop) Desktop GUI Modal
 * Includes Command Prompt, Web Browser, Email Client, IP Configuration, and VoIP Dialer
 */

import React, { useState } from 'react';
import { NetworkDevice, MailMessage, DnsRecord } from '../../types/network';
import { 
  Monitor, 
  Terminal, 
  Globe, 
  Mail, 
  PhoneCall, 
  Cpu, 
  Settings2, 
  X, 
  Send, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw,
  Search,
  CheckCircle2,
  FileText,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface EndDeviceDesktopModalProps {
  device: NetworkDevice;
  dnsRecords: DnsRecord[];
  mailMessages: MailMessage[];
  onSendMail: (mail: MailMessage) => void;
  onSendPingPacket?: (sourceId: string, targetIp: string) => void;
  onClose: () => void;
}

export const EndDeviceDesktopModal: React.FC<EndDeviceDesktopModalProps> = ({
  device,
  dnsRecords,
  mailMessages,
  onSendMail,
  onSendPingPacket,
  onClose
}) => {
  const [activeApp, setActiveApp] = useState<'desktop' | 'cmd' | 'browser' | 'email' | 'ipconfig' | 'voip'>('desktop');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Command Prompt state
  const [cmdLines, setCmdLines] = useState<string[]>([
    `Cisco Packet Tracer PC Command Line 1.0`,
    `Haramaya University Workstation: ${device.hostname}`,
    `IP Address: ${device.managementIp || '192.168.10.25'} | Gateway: ${device.gateway || '192.168.10.1'}`,
    `Type "help" for available PC diagnostic commands.`,
    ``
  ]);
  const [cmdInput, setCmdInput] = useState<string>('');

  // Web Browser state
  const [urlInput, setUrlInput] = useState<string>('http://www.haramaya.edu.et');
  const [currentUrl, setCurrentUrl] = useState<string>('http://www.haramaya.edu.et');

  // Email App state
  const [emailTab, setEmailTab] = useState<'inbox' | 'compose'>('inbox');
  const [selectedMail, setSelectedMail] = useState<MailMessage | null>(mailMessages[0] || null);
  const [composeTo, setComposeTo] = useState<string>('president@haramaya.edu.et');
  const [composeSubject, setComposeSubject] = useState<string>('Campus Network Status Report');
  const [composeBody, setComposeBody] = useState<string>('Testing SMTP relay over VLAN 10 to DMZ server 172.16.10.7.');

  // VoIP Dialer state
  const [dialedNumber, setDialedNumber] = useState<string>('');
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle');

  // Command Prompt Logic
  const handleCmdExecute = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = cmdInput.trim();
    if (!raw) return;

    setCmdLines((prev) => [...prev, `C:\\>${raw}`]);
    setCmdInput('');

    const tokens = raw.split(/\s+/);
    const cmd = tokens[0].toLowerCase();

    if (cmd === 'cls' || cmd === 'clear') {
      setCmdLines([]);
    } else if (cmd === 'help') {
      setCmdLines((prev) => [
        ...prev,
        `Available PC Commands:`,
        `  ipconfig [/all]     Display IP, MAC, Gateway, and DNS servers`,
        `  ping <target-ip>    Send ICMP Echo requests to verify reachability`,
        `  tracert <target-ip> Trace network routing hops`,
        `  nslookup <domain>   Query Haramaya DNS server (172.16.10.4)`,
        `  ftp <server-ip>     Connect to DMZ FTP server (172.16.10.10)`,
        `  ssh -l admin <ip>   Remote SSH terminal into Cisco routers/switches`,
        `  cls                 Clear screen`
      ]);
    } else if (cmd === 'ipconfig') {
      const isAll = tokens[1] === '/all';
      setCmdLines((prev) => [
        ...prev,
        `FastEthernet0 Connection:`,
        `  Connection-specific DNS Suffix..: haramaya.edu.et`,
        `  Physical Address (MAC)..........: ${device.interfaces[0]?.mac || '00E0.F725.0001'}`,
        `  Link-local IPv6 Address.........: fe80::2e0:f7ff:fe25:1%12`,
        `  IPv4 Address....................: ${device.managementIp || '192.168.10.25'}`,
        `  Subnet Mask.....................: ${device.interfaces[0]?.subnetMask || '255.255.255.0'}`,
        `  Default Gateway.................: ${device.gateway || '192.168.10.1'}`,
        ...(isAll
          ? [
              `  DHCP Server.....................: 172.16.10.5`,
              `  DNS Servers.....................: ${device.dnsServer || '172.16.10.4'}`,
              `  Lease Obtained..................: Sunday, September 27, 2026`,
              `  Lease Expires...................: Sunday, October 4, 2026`
            ]
          : [])
      ]);
    } else if (cmd === 'ping') {
      const target = tokens[1];
      if (!target) {
        setCmdLines((prev) => [...prev, `Usage: ping <target-ip or domain>`]);
      } else {
        setCmdLines((prev) => [
          ...prev,
          `Pinging ${target} with 32 bytes of data:`,
          `Reply from ${target}: bytes=32 time=4ms TTL=126`,
          `Reply from ${target}: bytes=32 time=3ms TTL=126`,
          `Reply from ${target}: bytes=32 time=5ms TTL=126`,
          `Reply from ${target}: bytes=32 time=3ms TTL=126`,
          ``,
          `Ping statistics for ${target}:`,
          `    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`,
          `Approximate round trip times in milli-seconds:`,
          `    Minimum = 3ms, Maximum = 5ms, Average = 3ms`
        ]);
        if (onSendPingPacket) {
          onSendPingPacket(device.id, target);
        }
      }
    } else if (cmd === 'tracert' || cmd === 'traceroute') {
      const target = tokens[1] || '172.16.10.6';
      setCmdLines((prev) => [
        ...prev,
        `Tracing route to ${target} over a maximum of 30 hops:`,
        `  1     1 ms     1 ms     1 ms  ${device.gateway || '192.168.10.1'}`,
        `  2     2 ms     2 ms     2 ms  192.168.0.18 (C1-DS1)`,
        `  3     3 ms     2 ms     3 ms  192.168.0.1 (C1-CS1)`,
        `  4     4 ms     3 ms     4 ms  172.16.10.1 (C1-DMZ)`,
        `  5     4 ms     4 ms     4 ms  ${target}`,
        `Trace complete.`
      ]);
    } else if (cmd === 'nslookup') {
      const query = tokens[1] || 'www.haramaya.edu.et';
      const record = dnsRecords.find((r) => r.domain === query);
      setCmdLines((prev) => [
        ...prev,
        `Server:  dns.haramaya.edu.et`,
        `Address:  172.16.10.4`,
        ``,
        `Name:    ${query}`,
        `Address: ${record ? record.target : '172.16.10.6'}`
      ]);
    } else if (cmd === 'ftp') {
      const host = tokens[1] || '172.16.10.10';
      setCmdLines((prev) => [
        ...prev,
        `Connected to ${host}.`,
        `220 Welcome to Haramaya University FTP service.`,
        `User (172.16.10.10:(none)): campus1`,
        `331 Please specify the password.`,
        `Password: ********`,
        `230 Login successful.`,
        `ftp> dir`,
        `200 PORT command successful.`,
        `150 Here comes the directory listing.`,
        `-rw-r--r--   1 1000 1000       26 Sep 27 09:00 sampleFile.txt`,
        `-rw-r--r--   1 1000 1000  4823440 Sep 26 18:30 haramaya-topology.pkt`,
        `226 Directory send OK.`,
        `ftp> get sampleFile.txt`,
        `200 PORT command successful.`,
        `150 Opening BINARY mode data connection for sampleFile.txt (26 bytes).`,
        `226 Transfer complete. 26 bytes received in 0.04 secs.`,
        `ftp> quit`,
        `221 Goodbye.`
      ]);
    } else if (cmd === 'ssh') {
      setCmdLines((prev) => [
        ...prev,
        `OpenSSH_8.2p1, OpenSSL 1.1.1f  31 Mar 2020`,
        `Connecting to C1-DMZ (172.16.10.1)...`,
        `User Access Verification`,
        `Username: admin`,
        `Password: ********`,
        `C1-DMZ# show version`,
        `Cisco IOS Software, ISR4331 Software, Version 15.4(3)M2`,
        `C1-DMZ# exit`,
        `Connection to 172.16.10.1 closed.`
      ]);
    } else {
      setCmdLines((prev) => [...prev, `'${raw}' is not recognized as an internal or external command.`]);
    }
  };

  // VoIP call handler
  const handleDial = (key: string) => {
    soundManager.playDtmf(key);
    setDialedNumber((prev) => prev + key);
  };

  const handleCall = () => {
    if (!dialedNumber) return;
    setCallStatus('calling');
    soundManager.playRingback();
    setTimeout(() => {
      setCallStatus('connected');
    }, 2000);
  };

  const handleHangup = () => {
    setCallStatus('idle');
    setDialedNumber('');
  };

  const handleSendEmail = () => {
    if (!composeTo || !composeSubject) return;
    const newMsg: MailMessage = {
      id: `m-${Date.now()}`,
      from: `${device.hostname.toLowerCase()}@haramaya.edu.et`,
      to: composeTo,
      subject: composeSubject,
      body: composeBody,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      read: true
    };
    onSendMail(newMsg);
    setEmailTab('inbox');
    setSelectedMail(newMsg);
  };

  return (
    <div className={`fixed z-50 inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center ${isFullScreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-200 transition-all ${
        isFullScreen ? 'w-full h-full rounded-none border-none' : 'rounded-2xl w-full max-w-4xl h-[740px]'
      }`}>
        {/* Device Top Bar */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">{device.name} &bull; Desktop</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  VLAN {device.vlan || 10} ({device.department || 'Admin'})
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                IP: {device.managementIp} &bull; MAC: {device.interfaces[0]?.mac} &bull; GW: {device.gateway}
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

        {/* Windows Desktop Canvas */}
        <div className="flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 relative flex flex-col overflow-hidden">
          {/* Main Desktop Screen */}
          {activeApp === 'desktop' && (
            <div className="flex-1 p-8 grid grid-cols-4 sm:grid-cols-6 gap-6 content-start animate-in fade-in duration-200">
              {/* App Icons */}
              {[
                { id: 'cmd', label: 'Command Prompt', icon: Terminal, color: 'from-slate-700 to-slate-900', badge: 'CLI' },
                { id: 'browser', label: 'Web Browser', icon: Globe, color: 'from-blue-600 to-indigo-600', badge: 'HTTP' },
                { id: 'email', label: 'Mail Client', icon: Mail, color: 'from-emerald-600 to-teal-700', badge: 'SMTP' },
                { id: 'voip', label: 'IP Phone Dialer', icon: PhoneCall, color: 'from-amber-600 to-orange-700', badge: 'CME' },
                { id: 'ipconfig', label: 'IP Configuration', icon: Settings2, color: 'from-purple-600 to-violet-800', badge: 'DHCP' }
              ].map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    onClick={() => setActiveApp(app.id as any)}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition-all cursor-pointer group text-center"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white leading-tight">
                      {app.label}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      {app.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── COMMAND PROMPT WINDOW ── */}
          {activeApp === 'cmd' && (
            <div className="flex-1 flex flex-col bg-black text-slate-300 font-mono text-xs overflow-hidden">
              <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Command Prompt (C:\\Windows\\System32\\cmd.exe)
                </span>
                <button onClick={() => setActiveApp('desktop')} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-1">
                {cmdLines.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                    {line}
                  </div>
                ))}
                <form onSubmit={handleCmdExecute} className="flex items-center gap-1 pt-1">
                  <span className="text-emerald-400 font-semibold">C:\&gt;</span>
                  <input
                    type="text"
                    value={cmdInput}
                    onChange={(e) => setCmdInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-emerald-400 font-mono text-xs"
                    autoFocus
                    spellCheck={false}
                  />
                </form>
              </div>
            </div>
          )}

          {/* ── WEB BROWSER WINDOW ── */}
          {activeApp === 'browser' && (
            <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
              {/* Browser Navigation Bar */}
              <div className="bg-slate-900 p-2.5 flex items-center gap-2 border-b border-slate-800 select-none">
                <button
                  onClick={() => setCurrentUrl('http://www.haramaya.edu.et')}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button className="p-1 rounded hover:bg-slate-800 text-slate-500 cursor-not-allowed">
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentUrl(urlInput)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <div className="flex-1 flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 gap-2">
                  <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setCurrentUrl(urlInput)}
                    className="flex-1 bg-transparent border-none outline-none text-xs text-white font-mono"
                  />
                </div>

                <button
                  onClick={() => setCurrentUrl(urlInput)}
                  className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Go
                </button>
                <button onClick={() => setActiveApp('desktop')} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Rendered Web Content */}
              <div className="flex-1 bg-slate-950 p-6 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-400 tracking-wider uppercase">
                        Haramaya University &bull; Ethiopia
                      </span>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Academic & Student Web Portal</h2>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      HTTP 200 OK &bull; 172.16.10.6
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Welcome to the official digital portal of Haramaya University. This portal is securely hosted on DMZ Web Server (C1-Web at 172.16.10.6) and routed through the Cisco Catalyst 3650 Core distribution layers and Cisco ASA 5506-X Firewalls.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                      <h4 className="text-xs font-bold text-indigo-300 mb-1">Campus I - Main Campus (Haramaya)</h4>
                      <p className="text-xs text-slate-400">
                        Hosts College of Computing and Informatics, Agriculture, Engineering, and Central Data Center.
                      </p>
                      <span className="text-[10px] text-emerald-400 font-mono mt-2 block">LAN: 192.168.0.0/16</span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                      <h4 className="text-xs font-bold text-indigo-300 mb-1">Campus II - Harar Campus</h4>
                      <p className="text-xs text-slate-400">
                        Hosts College of Health and Medical Sciences, teaching hospital, and HiOT technology laboratories.
                      </p>
                      <span className="text-[10px] text-emerald-400 font-mono mt-2 block">LAN: 192.169.0.0/16</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white">Undergraduate Registration Portal</h5>
                      <p className="text-[11px] text-slate-400">Online course registration and semester examination schedules.</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer">
                      Enter SIS Portal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── EMAIL CLIENT WINDOW ── */}
          {activeApp === 'email' && (
            <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
              <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 select-none">
                <span className="text-xs font-semibold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  Haramaya University Mail Browser (SMTP: 172.16.10.7 / POP3: 172.16.10.7)
                </span>
                <button onClick={() => setActiveApp('desktop')} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Mail Tabs */}
                <div className="w-44 bg-slate-950 border-r border-slate-800 p-2 space-y-1 text-xs">
                  <button
                    onClick={() => setEmailTab('inbox')}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium cursor-pointer transition-all ${
                      emailTab === 'inbox' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Inbox ({mailMessages.length})
                  </button>
                  <button
                    onClick={() => setEmailTab('compose')}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium cursor-pointer transition-all ${
                      emailTab === 'compose' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Compose Email
                  </button>
                </div>

                {/* Mail Content */}
                <div className="flex-1 bg-slate-900/40 p-4 overflow-y-auto">
                  {emailTab === 'inbox' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                      <div className="border border-slate-800 rounded-xl overflow-y-auto divide-y divide-slate-800 bg-slate-950/50">
                        {mailMessages.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMail(m)}
                            className={`p-3 cursor-pointer text-xs transition-colors ${
                              selectedMail?.id === m.id ? 'bg-indigo-600/20 border-l-2 border-indigo-500' : 'hover:bg-slate-800/50'
                            }`}
                          >
                            <span className="font-semibold text-white block truncate">{m.subject}</span>
                            <span className="text-[11px] text-slate-400 block truncate">From: {m.from}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{m.timestamp}</span>
                          </div>
                        ))}
                      </div>

                      {selectedMail && (
                        <div className="md:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                          <div>
                            <h4 className="text-base font-bold text-white mb-2">{selectedMail.subject}</h4>
                            <div className="text-xs text-slate-400 space-y-0.5 pb-3 border-b border-slate-800 mb-4 font-mono">
                              <p>From: <span className="text-indigo-400">{selectedMail.from}</span></p>
                              <p>To: <span className="text-emerald-400">{selectedMail.to}</span></p>
                              <p>Date: {selectedMail.timestamp}</p>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {selectedMail.body}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-slate-800 flex gap-2">
                            <button
                              onClick={() => {
                                setComposeTo(selectedMail.from);
                                setComposeSubject(`Re: ${selectedMail.subject}`);
                                setEmailTab('compose');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="max-w-xl mx-auto space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs">
                      <h4 className="text-sm font-semibold text-white mb-3">Compose New Email Message</h4>
                      <div>
                        <label className="text-slate-400 block mb-1">To:</label>
                        <input
                          type="text"
                          value={composeTo}
                          onChange={(e) => setComposeTo(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Subject:</label>
                        <input
                          type="text"
                          value={composeSubject}
                          onChange={(e) => setComposeSubject(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Body:</label>
                        <textarea
                          rows={6}
                          value={composeBody}
                          onChange={(e) => setComposeBody(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                        />
                      </div>
                      <button
                        onClick={handleSendEmail}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message (SMTP)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── VOIP PHONE DIALER WINDOW ── */}
          {activeApp === 'voip' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950">
              <div className="w-80 bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Cisco 7960 IP Phone</span>
                  </div>
                  <button onClick={() => setActiveApp('desktop')} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* LCD Screen */}
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-center font-mono">
                  <span className="text-[10px] text-emerald-400 block">HARAMAYA CME LINE 1</span>
                  <span className="text-lg font-bold text-emerald-200 block tracking-wider">
                    {dialedNumber || 'Ready: Ext 1001'}
                  </span>
                  <span className="text-[10px] text-emerald-400/80 block mt-1">
                    {callStatus === 'idle'
                      ? 'Off Hook / Dial Number (Try 2001)'
                      : callStatus === 'calling'
                      ? 'Calling Harar Campus (2001)...'
                      : 'Call Connected (00:14) &bull; Codec: G.711u'}
                  </span>
                </div>

                {/* Dial Pad */}
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                    <button
                      key={k}
                      onClick={() => handleDial(k)}
                      className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-mono text-sm font-semibold transition-all cursor-pointer border border-slate-700/50 shadow-sm"
                    >
                      {k}
                    </button>
                  ))}
                </div>

                {/* Call & Hangup Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleCall}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Dial (2001)</span>
                  </button>
                  <button
                    onClick={handleHangup}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>End Call</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── IP CONFIGURATION WINDOW ── */}
          {activeApp === 'ipconfig' && (
            <div className="flex-1 flex flex-col bg-slate-950 p-6 overflow-y-auto">
              <div className="max-w-xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-semibold text-white">IP Configuration Settings</h4>
                  <button onClick={() => setActiveApp('desktop')} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked readOnly name="iptype" className="text-indigo-600" />
                      <span className="text-white">DHCP (Assigned by C1-DHCP)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                      <input type="radio" disabled name="iptype" />
                      <span>Static</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">IPv4 Address:</label>
                    <input
                      type="text"
                      readOnly
                      value={device.managementIp || '192.168.10.25'}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-emerald-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Subnet Mask:</label>
                    <input
                      type="text"
                      readOnly
                      value={device.interfaces[0]?.subnetMask || '255.255.255.0'}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Default Gateway:</label>
                    <input
                      type="text"
                      readOnly
                      value={device.gateway || '192.168.10.1'}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-indigo-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">DNS Server:</label>
                    <input
                      type="text"
                      readOnly
                      value={device.dnsServer || '172.16.10.4'}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-indigo-400 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveApp('desktop')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Taskbar */}
          <div className="h-12 bg-slate-950/90 border-t border-slate-800/80 px-4 flex items-center justify-between select-none">
            <button
              onClick={() => setActiveApp('desktop')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Start</span>
            </button>

            <div className="flex items-center gap-1">
              {[
                { id: 'cmd', label: 'CMD' },
                { id: 'browser', label: 'Web' },
                { id: 'email', label: 'Mail' },
                { id: 'voip', label: 'Phone' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveApp(btn.id as any)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                    activeApp === btn.id
                      ? 'bg-slate-800 text-white border-b-2 border-indigo-500'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
