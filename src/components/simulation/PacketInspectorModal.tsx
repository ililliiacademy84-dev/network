/**
 * Cisco Packet Tracer PDU Packet Inspector Modal
 * Displays In-Layer and Out-Layer details across Layer 2, Layer 3, Layer 4, and Security filters.
 */

import React, { useState } from 'react';
import { SimulationPacket } from '../../types/network';
import { Layers, ShieldCheck, ArrowRight, X, CheckCircle2, Lock, Eye } from 'lucide-react';

interface PacketInspectorModalProps {
  packet: SimulationPacket;
  onClose: () => void;
}

export const PacketInspectorModal: React.FC<PacketInspectorModalProps> = ({ packet, onClose }) => {
  const [activeTab, setActiveTab] = useState<'model' | 'inbound' | 'outbound'>('model');

  const insp = packet.inspection;

  return (
    <div className="fixed z-50 inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">PDU Packet Inspector</h3>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold font-mono"
                  style={{
                    backgroundColor: `${packet.color}25`,
                    color: packet.color,
                    border: `1px solid ${packet.color}40`
                  }}
                >
                  {packet.protocol}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {packet.id}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Current Location: Hop {packet.currentHopIndex} of {packet.path.length} ({packet.path[packet.currentHopIndex] || packet.targetDeviceId})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-6 py-2 flex items-center gap-2 text-xs">
          {[
            { id: 'model', label: 'OSI Model Layers' },
            { id: 'inbound', label: 'Inbound PDU Details' },
            { id: 'outbound', label: 'Security & NAT Decision' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 bg-slate-950 space-y-6 text-xs font-mono max-h-[520px] overflow-y-auto">
          {activeTab === 'model' && (
            <div className="space-y-4">
              {/* Layer 4 */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-indigo-400 font-bold mb-1">
                  <span>Layer 4: Transport Layer</span>
                  <span>{insp.layer4?.protocol || 'ICMP / Control'}</span>
                </div>
                <p className="text-slate-300">
                  {insp.layer4
                    ? `Source Port: ${insp.layer4.sourcePort} -> Destination Port: ${insp.layer4.destPort}`
                    : 'ICMP Echo Request (Type: 8, Code: 0, Checksum: 0x4d2a)'}
                </p>
              </div>

              {/* Layer 3 */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
                  <span>Layer 3: Network Layer (IPv4)</span>
                  <span>TTL: {insp.layer3.ttl}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Source IP:</span>
                    <span className="text-emerald-400 font-semibold">{insp.layer3.sourceIp}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Destination IP:</span>
                    <span className="text-emerald-400 font-semibold">{insp.layer3.destIp}</span>
                  </div>
                </div>
                <p className="text-slate-400 text-[11px] pt-1">
                  Header Length: 20 bytes &bull; DiffServ: Default (0x00) &bull; Protocol ID: {insp.layer3.protocol}
                </p>
              </div>

              {/* Layer 2 */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                  <span>Layer 2: Data Link Layer (Ethernet II)</span>
                  <span>VLAN: {insp.layer2.vlan || 10}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Source MAC:</span>
                    <span>{insp.layer2.sourceMac}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Destination MAC:</span>
                    <span>{insp.layer2.destMac}</span>
                  </div>
                </div>
                <p className="text-slate-400 text-[11px] pt-1">
                  EtherType: {insp.layer2.etherType} &bull; 802.1Q Tagged: Yes
                </p>
              </div>
            </div>
          )}

          {activeTab === 'inbound' && (
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h5 className="font-bold text-white text-sm">Decapsulated PDU Header Bytes</h5>
              <div className="bg-black p-4 rounded-xl text-emerald-400 text-xs overflow-x-auto space-y-1">
                <p>0000  00 50 0f 20 10 01 00 e0  f7 25 10 01 81 00 00 0a</p>
                <p>0010  08 00 45 00 00 3c 1c 46  40 00 40 01 f3 61 0a 0a</p>
                <p>0020  0a 19 0a 0a 96 06 08 00  4d 2a 00 01 00 01 61 62</p>
                <p>0030  63 64 65 66 67 68 69 6a  6b 6c 6d 6e 6f 70 71 72</p>
              </div>
              <p className="text-slate-400 text-xs">
                Payload represents 32 bytes of ASCII alphabet ping data (abcdefghijklmnopqrstuvw).
              </p>
            </div>
          )}

          {activeTab === 'outbound' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block mb-1">ACL Policy Evaluation</span>
                  <span className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {insp.security.aclDecision} (access-list permit)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block mb-1">Stateful Firewall Decision</span>
                  <span className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {insp.security.firewallDecision} (security-level inspect)
                  </span>
                </div>
              </div>

              {insp.security.vpnEncrypted && (
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-indigo-400 shrink-0" />
                  <div>
                    <h5 className="font-bold text-white">IPSec ESP Encryption Active</h5>
                    <p className="text-xs text-slate-300">
                      Packet encrypted with AES-256 and authenticated with SHA-256 HMAC for transit across public WAN.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
