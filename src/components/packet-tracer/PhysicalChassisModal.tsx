/**
 * Cisco Packet Tracer Device Inspector: Physical Chassis, Config & CLI
 * Features real Haramaya University physical building blocks, chassis port LEDs,
 * power toggle, interface configuration, and interactive state mutation.
 */

import React, { useState } from 'react';
import { NetworkDevice, DeviceInterface } from '../../types/network';
import { HARAMAYA_BUILDINGS, HARAMAYA_ENTERPRISE_VLANS } from '../../data/haramayaNetworkData';
import { 
  Cpu, 
  Power, 
  Settings2, 
  Terminal, 
  Building2, 
  Layers, 
  X, 
  Check, 
  AlertCircle, 
  Activity,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { CiscoCliModal } from './CiscoCliModal';

interface PhysicalChassisModalProps {
  device: NetworkDevice;
  onUpdateDevice: (updated: NetworkDevice) => void;
  onClose: () => void;
  onSendPingPacket?: (sourceId: string, targetIp: string) => void;
}

export const PhysicalChassisModal: React.FC<PhysicalChassisModalProps> = ({
  device,
  onUpdateDevice,
  onClose,
  onSendPingPacket
}) => {
  const [activeTab, setActiveTab] = useState<'physical' | 'config' | 'cli'>('physical');
  const [selectedInterfaceIndex, setSelectedInterfaceIndex] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Editable Config State
  const [hostname, setHostname] = useState<string>(device.hostname);
  const [power, setPower] = useState<boolean>(device.power);
  const [gateway, setGateway] = useState<string>(device.gateway || '');
  const [dnsServer, setDnsServer] = useState<string>(device.dnsServer || '');

  // Current interface edit
  const currentIntf = device.interfaces[selectedInterfaceIndex] || device.interfaces[0];
  const [intfIp, setIntfIp] = useState<string>(currentIntf?.ip || '');
  const [intfMask, setIntfMask] = useState<string>(currentIntf?.subnetMask || '255.255.255.0');
  const [intfAdminStatus, setIntfAdminStatus] = useState<'up' | 'down'>(currentIntf?.adminStatus || 'up');
  const [intfVlan, setIntfVlan] = useState<number>(currentIntf?.vlan || 10);
  const [intfMode, setIntfMode] = useState<'access' | 'trunk'>(currentIntf?.mode || 'access');

  // Match real building from dataset
  const buildingInfo = HARAMAYA_BUILDINGS.find((b) => b.name === device.building) || 
                       HARAMAYA_BUILDINGS.find((b) => b.campus === device.campus) || 
                       HARAMAYA_BUILDINGS[0];

  // Save Config changes directly to network engine
  const handleSaveInterfaceConfig = () => {
    const updatedInterfaces = [...device.interfaces];
    if (updatedInterfaces[selectedInterfaceIndex]) {
      updatedInterfaces[selectedInterfaceIndex] = {
        ...updatedInterfaces[selectedInterfaceIndex],
        ip: intfIp || undefined,
        subnetMask: intfMask || undefined,
        adminStatus: intfAdminStatus,
        status: intfAdminStatus === 'up' && power ? 'up' : 'down',
        vlan: intfVlan,
        mode: intfMode
      };
    }

    const updatedDev: NetworkDevice = {
      ...device,
      hostname,
      power,
      gateway: gateway || undefined,
      dnsServer: dnsServer || undefined,
      interfaces: updatedInterfaces,
      managementIp: updatedInterfaces[0]?.ip || device.managementIp
    };

    onUpdateDevice(updatedDev);
  };

  const handleTogglePower = () => {
    const nextPower = !power;
    setPower(nextPower);
    const updatedInterfaces = device.interfaces.map((i) => ({
      ...i,
      status: nextPower && i.adminStatus === 'up' ? ('up' as const) : ('down' as const)
    }));
    onUpdateDevice({
      ...device,
      power: nextPower,
      interfaces: updatedInterfaces
    });
  };

  return (
    <div className={`fixed z-50 inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center ${isFullScreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-200 transition-all ${
        isFullScreen ? 'w-full h-full rounded-none border-none' : 'rounded-3xl w-full max-w-5xl h-[760px]'
      }`}>
        {/* Modal Top Bar */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{device.name} ({device.model})</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  power ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {power ? 'ONLINE &bull; POWER ON' : 'OFFLINE &bull; POWER OFF'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {device.campus.toUpperCase()} CAMPUS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Physical Location: {device.building || buildingInfo.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Power Switch Button */}
            <button
              onClick={handleTogglePower}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                power
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{power ? 'AC Power: ON' : 'AC Power: OFF'}</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
              title={isFullScreen ? 'Restore' : 'Maximize'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-6 py-2 flex items-center gap-2 select-none">
          {[
            { id: 'physical', label: 'Physical Chassis & Building Block', icon: Building2 },
            { id: 'config', label: 'Device Configuration', icon: Settings2 },
            { id: 'cli', label: 'Cisco IOS CLI Terminal', icon: Terminal }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 bg-slate-950 p-6 overflow-y-auto">
          {/* ── TAB 1: PHYSICAL CHASSIS & REAL BUILDING ── */}
          {activeTab === 'physical' && (
            <div className="space-y-6">
              {/* Chassis Panel Graphic */}
              <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white tracking-widest uppercase">
                      CISCO SYSTEMS &bull; {device.model}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">19-Inch 1U Rack Mount</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${power ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`} />
                    <span className="text-xs font-mono text-slate-400">SYS LED</span>
                  </div>
                </div>

                {/* Ports Bank (Front Panel) */}
                <div className="bg-black/90 p-5 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-mono block mb-3 uppercase tracking-wider">
                    RJ-45 GigabitEthernet 10/100/1000 Ports Bank
                  </span>

                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                    {device.interfaces.map((intf, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedInterfaceIndex(idx);
                          setIntfIp(intf.ip || '');
                          setIntfMask(intf.subnetMask || '255.255.255.0');
                          setIntfAdminStatus(intf.adminStatus);
                          setIntfVlan(intf.vlan || 10);
                          setIntfMode(intf.mode || 'access');
                          setActiveTab('config');
                        }}
                        className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          selectedInterfaceIndex === idx
                            ? 'border-indigo-500 bg-indigo-950/60 ring-2 ring-indigo-500/20'
                            : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              power && intf.status === 'up' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'
                            }`}
                          />
                        </div>
                        <div className="w-5 h-4 bg-slate-900 border border-slate-700 rounded-sm mb-1" />
                        <span className="text-[9px] font-mono text-slate-400 truncate w-full text-center">
                          {intf.name.replace('GigabitEthernet', 'Gi').replace('FastEthernet', 'Fa')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real Haramaya University Physical Building Showcase */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-base">Haramaya University Physical Infrastructure Location</h4>
                    <p className="text-xs text-slate-400">Real verified campus building blocks, research labs, and server rooms</p>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 px-3 py-1 rounded bg-slate-950 border border-slate-800">
                    {buildingInfo.location}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1 rounded-2xl overflow-hidden border border-slate-800 shadow-xl h-48 relative">
                    <img
                      src={buildingInfo.image}
                      alt={buildingInfo.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-xs font-bold text-white">{buildingInfo.blocks}</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <h5 className="text-lg font-bold text-white">{buildingInfo.name}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {buildingInfo.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block mb-0.5">Campus Unit:</span>
                        <span className="text-emerald-400 font-semibold">{device.campus.toUpperCase()} CAMPUS</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block mb-0.5">Rack ID:</span>
                        <span className="text-indigo-400 font-semibold">HU-RACK-0{device.layer === 'core' ? '1' : '3'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: CONFIGURATION ── */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Global Settings */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Global Settings</h4>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Display Hostname</label>
                    <input
                      type="text"
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Default Gateway</label>
                    <input
                      type="text"
                      value={gateway}
                      onChange={(e) => setGateway(e.target.value)}
                      placeholder="e.g. 10.10.10.1"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">DNS Server</label>
                    <input
                      type="text"
                      value={dnsServer}
                      onChange={(e) => setDnsServer(e.target.value)}
                      placeholder="e.g. 10.10.150.4"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-indigo-400 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                {/* Interface Settings */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-white text-sm">Interface Configuration</h4>
                    <select
                      value={selectedInterfaceIndex}
                      onChange={(e) => {
                        const idx = parseInt(e.target.value);
                        setSelectedInterfaceIndex(idx);
                        const intf = device.interfaces[idx];
                        if (intf) {
                          setIntfIp(intf.ip || '');
                          setIntfMask(intf.subnetMask || '255.255.255.0');
                          setIntfAdminStatus(intf.adminStatus);
                          setIntfVlan(intf.vlan || 10);
                          setIntfMode(intf.mode || 'access');
                        }
                      }}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                    >
                      {device.interfaces.map((intf, idx) => (
                        <option key={idx} value={idx}>
                          {intf.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Port Status</span>
                    <button
                      type="button"
                      onClick={() => setIntfAdminStatus(intfAdminStatus === 'up' ? 'down' : 'up')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        intfAdminStatus === 'up'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {intfAdminStatus === 'up' ? 'NO SHUTDOWN (UP)' : 'SHUTDOWN (DOWN)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">IP Address</label>
                      <input
                        type="text"
                        value={intfIp}
                        onChange={(e) => setIntfIp(e.target.value)}
                        placeholder="e.g. 10.10.10.25"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Subnet Mask</label>
                      <input
                        type="text"
                        value={intfMask}
                        onChange={(e) => setIntfMask(e.target.value)}
                        placeholder="255.255.255.0"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Switchport Mode</label>
                      <select
                        value={intfMode}
                        onChange={(e) => setIntfMode(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      >
                        <option value="access">Access Port</option>
                        <option value="trunk">802.1Q Trunk Port</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Assigned VLAN</label>
                      <select
                        value={intfVlan}
                        onChange={(e) => setIntfVlan(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-indigo-400 focus:outline-none focus:border-indigo-500 font-mono"
                      >
                        {HARAMAYA_ENTERPRISE_VLANS.map((v) => (
                          <option key={v.id} value={v.id}>
                            VLAN {v.id} ({v.name})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveInterfaceConfig}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply & Save to Simulator State</span>
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 3: CISCO IOS CLI ── */}
          {activeTab === 'cli' && (
            <div className="h-full">
              <CiscoCliModal
                device={device}
                onClose={() => setActiveTab('physical')}
                onSendPingPacket={onSendPingPacket}
                onDeviceMutate={onUpdateDevice}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
