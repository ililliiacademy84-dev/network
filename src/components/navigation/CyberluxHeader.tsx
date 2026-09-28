/**
 * Cyberlux-Inspired Enterprise Navigation Header
 * Follows strict Top Bar Contract with nested dropdown navigation & mobile menu
 */

import React, { useState } from 'react';
import { 
  Network, 
  ChevronDown, 
  Play, 
  GraduationCap, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Building2, 
  Table, 
  FileCode, 
  Calculator, 
  Activity, 
  Globe, 
  Bot, 
  Award, 
  FolderDown, 
  Menu, 
  X,
  Users
} from 'lucide-react';

interface CyberluxHeaderProps {
  activeTab: string;
  onNavigate: (tab: any, campus?: any) => void;
  onOpenAssistant: () => void;
  onOpenLabs: () => void;
  onOpenProjects: () => void;
}

export const CyberluxHeader: React.FC<CyberluxHeaderProps> = ({
  activeTab,
  onNavigate,
  onOpenAssistant,
  onOpenLabs,
  onOpenProjects
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownClick = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSelectNav = (tab: any, campus?: any) => {
    onNavigate(tab, campus);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-slate-800/90 bg-[#060b18]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="w-full px-4 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <div 
          onClick={() => handleSelectNav('landing')} 
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#00ff87] text-slate-950 flex items-center justify-center font-black shadow-lg shadow-[#00ff87]/25 group-hover:scale-105 transition-transform">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
              HARAMAYA <span className="text-[#00ff87]">NOC</span>
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              Smart Network Simulator & Cybersecurity
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links & Nested Dropdowns (Desktop) */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold text-slate-300">
          {/* 1. Home */}
          <button
            onClick={() => handleSelectNav('landing')}
            className={`transition-colors hover:text-[#00ff87] cursor-pointer ${
              activeTab === 'landing' ? 'text-[#00ff87] font-bold' : ''
            }`}
          >
            HOME
          </button>

          {/* 2. Network Simulator Dropdown */}
          <div className="relative group">
            <button
              onClick={() => handleDropdownClick('simulator')}
              className={`flex items-center gap-1.5 transition-colors hover:text-[#00ff87] cursor-pointer ${
                activeTab === 'topology' ? 'text-[#00ff87] font-bold' : ''
              }`}
            >
              <span>NETWORK SIMULATOR</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {openDropdown === 'simulator' && (
              <div 
                className="absolute top-full left-0 mt-3 w-56 bg-[#0b112c] border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => handleSelectNav('topology', 'all')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <Network className="w-4 h-4 text-[#00ff87]" />
                  <span>Full Topology Canvas</span>
                </button>
                <button
                  onClick={() => {
                    onOpenProjects();
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <FolderDown className="w-4 h-4 text-emerald-400" />
                  <span>Save & Load Projects</span>
                </button>
                <button
                  onClick={() => handleSelectNav('configs')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>Cisco IOS Repository</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Campuses Dropdown */}
          <div className="relative group">
            <button
              onClick={() => handleDropdownClick('campuses')}
              className={`flex items-center gap-1.5 transition-colors hover:text-[#00ff87] cursor-pointer ${
                activeTab === 'colleges' || activeTab === 'buildings' ? 'text-[#00ff87] font-bold' : ''
              }`}
            >
              <span>CAMPUSES</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {openDropdown === 'campuses' && (
              <div 
                className="absolute top-full left-0 mt-3 w-64 bg-[#0b112c] border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => handleSelectNav('colleges')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>11 Colleges & 60 Depts</span>
                </button>
                <button
                  onClick={() => handleSelectNav('topology', 'main')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>Main Campus (Bati)</span>
                </button>
                <button
                  onClick={() => handleSelectNav('topology', 'hit')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>HiT Tech Campus</span>
                </button>
                <button
                  onClick={() => handleSelectNav('topology', 'cvm')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>CVM Veterinary Campus</span>
                </button>
                <button
                  onClick={() => handleSelectNav('topology', 'harar')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-rose-400" />
                  <span>Harar Health & HFSUH</span>
                </button>
                <button
                  onClick={() => handleSelectNav('buildings')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer border-t border-slate-800"
                >
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Building Rack Directory</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. Network Labs */}
          <button
            onClick={onOpenLabs}
            className="flex items-center gap-1.5 transition-colors hover:text-[#00ff87] cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>NETWORK LABS</span>
          </button>

          {/* 5. Monitoring & NOC */}
          <div className="relative group">
            <button
              onClick={() => handleDropdownClick('monitoring')}
              className={`flex items-center gap-1.5 transition-colors hover:text-[#00ff87] cursor-pointer ${
                activeTab === 'soc' || activeTab === 'vpn' || activeTab === 'telemetry' || activeTab === 'iot'
                  ? 'text-[#00ff87] font-bold'
                  : ''
              }`}
            >
              <span>MONITORING & NOC</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {openDropdown === 'monitoring' && (
              <div 
                className="absolute top-full left-0 mt-3 w-60 bg-[#0b112c] border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => handleSelectNav('telemetry')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Bandwidth & Traffic NOC</span>
                </button>
                <button
                  onClick={() => handleSelectNav('soc')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>ASA Firewall & SOC</span>
                </button>
                <button
                  onClick={() => handleSelectNav('vpn')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Site-to-Site IPSec VPN</span>
                </button>
                <button
                  onClick={() => handleSelectNav('iot')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-purple-400" />
                  <span>Smart Campus IoT</span>
                </button>
              </div>
            )}
          </div>

          {/* 6. Tools & IPAM */}
          <div className="relative group">
            <button
              onClick={() => handleDropdownClick('tools')}
              className={`flex items-center gap-1.5 transition-colors hover:text-[#00ff87] cursor-pointer ${
                activeTab === 'calculator' || activeTab === 'tables' || activeTab === 'portal'
                  ? 'text-[#00ff87] font-bold'
                  : ''
              }`}
            >
              <span>TOOLS & IPAM</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {openDropdown === 'tools' && (
              <div 
                className="absolute top-full left-0 mt-3 w-56 bg-[#0b112c] border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => handleSelectNav('calculator')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>VLSM Subnet Calculator</span>
                </button>
                <button
                  onClick={() => handleSelectNav('tables')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <Table className="w-4 h-4 text-cyan-400" />
                  <span>IP & VLAN Schemes</span>
                </button>
                <button
                  onClick={() => handleSelectNav('portal')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#00ff87]/15 hover:text-[#00ff87] text-slate-200 flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>HU Academic Portal</span>
                </button>
              </div>
            )}
          </div>

          {/* 7. Admin Portal */}
          <button
            onClick={() => handleSelectNav('admin')}
            className={`flex items-center gap-1.5 transition-colors hover:text-[#00ff87] cursor-pointer ${
              activeTab === 'admin' ? 'text-[#00ff87] font-bold' : ''
            }`}
          >
            <Users className="w-4 h-4 text-[#00ff87]" />
            <span>ADMIN</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAssistant}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700/80 cursor-pointer transition-all"
            title="Open AI Network Audit"
          >
            <Bot className="w-4 h-4 text-[#00e5ff]" />
            <span>AI Audit</span>
          </button>

          <button
            onClick={() => handleSelectNav('topology', 'all')}
            className="px-5 py-2.5 rounded-xl bg-[#00ff87] hover:bg-[#00e575] text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00ff87]/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>LAUNCH SIMULATOR</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#0b112c] border-b border-slate-800 p-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleSelectNav('landing')}
              className="p-2.5 rounded-xl bg-slate-900 text-left font-semibold text-white hover:bg-[#00ff87]/15"
            >
              Home Page
            </button>
            <button
              onClick={() => handleSelectNav('topology', 'all')}
              className="p-2.5 rounded-xl bg-slate-900 text-left font-semibold text-white hover:bg-[#00ff87]/15"
            >
              Topology Simulator
            </button>
            <button
              onClick={() => handleSelectNav('colleges')}
              className="p-2.5 rounded-xl bg-slate-900 text-left font-semibold text-white hover:bg-[#00ff87]/15"
            >
              Colleges & Depts (60)
            </button>
            <button
              onClick={() => {
                onOpenLabs();
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-900 text-left font-semibold text-white hover:bg-[#00ff87]/15"
            >
              12 Network Labs
            </button>
            <button
              onClick={() => handleSelectNav('telemetry')}
              className="p-2.5 rounded-xl bg-slate-900 text-left font-semibold text-white hover:bg-[#00ff87]/15"
            >
              Traffic NOC
            </button>
            <button
              onClick={() => handleSelectNav('soc')}
              className="p-2.5 rounded-xl bg-slate-900 text-left font-semibold text-white hover:bg-[#00ff87]/15"
            >
              ASA Firewall SOC
            </button>
            <button
              onClick={() => handleSelectNav('calculator')}
              className="p-2.5 rounded-xl bg-slate-900 text-left font-semibold text-white hover:bg-[#00ff87]/15"
            >
              VLSM Calculator
            </button>
            <button
              onClick={() => handleSelectNav('admin')}
              className="p-2.5 rounded-xl bg-slate-900 text-left font-semibold text-white hover:bg-[#00ff87]/15"
            >
              Admin & RBAC
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
