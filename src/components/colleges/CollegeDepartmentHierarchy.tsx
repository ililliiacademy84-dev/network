/**
 * Haramaya University Academic & Network Hierarchy Explorer
 * Real Cisco Packet Tracer Network Design for all 4 Campuses, 11 Colleges, and 60 Departments
 */

import React, { useState } from 'react';
import { 
  HARAMAYA_CAMPUS_COLLEGE_TREE, 
  ALL_HARAMAYA_DEPARTMENTS, 
  ALL_HARAMAYA_COLLEGES 
} from '../../data/haramayaCollegesData';
import { HaramayaDepartmentInfo, HaramayaCollegeInfo, CampusId, NetworkDevice } from '../../types/network';
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Terminal, 
  Send, 
  Monitor, 
  Network, 
  Layers, 
  Building2, 
  GraduationCap, 
  FlaskConical, 
  ShieldCheck, 
  Activity, 
  Check, 
  Copy, 
  ExternalLink,
  Sprout,
  TrendingUp,
  Binary,
  Scale,
  Globe2,
  Cpu,
  HeartPulse,
  Stethoscope,
  Filter
} from 'lucide-react';

interface CollegeDepartmentHierarchyProps {
  onSelectDepartmentWorkstation: (workstationId: string) => void;
  onOpenSwitchCli: (switchId: string) => void;
  onSendPingFromDepartment: (srcWorkstationId: string, dstWorkstationId: string) => void;
  onLocateOnCanvas: (campusId: CampusId, deviceId: string) => void;
  devices: NetworkDevice[];
}

export const CollegeDepartmentHierarchy: React.FC<CollegeDepartmentHierarchyProps> = ({
  onSelectDepartmentWorkstation,
  onOpenSwitchCli,
  onSendPingFromDepartment,
  onLocateOnCanvas,
  devices
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('all');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'camp-main': true,
    'camp-hit': true,
    'camp-cvm': true,
    'camp-harar': true,
    'col-caes': true,
    'col-cbe': false,
    'col-cci': true,
    'col-cebs': false,
    'col-law': false,
    'col-cncs': false,
    'col-cssh': false,
    'col-sport': false,
    'col-hit-eng': true,
    'col-cvm-vet': true,
    'col-chms-health': true
  });

  const [activeDepartment, setActiveDepartment] = useState<HaramayaDepartmentInfo>(ALL_HARAMAYA_DEPARTMENTS[0]);
  const [targetPingDeptId, setTargetPingDeptId] = useState<string>(
    ALL_HARAMAYA_DEPARTMENTS.find((d) => d.campusId === 'harar')?.id || ALL_HARAMAYA_DEPARTMENTS[10].id
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const getCollegeIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sprout': return <Sprout className="w-4 h-4 text-emerald-400" />;
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-cyan-400" />;
      case 'Binary': return <Binary className="w-4 h-4 text-indigo-400" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-amber-400" />;
      case 'Scale': return <Scale className="w-4 h-4 text-purple-400" />;
      case 'FlaskConical': return <FlaskConical className="w-4 h-4 text-rose-400" />;
      case 'Globe2': return <Globe2 className="w-4 h-4 text-teal-400" />;
      case 'Activity': return <Activity className="w-4 h-4 text-orange-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-blue-400" />;
      case 'HeartPulse': return <HeartPulse className="w-4 h-4 text-emerald-400" />;
      case 'Stethoscope': return <Stethoscope className="w-4 h-4 text-rose-400" />;
      default: return <Building2 className="w-4 h-4 text-indigo-400" />;
    }
  };

  const targetDept = ALL_HARAMAYA_DEPARTMENTS.find((d) => d.id === targetPingDeptId) || ALL_HARAMAYA_DEPARTMENTS[0];

  const filteredCampuses = HARAMAYA_CAMPUS_COLLEGE_TREE.filter((camp) => {
    if (selectedCampus !== 'all' && camp.id !== selectedCampus) return false;
    return true;
  }).map((camp) => {
    const filteredColleges = camp.colleges.filter((col) => {
      if (selectedCollegeId !== 'all' && col.id !== selectedCollegeId) return false;
      return true;
    }).map((col) => {
      const filteredDepts = col.departments.filter((dept) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          dept.name.toLowerCase().includes(q) ||
          dept.code.toLowerCase().includes(q) ||
          dept.workstationIp.includes(q) ||
          dept.subnet.includes(q) ||
          String(dept.vlan).includes(q) ||
          dept.description.toLowerCase().includes(q) ||
          col.name.toLowerCase().includes(q)
        );
      });
      return { ...col, departments: filteredDepts };
    }).filter((col) => col.departments.length > 0);

    return { ...camp, colleges: filteredColleges };
  }).filter((camp) => camp.colleges.length > 0);

  const totalFilteredDepts = filteredCampuses.reduce(
    (acc, camp) => acc + camp.colleges.reduce((cAcc, col) => cAcc + col.departments.length, 0),
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono text-xs font-semibold">
                HARAMAYA UNIVERSITY &bull; ሀረማያ ዩኒቨርሲቲ
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs">
                4 Campuses &bull; 11 Colleges &bull; 60 Departments
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Cisco Packet Tracer Academic & Network Directory
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Complete hierarchical network infrastructure design for all verified colleges, schools, institutes, and academic departments.
              Each department is provisioned with a dedicated access switch port, VLAN segmentation, workstation IP schema, and inter-campus routing.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="block text-2xl font-black text-indigo-400">4</span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Campuses</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="block text-2xl font-black text-cyan-400">11</span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Colleges / Inst.</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="block text-2xl font-black text-emerald-400">60</span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Departments</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="block text-2xl font-black text-amber-400">15</span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active VLANs</span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1.5 rounded-xl border border-slate-800">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-medium">Campus:</span>
              <select
                value={selectedCampus}
                onChange={(e) => {
                  setSelectedCampus(e.target.value);
                  setSelectedCollegeId('all');
                }}
                className="bg-transparent text-white font-semibold outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All 4 Campuses</option>
                <option value="main" className="bg-slate-900">Main Campus (Bati)</option>
                <option value="hit" className="bg-slate-900">HiT Tech Campus</option>
                <option value="cvm" className="bg-slate-900">CVM Veterinary</option>
                <option value="harar" className="bg-slate-900">Harar Health Campus</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-medium">College:</span>
              <select
                value={selectedCollegeId}
                onChange={(e) => setSelectedCollegeId(e.target.value)}
                className="bg-transparent text-white font-semibold outline-none cursor-pointer max-w-[200px] truncate"
              >
                <option value="all" className="bg-slate-900">All Colleges (11)</option>
                {ALL_HARAMAYA_COLLEGES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900">
                    {c.shortName} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search department, school, VLAN, IP address, research..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* ── TWO-COLUMN WORKSPACE: LEFT HIERARCHY TREE, RIGHT TELEMETRY CARD ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: TREE BROWSER (5 COLS) */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4 max-h-[820px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Academic Hierarchy</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {totalFilteredDepts} of 60 Departments
            </span>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {filteredCampuses.map((camp) => {
              const campKey = `camp-${camp.id}`;
              const isCampOpen = !!expandedNodes[campKey];

              return (
                <div key={camp.id} className="border border-slate-800/80 rounded-2xl bg-slate-950/60 overflow-hidden">
                  {/* Campus Header */}
                  <div
                    onClick={() => toggleNode(campKey)}
                    className="flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-900 cursor-pointer select-none transition-colors border-b border-slate-800/60"
                  >
                    <div className="flex items-center gap-2 font-bold text-slate-200">
                      {isCampOpen ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      <span className="text-white">{camp.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                      {camp.subnet}
                    </span>
                  </div>

                  {/* Colleges List */}
                  {isCampOpen && (
                    <div className="p-2 space-y-2">
                      {camp.colleges.map((col) => {
                        const colKey = col.id;
                        const isColOpen = !!expandedNodes[colKey];

                        return (
                          <div key={col.id} className="border border-slate-800/60 rounded-xl bg-slate-900/40 overflow-hidden">
                            {/* College Header */}
                            <div
                              onClick={() => toggleNode(colKey)}
                              className="flex items-center justify-between p-2.5 hover:bg-slate-800/50 cursor-pointer select-none transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {isColOpen ? <ChevronDown className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                                <div className="p-1 rounded bg-slate-800 border border-slate-700">
                                  {getCollegeIcon(col.iconName)}
                                </div>
                                <span className="font-semibold text-slate-200 text-xs">
                                  {col.name} <span className="text-cyan-400 text-[11px]">({col.shortName})</span>
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {col.departments.length} Depts
                              </span>
                            </div>

                            {/* Departments List */}
                            {isColOpen && (
                              <div className="pl-6 pr-2 pb-2 pt-1 space-y-1 border-t border-slate-800/50">
                                {col.departments.map((dept) => {
                                  const isSelected = activeDepartment.id === dept.id;

                                  return (
                                    <div
                                      key={dept.id}
                                      onClick={() => setActiveDepartment(dept)}
                                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                                        isSelected
                                          ? 'bg-indigo-600 text-white font-semibold shadow-md'
                                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} />
                                        <span className="truncate">{dept.name}</span>
                                      </div>

                                      <div className="flex items-center gap-1.5 font-mono text-[10px] shrink-0 ml-2">
                                        <span className={`px-1.5 py-0.5 rounded ${isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'}`}>
                                          VLAN {dept.vlan}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL TELEMETRY & SIMULATION CARD (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Department Spec Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            {/* Header with Title and Badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-mono font-bold">
                    CODE: {activeDepartment.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                    CAMPUS: {activeDepartment.campusId.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {activeDepartment.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {ALL_HARAMAYA_COLLEGES.find((c) => c.id === activeDepartment.collegeId)?.name}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onLocateOnCanvas(activeDepartment.campusId, activeDepartment.switchId)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                  title="Locate switch on Cisco Packet Tracer Canvas"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Locate on Canvas</span>
                </button>
                <button
                  onClick={() => onOpenSwitchCli(activeDepartment.switchId)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Open Cisco IOS CLI terminal for this department's switch"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Cisco CLI</span>
                </button>
              </div>
            </div>

            {/* Network Specification Grid */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cisco Packet Tracer Network Configuration</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Department Workstation</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{activeDepartment.workstationName}</span>
                    <button
                      onClick={() => onSelectDepartmentWorkstation(activeDepartment.workstationId)}
                      className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
                    >
                      <Monitor className="w-3 h-3" />
                      <span>Desktop</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold block">{activeDepartment.workstationIp}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Subnet & Gateway</span>
                  <span className="font-bold text-slate-300 block">{activeDepartment.subnet}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-cyan-400">GW: {activeDepartment.gateway}</span>
                    <button
                      onClick={() => copyText(activeDepartment.gateway, 'gw-active')}
                      className="text-slate-500 hover:text-white cursor-pointer"
                      title="Copy Gateway"
                    >
                      {copiedKey === 'gw-active' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Switch & Port</span>
                  <span className="font-bold text-amber-400 block">{activeDepartment.switchId.toUpperCase()}</span>
                  <span className="text-[11px] text-slate-400">Port {activeDepartment.switchPort} (Access)</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">VLAN Segmentation</span>
                  <span className="font-bold text-indigo-400 block">VLAN {activeDepartment.vlan}</span>
                  <span className="text-[10px] text-slate-400 font-sans">802.1Q IEEE Encapsulation</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Workstation MAC</span>
                  <span className="font-bold text-slate-300 block">{activeDepartment.workstationMac}</span>
                  <span className="text-[10px] text-slate-400">FastEthernet0 (100M/Full)</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">DNS & Firewall Zone</span>
                  <span className="font-bold text-indigo-300 block">10.10.150.4 (HU-DNS)</span>
                  <span className="text-[10px] text-emerald-400">Zone: INSIDE (Security 100)</span>
                </div>
              </div>
            </div>

            {/* Department Academic & Research Profile */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Academic Degrees & Research Initiatives</span>
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeDepartment.description}
              </p>

              {activeDepartment.labFacility && (
                <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs">
                  <span className="font-bold text-indigo-300 block mb-1">Assigned Laboratory Facility:</span>
                  <span className="text-slate-300">{activeDepartment.labFacility}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white block">Programs Offered:</span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {activeDepartment.programsOffered.map((prog, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{prog}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white block">Flagship Research Foci:</span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {activeDepartment.researchAreas.map((res, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ── LIVE INTER-DEPARTMENT PING TEST TOOL ── */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inter-Department Simulation Ping Tester</span>
              </h4>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex-1 space-y-1">
                  <span className="text-[11px] text-slate-400">Ping Destination Department:</span>
                  <select
                    value={targetPingDeptId}
                    onChange={(e) => setTargetPingDeptId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono cursor-pointer"
                  >
                    {ALL_HARAMAYA_DEPARTMENTS.filter((d) => d.id !== activeDepartment.id).map((d) => (
                      <option key={d.id} value={d.id} className="bg-slate-900">
                        [{d.campusId.toUpperCase()}] {d.name} ({d.workstationIp})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    onSendPingFromDepartment(activeDepartment.workstationId, targetDept.workstationId);
                  }}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer self-end sm:self-auto"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Packet ({activeDepartment.campusId !== targetDept.campusId ? 'IPSec VPN' : 'OSPF/VLAN'})</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <span>
                  Source: <strong className="text-white">{activeDepartment.workstationName}</strong> ({activeDepartment.workstationIp})
                </span>
                <span>&rarr;</span>
                <span>
                  Target: <strong className="text-white">{targetDept.workstationName}</strong> ({targetDept.workstationIp})
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  activeDepartment.campusId !== targetDept.campusId ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                }`}>
                  {activeDepartment.campusId !== targetDept.campusId ? 'Site-to-Site VPN Encrypted' : 'Intra-Campus 10Gbps Backplane'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
