/**
 * Haramaya University Network Configuration & Simulation Platform
 * Fully Functional 4-Campus Enterprise Simulation Laboratory
 * Features:
 * - 4 Campuses: Main Campus (Bati), HiT, CVM, and Harar Campus
 * - Interactive Cisco Packet Tracer Canvas, Drag & Drop Palette & Cabling
 * - Physical Chassis with Power Switch, Port LEDs & Real Building Blocks
 * - Stateful Cisco ASA Firewall Manager & HU SOC Threat Center
 * - OSI Packet Inspector (Layer 2, 3, 4 & Security decisions)
 * - Site-to-Site IPSec VPN Tunnels & Live Crypto Telemetry
 * - 12 Interactive Educational Labs with Verification & Scoring
 * - Automated Network Validation & Smart Network Assistant
 * - Project Save/Load & Technical Documentation Generator
 */

import React, { useState, useEffect } from 'react';
import { 
  NetworkDevice, 
  NetworkLink, 
  SimulationPacket, 
  IotCampusState, 
  MailMessage, 
  DnsRecord, 
  FtpFile, 
  SyslogEntry,
  FirewallRule,
  SecurityEvent,
  VlanInfo,
  CampusId,
  ProjectSaveState,
  DeviceType,
  NetworkLayer
} from './types/network';

import { 
  COMPLETE_NETWORK_DEVICES, 
  COMPLETE_NETWORK_LINKS, 
  HARAMAYA_ENTERPRISE_VLANS,
  INITIAL_FIREWALL_RULES,
  INITIAL_SECURITY_EVENTS,
  HARAMAYA_DNS_RECORDS, 
  HARAMAYA_MAIL_MESSAGES, 
  HARAMAYA_FTP_FILES, 
  HARAMAYA_SYSLOG_LOGS,
  HARAMAYA_CISCO_CONFIGS
} from './data/haramayaNetworkData';

import { TopologyCanvas } from './components/packet-tracer/TopologyCanvas';
import { DevicePalette } from './components/packet-tracer/DevicePalette';
import { ConnectDeviceModal } from './components/packet-tracer/ConnectDeviceModal';
import { PhysicalChassisModal } from './components/packet-tracer/PhysicalChassisModal';
import { ServerServicesModal } from './components/packet-tracer/ServerServicesModal';
import { EndDeviceDesktopModal } from './components/packet-tracer/EndDeviceDesktopModal';
import { IotLabModal } from './components/packet-tracer/IotLabModal';
import { SimulationBar } from './components/packet-tracer/SimulationBar';
import { PacketInspectorModal } from './components/simulation/PacketInspectorModal';
import { SocDashboard } from './components/security/SocDashboard';
import { EducationalLabsModal } from './components/labs/EducationalLabsModal';
import { SmartNetworkAssistant } from './components/assistant/SmartNetworkAssistant';
import { HaramayaPhysicalBuildings } from './components/buildings/HaramayaPhysicalBuildings';
import { ProjectManagerModal } from './components/projects/ProjectManagerModal';
import { HaramayaPortal } from './components/portal/HaramayaPortal';
import { VpnTunnelMonitor } from './components/vpn/VpnTunnelMonitor';
import { IpVlanTables } from './components/tables/IpVlanTables';
import { CollegeDepartmentHierarchy } from './components/colleges/CollegeDepartmentHierarchy';
import { SubnetCalculator } from './components/calculator/SubnetCalculator';
import { BandwidthTrafficMonitor } from './components/telemetry/BandwidthTrafficMonitor';
import { CyberluxLandingPage } from './components/landing/CyberluxLandingPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CyberluxHeader } from './components/navigation/CyberluxHeader';

import { 
  Network, 
  Globe, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Table, 
  FileCode, 
  Building2, 
  Award, 
  Bot, 
  FolderDown, 
  Cable, 
  Plus, 
  Monitor, 
  Server, 
  Check, 
  Copy, 
  Layers, 
  Cpu,
  GraduationCap,
  Calculator,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Main view navigation: defaults to Cyberlux Landing Page
  const [activeTab, setActiveTab] = useState<'landing' | 'topology' | 'colleges' | 'portal' | 'soc' | 'vpn' | 'telemetry' | 'calculator' | 'iot' | 'labs' | 'buildings' | 'tables' | 'configs' | 'admin'>('landing');
  const [activeCampus, setActiveCampus] = useState<'all' | 'main' | 'hit' | 'cvm' | 'harar'>('all');

  // Network topology state
  const [devices, setDevices] = useState<NetworkDevice[]>(COMPLETE_NETWORK_DEVICES);
  const [links, setLinks] = useState<NetworkLink[]>(COMPLETE_NETWORK_LINKS);
  const [vlans, setVlans] = useState<VlanInfo[]>(HARAMAYA_ENTERPRISE_VLANS);
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>(INITIAL_FIREWALL_RULES);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(INITIAL_SECURITY_EVENTS);
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>(HARAMAYA_DNS_RECORDS);
  const [mailMessages, setMailMessages] = useState<MailMessage[]>(HARAMAYA_MAIL_MESSAGES);
  const [ftpFiles, setFtpFiles] = useState<FtpFile[]>(HARAMAYA_FTP_FILES);
  const [syslogLogs, setSyslogLogs] = useState<SyslogEntry[]>(HARAMAYA_SYSLOG_LOGS);

  // IoT campus state
  const [iotState, setIotState] = useState<IotCampusState>({
    motionDetected: false,
    lightBrightness: 25,
    fanActive: false,
    fanSpeed: 'low',
    fireDetected: false,
    smokeDensityPpm: 12,
    temperatureCelsius: 22,
    sirenAlert: false,
    sprinklerActive: false,
    doorLocked: true
  });

  // Modal Dialogs
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [chassisDevice, setChassisDevice] = useState<NetworkDevice | null>(null);
  const [serverDevice, setServerDevice] = useState<NetworkDevice | null>(null);
  const [desktopDevice, setDesktopDevice] = useState<NetworkDevice | null>(null);
  const [inspectPacket, setInspectPacket] = useState<SimulationPacket | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isLabsOpen, setIsLabsOpen] = useState<boolean>(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState<boolean>(false);
  const [isIotLabOpen, setIsIotLabOpen] = useState<boolean>(false);

  // Simulation Engine state
  const [simMode, setSimMode] = useState<'realtime' | 'simulation'>('realtime');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [packets, setPackets] = useState<SimulationPacket[]>([]);
  const [isPduToolActive, setIsPduToolActive] = useState<boolean>(false);
  const [pduSourceId, setPduSourceId] = useState<string | null>(null);

  // Cisco configs tab
  const [selectedConfigDevice, setSelectedConfigDevice] = useState<string>('c1-asa1');
  const [copiedConfig, setCopiedConfig] = useState<boolean>(false);

  // Helper to add Syslog entry
  const addSyslogEntry = (msg: string, severity: 'EMERG' | 'ALERT' | 'CRIT' | 'ERR' | 'WARNING' | 'NOTICE' | 'INFO' | 'DEBUG' = 'INFO') => {
    const newEntry: SyslogEntry = {
      id: `sys-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      source: 'HU-NOC',
      severity,
      message: msg
    };
    setSyslogLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  // Add new device from palette
  const handleAddDeviceFromPalette = (template: {
    type: DeviceType;
    name: string;
    model: string;
    layer: NetworkLayer;
    campus: CampusId;
  }) => {
    const campusXOffset = {
      main: 320,
      hit: 800,
      cvm: 1040,
      harar: 1260,
      wan: 600
    }[template.campus] || 400;

    const newDev: NetworkDevice = {
      id: `dev-${Date.now()}`,
      name: template.name,
      hostname: template.name,
      model: template.model,
      type: template.type,
      layer: template.layer,
      campus: template.campus,
      x: campusXOffset + Math.floor(Math.random() * 80 - 40),
      y: 350 + Math.floor(Math.random() * 80 - 40),
      power: true,
      managementIp: `10.${template.campus === 'hit' ? '20' : template.campus === 'cvm' ? '30' : template.campus === 'harar' ? '40' : '10'}.10.${Math.floor(Math.random() * 150 + 50)}`,
      gateway: `10.${template.campus === 'hit' ? '20' : template.campus === 'cvm' ? '30' : template.campus === 'harar' ? '40' : '10'}.10.1`,
      dnsServer: '10.10.150.4',
      interfaces: [
        {
          name: template.type.includes('switch') ? 'Fa0/1' : 'FastEthernet0',
          mac: `00E0.${Math.floor(Math.random() * 8999 + 1000)}.0001`,
          status: 'up',
          adminStatus: 'up',
          type: 'FastEthernet',
          speed: '100Mbps',
          duplex: 'full',
          vlan: 10
        }
      ]
    };

    setDevices((prev) => [...prev, newDev]);
    addSyslogEntry(`%TOPOLOGY-6-DEVICE_ADDED: New device ${newDev.name} deployed in ${template.campus.toUpperCase()}.`, 'INFO');
    setIsPaletteOpen(false);
  };

  // Device drag handler
  const handleDeviceMove = (id: string, x: number, y: number) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, x: Math.max(20, x), y: Math.max(20, y) } : d))
    );
  };

  // Update device state (from physical modal or CLI mutation)
  const handleUpdateDevice = (updated: NetworkDevice) => {
    setDevices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    if (chassisDevice?.id === updated.id) {
      setChassisDevice(updated);
    }
    addSyslogEntry(`%SYS-5-CONFIG_I: Device ${updated.name} configuration updated.`, 'INFO');
  };

  // Click on a device on the canvas
  const handleSelectDevice = (dev: NetworkDevice) => {
    setSelectedDevice(dev);

    // If PDU Ping Tool is active
    if (isPduToolActive) {
      if (!pduSourceId) {
        setPduSourceId(dev.id);
      } else if (pduSourceId !== dev.id) {
        sendSimulationPing(pduSourceId, dev.id);
        setPduSourceId(null);
        setIsPduToolActive(false);
      }
      return;
    }

    // Open appropriate modal
    if (dev.type === 'server') {
      setServerDevice(dev);
    } else if (dev.type === 'pc' || dev.type === 'laptop' || dev.type === 'ip_phone') {
      setDesktopDevice(dev);
    } else if (dev.layer === 'iot') {
      setIsIotLabOpen(true);
    } else {
      // Router, Switch, Firewall opens Physical & Config chassis
      setChassisDevice(dev);
    }
  };

  // Simulation packet timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPackets((prevPackets) => {
        if (prevPackets.length === 0) return prevPackets;

        return prevPackets.map((pkt) => {
          if (pkt.status !== 'transmitting') return pkt;

          const nextHop = pkt.currentHopIndex + 1;
          if (nextHop >= pkt.path.length) {
            return {
              ...pkt,
              currentHopIndex: pkt.path.length,
              status: 'success' as const
            };
          }
          return {
            ...pkt,
            currentHopIndex: nextHop
          };
        });
      });
    }, 800 / simSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  // Construct and send a multi-hop PDU packet
  const sendSimulationPing = (sourceId: string, targetId: string) => {
    const srcDev = devices.find((d) => d.id === sourceId);
    const dstDev = devices.find((d) => d.id === targetId);

    const isInterCampus = srcDev && dstDev && srcDev.campus !== dstDev.campus;

    // Helper to find attached access switch for end devices
    const findAttachedSwitch = (devId: string): string[] => {
      const link = links.find((l) => l.fromDeviceId === devId || l.toDeviceId === devId);
      if (!link) return [];
      const peerId = link.fromDeviceId === devId ? link.toDeviceId : link.fromDeviceId;
      const peer = devices.find((d) => d.id === peerId);
      if (peer && peer.layer === 'access' && peer.id !== devId) return [peer.id];
      return [];
    };

    // Helper to find campus egress path
    const getCampusEgressHops = (dev: NetworkDevice): string[] => {
      switch (dev.campus) {
        case 'main':
          if (dev.layer === 'dmz') return ['c1-dmz-router', 'c1-asa1'];
          return ['c1-ds1', 'c1-cs1', 'c1-asa1'];
        case 'hit':
          return ['hit-core'];
        case 'cvm':
          return ['cvm-core'];
        case 'harar':
          return ['harar-cs1', 'harar-asa1'];
        default:
          return [];
      }
    };

    // Helper to find campus ingress path
    const getCampusIngressHops = (dev: NetworkDevice): string[] => {
      switch (dev.campus) {
        case 'main':
          if (dev.layer === 'dmz') return ['c1-asa1', 'c1-dmz-router'];
          return ['c1-asa1', 'c1-cs1', 'c1-ds1'];
        case 'hit':
          return ['hit-core'];
        case 'cvm':
          return ['cvm-core'];
        case 'harar':
          return ['harar-asa1', 'harar-cs1'];
        default:
          return [];
      }
    };

    let calculatedPath: string[] = [];
    const srcSwHops = srcDev?.layer === 'end' ? findAttachedSwitch(sourceId) : [];
    const dstSwHops = dstDev?.layer === 'end' ? findAttachedSwitch(targetId) : [];

    if (isInterCampus && srcDev && dstDev) {
      const srcHops = getCampusEgressHops(srcDev);
      const dstHops = getCampusIngressHops(dstDev);
      calculatedPath = [sourceId, ...srcSwHops, ...srcHops, 'isp-router', ...dstHops, ...dstSwHops, targetId];
    } else {
      // Intra-campus routing
      if (srcDev?.campus === 'main') {
        calculatedPath = [sourceId, ...srcSwHops, 'c1-ds1', 'c1-cs1', 'c1-ds1', ...dstSwHops, targetId];
      } else if (srcDev?.campus === 'hit') {
        calculatedPath = [sourceId, ...srcSwHops, 'hit-core', ...dstSwHops, targetId];
      } else if (srcDev?.campus === 'cvm') {
        calculatedPath = [sourceId, ...srcSwHops, 'cvm-core', ...dstSwHops, targetId];
      } else if (srcDev?.campus === 'harar') {
        calculatedPath = [sourceId, ...srcSwHops, 'harar-cs1', ...dstSwHops, targetId];
      } else {
        calculatedPath = [sourceId, 'isp-router', targetId];
      }
    }

    // Filter consecutive duplicate device IDs
    const finalPath = calculatedPath.filter((id, idx, arr) => id && (idx === 0 || id !== arr[idx - 1]));

    const newPkt: SimulationPacket = {
      id: `pkt-${Date.now()}`,
      sourceDeviceId: sourceId,
      targetDeviceId: targetId,
      protocol: isInterCampus ? 'ESP_VPN' : 'ICMP',
      path: finalPath,
      currentHopIndex: 0,
      status: 'transmitting',
      color: isInterCampus ? '#38bdf8' : '#22c55e',
      details: isInterCampus
        ? `IPSec Encrypted ESP Tunnel &bull; Inter-Campus Echo`
        : `ICMP Echo Request (type 8, seq 1, len 32)`,
      inspection: {
        layer2: {
          sourceMac: srcDev?.interfaces[0]?.mac || '00E0.F725.1001',
          destMac: dstDev?.interfaces[0]?.mac || '00E0.F725.4001',
          vlan: srcDev?.vlan || 10,
          etherType: '0x0800 (IPv4)'
        },
        layer3: {
          sourceIp: srcDev?.managementIp || '10.10.10.25',
          destIp: dstDev?.managementIp || '10.40.30.22',
          protocol: isInterCampus ? '50 (ESP)' : '1 (ICMP)',
          ttl: 128
        },
        security: {
          aclDecision: 'PERMIT',
          firewallDecision: 'ALLOW',
          vpnEncrypted: isInterCampus || false
        }
      }
    };

    setPackets((prev) => [newPkt, ...prev.slice(0, 19)]);
    addSyslogEntry(`%SIM-5-PDU_TRANSMIT: ${newPkt.protocol} packet launched from ${sourceId} to ${targetId}.`, 'INFO');

    if (isInterCampus) {
      try {
        confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
      } catch {}
    }
  };

  const handleSendPingFromCli = (sourceId: string, targetIp: string) => {
    const targetDev = devices.find((d) => d.managementIp === targetIp) || devices.find((d) => d.id === 'c1-web');
    if (targetDev) {
      sendSimulationPing(sourceId, targetDev.id);
    }
  };

  // SOC threat trigger
  const handleTriggerThreat = (type: 'PORT_SCAN' | 'BRUTE_FORCE' | 'DOS_ATTEMPT') => {
    const newEv: SecurityEvent = {
      id: `sec-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      severity: type === 'DOS_ATTEMPT' ? 'CRITICAL' : 'HIGH',
      sourceIp: '197.156.77.12',
      destIp: '10.10.150.6 (HU-WEB)',
      type,
      description: `${type} attack simulation launched against Haramaya University perimeter.`,
      actionTaken: 'BLOCKED',
      remediation: 'ASA firewall stateful drop rule engaged.'
    };
    setSecurityEvents((prev) => [newEv, ...prev]);
    addSyslogEntry(`%SECURITY-1-ATTACK_DETECTED: ${type} blocked by HU-MAIN-ASA1.`, 'EMERG');
  };

  // Copy Cisco config
  const copyConfigSnippet = () => {
    const text = HARAMAYA_CISCO_CONFIGS[selectedConfigDevice] || '';
    navigator.clipboard.writeText(text);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col font-sans selection:bg-[#00ff87] selection:text-slate-950">
      {/* Background Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-[#00ff87]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] bg-[#00e5ff]/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Cyberlux Enterprise Header */}
      <CyberluxHeader
        activeTab={activeTab}
        onNavigate={(tab, campus) => {
          setActiveTab(tab);
          if (campus) setActiveCampus(campus);
        }}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenLabs={() => setIsLabsOpen(true)}
        onOpenProjects={() => setIsProjectsOpen(true)}
      />

      {/* ── LANDING PAGE VIEW ── */}
      {activeTab === 'landing' ? (
        <CyberluxLandingPage
          onNavigate={(tab, campus) => {
            setActiveTab(tab);
            if (campus) setActiveCampus(campus);
          }}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenLabs={() => setIsLabsOpen(true)}
          onOpenProjects={() => setIsProjectsOpen(true)}
        />
      ) : (
        /* ── ENGINEERING & SIMULATION WORKSPACE ── */
        <main className="flex-1 w-full px-4 lg:px-8 py-6 flex flex-col space-y-6">
          {/* Quick Toolbar for Engineering Actions */}
          <div className="bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs shadow-lg">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/25 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{isPaletteOpen ? 'Close Device Palette' : 'Add Devices'}</span>
              </button>

              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-2 border border-slate-700/80 cursor-pointer transition-all hover:text-white"
              >
                <Cable className="w-4 h-4 text-amber-400" />
                <span>Connect Ports</span>
              </button>

              <button
                onClick={() => setIsAssistantOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-2 border border-slate-700/80 cursor-pointer transition-all hover:text-white"
              >
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>Network Audit & Assistant</span>
              </button>

              <button
                onClick={() => setIsLabsOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-2 border border-slate-700/80 cursor-pointer transition-all hover:text-white"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>12 Networking Labs</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsProjectsOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-2 border border-slate-700/80 cursor-pointer transition-all hover:text-white shadow-sm"
              >
                <FolderDown className="w-4 h-4 text-emerald-400" />
                <span>Save & Export Docs</span>
              </button>
            </div>
          </div>

        {/* Collapsible Device Palette */}
        {isPaletteOpen && (
          <DevicePalette
            onAddDevice={handleAddDeviceFromPalette}
            activeCampus={activeCampus === 'all' ? 'main' : activeCampus}
          />
        )}

        {/* ── VIEW 1: TOPOLOGY & SIMULATION CANVAS ── */}
        {activeTab === 'topology' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Campus View Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'all', label: 'All 4 Campuses & WAN' },
                  { id: 'main', label: 'Main Campus (Bati)' },
                  { id: 'hit', label: 'HiT Tech Campus' },
                  { id: 'cvm', label: 'CVM Veterinary' },
                  { id: 'harar', label: 'Harar Health Campus' }
                ].map((camp) => (
                  <button
                    key={camp.id}
                    onClick={() => setActiveCampus(camp.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      activeCampus === camp.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {camp.label}
                  </button>
                ))}
              </div>

              <span className="text-[11px] font-mono text-slate-400">
                {devices.length} Devices &bull; {links.length} Physical/VPN Links
              </span>
            </div>

            {/* Interactive Canvas */}
            <TopologyCanvas
              devices={devices}
              links={links}
              packets={packets}
              activeCampus={activeCampus}
              selectedDeviceId={selectedDevice?.id || null}
              onSelectDevice={handleSelectDevice}
              onDeviceMove={handleDeviceMove}
              pingSourceId={pduSourceId}
              onSetPingSource={setPduSourceId}
              onPacketClick={(pkt) => setInspectPacket(pkt)}
            />

            {/* Bottom Simulation Bar and Event List */}
            <SimulationBar
              mode={simMode}
              onSetMode={setSimMode}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onStepForward={() => {
                setPackets((prev) =>
                  prev.map((p) => ({
                    ...p,
                    currentHopIndex: Math.min(p.path.length, p.currentHopIndex + 1),
                    status: p.currentHopIndex + 1 >= p.path.length ? 'success' : 'transmitting'
                  }))
                );
              }}
              onResetPackets={() => setPackets([])}
              packets={packets}
              isPduToolActive={isPduToolActive}
              onTogglePduTool={() => {
                setIsPduToolActive(!isPduToolActive);
                setPduSourceId(null);
              }}
              pduSource={pduSourceId}
              speed={simSpeed}
              onSetSpeed={setSimSpeed}
              onInspectPacket={(pkt) => setInspectPacket(pkt)}
            />
          </div>
        )}

        {/* ── VIEW: COLLEGES & DEPARTMENTS NETWORK DIRECTORY ── */}
        {activeTab === 'colleges' && (
          <CollegeDepartmentHierarchy
            devices={devices}
            onSelectDepartmentWorkstation={(workstationId) => {
              const dev = devices.find((d) => d.id === workstationId);
              if (dev) {
                setDesktopDevice(dev);
              }
            }}
            onOpenSwitchCli={(switchId) => {
              const dev = devices.find((d) => d.id === switchId);
              if (dev) {
                setChassisDevice(dev);
              }
            }}
            onSendPingFromDepartment={(srcId, dstId) => {
              sendSimulationPing(srcId, dstId);
            }}
            onLocateOnCanvas={(campusId, deviceId) => {
              if (campusId === 'wan') {
                setActiveCampus('all');
              } else {
                setActiveCampus(campusId);
              }
              setActiveTab('topology');
              const dev = devices.find((d) => d.id === deviceId);
              if (dev) {
                setSelectedDevice(dev);
              }
            }}
          />
        )}

        {/* ── VIEW 2: HARAMAYA PORTAL ── */}
        {activeTab === 'portal' && <HaramayaPortal />}

        {/* ── VIEW 3: HU SOC ── */}
        {activeTab === 'soc' && (
          <SocDashboard
            firewallRules={firewallRules}
            onUpdateRules={setFirewallRules}
            securityEvents={securityEvents}
            onTriggerThreatSimulation={handleTriggerThreat}
          />
        )}

        {/* ── VIEW 4: IPSEC VPN ── */}
        {activeTab === 'vpn' && (
          <VpnTunnelMonitor
            onTriggerVpnPacket={() => {
              sendSimulationPing('c1-pc-admin1', 'harar-pc-med');
            }}
          />
        )}

        {/* ── VIEW: LIVE BANDWIDTH TELEMETRY ── */}
        {activeTab === 'telemetry' && <BandwidthTrafficMonitor />}

        {/* ── VIEW: VLSM SUBNET CALCULATOR ── */}
        {activeTab === 'calculator' && <SubnetCalculator />}

        {/* ── VIEW 5: IOT LAB ── */}
        {activeTab === 'iot' && (
          <IotLabModal
            iotState={iotState}
            onUpdateIot={setIotState}
            onClose={() => setActiveTab('topology')}
            onLogEvent={addSyslogEntry}
          />
        )}

        {/* ── VIEW 6: PHYSICAL BUILDINGS ── */}
        {activeTab === 'buildings' && <HaramayaPhysicalBuildings />}

        {/* ── VIEW 7: IP & VLAN TABLES ── */}
        {activeTab === 'tables' && <IpVlanTables />}

        {/* ── VIEW 8: CISCO IOS CONFIGS ── */}
        {activeTab === 'configs' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Cisco IOS Configuration Repository</h3>
                <p className="text-xs text-slate-400">Authentic production scripts ready for Cisco Packet Tracer terminal paste</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedConfigDevice}
                  onChange={(e) => setSelectedConfigDevice(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-mono"
                >
                  <option value="c1-asa1">HU-MAIN-ASA1 (Cisco ASA 5506-X Firewall)</option>
                  <option value="c1-cs1">HU-MAIN-CS1 (Catalyst 3650 Core Switch 1)</option>
                  <option value="c1-ds1">HU-MAIN-DS1 (Catalyst 3650 Dist Switch 1)</option>
                  <option value="c1-sw-caes">SW-MAIN-CAES (Agriculture & Environmental Access SW)</option>
                  <option value="harar-sw-med">SW-HARAR-MED (Health & Medical Sciences Access SW)</option>
                  <option value="c1-voip">HU-MAIN-VOIP (Cisco 2811 CME Telephony)</option>
                </select>

                <button
                  onClick={copyConfigSnippet}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedConfig ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedConfig ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
            </div>

            <div className="bg-black border border-slate-800 rounded-2xl p-5 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed max-h-[550px]">
              <pre>{HARAMAYA_CISCO_CONFIGS[selectedConfigDevice]}</pre>
            </div>
          </div>
        )}

        {/* ── VIEW 9: ADMIN & RBAC DASHBOARD ── */}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>
      )}

      {/* ── MODALS ── */}
      {chassisDevice && (
        <PhysicalChassisModal
          device={chassisDevice}
          onUpdateDevice={handleUpdateDevice}
          onClose={() => setChassisDevice(null)}
          onSendPingPacket={handleSendPingFromCli}
        />
      )}

      {serverDevice && (
        <ServerServicesModal
          device={serverDevice}
          dnsRecords={dnsRecords}
          onUpdateDns={setDnsRecords}
          ftpFiles={ftpFiles}
          onUpdateFtp={setFtpFiles}
          syslogLogs={syslogLogs}
          onClose={() => setServerDevice(null)}
        />
      )}

      {desktopDevice && (
        <EndDeviceDesktopModal
          device={desktopDevice}
          dnsRecords={dnsRecords}
          mailMessages={mailMessages}
          onSendMail={(msg) => setMailMessages((prev) => [msg, ...prev])}
          onSendPingPacket={(sourceId, targetIp) => handleSendPingFromCli(sourceId, targetIp)}
          onClose={() => setDesktopDevice(null)}
        />
      )}

      {inspectPacket && (
        <PacketInspectorModal
          packet={inspectPacket}
          onClose={() => setInspectPacket(null)}
        />
      )}

      {isConnectModalOpen && (
        <ConnectDeviceModal
          devices={devices}
          onConnect={(newLink) => setLinks((prev) => [...prev, newLink])}
          onClose={() => setIsConnectModalOpen(false)}
        />
      )}

      {isAssistantOpen && (
        <SmartNetworkAssistant
          devices={devices}
          links={links}
          firewallRules={firewallRules}
          vlans={vlans}
          onClose={() => setIsAssistantOpen(false)}
        />
      )}

      {isLabsOpen && (
        <EducationalLabsModal
          onClose={() => setIsLabsOpen(false)}
        />
      )}

      {isProjectsOpen && (
        <ProjectManagerModal
          devices={devices}
          links={links}
          vlans={vlans}
          firewallRules={firewallRules}
          onLoadProject={(proj) => {
            setDevices(proj.devices);
            setLinks(proj.links);
            setVlans(proj.vlans);
            setFirewallRules(proj.firewallRules);
            setIsProjectsOpen(false);
          }}
          onClose={() => setIsProjectsOpen(false)}
        />
      )}

      {isIotLabOpen && activeTab !== 'iot' && (
        <IotLabModal
          iotState={iotState}
          onUpdateIot={setIotState}
          onClose={() => setIsIotLabOpen(false)}
          onLogEvent={addSyslogEntry}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500 mt-auto bg-slate-950/80">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>Haramaya University Smart Network Configuration & Simulation Platform</span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="text-slate-400">
            Main Campus, HiT Engineering, CVM Veterinary & Harar CHMS Campus &bull; Cisco Packet Tracer Showcase
          </span>
        </div>
      </footer>
    </div>
  );
}
