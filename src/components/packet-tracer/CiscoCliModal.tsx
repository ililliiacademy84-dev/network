/**
 * Authentic Cisco IOS Command Line Interface (CLI) Terminal Modal
 * Closely models Cisco Packet Tracer CLI tab and prompt hierarchies
 */

import React, { useState, useEffect, useRef } from 'react';
import { NetworkDevice } from '../../types/network';
import { CISCO_CONFIG_SNIPPETS } from '../../data/haramayaNetworkData';
import { Terminal, Maximize2, Minimize2, X, RefreshCw, Copy, Check } from 'lucide-react';

interface CiscoCliModalProps {
  device: NetworkDevice;
  onClose: () => void;
  onSendPingPacket?: (sourceId: string, targetIp: string) => void;
  onDeviceMutate?: (updated: NetworkDevice) => void;
}

export const CiscoCliModal: React.FC<CiscoCliModalProps> = ({ device, onClose, onSendPingPacket, onDeviceMutate }) => {
  const [mode, setMode] = useState<'user' | 'priv' | 'config' | 'config-if'>('priv');
  const [currentInterface, setCurrentInterface] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [lines, setLines] = useState<Array<{ text: string; type?: 'input' | 'output' | 'error' | 'system' }>>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize terminal banner
  useEffect(() => {
    const banner = [
      { text: `Cisco IOS Software, ${device.model} Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 15.4(3)M2`, type: 'system' as const },
      { text: `Haramaya University Network - Node: ${device.hostname} (${device.name})`, type: 'system' as const },
      { text: `System Bootstrap, Version 15.1(4)M4, RELEASE SOFTWARE (fc1)`, type: 'system' as const },
      { text: `Type "help" or "?" for an available list of commands.`, type: 'system' as const },
      { text: ``, type: 'system' as const }
    ];
    setLines(banner);
  }, [device]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const getPrompt = () => {
    const host = device.hostname;
    switch (mode) {
      case 'user':
        return `${host}>`;
      case 'priv':
        return `${host}#`;
      case 'config':
        return `${host}(config)#`;
      case 'config-if':
        return `${host}(config-if)#`;
      default:
        return `${host}#`;
    }
  };

  const handleCommand = (rawInput: string) => {
    const trimmed = rawInput.trim();
    const prompt = getPrompt();

    // Echo input
    setLines((prev) => [...prev, { text: `${prompt} ${rawInput}`, type: 'input' }]);

    if (trimmed) {
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
    }

    if (!trimmed) {
      return;
    }

    const lower = trimmed.toLowerCase();
    const tokens = trimmed.split(/\s+/);
    const cmd = tokens[0].toLowerCase();

    // ── Command Parsing ──
    if (cmd === 'enable' || cmd === 'en') {
      setMode('priv');
      setLines((prev) => [...prev, { text: `% Privilege mode enabled`, type: 'output' }]);
    } else if (cmd === 'disable') {
      setMode('user');
    } else if (cmd === 'configure' || cmd === 'conf' || cmd === 'conft' || trimmed === 'conf t') {
      if (mode === 'user') {
        setLines((prev) => [...prev, { text: `% Unknown command or not authorized. Enter privileged mode first.`, type: 'error' }]);
      } else {
        setMode('config');
        setLines((prev) => [
          ...prev,
          { text: `Enter configuration commands, one per line. End with CNTL/Z or "end".`, type: 'output' }
        ]);
      }
    } else if (cmd === 'exit') {
      if (mode === 'config-if') {
        setMode('config');
      } else if (mode === 'config') {
        setMode('priv');
      } else if (mode === 'priv') {
        setMode('user');
      }
    } else if (cmd === 'end') {
      setMode('priv');
    } else if (cmd === 'clear' || cmd === 'cls') {
      setLines([]);
    } else if (cmd === 'help' || cmd === '?') {
      setLines((prev) => [
        ...prev,
        {
          text: `Exec commands:
  enable             Turn on privileged commands
  disable            Turn off privileged commands
  conf t             Enter global configuration mode
  show ip int brief  Display interface status and IP addresses
  show ip route      Display IP routing table
  show running-config Display current operating configuration
  show vlan brief    Display VLAN status
  show crypto ipsec sa Display IPsec Security Associations & packet crypto stats
  show version       Display system hardware and software status
  ping <ip>          Send ICMP echo request
  traceroute <ip>    Trace route to destination
  clear              Clear terminal buffer`,
          type: 'output'
        }
      ]);
    } else if (cmd === 'ping') {
      const targetIp = tokens[1];
      if (!targetIp) {
        setLines((prev) => [...prev, { text: `% Usage: ping <target-ip>`, type: 'error' }]);
      } else {
        setLines((prev) => [
          ...prev,
          { text: `Type escape sequence to abort.`, type: 'output' },
          { text: `Sending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:`, type: 'output' },
          { text: `!!!!!`, type: 'output' },
          { text: `Success rate is 100 percent (5/5), round-trip min/avg/max = 2/4/8 ms`, type: 'output' }
        ]);
        if (onSendPingPacket) {
          onSendPingPacket(device.id, targetIp);
        }
      }
    } else if (cmd === 'traceroute' || cmd === 'tracert') {
      const targetIp = tokens[1] || '172.16.10.6';
      setLines((prev) => [
        ...prev,
        { text: `Tracing route to ${targetIp}...`, type: 'output' },
        { text: `  1 192.168.0.50 (C1-ASA1) 2 msec 1 msec 1 msec`, type: 'output' },
        { text: `  2 172.16.10.1 (C1-DMZ-Router) 3 msec 2 msec 2 msec`, type: 'output' },
        { text: `  3 ${targetIp} 4 msec 3 msec 3 msec`, type: 'output' },
        { text: `Trace complete.`, type: 'output' }
      ]);
    } else if (lower.startsWith('show ip int') || lower === 'sh ip int br' || lower === 'sh ip int brief') {
      const header = `Interface              IP-Address      OK? Method Status                Protocol`;
      const rows = device.interfaces.map(
        (intf) =>
          `${intf.name.padEnd(22)} ${(intf.ip || 'unassigned').padEnd(15)} YES manual ${intf.status.padEnd(21)} ${intf.status}`
      );
      setLines((prev) => [...prev, { text: header, type: 'output' }, ...rows.map((r) => ({ text: r, type: 'output' as const }))]);
    } else if (lower.startsWith('show ip route') || lower === 'sh ip route') {
      setLines((prev) => [
        ...prev,
        {
          text: `Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
Gateway of last resort is 10.10.10.1 to network 0.0.0.0

C    192.168.0.0/16 is directly connected, Vlan10
O    192.169.0.0/16 [110/20] via 10.10.10.6, 02:44:11, GigabitEthernet1/1
S*   0.0.0.0/0 [1/0] via 10.10.10.1, outside1
C    172.16.10.0/26 is directly connected, GigabitEthernet1/2`,
          type: 'output'
        }
      ]);
    } else if (lower.startsWith('show crypto ipsec') || lower === 'sh cry ip sa') {
      setLines((prev) => [
        ...prev,
        {
          text: `interface: outside1
    Crypto map tag: VPN_MAP_OUTSIDE1, seq num: 10, local addr 10.10.10.2
      permit ip 192.168.0.0 255.255.0.0 192.169.0.0 255.255.0.0
      current_peer 10.10.10.6
      #pkts encaps: 42, #pkts encrypt: 42, #pkts digest: 0
      #pkts decaps: 42, #pkts decrypt: 42, #pkts verify: 0
      #pkts compressed: 0, #pkts decompressed: 0
      #send errors: 0, #recv errors: 0
      local crypto endpt.: 10.10.10.2/0, remote crypto endpt.: 10.10.10.6/0
      path mtu 1500, ip mtu, ipsec overhead 78, media mtu 1500
    inbound esp sas:
      spi: 0x21D3513F (567497023)
      transform: esp-aes 256 esp-sha-hmac no compression
      in use settings ={L2L, Tunnel, }
    outbound esp sas:
      spi: 0xC79BFBA0 (3348888480)
      transform: esp-aes 256 esp-sha-hmac no compression`,
          type: 'output'
        }
      ]);
    } else if (lower.startsWith('show spanning-tree') || lower === 'sh stp') {
      setLines((prev) => [
        ...prev,
        {
          text: `VLAN0001
  Spanning tree enabled protocol rstp
  Root ID    Priority    32769
             Address     0011.2233.4455
             This bridge is the root
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi0/1               Desg FWD 4         128.1    P2p 
Gi0/2               Desg FWD 4         128.2    P2p 
Fa0/1               Desg FWD 19        128.3    P2p Edge`,
          type: 'output'
        }
      ]);
    } else if (lower.startsWith('show cdp') || lower.startsWith('show lldp')) {
      setLines((prev) => [
        ...prev,
        {
          text: `Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone

Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
SW-BATI-CORE     Gi0/1             165            S I     WS-C3850  Gi0/1
R-HIT-CORE       Gi0/2             158           R S I    CISCO4451 Gi0/0
ASA-5506-BATI    Gi0/3             172            S H     ASA5506X  Gi0/1`,
          type: 'output'
        }
      ]);
    } else if (lower.startsWith('show mac') || lower === 'sh mac-address-table') {
      setLines((prev) => [
        ...prev,
        {
          text: `          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0011.2233.4455    DYNAMIC     Gi0/1
  10    00aa.bbcc.dd11    DYNAMIC     Fa0/1
  20    00aa.bbcc.dd22    DYNAMIC     Fa0/2
Total Mac Addresses for this criterion: 3`,
          type: 'output'
        }
      ]);
    } else if (lower.startsWith('show ip ospf neighbor') || lower === 'sh ip ospf neigh') {
      setLines((prev) => [
        ...prev,
        {
          text: `Neighbor ID     Pri   State           Dead Time   Address         Interface
10.20.1.1         1   FULL/BDR        00:00:34    10.20.1.1       GigabitEthernet0/1
10.30.1.1         1   FULL/DR         00:00:38    10.30.1.1       GigabitEthernet0/2
10.40.1.1         1   FULL/DROTHER    00:00:31    10.40.1.1       GigabitEthernet0/3`,
          type: 'output'
        }
      ]);
    } else if (lower.startsWith('copy run') || lower === 'copy running-config startup-config' || lower === 'write memory' || lower === 'wr') {
      setLines((prev) => [
        ...prev,
        { text: `Building configuration...`, type: 'output' },
        { text: `[OK] Configuration saved to NVRAM startup-config.`, type: 'output' }
      ]);
    } else if (lower.startsWith('hostname ')) {
      const newName = tokens[1];
      if (newName) {
        if (onDeviceMutate) {
          onDeviceMutate({ ...device, hostname: newName, name: newName });
        }
        setLines((prev) => [...prev, { text: `% Hostname updated to ${newName}`, type: 'output' }]);
      }
    } else if (lower.startsWith('show vlan') || lower === 'sh vlan br') {
      setLines((prev) => [
        ...prev,
        {
          text: `VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/11-24, Gi0/2
10   Admin                            active    Fa0/1, Fa0/2, Fa0/3, Fa0/10
11   Chairman                         active    Fa0/4
12   Admission                        active    Fa0/5
13   Register                         active    Fa0/6
14   Accounts                         active    Fa0/7
15   Cafe                             active    Fa0/8
16   Mosque                           active    Fa0/9`,
          type: 'output'
        }
      ]);
    } else if (lower.startsWith('show running') || lower === 'sh run') {
      const cfg = CISCO_CONFIG_SNIPPETS[device.id] || `!
hostname ${device.hostname}
!
ip routing
!
interface GigabitEthernet0/0/0
 ip address ${device.managementIp || '192.168.0.1'} 255.255.255.0
 no shutdown
!
line con 0
 password cisco
 login
line vty 0 4
 transport input ssh
!
end`;
      setLines((prev) => [...prev, { text: cfg, type: 'output' }]);
    } else if (lower.startsWith('interface') || lower.startsWith('int ')) {
      if (mode === 'config' || mode === 'config-if') {
        const intf = tokens[1] || 'GigabitEthernet0/0/0';
        setCurrentInterface(intf);
        setMode('config-if');
        setLines((prev) => [...prev, { text: `% Configuring interface ${intf}`, type: 'output' }]);
      } else {
        setLines((prev) => [...prev, { text: `% Incomplete command. Enter global config mode first.`, type: 'error' }]);
      }
    } else if (lower.startsWith('ip address')) {
      if (mode === 'config-if') {
        const ip = tokens[2];
        const mask = tokens[3] || '255.255.255.0';
        if (ip) {
          const updatedIfs = device.interfaces.map((i) =>
            i.name.toLowerCase() === currentInterface.toLowerCase()
              ? { ...i, ip, subnetMask: mask }
              : i
          );
          if (onDeviceMutate) {
            onDeviceMutate({
              ...device,
              interfaces: updatedIfs,
              managementIp: updatedIfs[0]?.ip || device.managementIp
            });
          }
          setLines((prev) => [...prev, { text: `% IP address ${ip} ${mask} configured on ${currentInterface}`, type: 'output' }]);
        } else {
          setLines((prev) => [...prev, { text: `% Incomplete command: ip address <ip> <mask>`, type: 'error' }]);
        }
      } else {
        setLines((prev) => [...prev, { text: `% Command only available in interface configuration mode`, type: 'error' }]);
      }
    } else if (lower === 'no shutdown' || lower === 'no shut') {
      if (mode === 'config-if') {
        const updatedIfs = device.interfaces.map((i) =>
          i.name.toLowerCase() === currentInterface.toLowerCase()
            ? { ...i, adminStatus: 'up' as const, status: 'up' as const }
            : i
        );
        if (onDeviceMutate) {
          onDeviceMutate({ ...device, interfaces: updatedIfs });
        }
        setLines((prev) => [
          ...prev,
          { text: `% Interface ${currentInterface}, changed state to up`, type: 'output' },
          { text: `% LINEPROTO-5-UPDOWN: Line protocol on Interface ${currentInterface}, changed state to up`, type: 'output' }
        ]);
      } else {
        setLines((prev) => [...prev, { text: `% Command only available in interface configuration mode`, type: 'error' }]);
      }
    } else if (lower === 'shutdown' || lower === 'shut') {
      if (mode === 'config-if') {
        const updatedIfs = device.interfaces.map((i) =>
          i.name.toLowerCase() === currentInterface.toLowerCase()
            ? { ...i, adminStatus: 'down' as const, status: 'down' as const }
            : i
        );
        if (onDeviceMutate) {
          onDeviceMutate({ ...device, interfaces: updatedIfs });
        }
        setLines((prev) => [
          ...prev,
          { text: `% Interface ${currentInterface}, changed state to administratively down`, type: 'output' },
          { text: `% LINEPROTO-5-UPDOWN: Line protocol on Interface ${currentInterface}, changed state to down`, type: 'output' }
        ]);
      } else {
        setLines((prev) => [...prev, { text: `% Command only available in interface configuration mode`, type: 'error' }]);
      }
    } else if (lower.startsWith('hostname')) {
      const newName = tokens[1];
      if (newName) {
        if (onDeviceMutate) {
          onDeviceMutate({ ...device, hostname: newName, name: newName });
        }
        setLines((prev) => [...prev, { text: `% Hostname configured to ${newName}`, type: 'output' }]);
      }
    } else {
      setLines((prev) => [
        ...prev,
        { text: `% Invalid input detected at '^' marker. Type 'help' for commands.`, type: 'error' }
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setCurrentInput(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length > 0 && historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= history.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(nextIdx);
          setCurrentInput(history[nextIdx] || '');
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete simple tokens
      const val = currentInput.trim();
      const suggestions = ['show ip int brief', 'show running-config', 'show ip route', 'show crypto ipsec sa', 'configure terminal', 'enable', 'ping'];
      const match = suggestions.find((s) => s.startsWith(val));
      if (match) {
        setCurrentInput(match);
      }
    }
  };

  const copyConfig = () => {
    const textToCopy = CISCO_CONFIG_SNIPPETS[device.id] || lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`fixed z-50 inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-all`}>
      <div
        className={`bg-slate-950 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all ${
          isFullScreen ? 'w-full h-full max-w-none rounded-none' : 'w-full max-w-4xl h-[680px]'
        }`}
      >
        {/* Terminal Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="flex items-center gap-2 ml-4">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-semibold text-slate-200">
                {device.hostname} &bull; Cisco IOS CLI ({device.model})
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Connected: Console / VTY
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyConfig}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-all cursor-pointer"
              title="Copy Cisco Running Configuration"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Config'}</span>
            </button>
            <button
              onClick={() => setLines([])}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Clear terminal"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Command Suggestions */}
        <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-400 overflow-x-auto">
          <span className="text-slate-500 self-center text-[10px]">Quick test:</span>
          {['sh ip int br', 'sh ip route', 'sh run', 'sh crypto ipsec sa', 'ping 172.16.10.6', 'ping 10.10.10.6'].map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => {
                handleCommand(cmd);
              }}
              className="px-2 py-0.5 rounded bg-slate-800/90 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Screen */}
        <div
          className="flex-1 bg-black p-4 font-mono text-xs overflow-y-auto space-y-1 text-slate-300 cursor-text select-text"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`leading-relaxed whitespace-pre-wrap ${
                line.type === 'input'
                  ? 'text-emerald-400 font-semibold'
                  : line.type === 'error'
                  ? 'text-rose-400'
                  : line.type === 'system'
                  ? 'text-cyan-400/90'
                  : 'text-slate-300'
              }`}
            >
              {line.text}
            </div>
          ))}

          {/* Active Input Line */}
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold pt-1">
            <span>{getPrompt()}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-emerald-300 font-mono text-xs caret-emerald-400"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
