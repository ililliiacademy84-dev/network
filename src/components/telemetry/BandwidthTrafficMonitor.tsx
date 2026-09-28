/**
 * Interactive Network Bandwidth & Link Traffic Load Testing
 * Real-time Gigabit/Fiber throughput telemetry across 4 Campuses
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  Radio, 
  Server, 
  Network 
} from 'lucide-react';

interface LinkMetric {
  id: string;
  name: string;
  endpoints: string;
  capacityGbps: number;
  currentMbps: number;
  utilizationPercent: number;
  packetsPerSec: number;
  droppedPackets: number;
  latencyMs: number;
  status: 'normal' | 'congested' | 'critical';
}

export const BandwidthTrafficMonitor: React.FC = () => {
  const [isGeneratingTraffic, setIsGeneratingTraffic] = useState<boolean>(true);
  const [trafficProfile, setTrafficProfile] = useState<'normal' | 'exam_day' | 'video_streaming' | 'soc_ddos'>('normal');

  const [metrics, setMetrics] = useState<LinkMetric[]>([
    {
      id: 'l1',
      name: 'Main Campus Core EtherChannel (Po1/Po2)',
      endpoints: 'HU-MAIN-CORE1 (Gi1/0/1-2) <-> HU-MAIN-CORE2 (Gi1/0/1-2)',
      capacityGbps: 20,
      currentMbps: 4820,
      utilizationPercent: 24.1,
      packetsPerSec: 382000,
      droppedPackets: 0,
      latencyMs: 0.4,
      status: 'normal'
    },
    {
      id: 'l2',
      name: 'Main DMZ Server Farm 10G Trunk',
      endpoints: 'HU-MAIN-CORE1 (Te1/0/1) <-> HU-DMZ-SW1 (Te1/0/1)',
      capacityGbps: 10,
      currentMbps: 3120,
      utilizationPercent: 31.2,
      packetsPerSec: 245000,
      droppedPackets: 0,
      latencyMs: 0.6,
      status: 'normal'
    },
    {
      id: 'l3',
      name: 'Main <-> HiT IPSec VPN Tunnel',
      endpoints: 'HU-MAIN-ASA1 (Outside) <-> HIT-CORE1 (Outside)',
      capacityGbps: 1,
      currentMbps: 410,
      utilizationPercent: 41.0,
      packetsPerSec: 32000,
      droppedPackets: 1,
      latencyMs: 4.8,
      status: 'normal'
    },
    {
      id: 'l4',
      name: 'Main <-> Harar Campus IPSec VPN Tunnel',
      endpoints: 'HU-MAIN-ASA1 (Outside) <-> HARAR-ASA1 (Outside)',
      capacityGbps: 1,
      currentMbps: 680,
      utilizationPercent: 68.0,
      packetsPerSec: 54000,
      droppedPackets: 4,
      latencyMs: 8.2,
      status: 'normal'
    },
    {
      id: 'l5',
      name: 'Main <-> CVM Veterinary IPSec VPN Tunnel',
      endpoints: 'HU-MAIN-ASA1 (Outside) <-> CVM-CORE1 (Outside)',
      capacityGbps: 1,
      currentMbps: 290,
      utilizationPercent: 29.0,
      packetsPerSec: 21000,
      droppedPackets: 0,
      latencyMs: 5.1,
      status: 'normal'
    },
    {
      id: 'l6',
      name: 'EthioTelecom Primary Gateway ISP Link',
      endpoints: 'HU-MAIN-GW (Gi0/0/0) <-> ETHIOTELECOM-ISP (Gi0/0/0)',
      capacityGbps: 10,
      currentMbps: 5420,
      utilizationPercent: 54.2,
      packetsPerSec: 420000,
      droppedPackets: 2,
      latencyMs: 14.5,
      status: 'normal'
    }
  ]);

  // Traffic dynamic simulation tick
  useEffect(() => {
    if (!isGeneratingTraffic) return;

    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          let multiplier = 1;
          if (trafficProfile === 'exam_day') multiplier = 1.8;
          if (trafficProfile === 'video_streaming') multiplier = 2.4;
          if (trafficProfile === 'soc_ddos' && m.id === 'l6') multiplier = 3.8;

          const jitter = (Math.random() * 0.2 - 0.1) * m.currentMbps;
          const targetMbps = Math.max(50, Math.min(m.capacityGbps * 1000, m.currentMbps * multiplier + jitter));
          const util = (targetMbps / (m.capacityGbps * 1000)) * 100;

          return {
            ...m,
            currentMbps: Math.round(targetMbps),
            utilizationPercent: parseFloat(util.toFixed(1)),
            packetsPerSec: Math.round(targetMbps * 80),
            droppedPackets: util > 85 ? m.droppedPackets + Math.floor(Math.random() * 8) : m.droppedPackets,
            status: util > 85 ? 'critical' : util > 65 ? 'congested' : 'normal'
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isGeneratingTraffic, trafficProfile]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 p-6 rounded-3xl border border-cyan-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Haramaya Live Bandwidth & Throughput Telemetry</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              SNMP / NetFlow v9
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time interface link load monitoring, packet drop analytics, and stress-test traffic generator.
          </p>
        </div>

        {/* Traffic Profile Switcher */}
        <div className="flex items-center gap-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setIsGeneratingTraffic(!isGeneratingTraffic)}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer ${
              isGeneratingTraffic ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isGeneratingTraffic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isGeneratingTraffic ? 'Live Polling' : 'Paused'}</span>
          </button>

          <select
            value={trafficProfile}
            onChange={(e) => setTrafficProfile(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="normal">Profile: Regular Day (35% Avg)</option>
            <option value="exam_day">Profile: Online Exams Rush (65%)</option>
            <option value="video_streaming">Profile: Video Conferencing (80%)</option>
            <option value="soc_ddos">Profile: Perimeter Stress Spike</option>
          </select>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((link) => (
          <div
            key={link.id}
            className={`p-5 rounded-3xl border transition-all ${
              link.status === 'critical'
                ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-900/20'
                : link.status === 'congested'
                ? 'bg-amber-950/20 border-amber-500/40'
                : 'bg-slate-900/80 border-slate-800'
            } shadow-xl`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-bold text-white">{link.name}</h4>
                <p className="text-[10px] font-mono text-slate-400 truncate max-w-[240px] mt-0.5">{link.endpoints}</p>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  link.status === 'critical'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                    : link.status === 'congested'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}
              >
                {link.status.toUpperCase()}
              </span>
            </div>

            {/* Throughput Gauges */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Throughput</span>
                <span className="font-mono text-white font-bold">
                  {(link.currentMbps / 1000).toFixed(2)} Gbps / {link.capacityGbps} Gbps
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    link.status === 'critical'
                      ? 'bg-rose-500'
                      : link.status === 'congested'
                      ? 'bg-amber-500'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, link.utilizationPercent)}%` }}
                />
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
              <div className="bg-slate-950/60 p-2 rounded-xl text-center">
                <span className="text-slate-500 block text-[9px]">PACKETS/S</span>
                <span className="text-cyan-300 font-bold">{link.packetsPerSec.toLocaleString()}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl text-center">
                <span className="text-slate-500 block text-[9px]">LATENCY</span>
                <span className="text-emerald-400 font-bold">{link.latencyMs} ms</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl text-center">
                <span className="text-slate-500 block text-[9px]">DROPS</span>
                <span className={`font-bold ${link.droppedPackets > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                  {link.droppedPackets}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
