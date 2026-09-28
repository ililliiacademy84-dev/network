import React, { useState } from 'react';
import { NetworkDevice, NetworkLink, FirewallRule, VlanInfo } from '../../types/network';
import { Zap, AlertOctagon, CheckCircle2, ShieldAlert, RefreshCw, Award, Play, Wrench } from 'lucide-react';

interface ScenarioEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: NetworkDevice[];
  links: NetworkLink[];
  firewallRules: FirewallRule[];
  vlans: VlanInfo[];
  onMutateLinks: (links: NetworkLink[]) => void;
  onMutateFirewall: (rules: FirewallRule[]) => void;
}

export interface FaultScenario {
  id: string;
  title: string;
  category: 'OSPF' | 'Firewall' | 'VLAN' | 'DHCP' | 'VPN';
  difficulty: 'Medium' | 'Hard';
  description: string;
  symptoms: string[];
  points: number;
  isApplied: boolean;
  isResolved: boolean;
}

export const ScenarioEngineModal: React.FC<ScenarioEngineModalProps> = ({
  isOpen,
  onClose,
  devices,
  links,
  firewallRules,
  vlans,
  onMutateLinks,
  onMutateFirewall
}) => {
  const [scenarios, setScenarios] = useState<FaultScenario[]>([
    {
      id: 'scen-01',
      title: 'Inter-Campus OSPF Area 0 Link Cut',
      category: 'OSPF',
      difficulty: 'Medium',
      description: 'Cuts the core fiber optic link between Main Campus R-BATI-CORE and HiT R-HIT-CORE.',
      symptoms: ['Ping loss between Bati and HiT', 'OSPF neighbor state drops to DOWN', 'Routing table loses 10.20.0.0/16 route'],
      points: 100,
      isApplied: false,
      isResolved: false
    },
    {
      id: 'scen-[#00ff87]',
      title: 'Cisco ASA Stateful Firewall DMZ Block',
      category: 'Firewall',
      difficulty: 'Hard',
      description: 'Injects an aggressive DENY rule dropping all TCP/443 traffic destined for Haramaya Web Server Farm.',
      symptoms: ['HTTPS Web Portal timeout', 'ASA Firewall log increments drop counter', 'Student portal inaccessible'],
      points: 150,
      isApplied: false,
      isResolved: false
    },
    {
      id: 'scen-03',
      title: 'Access Port VLAN Tag Isolation',
      category: 'VLAN',
      difficulty: 'Medium',
      description: 'Re-assigns FastEthernet 0/1 on Switch SW-HIT-ACC-01 to unused VLAN 999.',
      symptoms: ['PC-HIT-01 loses gateway connectivity', 'No inter-VLAN routing possible', 'Broadcast domain isolation'],
      points: 80,
      isApplied: false,
      isResolved: false
    }
  ]);

  if (!isOpen) return null;

  const handleApplyFault = (scenario: FaultScenario) => {
    if (scenario.category === 'OSPF') {
      const updatedLinks = links.map((l, i) => i === 0 ? { ...l, status: 'down' as const } : l);
      onMutateLinks(updatedLinks);
    } else if (scenario.category === 'Firewall') {
      const updatedRules = firewallRules.map((r, i) => i === 0 ? { ...r, action: 'deny' as const } : r);
      onMutateFirewall(updatedRules);
    }

    setScenarios(scenarios.map(s => s.id === scenario.id ? { ...s, isApplied: true, isResolved: false } : s));
  };

  const handleVerifySolution = (scenario: FaultScenario) => {
    // Check if the link or rule was fixed
    let resolved = false;
    if (scenario.category === 'OSPF') {
      resolved = links[0]?.status === 'up';
    } else if (scenario.category === 'Firewall') {
      resolved = firewallRules[0]?.action === 'allow';
    } else {
      resolved = true;
    }

    if (resolved) {
      setScenarios(scenarios.map(s => s.id === scenario.id ? { ...s, isResolved: true } : s));
    } else {
      alert(`Fault "${scenario.title}" is still active in the topology. Troubleshoot using CLI or Firewall Manager and try again.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0c0c] border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-2">
                <span>HU-SSAN INSTRUCTOR FAULT INJECTION & SCENARIO ENGINE</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Inject realistic network outages, security blocks & misconfigurations to test diagnostic skills
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scenarios List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {scenarios.map(scen => (
            <div
              key={scen.id}
              className={`p-5 rounded-2xl border transition-all ${
                scen.isResolved
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : scen.isApplied
                  ? 'bg-rose-950/30 border-rose-500/40'
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-white text-base">{scen.title}</span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                    {scen.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                    +{scen.points} PTS
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!scen.isApplied ? (
                    <button
                      onClick={() => handleApplyFault(scen)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>INJECT FAULT</span>
                    </button>
                  ) : !scen.isResolved ? (
                    <button
                      onClick={() => handleVerifySolution(scen)}
                      className="px-4 py-2 rounded-xl bg-[#00ff87] text-slate-950 text-xs font-black uppercase cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#00ff87]/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>VERIFY FIX</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-extrabold font-mono flex items-center gap-1.5 border border-emerald-500/40">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>RESOLVED (+{scen.points} PTS)</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 font-mono mb-3">{scen.description}</p>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                  Reported Network Symptoms:
                </span>
                <ul className="list-disc list-inside text-xs text-rose-300/90 font-mono space-y-0.5">
                  {scen.symptoms.map((symptom, idx) => (
                    <li key={idx}>{symptom}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
