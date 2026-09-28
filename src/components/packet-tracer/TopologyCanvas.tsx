/**
 * Cisco Packet Tracer Interactive Topology Canvas
 * Supports zoom, pan, dragging devices, cable rendering, port LEDs,
 * animated packet transmission, and device click-to-configure.
 */

import React, { useState, useRef, useEffect } from 'react';
import { NetworkDevice, NetworkLink, SimulationPacket, CampusId } from '../../types/network';
import { ALL_HARAMAYA_COLLEGES } from '../../data/haramayaCollegesData';
import { 
  Server, 
  Monitor, 
  Laptop, 
  PhoneCall, 
  ShieldAlert, 
  Cloud, 
  Radio, 
  Lightbulb, 
  Fan, 
  Flame, 
  Droplets, 
  DoorClosed, 
  Camera, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2,
  Minimize2,
  Filter,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface TopologyCanvasProps {
  devices: NetworkDevice[];
  links: NetworkLink[];
  packets: SimulationPacket[];
  activeCampus: 'all' | 'main' | 'hit' | 'cvm' | 'harar';
  selectedDeviceId: string | null;
  onSelectDevice: (device: NetworkDevice) => void;
  onDeviceMove?: (id: string, x: number, y: number) => void;
  pingSourceId: string | null;
  onSetPingSource: (id: string | null) => void;
  onPacketClick?: (packet: SimulationPacket) => void;
}

export const TopologyCanvas: React.FC<TopologyCanvasProps> = ({
  devices,
  links,
  packets,
  activeCampus,
  selectedDeviceId,
  onSelectDevice,
  onDeviceMove,
  pingSourceId,
  onSetPingSource,
  onPacketClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.9);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggingDeviceId, setDraggingDeviceId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [filterLayer, setFilterLayer] = useState<string>('all');
  const [filterCollege, setFilterCollege] = useState<string>('all');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Auto-pan and zoom to focus selected campus
  useEffect(() => {
    if (activeCampus === 'all') {
      setScale(0.72);
      setPan({ x: 20, y: 20 });
    } else if (activeCampus === 'main') {
      setScale(0.95);
      setPan({ x: 30, y: 20 });
    } else if (activeCampus === 'hit') {
      setScale(1.05);
      setPan({ x: -620, y: 30 });
    } else if (activeCampus === 'cvm') {
      setScale(1.05);
      setPan({ x: -940, y: 30 });
    } else if (activeCampus === 'harar') {
      setScale(1.05);
      setPan({ x: -1250, y: 30 });
    }
  }, [activeCampus]);

  // Filter devices based on active campus and college
  const visibleDevices = devices.filter((d) => {
    if (activeCampus === 'all') return true;
    return d.campus === activeCampus || d.campus === 'wan';
  }).filter((d) => {
    if (filterCollege === 'all') return true;
    // Keep infrastructure backbone visible
    if (['core', 'distribution', 'outside', 'dmz'].includes(d.layer)) return true;
    const col = ALL_HARAMAYA_COLLEGES.find((c) => c.id === filterCollege);
    if (!col) return true;
    const colDeptNames = col.departments.map((dep) => dep.name);
    const colSwitchIds = col.departments.map((dep) => dep.switchId);
    const colWorkstationIds = col.departments.map((dep) => dep.workstationId);
    return (
      colSwitchIds.includes(d.id) ||
      colWorkstationIds.includes(d.id) ||
      (d.department && (colDeptNames.includes(d.department) || d.department.includes(col.name)))
    );
  }).filter((d) => {
    if (filterLayer === 'all') return true;
    if (filterLayer === 'infrastructure') return ['core', 'distribution', 'outside', 'dmz'].includes(d.layer);
    if (filterLayer === 'access') return d.layer === 'access';
    if (filterLayer === 'servers') return d.type === 'server';
    if (filterLayer === 'iot') return d.layer === 'iot';
    if (filterLayer === 'end') return ['pc', 'laptop', 'ip_phone'].includes(d.type);
    return true;
  });

  const visibleDeviceMap = new Map(visibleDevices.map((d) => [d.id, d]));

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0 && !draggingDeviceId) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    } else if (draggingDeviceId && onDeviceMove) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = (e.clientX - rect.left - pan.x) / scale;
        const mouseY = (e.clientY - rect.top - pan.y) / scale;
        onDeviceMove(draggingDeviceId, Math.round(mouseX - dragOffset.x), Math.round(mouseY - dragOffset.y));
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingDeviceId(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setScale((prev) => Math.min(2.5, Math.max(0.4, prev * zoomFactor)));
  };

  // Get device icon
  const renderDeviceIcon = (device: NetworkDevice) => {
    switch (device.type) {
      case 'router':
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg border border-cyan-300/40">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v10M7 12h10M9 9l6 6M15 9l-6 6" />
            </svg>
          </div>
        );
      case 'switch_l3':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-lg border border-cyan-400/40">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 12h10M7 9l-3 3 3 3M17 9l3 3-3 3" />
            </svg>
          </div>
        );
      case 'switch_l2':
        return (
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-slate-200 shadow-md border border-slate-600">
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2">
              <rect x="3" y="6" width="18" height="12" rx="2" />
              <path d="M8 12h8M8 9l-2 3 2 3M16 9l2 3-2 3" />
            </svg>
          </div>
        );
      case 'firewall':
        return (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-700 to-red-950 flex items-center justify-center text-white shadow-lg border border-rose-400/50">
            <ShieldAlert className="w-6 h-6 text-rose-200" />
          </div>
        );
      case 'server':
        return (
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md border border-emerald-400/40">
            <Server className="w-5 h-5 text-emerald-100" />
          </div>
        );
      case 'pc':
        return (
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-cyan-300 shadow-md border border-cyan-500/30">
            <Monitor className="w-5 h-5" />
          </div>
        );
      case 'laptop':
        return (
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-cyan-300 shadow-md border border-cyan-500/30">
            <Laptop className="w-5 h-5" />
          </div>
        );
      case 'ip_phone':
        return (
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white shadow-md border border-amber-400/40">
            <PhoneCall className="w-5 h-5" />
          </div>
        );
      case 'iot_sensor':
      case 'iot_actuator':
        if (device.id.includes('motion')) return <div className="w-8 h-8 rounded-full bg-blue-600/80 flex items-center justify-center text-white"><Radio className="w-4 h-4" /></div>;
        if (device.id.includes('light')) return <div className="w-8 h-8 rounded-full bg-amber-500/80 flex items-center justify-center text-white"><Lightbulb className="w-4 h-4" /></div>;
        if (device.id.includes('fan')) return <div className="w-8 h-8 rounded-full bg-cyan-600/80 flex items-center justify-center text-white"><Fan className="w-4 h-4" /></div>;
        if (device.id.includes('fire')) return <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white"><Flame className="w-4 h-4" /></div>;
        if (device.id.includes('sprinkler')) return <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white"><Droplets className="w-4 h-4" /></div>;
        if (device.id.includes('door')) return <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white"><DoorClosed className="w-4 h-4" /></div>;
        return <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white"><Radio className="w-4 h-4" /></div>;
      default:
        return <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-white"><Monitor className="w-4 h-4" /></div>;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full bg-slate-950 overflow-hidden select-none cursor-grab active:cursor-grabbing border border-slate-800 rounded-2xl transition-all ${
        isFullScreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen border-none' : 'h-[680px]'
      }`}
    >
      {/* Background Grid Pattern (Authentic Packet Tracer Grid) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4f46e5" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Campus Background Zones */}
      <div
        className="absolute pointer-events-none transition-transform duration-75 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
        }}
      >
        {/* Campus 1: Main Campus Boundary */}
        {(activeCampus === 'all' || activeCampus === 'main') && (
          <div className="absolute left-8 top-20 w-[670px] h-[640px] rounded-3xl border-2 border-indigo-500/20 bg-indigo-950/10 backdrop-blur-[2px] p-4 pointer-events-none">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-400 font-mono tracking-wider uppercase">
              <span>Haramaya Main Campus (Bati)</span>
              <span>10.10.0.0/16 &bull; DMZ: 10.10.150.0/24</span>
            </div>
          </div>
        )}

        {/* Campus 2: HiT Campus Boundary */}
        {(activeCampus === 'all' || activeCampus === 'hit') && (
          <div className="absolute left-[710px] top-20 w-[290px] h-[640px] rounded-3xl border-2 border-cyan-500/20 bg-cyan-950/10 backdrop-blur-[2px] p-4 pointer-events-none">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-400 font-mono tracking-wider uppercase">
              <span>HiT Tech Campus</span>
              <span>10.20.0.0/16</span>
            </div>
          </div>
        )}

        {/* Campus 3: CVM Campus Boundary */}
        {(activeCampus === 'all' || activeCampus === 'cvm') && (
          <div className="absolute left-[1030px] top-20 w-[290px] h-[640px] rounded-3xl border-2 border-emerald-500/20 bg-emerald-950/10 backdrop-blur-[2px] p-4 pointer-events-none">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 font-mono tracking-wider uppercase">
              <span>CVM Veterinary</span>
              <span>10.30.0.0/16</span>
            </div>
          </div>
        )}

        {/* Campus 4: Harar Campus Boundary */}
        {(activeCampus === 'all' || activeCampus === 'harar') && (
          <div className="absolute left-[1350px] top-20 w-[310px] h-[640px] rounded-3xl border-2 border-amber-500/20 bg-amber-950/10 backdrop-blur-[2px] p-4 pointer-events-none">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 font-mono tracking-wider uppercase">
              <span>Harar Health (CHMS & HFSUH)</span>
              <span>10.40.0.0/16</span>
            </div>
          </div>
        )}

        {/* DMZ Zone Box in Main Campus */}
        {(activeCampus === 'all' || activeCampus === 'main') && (
          <div className="absolute left-12 top-28 w-[160px] h-[340px] rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-2 pointer-events-none">
            <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider uppercase">
              DMZ Server Farm
            </span>
          </div>
        )}
      </div>

      {/* SVG Cables & Link Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
        }}
      >
        <defs>
          <linearGradient id="vpnGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        {links.map((link) => {
          const fromDev = visibleDeviceMap.get(link.fromDeviceId);
          const toDev = visibleDeviceMap.get(link.toDeviceId);
          if (!fromDev || !toDev) return null;

          const isVpn = link.type === 'vpn';
          const isFiber = link.type === 'fiber';
          const isIoT = link.type === 'iot';
          const strokeColor = isVpn
            ? 'url(#vpnGradient)'
            : isFiber
            ? '#f59e0b'
            : isIoT
            ? '#a855f7'
            : '#475569';

          const strokeWidth = isVpn ? 3 : isFiber ? 2.5 : 1.5;
          const strokeDash = isVpn ? '6 4' : link.type === 'crossover' ? '4 3' : 'none';

          // Curved path for VPN across ISP, straight for others
          const dx = toDev.x - fromDev.x;
          const dy = toDev.y - fromDev.y;
          const midX = (fromDev.x + toDev.x) / 2;
          const midY = (fromDev.y + toDev.y) / 2 - (isVpn ? 40 : 0);

          const pathD = isVpn
            ? `M ${fromDev.x + 20} ${fromDev.y + 20} Q ${midX} ${midY} ${toDev.x + 20} ${toDev.y + 20}`
            : `M ${fromDev.x + 20} ${fromDev.y + 20} L ${toDev.x + 20} ${toDev.y + 20}`;

          return (
            <g key={link.id}>
              {/* Cable line */}
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDash}
                className={isVpn ? 'animate-pulse' : ''}
              />

              {/* Port LED (Green up / Amber) */}
              <circle
                cx={fromDev.x + 20 + (toDev.x - fromDev.x) * 0.15}
                cy={fromDev.y + 20 + (toDev.y - fromDev.y) * 0.15}
                r="3"
                fill="#22c55e"
                className="animate-ping opacity-75"
              />
              <circle
                cx={toDev.x + 20 - (toDev.x - fromDev.x) * 0.15}
                cy={toDev.y + 20 - (toDev.y - fromDev.y) * 0.15}
                r="3"
                fill="#22c55e"
              />

              {/* VPN label */}
              {isVpn && (
                <text
                  x={midX}
                  y={midY - 10}
                  fill="#38bdf8"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="font-bold drop-shadow"
                >
                  IPSec Tunnel (AES-256)
                </text>
              )}
            </g>
          );
        })}

        {/* In-flight Animated Packets */}
        {packets.map((pkt) => {
          const fromDev = visibleDeviceMap.get(pkt.sourceDeviceId);
          const toDev = visibleDeviceMap.get(pkt.targetDeviceId);
          if (!fromDev || !toDev) return null;

          const progress = (pkt.currentHopIndex % 10) / 10;
          const curX = fromDev.x + 20 + (toDev.x - fromDev.x) * progress;
          const curY = fromDev.y + 20 + (toDev.y - fromDev.y) * progress;

          return (
            <g
              key={pkt.id}
              className="cursor-pointer pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                if (onPacketClick) onPacketClick(pkt);
              }}
            >
              <circle cx={curX} cy={curY} r="9" fill={pkt.color} className="animate-pulse shadow-lg" />
              <text
                x={curX}
                y={curY - 14}
                fill={pkt.color}
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                {pkt.protocol} (Inspect)
              </text>
            </g>
          );
        })}
      </svg>

      {/* Render Network Devices */}
      <div
        className="absolute inset-0 pointer-events-none origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
        }}
      >
        {visibleDevices.map((dev) => {
          const isSelected = selectedDeviceId === dev.id;
          const isPingSource = pingSourceId === dev.id;

          return (
            <div
              key={dev.id}
              style={{
                left: `${dev.x}px`,
                top: `${dev.y}px`
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                if (e.shiftKey) {
                  // Drag device
                  setDraggingDeviceId(dev.id);
                  setDragOffset({ x: 0, y: 0 });
                } else {
                  if (pingSourceId && pingSourceId !== dev.id) {
                    // Send PDU ping between source and this target!
                    onSelectDevice(dev);
                  } else {
                    onSelectDevice(dev);
                  }
                }
              }}
              className={`absolute pointer-events-auto flex flex-col items-center cursor-pointer group transition-transform duration-100 ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-10'
              }`}
            >
              {/* Ping Selection Halo */}
              {isPingSource && (
                <span className="absolute -inset-2 rounded-2xl bg-amber-500/30 border-2 border-amber-400 animate-pulse pointer-events-none" />
              )}

              {/* Selection Halo */}
              {isSelected && (
                <span className="absolute -inset-1.5 rounded-2xl bg-indigo-500/30 border border-indigo-400 pointer-events-none" />
              )}

              {/* Device Icon */}
              {renderDeviceIcon(dev)}

              {/* Device Label */}
              <div className="mt-1 text-center select-none">
                <span className="text-[11px] font-semibold text-white tracking-tight block px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-800 shadow-sm leading-tight">
                  {dev.name}
                </span>
                {dev.managementIp && (
                  <span className="text-[9px] font-mono text-cyan-400/90 block mt-0.5">
                    {dev.managementIp}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Canvas Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl z-20">
        <button
          onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.4, s - 0.2))}
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setScale(1);
            setPan({ x: 50, y: 30 });
          }}
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            isFullScreen
              ? 'bg-indigo-600 text-white shadow-md'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
          title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Topology Canvas'}
        >
          {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* College Filter Menu */}
        <select
          value={filterCollege}
          onChange={(e) => setFilterCollege(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-cyan-300 font-medium focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[160px] truncate"
          title="Filter Canvas by College"
        >
          <option value="all">All Colleges (11)</option>
          {ALL_HARAMAYA_COLLEGES.map((c) => (
            <option key={c.id} value={c.id} className="bg-slate-900 text-white">
              {c.shortName} - {c.name}
            </option>
          ))}
        </select>

        {/* Layer Filter Menu */}
        <select
          value={filterLayer}
          onChange={(e) => setFilterLayer(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="all">All Device Layers</option>
          <option value="infrastructure">Core, Dist & ASA</option>
          <option value="access">Access Layer</option>
          <option value="servers">DMZ Servers</option>
          <option value="iot">IoT Nodes</option>
          <option value="end">Workstations & VoIP</option>
        </select>
      </div>

      {/* Hint Badge */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 pointer-events-none select-none z-20">
        <Info className="w-3.5 h-3.5 text-indigo-400" />
        <span>Click any device to open Cisco IOS CLI / Server GUI / Desktop. Hold <strong>Shift+Click</strong> to reposition.</span>
      </div>
    </div>
  );
};
