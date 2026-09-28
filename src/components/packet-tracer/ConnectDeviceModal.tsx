/**
 * Cisco Packet Tracer Cabling & Interface Interconnect Tool
 * Connects physical ports between two devices with cable type validation.
 */

import React, { useState } from 'react';
import { NetworkDevice, NetworkLink } from '../../types/network';
import { Cable, X, Check, AlertCircle, ArrowRight } from 'lucide-react';

interface ConnectDeviceModalProps {
  devices: NetworkDevice[];
  onConnect: (link: NetworkLink) => void;
  onClose: () => void;
}

export const ConnectDeviceModal: React.FC<ConnectDeviceModalProps> = ({ devices, onConnect, onClose }) => {
  const [sourceDevId, setSourceDevId] = useState<string>(devices[0]?.id || '');
  const [targetDevId, setTargetDevId] = useState<string>(devices[1]?.id || '');
  const [sourcePort, setSourcePort] = useState<string>('');
  const [targetPort, setTargetPort] = useState<string>('');
  const [cableType, setCableType] = useState<'copper' | 'crossover' | 'fiber' | 'serial' | 'iot'>('copper');

  const sourceDev = devices.find((d) => d.id === sourceDevId);
  const targetDev = devices.find((d) => d.id === targetDevId);

  // Auto pick first available interface
  const srcPorts = sourceDev?.interfaces.map((i) => i.name) || ['Fa0/1'];
  const dstPorts = targetDev?.interfaces.map((i) => i.name) || ['Fa0/1'];

  const handleCreateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceDevId || !targetDevId || sourceDevId === targetDevId) return;

    const newLink: NetworkLink = {
      id: `link-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fromDeviceId: sourceDevId,
      fromPort: sourcePort || srcPorts[0] || 'Fa0/1',
      toDeviceId: targetDevId,
      toPort: targetPort || dstPorts[0] || 'Fa0/1',
      type: cableType,
      bandwidth: cableType === 'fiber' ? '10 Gbps' : '1 Gbps',
      status: 'up',
      latencyMs: cableType === 'fiber' ? 1 : 3
    };

    onConnect(newLink);
    onClose();
  };

  return (
    <div className="fixed z-50 inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden text-slate-200">
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Cable className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Cabling & Port Interconnect Tool</h3>
              <p className="text-xs text-slate-400">Attach physical media between network interfaces</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateConnection} className="p-6 space-y-5 text-xs">
          {/* Source Device */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Source Device</label>
              <select
                value={sourceDevId}
                onChange={(e) => setSourceDevId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.campus.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Source Port / Interface</label>
              <select
                value={sourcePort}
                onChange={(e) => setSourcePort(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-mono focus:outline-none focus:border-indigo-500"
              >
                {srcPorts.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center text-slate-600">
            <ArrowRight className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>

          {/* Target Device */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Destination Device</label>
              <select
                value={targetDevId}
                onChange={(e) => setTargetDevId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.campus.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Destination Port</label>
              <select
                value={targetPort}
                onChange={(e) => setTargetPort(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-mono focus:outline-none focus:border-indigo-500"
              >
                {dstPorts.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cable type */}
          <div>
            <label className="text-slate-400 font-semibold block mb-2">Cable Transmission Medium</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'copper', label: 'Copper Straight-Through', desc: 'Host to Switch' },
                { id: 'crossover', label: 'Copper Crossover', desc: 'Switch to Switch' },
                { id: 'fiber', label: 'Fiber Optic (10GbE)', desc: 'Backbone Trunk' },
                { id: 'serial', label: 'Serial / WAN Cable', desc: 'ISP / Telco' },
                { id: 'iot', label: 'IoT Custom Cable', desc: 'Sensors / MCU' }
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCableType(c.id as any)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    cableType === c.id
                      ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-semibold block text-xs">{c.label}</span>
                  <span className="text-[10px] text-slate-500">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {sourceDevId === targetDevId && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Source and destination cannot be the same device.</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sourceDevId === targetDevId}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Establish Physical Link</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
