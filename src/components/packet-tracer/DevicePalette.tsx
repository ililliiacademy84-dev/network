/**
 * Cisco Packet Tracer-style Device Palette
 * Provides categorized hardware library to drag or click-to-add into the topology.
 */

import React, { useState } from 'react';
import { DeviceType, CampusId, NetworkLayer } from '../../types/network';
import { 
  Server, 
  Monitor, 
  Laptop, 
  Smartphone, 
  Printer, 
  PhoneCall, 
  Radio, 
  ShieldAlert, 
  Wifi, 
  Plus, 
  Cpu, 
  Flame, 
  Lightbulb, 
  Fan, 
  DoorClosed,
  Layers,
  ChevronRight
} from 'lucide-react';

interface DevicePaletteProps {
  onAddDevice: (template: {
    type: DeviceType;
    name: string;
    model: string;
    layer: NetworkLayer;
    campus: CampusId;
  }) => void;
  activeCampus: CampusId;
}

export const DevicePalette: React.FC<DevicePaletteProps> = ({ onAddDevice, activeCampus }) => {
  const [activeCategory, setActiveCategory] = useState<'routers' | 'switches' | 'security' | 'servers' | 'end' | 'iot' | 'wireless'>('routers');

  const categories = [
    { id: 'routers', label: 'Routers' },
    { id: 'switches', label: 'Switches' },
    { id: 'security', label: 'Security / ASA' },
    { id: 'servers', label: 'Servers' },
    { id: 'end', label: 'End Devices' },
    { id: 'wireless', label: 'Wireless' },
    { id: 'iot', label: 'Smart IoT' }
  ];

  const items = {
    routers: [
      { name: 'Cisco ISR4331', model: 'ISR4331', type: 'router' as DeviceType, layer: 'outside' as NetworkLayer, desc: 'Enterprise Modular Gateway' },
      { name: 'Cisco 2811 VoIP', model: 'Cisco 2811', type: 'router' as DeviceType, layer: 'voip' as NetworkLayer, desc: 'CME Telephony Gateway' }
    ],
    switches: [
      { name: 'Catalyst 3650 L3', model: 'WS-C3650-24PS', type: 'switch_l3' as DeviceType, layer: 'core' as NetworkLayer, desc: 'Multi-Layer Core/Dist Switch' },
      { name: 'Catalyst 2960 L2', model: 'WS-C2960-24TT', type: 'switch_l2' as DeviceType, layer: 'access' as NetworkLayer, desc: '24-Port FastEthernet Access Switch' }
    ],
    security: [
      { name: 'Cisco ASA 5506-X', model: 'ASA 5506-X', type: 'firewall' as DeviceType, layer: 'outside' as NetworkLayer, desc: 'Next-Gen Perimeter Firewall' }
    ],
    servers: [
      { name: 'DNS Server', model: 'Server-PT', type: 'server' as DeviceType, layer: 'dmz' as NetworkLayer, desc: 'Authoritative Domain Server' },
      { name: 'Web Server', model: 'Server-PT', type: 'server' as DeviceType, layer: 'dmz' as NetworkLayer, desc: 'HTTP/HTTPS Portal Server' },
      { name: 'DHCP Server', model: 'Server-PT', type: 'server' as DeviceType, layer: 'dmz' as NetworkLayer, desc: 'VLAN Dynamic Addressing' },
      { name: 'Mail Server', model: 'Server-PT', type: 'server' as DeviceType, layer: 'dmz' as NetworkLayer, desc: 'SMTP/POP3 Electronic Mail' },
      { name: 'FTP Server', model: 'Server-PT', type: 'server' as DeviceType, layer: 'dmz' as NetworkLayer, desc: 'File Repository & Backup' },
      { name: 'Syslog Server', model: 'Server-PT', type: 'server' as DeviceType, layer: 'dmz' as NetworkLayer, desc: 'RFC 5424 Event Logger' }
    ],
    end: [
      { name: 'Academic PC', model: 'PC-PT', type: 'pc' as DeviceType, layer: 'end' as NetworkLayer, desc: 'Faculty/Student Desktop' },
      { name: 'Admin Laptop', model: 'Laptop-PT', type: 'laptop' as DeviceType, layer: 'end' as NetworkLayer, desc: 'Staff Portable Workstation' },
      { name: 'Cisco 7960 IP Phone', model: 'Cisco 7960', type: 'ip_phone' as DeviceType, layer: 'voip' as NetworkLayer, desc: 'VoIP SCCP Phone' },
      { name: 'Network Printer', model: 'Printer-PT', type: 'printer' as DeviceType, layer: 'end' as NetworkLayer, desc: 'Shared Department Printer' }
    ],
    wireless: [
      { name: 'Campus Access Point', model: 'AP-PT', type: 'access_point' as DeviceType, layer: 'access' as NetworkLayer, desc: 'Dual-Band 802.11ac Wi-Fi' }
    ],
    iot: [
      { name: 'IoT MCU Controller', model: 'MCU-PT', type: 'iot_sensor' as DeviceType, layer: 'iot' as NetworkLayer, desc: 'Programmable Microcontroller' },
      { name: 'PIR Motion Sensor', model: 'Motion-PT', type: 'iot_sensor' as DeviceType, layer: 'iot' as NetworkLayer, desc: 'Infrared Motion Detector' },
      { name: 'Fire/Smoke Monitor', model: 'Smoke-PT', type: 'iot_sensor' as DeviceType, layer: 'iot' as NetworkLayer, desc: 'Optical Smoke Detector' },
      { name: 'Smart Dimmer Light', model: 'Light-PT', type: 'iot_actuator' as DeviceType, layer: 'iot' as NetworkLayer, desc: 'Automated Room Lighting' },
      { name: 'Smart Cooling Fan', model: 'Fan-PT', type: 'iot_actuator' as DeviceType, layer: 'iot' as NetworkLayer, desc: 'HVAC Smart Fan' },
      { name: 'RFID Smart Door', model: 'Door-PT', type: 'iot_actuator' as DeviceType, layer: 'iot' as NetworkLayer, desc: 'Motorized Access Lock' }
    ]
  };

  const targetCampus: CampusId = activeCampus === 'wan' ? 'main' : activeCampus;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Device Palette (Hardware Library)</h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          Target: {targetCampus.toUpperCase()} CAMPUS
        </span>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Item tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {items[activeCategory].map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              onAddDevice({
                type: item.type,
                name: `${item.name.replace(/\s+/g, '-')}-${Math.floor(Math.random() * 90 + 10)}`,
                model: item.model,
                layer: item.layer,
                campus: targetCampus
              });
            }}
            className="flex flex-col items-center p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1.5 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-white truncate w-full">{item.name}</span>
            <span className="text-[9px] text-slate-500 truncate w-full">{item.model}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
