import React, { useState } from 'react';
import { ProjectSaveState, NetworkDevice, NetworkLink, VlanInfo, FirewallRule } from '../../types/network';
import { FolderKanban, Plus, Save, Download, Upload, Copy, Archive, CheckCircle2, Clock } from 'lucide-react';

interface ProjectManagerModalProps {
  onClose: () => void;
  devices: NetworkDevice[];
  links: NetworkLink[];
  vlans: VlanInfo[];
  firewallRules: FirewallRule[];
  onLoadProject: (project: ProjectSaveState) => void;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  onClose,
  devices,
  links,
  vlans,
  firewallRules,
  onLoadProject
}) => {
  const [projects, setProjects] = useState<ProjectSaveState[]>([
    {
      id: 'proj-01',
      name: 'Haramaya Main Campus & HiT OSPF Area 0 Master Design',
      updatedAt: new Date().toISOString(),
      version: 'v2.4',
      devices,
      links,
      vlans,
      firewallRules,
      dnsRecords: [],
      mailMessages: [],
      ftpFiles: [],
      syslogLogs: [],
      securityEvents: []
    },
    {
      id: 'proj-02',
      name: 'Harar Health CHMS IPSec VPN Remote Extension',
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      version: 'v1.1',
      devices: devices.slice(0, 4),
      links: links.slice(0, 3),
      vlans: vlans.slice(0, 3),
      firewallRules,
      dnsRecords: [],
      mailMessages: [],
      ftpFiles: [],
      syslogLogs: [],
      securityEvents: []
    }
  ]);

  const [projectNameInput, setProjectNameInput] = useState<string>('');

  const handleSaveCurrentAsProject = () => {
    if (!projectNameInput.trim()) return;

    const newProject: ProjectSaveState = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      name: projectNameInput.trim(),
      updatedAt: new Date().toISOString(),
      version: 'v1.0',
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

    setProjects([newProject, ...projects]);
    setProjectNameInput('');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.devices && Array.isArray(parsed.devices)) {
          onLoadProject(parsed);
          onClose();
        } else {
          alert('Invalid HU-SSAN Topology file format.');
        }
      } catch (err) {
        alert('Failed to parse topology file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0c0c] border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00ff87]/20 border border-[#00ff87]/40 flex items-center justify-center text-[#00ff87]">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-2">
                <span>HU-SSAN NETWORK PROJECT MANAGER</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Save, load, duplicate, archive & import network topology designs
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Create New Project Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Enter New Project Name (e.g. Bati Core Router Upgrade)..."
              value={projectNameInput}
              onChange={e => setProjectNameInput(e.target.value)}
              className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold outline-none focus:border-[#00ff87]"
            />
            <button
              onClick={handleSaveCurrentAsProject}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00ff87] text-slate-950 text-xs font-black uppercase cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 shadow-lg shadow-[#00ff87]/20"
            >
              <Save className="w-4 h-4" />
              <span>SAVE CURRENT STATE</span>
            </button>
            <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap border border-slate-700">
              <Upload className="w-4 h-4 text-cyan-300" />
              <span>IMPORT JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>

          {/* Project List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Saved Network Projects ({projects.length})
            </h4>

            <div className="space-y-3">
              {projects.map(p => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">{p.name}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">{p.version}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-3">
                      <span>{p.devices.length} Devices</span>
                      <span>&bull;</span>
                      <span>{p.links.length} Links</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(p.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        onLoadProject(p);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#00ff87]/20 hover:bg-[#00ff87]/30 text-[#00ff87] text-xs font-bold border border-[#00ff87]/40 cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>LOAD PROJECT</span>
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${p.name.replace(/\s+/g, '_')}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="Export Project JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
