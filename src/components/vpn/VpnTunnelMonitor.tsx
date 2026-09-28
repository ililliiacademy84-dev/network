/**
 * Cisco ASA 5506-X Site-to-Site IPSec VPN Monitor
 * Directly replicates Figures 9.7 & 9.8 from the thesis:
 * Real-time crypto stats, SA lifetime, Phase 1/2 diagnostics, and encrypt/decrypt counters.
 */

import React, { useState } from 'react';
import { ShieldCheck, Lock, Activity, Send, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VpnTunnelMonitorProps {
  onTriggerVpnPacket: () => void;
}

export const VpnTunnelMonitor: React.FC<VpnTunnelMonitorProps> = ({ onTriggerVpnPacket }) => {
  const [encryptCount, setEncryptCount] = useState<number>(48);
  const [decryptCount, setDecryptCount] = useState<number>(48);
  const [activeTunnel, setActiveTunnel] = useState<boolean>(true);
  const [saLifetime, setSaLifetime] = useState<number>(3560);

  const handleTestTunnel = () => {
    setEncryptCount((c) => c + 4);
    setDecryptCount((c) => c + 4);
    onTriggerVpnPacket();
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Top VPN Hero Status */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-cyan-950/40 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-600/20">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Cisco ASA 5506-X Site-to-Site IPSec VPN Tunnel
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Tunnel Established (UP)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Encrypted IPsec Gateway: <strong>Campus I (10.10.10.2)</strong> &harr; <strong>Campus II (10.10.10.6)</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleTestTunnel}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Send Encrypted Packet Stream</span>
        </button>
      </div>

      {/* Counters and Crypto Properties */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-center">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Encapsulated & Encrypted</span>
          <span className="text-3xl font-mono font-bold text-emerald-400 block">{encryptCount} pkts</span>
          <span className="text-[11px] text-slate-500 mt-1 block">#pkts encrypt: {encryptCount}</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-center">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Decapsulated & Decrypted</span>
          <span className="text-3xl font-mono font-bold text-cyan-400 block">{decryptCount} pkts</span>
          <span className="text-[11px] text-slate-500 mt-1 block">#pkts decrypt: {decryptCount}</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-center">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Cipher Suite</span>
          <span className="text-lg font-mono font-bold text-indigo-300 block">ESP-AES-256</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Hash: SHA-HMAC</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-center">
          <span className="text-xs font-semibold text-slate-400 block mb-1">SA Lifetime Remaining</span>
          <span className="text-2xl font-mono font-bold text-white block">{saLifetime}s</span>
          <span className="text-[11px] text-slate-500 mt-1 block">4,525,504 KBytes</span>
        </div>
      </div>

      {/* Cisco ASA CLI show crypto ipsec sa Output (Figure 9.7 & 9.8) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-400" />
            <h4 className="font-semibold text-white text-sm">
              Live Cisco ASA Command Output: <code>show crypto ipsec sa</code>
            </h4>
          </div>
          <span className="text-xs font-mono text-slate-400">Figures 9.7 & 9.8 Validation</span>
        </div>

        <div className="bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto space-y-1">
          <p className="text-emerald-400">C1-ASA1(config)# show crypto ipsec sa</p>
          <p>interface: outside1</p>
          <p className="pl-4">
            Crypto map tag: <span className="text-cyan-400">VPN_MAP_OUTSIDE1</span>, seq num: 10, local addr: <span className="text-indigo-300">10.10.10.2</span>
          </p>
          <p className="pl-6 text-slate-400">
            permit ip 192.168.0.0 255.255.0.0 192.169.0.0 255.255.0.0
          </p>
          <p className="pl-6">
            local ident (addr/mask/prot/port): (192.168.0.0/255.255.0.0/0/0)
          </p>
          <p className="pl-6">
            remote ident (addr/mask/prot/port): (192.169.0.0/255.255.0.0/0/0)
          </p>
          <p className="pl-6 text-white font-semibold">
            current_peer: 10.10.10.6
          </p>
          <p className="pl-6 text-emerald-400">
            #pkts encaps: {encryptCount}, #pkts encrypt: {encryptCount}, #pkts digest: 0
          </p>
          <p className="pl-6 text-cyan-400">
            #pkts decaps: {decryptCount}, #pkts decrypt: {decryptCount}, #pkts verify: 0
          </p>
          <p className="pl-6 text-slate-500">
            #pkts compressed: 0, #pkts decompressed: 0, #send errors: 0, #recv errors: 0
          </p>
          <p className="pl-4 pt-2 text-indigo-300">inbound esp sas:</p>
          <p className="pl-6">
            spi: <span className="text-amber-400">0x21D3513F (567497023)</span>
          </p>
          <p className="pl-6">
            transform: esp-aes 256 esp-sha-hmac no compression in use settings ={'{L2L, Tunnel}'}
          </p>
          <p className="pl-6">sa timing: remaining key lifetime (k/sec): (4525504/{saLifetime})</p>
          <p className="pl-4 pt-2 text-indigo-300">outbound esp sas:</p>
          <p className="pl-6">
            spi: <span className="text-amber-400">0xC79BFBA0 (3348888480)</span>
          </p>
          <p className="pl-6">
            transform: esp-aes 256 esp-sha-hmac no compression in use settings ={'{L2L, Tunnel}'}
          </p>
        </div>
      </div>
    </div>
  );
};
