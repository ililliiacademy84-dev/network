import React, { useState } from 'react';
import { NetworkDevice, NetworkLink, FirewallRule, VpnTunnel, DnsRecord } from '../../types/network';
import { SimulationEngine, SimulationTraceResult } from '../../utils/simulationEngine';
import { AlertTriangle, CheckCircle2, XCircle, Wrench, Search, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface TroubleshootingCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: NetworkDevice[];
  links: NetworkLink[];
  firewallRules: FirewallRule[];
  vpnTunnels: VpnTunnel[];
  dnsRecords: DnsRecord[];
  onAutoFix?: (problemType: string, targetDeviceId: string) => void;
}

export const TroubleshootingCenterModal: React.FC<TroubleshootingCenterModalProps> = ({
  isOpen,
  onClose,
  devices,
  links,
  firewallRules,
  vpnTunnels,
  dnsRecords,
  onAutoFix
}) => {
  const [sourceId, setSourceId] = useState<string>(devices[0]?.id || '');
  const [targetId, setTargetId] = useState<string>(devices[devices.length - 1]?.id || '');
  const [protocol, setProtocol] = useState<'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'SMTP'>('ICMP');
  const [traceResult, setTraceResult] = useState<SimulationTraceResult | null>(null);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRunDiagnostic = () => {
    setIsDiagnosticRunning(true);
    setTimeout(() => {
      const res = SimulationEngine.simulatePacketTrace(
        sourceId,
        targetId,
        protocol as any,
        devices,
        links,
        firewallRules,
        vpnTunnels,
        dnsRecords
      );
      setTraceResult(res);
      setIsDiagnosticRunning(false);
    }, 600);
  };

  const sourceDev = devices.find(d => d.id === sourceId);
  const targetDev = devices.find(d => d.id === targetId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0c0c] border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00ff87]/20 border border-[#00ff87]/40 flex items-center justify-center text-[#00ff87]">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-2">
                <span>HU-SSAN GUIDED TROUBLESHOOTING CENTER</span>
                <span className="px-2 py-0.5 rounded-full bg-[#00ff87]/20 text-[#00ff87] text-[10px] font-mono font-bold">
                  DETERMINISTIC DIAGNOSTICS
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Real-time root cause analysis, evidence collection & auto-remediation engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Diagnostic Input Panel */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-mono text-slate-400 font-bold mb-1.5 uppercase">Source Node</label>
              <select
                value={sourceId}
                onChange={e => setSourceId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold focus:border-[#00ff87] outline-none"
              >
                {devices.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.campus.toUpperCase()} - {d.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 font-bold mb-1.5 uppercase">Target Node</label>
              <select
                value={targetId}
                onChange={e => setTargetId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold focus:border-[#00ff87] outline-none"
              >
                {devices.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.campus.toUpperCase()} - {d.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 font-bold mb-1.5 uppercase">Traffic Protocol</label>
              <select
                value={protocol}
                onChange={e => setProtocol(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold focus:border-[#00ff87] outline-none"
              >
                <option value="ICMP">ICMP Echo (Ping)</option>
                <option value="HTTP">HTTP (Port 80)</option>
                <option value="HTTPS">HTTPS (Port 443)</option>
                <option value="DNS">DNS Query (Port 53)</option>
                <option value="SMTP">SMTP Email (Port 25)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRunDiagnostic}
            disabled={isDiagnosticRunning}
            className="w-full py-3.5 rounded-2xl bg-[#00ff87] hover:bg-[#00e575] text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-[#00ff87]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isDiagnosticRunning ? (
              <span className="animate-pulse">ANALYZING NETWORK PIPELINE & HOP-BY-HOP TRACE...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>EXECUTE DEEP NETWORK DIAGNOSTIC</span>
              </>
            )}
          </button>

          {/* Results Panel */}
          {traceResult && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Verdict Header */}
              <div
                className={`p-5 rounded-2xl border flex items-center justify-between ${
                  traceResult.status === 'SUCCESS'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {traceResult.status === 'SUCCESS' ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-extrabold text-sm uppercase tracking-wide">
                      VERDICT: {traceResult.status === 'SUCCESS' ? 'END-TO-END CONNECTIVITY VERIFIED' : 'TRAFFIC BLOCKED / DROPPED'}
                    </h4>
                    <p className="text-xs font-mono mt-0.5 opacity-90">
                      {traceResult.status === 'SUCCESS'
                        ? `Path verified across ${traceResult.hops.length} hops in ${traceResult.totalLatencyMs}ms.`
                        : traceResult.dropReason}
                    </p>
                  </div>
                </div>

                {traceResult.status === 'DROPPED' && onAutoFix && (
                  <button
                    onClick={() => onAutoFix('connectivity_repair', targetId)}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold shadow-lg cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>AUTO-FIX CONFIGURATION</span>
                  </button>
                )}
              </div>

              {/* Hop Breakdown */}
              <div className="space-y-2">
                <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Hop-by-Hop Execution Trace ({traceResult.hops.length} Nodes Visited)
                </h5>

                <div className="space-y-2">
                  {traceResult.hops.map((hop, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px]">
                          0{index + 1}
                        </span>
                        <div>
                          <span className="font-bold text-white text-sm">{hop.deviceName}</span>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>Layer: {hop.layer}</span>
                            {hop.inPort && <span>In: {hop.inPort}</span>}
                            {hop.outPort && <span>Out: {hop.outPort}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                            hop.action === 'DROPPED'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : hop.action === 'PERMITTED' || hop.action === 'ROUTED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          {hop.action}
                        </span>
                        {hop.reason && <p className="text-[10px] text-slate-400 mt-1 max-w-xs">{hop.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
