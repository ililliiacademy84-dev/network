/**
 * Cyberlux-Inspired Enterprise Landing Page for Haramaya University Network Platform
 * High-fidelity Cyberlux visual design (Dark Navy + Vivid Neon Green/Cyan)
 * Fully interactive with working navigation into Simulator, Labs, Campuses, NOC & Admin
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Globe, 
  PhoneCall, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Server, 
  Network, 
  Cpu, 
  Award, 
  Users, 
  Building2, 
  FileCode, 
  Bot, 
  ChevronRight, 
  Radio, 
  Terminal, 
  ExternalLink,
  Zap,
  Clock,
  Calendar,
  Sparkles,
  Search,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CyberluxLandingPageProps {
  onNavigate: (tab: any, campus?: any) => void;
  onOpenAssistant: () => void;
  onOpenLabs: () => void;
  onOpenProjects: () => void;
}

export const CyberluxLandingPage: React.FC<CyberluxLandingPageProps> = ({
  onNavigate,
  onOpenAssistant,
  onOpenLabs,
  onOpenProjects
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [testimonialIndex, setTestimonialIndex] = useState<number>(0);
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);

  const testimonials = [
    {
      name: 'Dr. Alemayehu Worku',
      role: 'Director of ICT & Infrastructure',
      dept: 'Haramaya University Main Campus',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'The simulated Cisco multi-campus topology enables our engineering students and staff to model redundant OSPF routing, EtherChannels, and ASA firewall rules across all 4 campuses without hardware downtime.'
    },
    {
      name: 'Eng. Bethelhem Tadesse',
      role: 'Senior Network Security Analyst',
      dept: 'College of Computing & Informatics (CCI)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      text: 'Having real-time packet inspection down to Layer 2/3/4 alongside Site-to-Site IPSec VPN telemetry makes troubleshooting complex subnetting and ACL issues effortless.'
    },
    {
      name: 'Prof. Girma Kebede',
      role: 'Dean, Haramaya Institute of Technology (HiT)',
      dept: 'Faculty of Electrical & Computer Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      text: 'With 12 hands-on CCNA/Enterprise labs integrated directly into our curriculum, our engineering students achieve exceptional mastery in VLAN segmentation and routing protocols.'
    }
  ];

  const handleLaunchSimulator = (campus = 'all') => {
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    } catch {}
    onNavigate('topology', campus);
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 font-sans selection:bg-[#00ff87] selection:text-slate-950 overflow-x-hidden">
      
      {/* ── TOP NEON GREEN ANNOUNCEMENT BANNER ── */}
      <div className="bg-[#00ff87] text-slate-950 px-4 py-4.5 shadow-lg shadow-[#00ff87]/20 border-b border-[#00e575]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-base tracking-tight uppercase">
              Select The Perfect Plan For Your Needs.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0 text-slate-900" />
              <span>Protect Identity & Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 shrink-0 text-slate-900" />
              <span>Ensure Safety in Cyberspace</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 shrink-0 text-slate-900" />
              <span>Multi-Campus Network Defense</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 shrink-0 text-slate-900" />
              <span>NOC Desk: +251 25 553 0334</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Neon Glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#00ff87]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#00e5ff]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00ff87]/15 border border-[#00ff87]/40 text-[#00ff87] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Simulated Haramaya University Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Enterprise Network Simulation & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff87] to-[#00e5ff]">Cybersecurity</span> Platform.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Design, configure, and simulate high-availability Cisco architectures across Haramaya University's <strong>4 Campuses</strong>, <strong>11 Colleges</strong>, and <strong>60 Departments</strong> with live Cisco IOS CLI, EtherChannel, OSPF, ASA 5506-X Firewalls, and IPSec VPNs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleLaunchSimulator('all')}
                className="px-8 py-4 rounded-2xl bg-[#00ff87] hover:bg-[#00e575] text-slate-950 font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-[#00ff87]/30 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Launch Packet Tracer Simulator</span>
              </button>

              <button
                onClick={onOpenLabs}
                className="px-6 py-4 rounded-2xl bg-[#0e1630] hover:bg-[#142044] text-white font-bold text-sm flex items-center gap-2 border border-slate-700/80 shadow-lg cursor-pointer transition-all hover:border-[#00ff87]/40"
              >
                <Award className="w-4 h-4 text-[#00ff87]" />
                <span>12 Networking Labs</span>
              </button>

              <button
                onClick={onOpenAssistant}
                className="px-6 py-4 rounded-2xl bg-[#0e1630] hover:bg-[#142044] text-white font-bold text-sm flex items-center gap-2 border border-slate-700/80 shadow-lg cursor-pointer transition-all hover:border-[#00e5ff]/40"
              >
                <Bot className="w-4 h-4 text-[#00e5ff]" />
                <span>AI Network Audit</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-xs font-mono">
              <div className="bg-[#0b112c]/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">CAMPUSES</span>
                <span className="text-[#00ff87] text-base font-bold">4 Linked</span>
              </div>
              <div className="bg-[#0b112c]/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">COLLEGES & DEPTS</span>
                <span className="text-cyan-300 text-base font-bold">11 / 60 Depts</span>
              </div>
              <div className="bg-[#0b112c]/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">SECURITY LEVEL</span>
                <span className="text-emerald-400 text-base font-bold">ASA 5506-X</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual (Cyber Hologram Artwork) */}
          <div className="flex-1 relative max-w-lg lg:max-w-none w-full">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#00ff87]/40 shadow-2xl shadow-[#00ff87]/20 group">
              <img
                src="/src/assets/images/hero_cyber_operator_1790587415867.jpg"
                alt="Cyberlux Network Simulation Operator"
                className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-transparent to-transparent" />

              {/* Floating Overlay Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#0b112c]/90 backdrop-blur-md p-4 rounded-2xl border border-[#00ff87]/30 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00ff87]/20 border border-[#00ff87]/40 flex items-center justify-center text-[#00ff87]">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">4-Campus OSPF Area 0</h4>
                    <p className="text-[11px] text-slate-400 font-mono">10.10.0.0/16 &bull; 10.20.0.0/16 &bull; 10.40.0.0/16</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('telemetry')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#00ff87] text-slate-950 text-xs font-bold hover:bg-[#00e575] cursor-pointer"
                >
                  Live View
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: ABOUT OUR PLATFORM (Cyberlux Dual-Frame Section) ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-[#060a16] relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Sub-header */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#00ff87]" />
            <span className="text-xs font-bold tracking-widest text-[#00ff87] uppercase">
              ABOUT OUR NETWORK PLATFORM
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-white max-w-2xl mx-auto mb-16 tracking-tight">
            Cyberlux Architecture Helps You Build & Defend Academic Networks.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image with Neon Frame & Rotating Play Badge */}
            <div className="lg:col-span-4 relative flex justify-center">
              <div className="relative p-2 rounded-3xl border-2 border-[#00ff87]/50 bg-[#0b112c]/60 shadow-xl">
                <img
                  src="/src/assets/images/hero_cyber_operator_1790587415867.jpg"
                  alt="Network Defense Specialist"
                  className="w-72 h-88 rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Circular Rotating Play Badge */}
              <div className="absolute -bottom-6 left-10 flex items-center justify-center">
                <button
                  onClick={() => handleLaunchSimulator('main')}
                  className="w-16 h-16 rounded-full bg-[#00ff87] text-slate-950 flex items-center justify-center shadow-xl shadow-[#00ff87]/40 hover:scale-110 transition-transform cursor-pointer"
                  title="Launch Simulation Mode"
                >
                  <Play className="w-6 h-6 fill-slate-950 ml-1" />
                </button>
              </div>
            </div>

            {/* Middle Feature Highlights */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0b112c] p-6 rounded-3xl border border-slate-800 hover:border-[#00ff87]/40 transition-all space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#00ff87]/15 text-[#00ff87] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Threat Mitigation & ASA Firewall</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Real-time Cisco ASA 5506-X inspection engine blocking SYN Floods, Port Scans, DNS amplification, and unauthorized inter-VLAN traversal.
                </p>
              </div>

              <div className="bg-[#0b112c] p-6 rounded-3xl border border-slate-800 hover:border-[#00ff87]/40 transition-all space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#00e5ff]/15 text-[#00e5ff] flex items-center justify-center">
                  <Network className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Full 4-Campus OSPF Routing</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Backbone WAN point-to-point links converging Main Campus (Bati), HiT, CVM, and Harar Referral Hospital with redundant default gateway failover.
                </p>
              </div>
            </div>

            {/* Right Image (Security Holographic Shield) */}
            <div className="lg:col-span-4 relative flex justify-center">
              <div className="relative p-2 rounded-3xl border-2 border-[#00ff87]/50 bg-[#0b112c]/60 shadow-xl">
                <img
                  src="/src/assets/images/network_security_shield_1790587430512.jpg"
                  alt="Security Hologram"
                  className="w-72 h-88 rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: OUR SERVICES / NETWORK ENGINEERING SOLUTIONS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070b19] border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header & View All Action */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff87]" />
                <span className="text-xs font-bold tracking-widest text-[#00ff87] uppercase">
                  OUR SERVICES
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Keeping You Secure With Tailored Network Engineering Solutions
              </h2>
            </div>

            <button
              onClick={() => onNavigate('tables')}
              className="px-6 py-3 rounded-2xl bg-[#00ff87] text-slate-950 font-bold text-xs hover:bg-[#00e575] transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-[#00ff87]/25"
            >
              VIEW ALL ARCHITECTURES
            </button>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'soc',
                title: 'Network Protections',
                desc: 'Cisco ASA 5506-X perimeter security gateway, stateful inspection, access-lists, and threat defense.',
                icon: ShieldCheck,
                tab: 'soc'
              },
              {
                id: 'servers',
                title: 'Database & DMZ Security',
                desc: 'Isolated DMZ Server Farm with DNS, Web Portal, Student Records, Syslog, and FTP file repository.',
                icon: Server,
                tab: 'tables'
              },
              {
                id: 'portal',
                title: 'Web & Academic Portal',
                desc: 'Simulated high-availability Haramaya University public portal and faculty research directories.',
                icon: Globe,
                tab: 'portal'
              },
              {
                id: 'telemetry',
                title: 'Telemetry & Bandwidth NOC',
                desc: 'Live multi-gigabit traffic monitoring, packet loss analysis, and bandwidth capacity stress-testing.',
                icon: Activity,
                tab: 'telemetry'
              }
            ].map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="bg-[#0b112c] p-7 rounded-3xl border border-slate-800/80 hover:border-[#00ff87]/50 transition-all flex flex-col justify-between space-y-6 group hover:-translate-y-1 duration-300 shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#00ff87]/15 text-[#00ff87] flex items-center justify-center group-hover:bg-[#00ff87] group-hover:text-slate-950 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{srv.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{srv.desc}</p>
                  </div>

                  <button
                    onClick={() => onNavigate(srv.tab as any)}
                    className="w-full py-2.5 rounded-xl bg-[#082824] hover:bg-[#00ff87] text-[#00ff87] hover:text-slate-950 text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    READ MORE &bull; LAUNCH
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WHY CHOOSE HARAMAYA NETWORK PLATFORM ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#060a16] border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Art & 24/7 Helpline Badge */}
          <div className="flex-1 relative w-full max-w-lg">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#00ff87]/40 shadow-2xl">
              <img
                src="/src/assets/images/datacenter_engineer_1790587442769.jpg"
                alt="Datacenter Network Engineer"
                className="w-full h-[400px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* 24/7 Help Callout Badge */}
            <div className="absolute -bottom-6 -right-4 bg-[#00ff87] text-slate-950 p-4 rounded-2xl shadow-xl flex items-center gap-3">
              <PhoneCall className="w-6 h-6 shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block">Call, text, or email us</span>
                <span className="font-extrabold text-sm font-mono">+251 25 553 0334</span>
              </div>
            </div>
          </div>

          {/* Right Checklist */}
          <div className="flex-1 space-y-6 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff87]" />
              <span className="text-xs font-bold tracking-widest text-[#00ff87] uppercase">
                WHY CHOOSE US
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              We Provide Top Tier Academic Networking & Cybersecurity Simulation.
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Equip students, instructors, and network administrators with hands-on Cisco architecture emulation, 802.1Q trunking, OSPF routing protocols, and automated troubleshooting.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00ff87] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Full 11-College Mapping</h4>
                  <p className="text-[11px] text-slate-400">All 60 departments assigned dedicated VLANs & switches.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00ff87] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Live Cisco IOS CLI</h4>
                  <p className="text-[11px] text-slate-400">Real command execution with full running-config parsing.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00ff87] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Automated AI Auditor</h4>
                  <p className="text-[11px] text-slate-400">Instant detection of IP duplications & broken routes.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00ff87] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">12 Educational Labs</h4>
                  <p className="text-[11px] text-slate-400">Structured tasks with hints & automated verification.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleLaunchSimulator('all')}
                className="px-8 py-3.5 rounded-2xl bg-[#00ff87] hover:bg-[#00e575] text-slate-950 font-extrabold text-xs shadow-lg shadow-[#00ff87]/25 cursor-pointer transition-all"
              >
                GET STARTED NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: CASE STUDIES & CAMPUS SHOWCASES ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070b19] border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff87]" />
              <span className="text-xs font-bold tracking-widest text-[#00ff87] uppercase">
                CAMPUS CASE STUDIES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Case Studies Showcase Our 4-Campus Network Architecture.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'main',
                title: 'Main Campus (Bati)',
                subtitle: 'DMZ Server Farm & Core',
                ip: '10.10.0.0/16',
                depts: '35 Departments',
                bg: 'from-indigo-900 to-slate-900'
              },
              {
                id: 'hit',
                title: 'HiT Tech Campus',
                subtitle: 'Engineering Computer Labs',
                ip: '10.20.0.0/16',
                depts: '10 Engineering Depts',
                bg: 'from-cyan-900 to-slate-900'
              },
              {
                id: 'cvm',
                title: 'CVM Veterinary Campus',
                subtitle: 'Clinical & Pathology VLANs',
                ip: '10.30.0.0/16',
                depts: '4 Clinical Depts',
                bg: 'from-emerald-900 to-slate-900'
              },
              {
                id: 'harar',
                title: 'Harar Health Campus',
                subtitle: 'HFSUH Hospital & Medicine',
                ip: '10.40.0.0/16',
                depts: '11 Medical Schools',
                bg: 'from-rose-900 to-slate-900'
              }
            ].map((camp) => (
              <div
                key={camp.id}
                onClick={() => handleLaunchSimulator(camp.id)}
                className="group relative rounded-3xl overflow-hidden border border-slate-800 hover:border-[#00ff87] transition-all cursor-pointer p-6 bg-gradient-to-b from-[#0b112c] to-[#070b19] flex flex-col justify-between h-72 shadow-xl hover:-translate-y-1"
              >
                <div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#00ff87]/20 text-[#00ff87] border border-[#00ff87]/30">
                    {camp.ip}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-4">{camp.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{camp.subtitle}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300 font-bold">{camp.depts}</span>
                  <span className="text-[#00ff87] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-sans font-bold">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: MEET OUR NETWORK ENGINEERING TEAM & FACULTY ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#060a16] border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff87]" />
              <span className="text-xs font-bold tracking-widest text-[#00ff87] uppercase">
                MEET OUR TEAM
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Professional Faculty & Network Engineering Leadership.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Dr. Michael Bekele',
                role: 'Chief Network Architect',
                dept: 'ICT Directorate',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
              },
              {
                name: 'Eng. Solomon Haile',
                role: 'ASA Cybersecurity Lead',
                dept: 'Computing & Informatics',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
              },
              {
                name: 'Ms. Selamawit Desta',
                role: 'IPSec & Infrastructure Engineer',
                dept: 'Haramaya Institute of Technology',
                avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300'
              },
              {
                name: 'Mr. Yared Tulu',
                role: 'CCNA Educational Lab Director',
                dept: 'Telecommunications Center',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
              }
            ].map((member, i) => (
              <div
                key={i}
                className="bg-[#0b112c] rounded-3xl border border-slate-800 overflow-hidden shadow-xl group hover:border-[#00ff87]/50 transition-all"
              >
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-[#00ff87] text-slate-950 flex items-center justify-center font-bold text-base shadow-lg">
                    +
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-white">{member.name}</h3>
                  <p className="text-xs text-[#00ff87] font-semibold">{member.role}</p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">{member.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: PRICING & ACADEMIC LAB PLANS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070b19] border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff87]" />
              <span className="text-xs font-bold tracking-widest text-[#00ff87] uppercase">
                PRICING & ACADEMIC ACCESS PLANS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Best Access Plans For Students, Engineers & Faculty.
            </h2>

            {/* Monthly / Yearly Toggle */}
            <div className="pt-4 flex items-center justify-center">
              <div className="bg-[#0b112c] p-1.5 rounded-full border border-slate-800 flex items-center">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly' ? 'bg-[#00ff87] text-slate-950 shadow-md' : 'text-slate-400'
                  }`}
                >
                  SEMESTER ACCESS
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === 'yearly' ? 'bg-[#00ff87] text-slate-950 shadow-md' : 'text-slate-400'
                  }`}
                >
                  ANNUAL FACULTY PASS
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Student Plan */}
            <div className="bg-[#0b112c] p-8 rounded-3xl border border-slate-800 hover:border-[#00ff87]/50 transition-all flex flex-col justify-between space-y-8 shadow-xl">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Student Plan</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">Free</span>
                  <span className="text-xs text-slate-400">/ HU Student ID</span>
                </div>
                <p className="text-xs text-slate-300">Access to 12 hands-on CCNA laboratories, Cisco IOS CLI simulator, and automated verification.</p>

                <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>All 12 Guided CCNA Networking Labs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>Real-Time Packet Tracer Simulation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>Cisco IOS CLI Terminal Simulator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>Campus 60-Department Directory</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenLabs}
                className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-[#00ff87] text-white hover:text-slate-950 text-xs font-extrabold transition-all cursor-pointer border border-slate-700"
              >
                OPEN STUDENT LABS
              </button>
            </div>

            {/* Standard Engineer Plan (Featured) */}
            <div className="bg-[#0e1635] p-8 rounded-3xl border-2 border-[#00ff87] relative flex flex-col justify-between space-y-8 shadow-2xl shadow-[#00ff87]/20 transform md:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00ff87] text-slate-950 text-[10px] font-extrabold uppercase px-4 py-1 rounded-full tracking-wider shadow">
                RECOMMENDED FOR ENGINEERS
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold text-[#00ff87] uppercase tracking-wider block">Network Engineer Plan</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">Full Lab</span>
                  <span className="text-xs text-slate-400">/ Included</span>
                </div>
                <p className="text-xs text-slate-300">Custom topology creation, device drag & drop, ASA firewall simulation, and project state exports.</p>

                <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>Full 4-Campus Topology Designer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>Cisco ASA 5506-X Threat Simulator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>Site-to-Site IPSec VPN Monitor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>Save & Load Project State JSON</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>VLSM & IPAM Subnet Calculator</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleLaunchSimulator('all')}
                className="w-full py-3.5 rounded-2xl bg-[#00ff87] hover:bg-[#00e575] text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-[#00ff87]/30"
              >
                LAUNCH SIMULATOR
              </button>
            </div>

            {/* Premium Enterprise / Instructor */}
            <div className="bg-[#0b112c] p-8 rounded-3xl border border-slate-800 hover:border-[#00ff87]/50 transition-all flex flex-col justify-between space-y-8 shadow-xl">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Faculty & Instructor</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">Admin</span>
                  <span className="text-xs text-slate-400">/ Full Control</span>
                </div>
                <p className="text-xs text-slate-300">Curriculum management, student grading dashboards, audit logging, and automated RBAC administration.</p>

                <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>Full RBAC Admin System</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>Lab Curriculum & Solution Creator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>Automated AI Network Diagnostics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />
                    <span>Engineering Documentation PDF Generator</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('admin')}
                className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-[#00ff87] text-white hover:text-slate-950 text-xs font-extrabold transition-all cursor-pointer border border-slate-700"
              >
                OPEN ADMIN SYSTEM
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: TESTIMONIALS & STATS COUNTERS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#060a16] border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-4 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff87]" />
                <span className="text-xs font-bold tracking-widest text-[#00ff87] uppercase">
                  CLIENTS & ACADEMIC TESTIMONIAL
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Why Faculty & Students Recommend Our Simulation Platform.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Haramaya University's premier digital sandbox for hands-on telecommunications and cybersecurity excellence.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00ff87] text-slate-950 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Need Help?</span>
                  <span className="text-sm font-bold font-mono text-white">+251 (25) 553 0334</span>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="flex-1 max-w-xl bg-[#0b112c] p-8 rounded-3xl border border-slate-800 relative shadow-2xl">
              <p className="text-slate-200 text-sm italic leading-relaxed mb-6">
                "{testimonials[testimonialIndex].text}"
              </p>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonials[testimonialIndex].avatar}
                    alt={testimonials[testimonialIndex].name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#00ff87]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{testimonials[testimonialIndex].name}</h4>
                    <p className="text-xs text-[#00ff87]">{testimonials[testimonialIndex].role}</p>
                    <p className="text-[11px] text-slate-400">{testimonials[testimonialIndex].dept}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTestimonialIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1))}
                    className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-[#00ff87] hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    &larr;
                  </button>
                  <button
                    onClick={() => setTestimonialIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1))}
                    className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-[#00ff87] hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Quantitative Rigor Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="bg-[#0b112c] p-6 rounded-3xl border border-slate-800 text-center space-y-2 shadow-lg">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#00ff87] font-mono">150k+</span>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Packets Simulated</p>
            </div>
            <div className="bg-[#0b112c] p-6 rounded-3xl border border-slate-800 text-center space-y-2 shadow-lg">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#00e5ff] font-mono">252k+</span>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Lab Exercises Done</p>
            </div>
            <div className="bg-[#0b112c] p-6 rounded-3xl border border-slate-800 text-center space-y-2 shadow-lg">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">120+</span>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Simulated Network Nodes</p>
            </div>
            <div className="bg-[#0b112c] p-6 rounded-3xl border border-slate-800 text-center space-y-2 shadow-lg">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">50+</span>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">CCNA Verified Modules</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: LATEST NEWS & ARTICLES ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070b19] border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff87]" />
              <span className="text-xs font-bold tracking-widest text-[#00ff87] uppercase">
                LATEST UPDATES & ARTICLES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Check Out Our Newest Campus Network Updates & Articles.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                date: '28 Sep',
                author: 'By ICT Directorate',
                title: 'Deploying Site-to-Site IPSec VPN Tunnels Across HiT and Harar Health Campuses',
                desc: 'How AES-256 encryption and ISAKMP Phase 1 & 2 ensure HIPAA-compliant student patient data transit.',
                img: '/src/assets/images/noc_operations_center_1790587453063.jpg'
              },
              {
                date: '24 Sep',
                author: 'By Network Admin',
                title: 'Catalyst 3650 EtherChannel & HSRP Redundancy on Main Campus Core Switch Farm',
                desc: 'Achieving sub-second default gateway failover and 20Gbps aggregated core uplinks.',
                img: '/src/assets/images/datacenter_engineer_1790587442769.jpg'
              },
              {
                date: '19 Sep',
                author: 'By Security Team',
                title: 'Simulating SYN Flood Mitigation with Cisco ASA 5506-X Threat Defense Rules',
                desc: 'Configuring TCP intercept parameters and access-list policies to prevent server exhaustion.',
                img: '/src/assets/images/network_security_shield_1790587430512.jpg'
              }
            ].map((art, i) => (
              <div
                key={i}
                className="bg-[#0b112c] rounded-3xl border border-slate-800 overflow-hidden shadow-xl group hover:border-[#00ff87]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={art.img}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#070b19]/90 border border-[#00ff87]/40 px-3 py-1 rounded-xl text-center">
                      <span className="text-xs font-bold text-[#00ff87] font-mono">{art.date}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <span className="text-[11px] text-[#00e5ff] font-semibold">{art.author}</span>
                    <h3 className="text-base font-bold text-white group-hover:text-[#00ff87] transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{art.desc}</p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => onNavigate('configs')}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-[#00ff87] text-slate-300 hover:text-slate-950 text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    READ ARTICLE &bull; VIEW CONFIGS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER (Cyberlux Theme) ── */}
      <footer className="bg-[#040813] text-slate-300 border-t border-slate-800 pt-16 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Disclaimer */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#00ff87] text-slate-950 flex items-center justify-center font-black">
                <Network className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                HARAMAYA <span className="text-[#00ff87]">NOC</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official simulation and training environment for Haramaya University Network Engineering, Telecommunications, and Cybersecurity.
            </p>
            <div className="inline-block p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-amber-300 font-mono">
              SIMULATED HARAMAYA UNIVERSITY NETWORK &bull; NOT LIVE PRODUCTION
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('topology')} className="hover:text-[#00ff87] transition-colors cursor-pointer">
                  &bull; Topology Simulator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('colleges')} className="hover:text-[#00ff87] transition-colors cursor-pointer">
                  &bull; 11 Colleges & 60 Departments
                </button>
              </li>
              <li>
                <button onClick={onOpenLabs} className="hover:text-[#00ff87] transition-colors cursor-pointer">
                  &bull; 12 CCNA Networking Labs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-[#00ff87] transition-colors cursor-pointer">
                  &bull; VLSM Subnet Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-[#00ff87] transition-colors cursor-pointer">
                  &bull; Administration Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Campuses & Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Campus Networks</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleLaunchSimulator('main')} className="hover:text-[#00ff87] transition-colors cursor-pointer">
                  &bull; Main Campus (Bati) Core & DMZ
                </button>
              </li>
              <li>
                <button onClick={() => handleLaunchSimulator('hit')} className="hover:text-[#00ff87] transition-colors cursor-pointer">
                  &bull; HiT Institute of Technology
                </button>
              </li>
              <li>
                <button onClick={() => handleLaunchSimulator('cvm')} className="hover:text-[#00ff87] transition-colors cursor-pointer">
                  &bull; College of Veterinary Medicine
                </button>
              </li>
              <li>
                <button onClick={() => handleLaunchSimulator('harar')} className="hover:text-[#00ff87] transition-colors cursor-pointer">
                  &bull; Harar Health & HFSUH Hospital
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vpn')} className="hover:text-[#00ff87] transition-colors cursor-pointer">
                  &bull; Site-to-Site IPSec VPN Tunnels
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Institutional Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact & Location</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-[#00ff87] shrink-0 mt-0.5" />
                <span>Haramaya University, Bati/Harar, Oromia, Ethiopia</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#00ff87] shrink-0" />
                <span>+251 (25) 553 0334 / 0380</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00ff87] shrink-0" />
                <span>www.haramaya.edu.et</span>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 Haramaya University Smart Network Simulation Platform. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Academic Sandbox</span>
            <span>&bull;</span>
            <span>Cisco Packet Tracer Compatible</span>
            <span>&bull;</span>
            <span>ISO/IEC 27001</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
