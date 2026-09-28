/**
 * Official Haramaya University Academic Portal
 * Hosted directly on Campus I DMZ Web Server (C1-Web at 172.16.10.6)
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Building2, 
  Network, 
  Users, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Globe2,
  Calendar,
  Award,
  ArrowRight
} from 'lucide-react';

export const HaramayaPortal: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'colleges' | 'sis' | 'network' | 'thesis'>('home');
  const [studentId, setStudentId] = useState<string>('HU/9824/14');
  const [searchFaculty, setSearchFaculty] = useState<string>('');

  const colleges = [
    {
      name: 'College of Agriculture & Environmental Sciences (CAES)',
      campus: 'Main Campus (Bati)',
      depts: ['Plant Sciences', 'Animal Sciences', 'Agribusiness & Value Chain', 'Natural Resource Management', 'Rural Development'],
      students: '4,450 Students',
      vlan: 'VLAN 40 (Research) & VLAN 10'
    },
    {
      name: 'Haramaya Institute of Technology (HiT)',
      campus: 'HiT Campus',
      depts: ['Electrical & Computer Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Software & IoT Lab'],
      students: '4,800 Students',
      vlan: 'VLAN 10, 30 & 100 (HiT 10.20.0.0/16)'
    },
    {
      name: 'College of Health & Medical Sciences (CHMS & HFSUH)',
      campus: 'Harar Campus',
      depts: ['School of Medicine', 'Hiwot Fana Comprehensive Specialized Hospital', 'Public Health', 'Nursing & Midwifery', 'Pharmacy'],
      students: '5,300 Students',
      vlan: 'VLAN 30, 40 & 80 (Harar 10.40.0.0/16)'
    },
    {
      name: 'College of Veterinary Medicine (CVM)',
      campus: 'Veterinary Campus',
      depts: ['Veterinary Medicine (DVM)', 'Veterinary Teaching Hospital', 'Pathology & Diagnostic Laboratory', 'Biomedical Sciences'],
      students: '2,100 Students',
      vlan: 'VLAN 140 & 100 (CVM 10.30.0.0/16)'
    },
    {
      name: 'College of Computing & Informatics (CCI)',
      campus: 'Main Campus (Bati)',
      depts: ['Computer Science', 'Information Technology', 'Software Engineering', 'Information Systems', 'Cisco Academy'],
      students: '3,850 Students',
      vlan: 'VLAN 30 & 140'
    },
    {
      name: 'College of Business & Economics (CBE)',
      campus: 'Main Campus (Bati)',
      depts: ['Economics', 'Accounting & Finance', 'Management', 'Public Administration & Development Management'],
      students: '3,900 Students',
      vlan: 'VLAN 10 & 20'
    },
    {
      name: 'College of Education & Behavioural Sciences (CEBS)',
      campus: 'Main Campus (Bati)',
      depts: ['Educational Planning & Management', 'Psychology', 'Curriculum & Instruction', 'Special Needs Education'],
      students: '2,200 Students',
      vlan: 'VLAN 20'
    },
    {
      name: 'College of Law (COL)',
      campus: 'Main Campus (Bati)',
      depts: ['Human Rights Law', 'Public Law', 'Private & Commercial Law', 'Legal Aid Clinic'],
      students: '1,400 Students',
      vlan: 'VLAN 10'
    },
    {
      name: 'College of Natural & Computational Sciences (CNCS)',
      campus: 'Main Campus (Bati)',
      depts: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Statistics'],
      students: '2,800 Students',
      vlan: 'VLAN 40 (Research)'
    },
    {
      name: 'College of Social Sciences & Humanities (CSSH)',
      campus: 'Main Campus (Bati)',
      depts: ['Sociology', 'History & Heritage', 'Geography & Environmental Studies', 'Foreign & Afaan Oromo Languages'],
      students: '2,600 Students',
      vlan: 'VLAN 20'
    },
    {
      name: 'Sport Science Academy (SSA)',
      campus: 'Main Campus (Bati)',
      depts: ['Sport Sciences', 'Athletic Kinesiology & Biomechanics', 'Olympic Sports Training'],
      students: '820 Students',
      vlan: 'VLAN 30 (Student / Athletic)'
    }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-6">
      {/* Portal Top University Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-indigo-950 p-6 md:p-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 ring-2 ring-white/10 shrink-0">
              <GraduationCap className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 font-mono tracking-widest uppercase">
                HARAMAYA UNIVERSITY &bull; ETHIOPIA &bull; EST. 1954
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                ሀረማያ ዩኒቨርሲቲ &bull; Haramaya University Portal
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Building the Future Through Knowledge, Research and Technology. Empowering Ethiopian higher education with modern network infrastructure.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">DMZ Web Server Active</span>
              <span className="font-semibold text-emerald-300 font-mono">172.16.10.6 (www.haramaya.edu.et)</span>
            </div>
          </div>
        </div>

        {/* Portal Navigation Bar */}
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 pt-6 mt-4 border-t border-slate-800/80">
          {[
            { id: 'home', label: 'Overview', icon: Building2 },
            { id: 'colleges', label: 'Colleges & Campuses', icon: BookOpen },
            { id: 'sis', label: 'Student Portal (SIS)', icon: Users },
            { id: 'network', label: 'Live NOC Infrastructure', icon: Network },
            { id: 'thesis', label: 'CSE Packet Tracer Thesis', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Portal Screen */}
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        {/* ── HOME SECTION ── */}
        {activeSection === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Quick Hero Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Four Strategic Campuses</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interconnected Main Campus (Bati), HiT Engineering, CVM Veterinary, and Harar Health Campus (CHMS & HFSUH) via high-speed Cisco IPSec mesh tunnels.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span>Main &bull; HiT &bull; CVM &bull; Harar</span>
                  <span>AES-256 Mesh</span>
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                  <Network className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Three-Tier Network Backbone</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cisco Catalyst 3650 multilayer switches at Core and Distribution layers with OSPF routing, HSRP gateway failover, and LACP EtherChannels.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-indigo-400">
                  <span>Core &bull; Dist &bull; Access</span>
                  <span>7 VLANs</span>
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Smart Campus & IoT</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated motion sensing, emergency fire detection with automated sprinklers, Cisco IP VoIP calling, and RFID smart doors.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>Microcontroller MCU</span>
                  <span>Ext 1001 / 2001</span>
                </div>
              </div>
            </div>

            {/* University News & Announcements */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">Latest University Notices</h3>
                <span className="text-xs text-slate-400 font-mono">Academic Year 2026/2027</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'New Semester Online Registration Opened on C1-Web Server',
                    date: 'September 27, 2026',
                    cat: 'Registrar',
                    badge: 'bg-emerald-500/20 text-emerald-300'
                  },
                  {
                    title: 'College of Health & Medical Sciences Inter-Campus Telehealth Link Upgraded',
                    date: 'September 26, 2026',
                    cat: 'Harar Campus',
                    badge: 'bg-indigo-500/20 text-indigo-300'
                  },
                  {
                    title: 'University Network Operations Center Deploys Enhanced ASA Firewall ACLs',
                    date: 'September 25, 2026',
                    cat: 'ICT Directorate',
                    badge: 'bg-cyan-500/20 text-cyan-300'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${item.badge}`}>
                          {item.cat}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{item.date}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── COLLEGES SECTION ── */}
        {activeSection === 'colleges' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Academic Colleges & Faculties</h3>
                <p className="text-xs text-slate-400">Undergraduate & postgraduate programs across Main and Harar campuses</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter colleges..."
                  value={searchFaculty}
                  onChange={(e) => setSearchFaculty(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {colleges
                .filter((c) => c.name.toLowerCase().includes(searchFaculty.toLowerCase()))
                .map((col, idx) => (
                  <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                          {col.campus}
                        </span>
                        <span className="text-xs font-mono text-emerald-400">{col.students}</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">{col.name}</h4>
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-medium block">Departments:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {col.depts.map((d, dIdx) => (
                            <span key={dIdx} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-indigo-400">
                      <span>Network Segment: {col.vlan}</span>
                      <button className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── STUDENT INFORMATION SYSTEM (SIS) ── */}
        {activeSection === 'sis' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Student Information System (SIS)</h3>
              <p className="text-xs text-slate-400">Connected to Database & Registration Server in DMZ Zone (VLAN 13)</p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold font-mono">
                    HU
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Student Registration Record</h4>
                    <p className="text-xs text-slate-400 font-mono">ID: {studentId} &bull; College of Computing & Informatics</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  Status: Active
                </span>
              </div>

              {/* Registered Courses Table */}
              <div>
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Registered Courses (Semester I)</h5>
                <div className="border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3">Course Code</th>
                        <th className="p-3">Course Title</th>
                        <th className="p-3">Credit Hours</th>
                        <th className="p-3">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      <tr>
                        <td className="p-3 text-emerald-400">CoSc-4101</td>
                        <td className="p-3 text-white">Advanced Computer Networks (Cisco Packet Tracer)</td>
                        <td className="p-3">4 Cr</td>
                        <td className="p-3 text-emerald-400 font-bold">A</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-emerald-400">CoSc-4102</td>
                        <td className="p-3 text-white">Network Security & Cryptography (IPSec & ASA)</td>
                        <td className="p-3">3 Cr</td>
                        <td className="p-3 text-emerald-400 font-bold">A+</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-emerald-400">CoSc-4103</td>
                        <td className="p-3 text-white">Internet of Things (IoT) & Embedded Systems</td>
                        <td className="p-3">3 Cr</td>
                        <td className="p-3 text-emerald-400 font-bold">A</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-emerald-400">CoSc-4104</td>
                        <td className="p-3 text-white">Enterprise Systems Administration</td>
                        <td className="p-3">3 Cr</td>
                        <td className="p-3 text-indigo-300 font-bold">A-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LIVE NOC INFRASTRUCTURE ── */}
        {activeSection === 'network' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Network Operations Center (NOC) Real-time Health</h3>
              <p className="text-xs text-slate-400">Monitoring all switches, firewalls, and server daemons across Haramaya University</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">Campus I Core Uptime</span>
                <span className="text-2xl font-mono font-bold text-emerald-400 block">99.98%</span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">Catalyst 3650 Stack</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">Campus II VPN Latency</span>
                <span className="text-2xl font-mono font-bold text-cyan-400 block">18 ms</span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">Harar Campus IPsec Link</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">Total Active VLANs</span>
                <span className="text-2xl font-mono font-bold text-indigo-400 block">14 VLANs</span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">7 per Campus</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block mb-1">DMZ Servers</span>
                <span className="text-2xl font-mono font-bold text-emerald-400 block">8 Online</span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">DNS, HTTP, Mail, NTP, Syslog</span>
              </div>
            </div>
          </div>
        )}

        {/* ── THESIS SHOWCASE ── */}
        {activeSection === 'thesis' && (
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Award className="w-8 h-8 text-amber-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Bachelor in Computer Science & Engineering Showcase</h3>
                <p className="text-xs text-slate-400">Design and Implementation of a Secure University Network in Cisco Packet Tracer</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This interactive application simulates the complete 83-page engineering paper:
              "UNIVERSITY NETWORK: A Cisco Packet Tracer Showcase" (originally by Mehad Alam, CSE 068 07938), adapted as the official enterprise infrastructure for <strong>Haramaya University</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-300 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h5 className="font-bold text-indigo-400 mb-2">Network Design Chapters Implemented:</h5>
                <ul className="space-y-1 text-slate-400 list-disc list-inside">
                  <li>Ch 4: Three-Tier Hierarchical Network (Core, Dist, Access)</li>
                  <li>Ch 5: Cisco ISR4331, C3650, 2960-24TT, ASA 5506, 2811 VoIP</li>
                  <li>Ch 6: Dual Campus Physical Deployment & Cabling</li>
                  <li>Ch 7: Tables 7.1 to 7.8 IP Addressing Schema</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h5 className="font-bold text-emerald-400 mb-2">Protocols & Security Mechanisms:</h5>
                <ul className="space-y-1 text-slate-400 list-disc list-inside">
                  <li>Site-to-Site IPSec VPN (AES-256 / SHA-HMAC)</li>
                  <li>OSPF Area 0, HSRP Gateway Redundancy, VLAN Trunking</li>
                  <li>Cisco CallManager Express VoIP (Extensions 1001 & 2001)</li>
                  <li>IoT Sensor Automation (PIR, Smoke, Sprinklers, RFID Door)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
