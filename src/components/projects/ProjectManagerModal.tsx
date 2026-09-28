/**
 * Haramaya University Project Management & Documentation Generator
 * Supports Save/Load project state to browser storage, JSON import/export,
 * and automated export of comprehensive University Network Engineering Documentation.
 */

import React, { useState } from 'react';
import { NetworkDevice, NetworkLink, VlanInfo, FirewallRule, ProjectSaveState } from '../../types/network';
import { ALL_HARAMAYA_COLLEGES, ALL_HARAMAYA_DEPARTMENTS } from '../../data/haramayaCollegesData';
import { 
  FolderDown, 
  FileText, 
  Download, 
  Upload, 
  Save, 
  Copy, 
  Check, 
  X, 
  FileCode, 
  Share2,
  BookOpen,
  Maximize2,
  Minimize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProjectManagerModalProps {
  devices: NetworkDevice[];
  links: NetworkLink[];
  vlans: VlanInfo[];
  firewallRules: FirewallRule[];
  onLoadProject: (project: ProjectSaveState) => void;
  onClose: () => void;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  devices,
  links,
  vlans,
  firewallRules,
  onLoadProject,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'save' | 'export' | 'docs'>('docs');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('Haramaya-University-Enterprise-Network-v2');
  const [copiedDocs, setCopiedDocs] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Generate complete project JSON object
  const generateProjectJson = (): ProjectSaveState => {
    return {
      id: `hu-proj-${Date.now()}`,
      name: projectName,
      updatedAt: new Date().toISOString(),
      version: '2.5.0-Cisco-Packet-Tracer',
      devices,
      links,
      vlans,
      firewallRules,
      dnsRecords: [],
      mailMessages: [],
      ftpFiles: [],
      syslogLogs: [],
      securityEvents: []
    };
  };

  const handleSaveToBrowser = () => {
    const proj = generateProjectJson();
    localStorage.setItem(`HU_NET_PROJ_${projectName}`, JSON.stringify(proj));
    setSaveSuccess(true);
    try {
      confetti({ particleCount: 30, spread: 50 });
    } catch {}
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDownloadJson = () => {
    const proj = generateProjectJson();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(proj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${projectName}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Generate Comprehensive Technical Documentation
  const generateDocumentationText = () => {
    return `================================================================================
HARAMAYA UNIVERSITY SMART NETWORK ARCHITECTURE & SPECIFICATION REPORT
================================================================================
Simulated Institution: Haramaya University (Main, HiT, CVM & Harar Campuses)
Technical Framework: Cisco Three-Tier Hierarchical Model & ASA Perimeter Security
Date: ${new Date().toLocaleDateString()} | Author: Mehad Alam (Adapted for Haramaya University)
Status: Verified Simulated Network Engineering Blueprint
Official University Reference: https://www.haramaya.edu.et/

[DISCLAIMER]:
This document represents an academic network design and simulation blueprint for 
Haramaya University. Simulated devices, VLANs, and subnets are designed for 
educational testing in Cisco Packet Tracer and do not represent the physical production 
network of the university.

--------------------------------------------------------------------------------
1. EXECUTIVE SUMMARY & OBJECTIVES
--------------------------------------------------------------------------------
The primary objective of this project is to implement a robust, secure, and high-speed
Three-Tier Hierarchical Network interconnecting four major university campuses:
  1. Main Campus (Bati/Haramaya) - Central Administration, Computing (CCI), Agriculture
  2. Haramaya Institute of Technology (HiT) - Engineering Laboratories & IoT
  3. College of Veterinary Medicine (CVM) - Veterinary Teaching Hospital & Animal Health
  4. Harar Campus - College of Health & Medical Sciences (CHMS / HiOT Referral Hospital)

All campuses communicate through redundant Gigabit links to EthioTelecom ISP and 
utilize dedicated Cisco ASA 5506-X Site-to-Site IPSec VPN tunnels (AES-256 / SHA-256) 
for confidential inter-campus data transfer.

--------------------------------------------------------------------------------
2. THREE-TIER HIERARCHICAL TOPOLOGY ARCHITECTURE
--------------------------------------------------------------------------------
- CORE LAYER:
  * Hardware: Cisco Catalyst WS-C3650-24PS Multi-Layer Switches.
  * Routing: OSPF Area 0, EtherChannel (Port-channel1 & Po2), High-Speed Backbone.
- DISTRIBUTION LAYER:
  * Hardware: Cisco Catalyst WS-C3650-24PS.
  * Functions: Inter-VLAN Routing, Hot Standby Router Protocol (HSRP) Gateway 
    Redundancy, and Policy Access Control Lists (ACLs).
- ACCESS LAYER:
  * Hardware: Cisco Catalyst 2960-24TT Layer-2 Switches.
  * Functions: 802.1Q VLAN Segmentation, Port-Security, Spanning Tree (PVST+).

--------------------------------------------------------------------------------
3. IP ADDRESSING & 15 ENTERPRISE VLANS
--------------------------------------------------------------------------------
VLAN 10  - ADMIN      : 10.10.10.0/24   (Gateway: 10.10.10.1)
VLAN 20  - FACULTY    : 10.10.20.0/24   (Gateway: 10.10.20.1)
VLAN 30  - STUDENT    : 10.10.30.0/24   (Gateway: 10.10.30.1)
VLAN 40  - RESEARCH   : 10.10.40.0/24   (Gateway: 10.10.40.1)
VLAN 50  - LIBRARY    : 10.10.50.0/24   (Gateway: 10.10.50.1)
VLAN 60  - ICT        : 10.10.60.0/24   (Gateway: 10.10.60.1)
VLAN 70  - SERVER     : 10.10.70.0/24   (Gateway: 10.10.70.1)
VLAN 80  - VOICE      : 10.10.80.0/24   (Gateway: 10.10.80.1)
VLAN 90  - CCTV       : 10.10.90.0/24   (Gateway: 10.10.90.1)
VLAN 100 - IOT        : 10.10.100.0/24  (Gateway: 10.10.100.1)
VLAN 110 - GUEST      : 10.10.110.0/24  (Gateway: 10.10.110.1)
VLAN 120 - MANAGEMENT : 10.10.120.0/24  (Gateway: 10.10.120.1)
VLAN 130 - SECURITY   : 10.10.130.0/24  (Gateway: 10.10.130.1)
VLAN 140 - LAB        : 10.10.140.0/24  (Gateway: 10.10.140.1)
VLAN 150 - DMZ        : 10.10.150.0/24  (Gateway: 10.10.150.1)

--------------------------------------------------------------------------------
4. DMZ SERVICES & SERVERS
--------------------------------------------------------------------------------
- Authoritative DNS Server  : 10.10.150.4 (www.haramaya.edu.et, hit., cvm., chms.)
- Dynamic DHCP Server       : 10.10.150.5 (15 VLAN Dynamic Pools)
- Academic Web Server       : 10.10.150.6 (Haramaya Portal, SIS Registration)
- Mail Daemon (SMTP/POP3)   : 10.10.150.7 (Official @haramaya.edu.et accounts)
- Stratum 2 NTP Master      : 10.10.150.8 (East Africa Time UTC+3 Sync)
- Central Syslog Collector  : 10.10.150.9 (RFC 5424 Event Store)
- Secure FTP Repository     : 10.10.150.10 (Software & Config Images)
- Smart IoT Server          : 10.10.100.10 (Sensors & Smart Door Manager)

--------------------------------------------------------------------------------
5. PERIMETER SECURITY & IPSEC VPN
--------------------------------------------------------------------------------
- Cisco ASA 5506-X Zone Hierarchy:
  * Outside (Security Level 0)
  * DMZ (Security Level 70)
  * Inside (Security Level 100)
- Site-to-Site IPSec VPN Tunnels:
  * MAIN <-> HARAR (10.100.1.2 <-> 10.100.4.2)
  * MAIN <-> HIT   (10.100.1.2 <-> 10.100.2.2)
  * MAIN <-> CVM   (10.100.1.2 <-> 10.100.3.2)
  * Phase 1: IKEv1, DH Group 14, Pre-Shared Key Authentication
  * Phase 2: ESP-AES-256 with SHA-256 HMAC Authentication

--------------------------------------------------------------------------------
6. ACADEMIC ENTITY DIRECTORY (11 COLLEGES / 60 DEPARTMENTS)
--------------------------------------------------------------------------------
${ALL_HARAMAYA_COLLEGES.map((col) => `* [${col.campusId.toUpperCase()}] ${col.name} (${col.shortName}):
  - Dean/Lead: ${col.dean}
  - Building: ${col.building}
  - Departments (${col.departments.length}):
${col.departments.map((d) => `    * ${d.name} (${d.code}): Workstation ${d.workstationName} [${d.workstationIp}] | VLAN ${d.vlan} | GW: ${d.gateway}`).join('\n')}`).join('\n\n')}

================================================================================
END OF NETWORK DESIGN SPECIFICATION REPORT
================================================================================`;
  };

  const copyDocumentation = () => {
    navigator.clipboard.writeText(generateDocumentationText());
    setCopiedDocs(true);
    setTimeout(() => setCopiedDocs(false), 2000);
  };

  return (
    <div className={`fixed z-50 inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center ${isFullScreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-200 transition-all ${
        isFullScreen ? 'w-full h-full rounded-none border-none' : 'rounded-3xl w-full max-w-4xl h-[740px]'
      }`}>
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FolderDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Project Management & Documentation Generator</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Save network topology projects, export JSON schemas, or generate full engineering reports
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
        <div className="bg-slate-950/70 border-b border-slate-800 px-6 py-2 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'docs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Network Documentation Report
          </button>
          <button
            onClick={() => setActiveTab('save')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'save' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Save & Export Project
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 bg-slate-950 p-6 overflow-y-auto">
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Automated University Architecture Documentation</h4>
                  <p className="text-xs text-slate-400">Comprehensive report ready for printing, submission, or accreditation</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyDocumentation}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedDocs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDocs ? 'Copied' : 'Copy Documentation'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-black border border-slate-800 rounded-2xl p-5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-[500px]">
                <pre>{generateDocumentationText()}</pre>
              </div>
            </div>
          )}

          {activeTab === 'save' && (
            <div className="max-w-xl mx-auto space-y-6 pt-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-white text-base">Save Topology Project</h4>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSaveToBrowser}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saveSuccess ? 'Saved to Browser!' : 'Save to Local Storage'}</span>
                  </button>

                  <button
                    onClick={handleDownloadJson}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON File</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
