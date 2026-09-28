/**
 * Cyberlux-Inspired Enterprise Navigation Header
 * Follows strict Top Bar Contract with nested dropdown navigation & mobile menu
 */

import React, { useState, useEffect } from 'react';
import huLogo from '../../assets/logo/HU.png';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
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
  Users,
  Mail,
  Film,
  Sun,
  Moon,
  Tv
} from 'lucide-react';

interface CyberluxHeaderProps {
  activeTab: string;
  onNavigate: (tab: any, campus?: any) => void;
  onOpenAssistant: () => void;
  onOpenLabs: () => void;
  onOpenProjects: () => void;
  onOpenMessaging: () => void;
  unreadCount?: number;
}

export const CyberluxHeader: React.FC<CyberluxHeaderProps> = ({
  activeTab,
  onNavigate,
  onOpenAssistant,
  onOpenLabs,
  onOpenProjects,
  onOpenMessaging,
  unreadCount = 0
}) => {
  const { theme, setTheme } = useTheme();
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = activeTab === 'landing';

  const handleDropdownClick = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSelectNav = (tab: any, campus?: any) => {
    onNavigate(tab, campus);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`w-full transition-all duration-300 ${
        isLanding
          ? scrolled
            ? 'fixed top-0 left-0 right-0 z-40 bg-[#060b18]/90 backdrop-blur-md border-b border-slate-800/90 shadow-2xl'
            : 'absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/60 via-black/20 to-transparent border-b border-white/10'
          : 'sticky top-0 z-40 bg-[#060b18]/95 backdrop-blur-md border-b border-slate-800/90'
      }`}
    >
      <div className="w-full px-4 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Zone 1: Single Text Element Brand Wordmark with Official HU Logo */}
        <div 
          onClick={() => handleSelectNav('landing')} 
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-slate-950/80 border border-[#00ff87]/50 p-1 flex items-center justify-center shadow-lg shadow-[#00ff87]/25 group-hover:scale-105 transition-transform overflow-hidden backdrop-blur-md">
            <img 
              src={huLogo} 
              alt="Haramaya University Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              HARAMAYA <span className="text-[#00ff87]">NOC</span>
            </span>
            <span className="text-[10px] text-slate-300 block font-mono drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Smart Network Simulator & Cybersecurity
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links & Nested Dropdowns (Desktop) */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold text-slate-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
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

        {/* Zone 3: Primary Action, Theme Toggle & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Theme Selector Popover */}
          <div className="relative">
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700/80 cursor-pointer transition-all hover:border-[#00ff87]/50 shadow-md"
              title="Select Theme Mode (Light, Dark, Netflix Mode)"
            >
              {theme === 'netflix' ? (
                <>
                  <Tv className="w-4 h-4 text-[#e50914] animate-pulse" />
                  <span className="hidden md:inline text-white font-extrabold">NETFLIX MODE</span>
                </>
              ) : theme === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#00ff87]" />
                  <span className="hidden md:inline">Dark</span>
                </>
              )}
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isThemeOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-[#0c0c0c] border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setIsThemeOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800/80 mb-1">
                  Choose Color Theme
                </div>
                
                <button
                  onClick={() => {
                    setTheme('netflix');
                    setIsThemeOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    theme === 'netflix'
                      ? 'bg-[#e50914] text-white shadow-lg shadow-[#e50914]/30'
                      : 'hover:bg-slate-900 text-slate-200 hover:text-white'
                  }`}
                >
                  <Tv className="w-4 h-4 text-[#e50914]" />
                  <span>🎬 Netflix Mode</span>
                </button>

                <button
                  onClick={() => {
                    setTheme('dark');
                    setIsThemeOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/40'
                      : 'hover:bg-slate-900 text-slate-200 hover:text-white'
                  }`}
                >
                  <Moon className="w-4 h-4 text-[#00ff87]" />
                  <span>🌙 Dark (Cyberlux)</span>
                </button>

                <button
                  onClick={() => {
                    setTheme('light');
                    setIsThemeOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'hover:bg-slate-900 text-slate-200 hover:text-white'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>☀ Light Mode</span>
                </button>
              </div>
            )}
          </div>

          {/* Messages Button with Unread Badge */}
          <button
            onClick={onOpenMessaging}
            className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700/80 cursor-pointer transition-all hover:border-[#00ff87]/50 shadow-md"
            title="Open Haramaya Enterprise Messaging & Packet Tracer Simulation"
          >
            <div className="relative">
              <Mail className="w-4 h-4 text-[#00ff87]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-[#00ff87] text-slate-950 font-black text-[9px] font-mono shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline">Messages</span>
            {unreadCount > 0 && (
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-[#00ff87]/20 text-[#00ff87] text-[10px] font-mono font-bold">
                [{unreadCount}]
              </span>
            )}
          </button>

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
              onClick={() => {
                onOpenMessaging();
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-[#00ff87]/15 border border-[#00ff87]/40 text-left font-semibold text-[#00ff87] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Messages
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#00ff87] text-slate-950 font-bold text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>
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
