import React, { useState, useEffect, useRef } from 'react';
import { ChatUser, NetworkPacketHop } from '../../types/messaging';
import { 
  Network, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Server, 
  Monitor, 
  Layers, 
  Activity, 
  ArrowRight, 
  RotateCcw, 
  Zap, 
  Cpu, 
  Radio, 
  FileCode,
  Sparkles,
  Lock,
  Mail,
  GripHorizontal
} from 'lucide-react';

interface VisualPacketFlowProps {
  sourceUser: ChatUser;
  destUser: ChatUser;
  hops: NetworkPacketHop[];
  activeHopIndex: number;
  isSimulating: boolean;
  onReplay: () => void;
  onDragTransmit?: () => void;
}

export const VisualPacketFlow: React.FC<VisualPacketFlowProps> = ({
  sourceUser,
  destUser,
  hops,
  activeHopIndex,
  isSimulating,
  onReplay,
  onDragTransmit
}) => {
  const [selectedHopIndex, setSelectedHopIndex] = useState<number>(activeHopIndex);
  const [dragProgress, setDragProgress] = useState<number>(0);
  const [isDraggingPdu, setIsDraggingPdu] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedHopIndex(activeHopIndex);
  }, [activeHopIndex]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSimulating) return;
    setIsDraggingPdu(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingPdu || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clampedProgress = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setDragProgress(clampedProgress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingPdu) {
      setIsDraggingPdu(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      if (dragProgress > 70) {
        setDragProgress(100);
        if (onDragTransmit) {
          onDragTransmit();
        } else {
          onReplay();
        }
      }
      setTimeout(() => {
        setDragProgress(0);
      }, 400);
    }
  };

  const currentHop = hops[selectedHopIndex] || hops[hops.length - 1];
  const isDelivered = activeHopIndex >= hops.length - 1 && !isSimulating;

  return (
    <div className="flex flex-col h-full bg-[#050914] text-slate-100 rounded-2xl border border-slate-800/90 overflow-hidden font-sans">
      
      {/* Simulation Header */}
      <div className="p-4 bg-[#091024] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00ff87]/20 border border-[#00ff87]/40 flex items-center justify-center text-[#00ff87]">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Packet Tracer Simulation Flow</span>
              {isSimulating ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/40 animate-pulse">
                  <Activity className="w-3 h-3" /> Transmitting PDU
                </span>
              ) : isDelivered ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/40">
                  <CheckCircle2 className="w-3 h-3" /> Delivered
                </span>
              ) : null}
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Live Layer 2/3/4 End-to-End PDU Packet Inspection
            </p>
          </div>
        </div>

        <button
          onClick={onReplay}
          disabled={isSimulating}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
          title="Replay packet animation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay PDU</span>
        </button>
      </div>

      {/* Network Topology Canvas / Path Animation */}
      <div className="p-4 bg-[#070c1a] border-b border-slate-800 relative overflow-hidden">
        
        {/* Source & Destination Summary Bar */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
          <div className="bg-[#0c142b] p-2.5 rounded-xl border border-emerald-500/30">
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold block">
              [SOURCE HOST]
            </span>
            <div className="font-bold text-white text-xs truncate">{sourceUser.name}</div>
            <div className="text-[10px] text-slate-400 truncate">
              {sourceUser.ipAddress} &bull; VLAN {sourceUser.vlan}
            </div>
            <div className="text-[9px] text-slate-500 truncate">{sourceUser.campus}</div>
          </div>

          <div className="bg-[#0c142b] p-2.5 rounded-xl border border-cyan-500/30 text-right">
            <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold block">
              [DESTINATION HOST]
            </span>
            <div className="font-bold text-white text-xs truncate">{destUser.name}</div>
            <div className="text-[10px] text-slate-400 truncate">
              {destUser.ipAddress} &bull; VLAN {destUser.vlan}
            </div>
            <div className="text-[9px] text-slate-500 truncate">{destUser.campus}</div>
          </div>
        </div>

        {/* Visual Cable & Hop Nodes */}
        <div className="relative py-4 px-2">
          {/* Connecting Trunk Line */}
          <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-800 -translate-y-1/2 z-0">
            {/* Animated Progress Cable Glow */}
            <div 
              className="h-full bg-gradient-to-r from-[#00ff87] via-[#00e5ff] to-cyan-400 transition-all duration-300 shadow-[0_0_12px_#00ff87]"
              style={{
                width: hops.length > 1 ? `${(activeHopIndex / (hops.length - 1)) * 100}%` : '0%'
              }}
            />
          </div>

          {/* Node Discs */}
          <div className="relative z-10 flex items-center justify-between">
            {hops.map((hop, idx) => {
              const isPast = idx < activeHopIndex;
              const isCurrent = idx === activeHopIndex;
              const isSelected = idx === selectedHopIndex;

              return (
                <button
                  key={`${hop.nodeId}-${idx}`}
                  onClick={() => setSelectedHopIndex(idx)}
                  className={`group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transition-transform ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                      isCurrent
                        ? 'bg-[#00ff87] text-slate-950 ring-4 ring-[#00ff87]/30 shadow-[#00ff87]/50 animate-bounce'
                        : isPast || isDelivered
                        ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-300'
                        : 'bg-slate-900 border border-slate-700 text-slate-400'
                    } ${isSelected && !isCurrent ? 'ring-2 ring-cyan-400' : ''}`}
                  >
                    {hop.nodeType === 'host' ? (
                      <Monitor className="w-5 h-5" />
                    ) : hop.nodeType === 'switch' ? (
                      <Layers className="w-5 h-5" />
                    ) : hop.nodeType === 'firewall' ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      <Server className="w-5 h-5" />
                    )}
                  </div>

                  <span className={`text-[9px] font-mono max-w-[64px] text-center truncate ${
                    isCurrent || isSelected ? 'text-white font-bold' : 'text-slate-400'
                  }`}>
                    {hop.nodeName.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Drag & Send Simple PDU Track */}
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-[#00ff87] font-bold">
              <Mail className="w-3.5 h-3.5" />
              DRAG & SEND SIMPLE PDU:
            </span>
            <span className="text-cyan-300">
              {isDraggingPdu ? `${Math.round(dragProgress)}% Transmitted` : 'Drag ✉ to Destination Host'}
            </span>
          </div>

          <div
            ref={trackRef}
            className="relative h-10 rounded-xl bg-[#091129] border border-slate-700/80 p-1 flex items-center select-none overflow-hidden"
          >
            {/* Background fill track */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#00ff87]/30 via-cyan-500/30 to-[#00ff87]/40 transition-all pointer-events-none"
              style={{ width: `${Math.max(dragProgress, isSimulating ? (activeHopIndex / (hops.length - 1)) * 100 : 0)}%` }}
            />

            {/* Hint text in track */}
            <div className="w-full text-center text-[10px] font-mono font-semibold text-slate-400 pointer-events-none flex items-center justify-center gap-1.5">
              <span>{sourceUser.name.split(' ')[0]}</span>
              <ArrowRight className="w-3 h-3 text-[#00ff87] animate-pulse" />
              <span>Drag Envelope Icon ➔ Release to Send</span>
              <ArrowRight className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>{destUser.name.split(' ')[0]}</span>
            </div>

            {/* Draggable PDU Envelope Handle */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{
                left: `calc(${dragProgress}% - ${dragProgress * 0.36}px)`,
                touchAction: 'none'
              }}
              className={`absolute top-1 bottom-1 w-9 rounded-lg bg-gradient-to-br from-[#00ff87] to-cyan-400 text-slate-950 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg shadow-[#00ff87]/40 z-10 transition-transform ${
                isDraggingPdu ? 'scale-110 ring-2 ring-white' : 'hover:scale-105'
              }`}
              title="Drag ✉ across to send simple PDU"
            >
              <Mail className="w-4 h-4 fill-slate-950/20" />
            </div>
          </div>
        </div>
      </div>

      {/* OSI 7-Layer PDU Packet Inspector */}
      {currentHop && (
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400 flex items-center gap-1.5 font-bold uppercase">
              <Cpu className="w-3.5 h-3.5 text-[#00ff87]" />
              Hop {selectedHopIndex + 1} of {hops.length}: {currentHop.nodeName}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#00ff87]/15 text-[#00ff87] text-[10px] font-mono font-bold uppercase">
              {currentHop.layerDetails.status}
            </span>
          </div>

          {/* Action Callout */}
          <div className="p-2.5 rounded-xl bg-[#091129] border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{currentHop.action}</span>
          </div>

          {/* Layer Headers Breakdown */}
          <div className="space-y-2 text-xs font-mono">
            {/* Layer 4 Transport */}
            <div className="p-3 rounded-xl bg-[#080e22] border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Layer 4 (Transport / Socket Security)
                </span>
                <span className="text-[10px] text-slate-400">TCP / TLS</span>
              </div>
              <p className="text-slate-300 text-[11px]">{currentHop.layerDetails.layer4}</p>
            </div>

            {/* Layer 3 Network */}
            <div className="p-3 rounded-xl bg-[#080e22] border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5" />
                  Layer 3 (Network Routing / OSPF FIB)
                </span>
                <span className="text-[10px] text-slate-400">IPv4</span>
              </div>
              <p className="text-slate-300 text-[11px]">{currentHop.layerDetails.layer3}</p>
            </div>

            {/* Layer 2 Data Link */}
            <div className="p-3 rounded-xl bg-[#080e22] border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#00ff87] mb-1">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Layer 2 (Data Link / 802.1Q Framing)
                </span>
                <span className="text-[10px] text-slate-400">Ethernet II</span>
              </div>
              <p className="text-slate-300 text-[11px]">{currentHop.layerDetails.layer2}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Status */}
      <div className="p-3 bg-[#091024] border-t border-slate-800 text-[11px] font-mono flex items-center justify-between text-slate-400">
        <span>Campus Link: {currentHop ? currentHop.campus : 'HU Backbone'}</span>
        <span className="text-[#00ff87] font-bold">End-to-End Cryptography Active</span>
      </div>
    </div>
  );
};
