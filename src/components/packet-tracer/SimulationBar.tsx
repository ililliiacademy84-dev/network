/**
 * Cisco Packet Tracer Bottom Simulation Bar & Event List
 * Controls Realtime vs Simulation Mode, Play/Pause/Step, PDU generation,
 * and displays the live event list table.
 */

import React, { useState } from 'react';
import { SimulationPacket } from '../../types/network';
import { 
  Play, 
  Pause, 
  FastForward, 
  RotateCcw, 
  Mail, 
  ListFilter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';

interface SimulationBarProps {
  mode: 'realtime' | 'simulation';
  onSetMode: (m: 'realtime' | 'simulation') => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onResetPackets: () => void;
  packets: SimulationPacket[];
  isPduToolActive: boolean;
  onTogglePduTool: () => void;
  pduSource: string | null;
  speed: number;
  onSetSpeed: (s: number) => void;
  onInspectPacket?: (pkt: SimulationPacket) => void;
}

export const SimulationBar: React.FC<SimulationBarProps> = ({
  mode,
  onSetMode,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onResetPackets,
  packets,
  isPduToolActive,
  onTogglePduTool,
  pduSource,
  speed,
  onSetSpeed,
  onInspectPacket
}) => {
  const [isEventListOpen, setIsEventListOpen] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredPackets = packets.filter((p) => {
    if (filterType === 'all') return true;
    return p.protocol.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden select-none">
      {/* Simulation Top Controller Toolbar */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Realtime vs Simulation Mode Switch */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSetMode('realtime')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              mode === 'realtime'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Realtime
          </button>
          <button
            onClick={() => onSetMode('simulation')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              mode === 'simulation'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Simulation
          </button>
        </div>

        {/* Playback Controls (Active in Simulation Mode) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play / Capture'}</span>
          </button>

          <button
            onClick={onStepForward}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Step Forward (1 hop)"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResetPackets}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset Simulation Packets"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Speed slider */}
          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[11px]">
            <span>Speed:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={speed}
              onChange={(e) => onSetSpeed(parseFloat(e.target.value))}
              className="w-16 accent-indigo-500 cursor-pointer"
            />
            <span className="font-mono text-white">{speed}x</span>
          </div>
        </div>

        {/* PDU Ping Tool & Event List Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePduTool}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isPduToolActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>
              {isPduToolActive
                ? pduSource
                  ? 'Select Target Node...'
                  : 'Select Source Node...'
                : 'Add Simple PDU (Ping)'}
            </span>
          </button>

          <button
            onClick={() => setIsEventListOpen(!isEventListOpen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <span className="text-[11px] font-mono">Events ({packets.length})</span>
            {isEventListOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Simulation Event List */}
      {isEventListOpen && (
        <div className="bg-slate-950 p-3 max-h-48 overflow-y-auto">
          {packets.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs font-mono">
              Simulation queue empty. Click "Add Simple PDU" or run a command like <code>ping 172.16.10.6</code> in a PC or Cisco switch.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] text-slate-500 border-b border-slate-800 pb-1">
                <tr>
                  <th className="pb-1">Status</th>
                  <th className="pb-1">Protocol</th>
                  <th className="pb-1">Source Node</th>
                  <th className="pb-1">Target Node</th>
                  <th className="pb-1">Current Hop</th>
                  <th className="pb-1">PDU Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {filteredPackets.map((pkt) => (
                  <tr
                    key={pkt.id}
                    onClick={() => onInspectPacket && onInspectPacket(pkt)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
                    title="Click to open OSI Multi-Layer Packet Inspector"
                  >
                    <td className="py-1.5">
                      {pkt.status === 'success' ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Successful
                        </span>
                      ) : pkt.status === 'failed' ? (
                        <span className="flex items-center gap-1 text-rose-400 text-[11px]">
                          <XCircle className="w-3 h-3" />
                          Dropped
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-cyan-400 text-[11px] animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          In-Flight
                        </span>
                      )}
                    </td>
                    <td className="py-1.5">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold group-hover:ring-1 group-hover:ring-indigo-400"
                        style={{
                          backgroundColor: `${pkt.color}25`,
                          color: pkt.color,
                          border: `1px solid ${pkt.color}40`
                        }}
                      >
                        {pkt.protocol} &bull; Inspect
                      </span>
                    </td>
                    <td className="py-1.5 text-white font-semibold">{pkt.sourceDeviceId}</td>
                    <td className="py-1.5 text-white">{pkt.targetDeviceId}</td>
                    <td className="py-1.5 text-slate-400">
                      Step {pkt.currentHopIndex} of {pkt.path.length}
                    </td>
                    <td className="py-1.5 text-slate-400 truncate max-w-xs">{pkt.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
