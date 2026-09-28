/**
 * Haramaya University Network Engineering Educational Labs
 * 12 Guided Hands-on Networking Laboratories with automated task verification,
 * scoring, hints, and Cisco IOS reference solutions.
 */

import React, { useState } from 'react';
import { EducationalLab } from '../../types/network';
import { HARAMAYA_EDUCATIONAL_LABS } from '../../data/haramayaNetworkData';
import { 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Play, 
  RotateCcw, 
  Check, 
  Copy, 
  X, 
  ChevronRight,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EducationalLabsModalProps {
  onClose: () => void;
  onSelectLabDevice?: (deviceId: string) => void;
}

export const EducationalLabsModal: React.FC<EducationalLabsModalProps> = ({ onClose, onSelectLabDevice }) => {
  const [selectedLabId, setSelectedLabId] = useState<string>('lab-01');
  const [labs, setLabs] = useState<EducationalLab[]>(HARAMAYA_EDUCATIONAL_LABS);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [copiedSolution, setCopiedSolution] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const currentLab = labs.find((l) => l.id === selectedLabId) || labs[0];

  // Calculate score
  const completedTasks = currentLab.tasks.filter((t) => t.isCompleted).length;
  const scorePercent = Math.round((completedTasks / currentLab.tasks.length) * 100);

  const handleToggleTask = (taskId: string) => {
    setLabs((prev) =>
      prev.map((lab) => {
        if (lab.id !== selectedLabId) return lab;
        return {
          ...lab,
          tasks: lab.tasks.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
        };
      })
    );
  };

  const handleVerifyLab = () => {
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  return (
    <div className={`fixed z-50 inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center ${isFullScreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-200 transition-all ${
        isFullScreen ? 'w-full h-full rounded-none border-none' : 'rounded-3xl w-full max-w-5xl h-[760px]'
      }`}>
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Haramaya University Networking Laboratory</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  12 Hands-on Modules
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Practice Cisco IOS configurations, VLANs, OSPF routing, ASA firewall rules, and VoIP
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

        {/* Content Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Labs List Sidebar */}
          <div className="w-64 bg-slate-950/80 border-r border-slate-800 p-3 overflow-y-auto space-y-1 select-none">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2 block">
              Laboratory Curriculum
            </span>
            {labs.map((lab) => {
              const isSelected = lab.id === selectedLabId;
              const isDone = lab.tasks.every((t) => t.isCompleted);

              return (
                <button
                  key={lab.id}
                  onClick={() => {
                    setSelectedLabId(lab.id);
                    setShowSolution(false);
                    setShowHint(false);
                  }}
                  className={`w-full text-left p-3 rounded-2xl text-xs transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold truncate">{lab.title.split(':')[0]}</span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                  <span className="text-[11px] text-slate-400 truncate w-full">
                    {lab.title.split(':')[1] || lab.title}
                  </span>
                  <div className="flex items-center gap-2 text-[9px] font-mono mt-1">
                    <span className="px-1.5 py-0.2 rounded bg-black/40 text-slate-300">{lab.category}</span>
                    <span className="text-slate-400">{lab.difficulty}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Lab Details Panel */}
          <div className="flex-1 bg-slate-900/60 p-6 overflow-y-auto space-y-6">
            {/* Lab Objective & Stats */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-base">{currentLab.title}</h4>
                  <span className="text-xs text-indigo-400 font-mono">
                    Category: {currentLab.category} &bull; Difficulty: {currentLab.difficulty} &bull; {currentLab.estimatedMinutes} Mins
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <span className="text-xs text-slate-400 block">Progress</span>
                    <span className="text-lg font-bold text-emerald-400">{scorePercent}%</span>
                  </div>
                  <button
                    onClick={handleVerifyLab}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Verify & Score</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Objective:</strong> {currentLab.objective}
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h5 className="font-bold text-white text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Lab Instructions</span>
              </h5>
              <ol className="space-y-1.5 list-decimal list-inside text-xs text-slate-300 leading-relaxed font-mono">
                {currentLab.instructions.map((inst, idx) => (
                  <li key={idx} className="pl-1">
                    {inst}
                  </li>
                ))}
              </ol>
            </div>

            {/* Task Checklist */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h5 className="font-bold text-white text-sm">Grading Tasks Checklist</h5>
              <div className="space-y-2">
                {currentLab.tasks.map((task) => (
                  <label
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => {}}
                      className="w-4 h-4 text-indigo-600 rounded bg-slate-950 border-slate-700 focus:ring-0 cursor-pointer"
                    />
                    <span className={`text-xs ${task.isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                      {task.description}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hints & Solution Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHint ? 'Hide Hint' : 'View Hint'}</span>
              </button>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{showSolution ? 'Hide Solution' : 'View Cisco IOS Solution'}</span>
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono space-y-1">
                {currentLab.hints.map((h, i) => (
                  <p key={i}>&bull; {h}</p>
                ))}
              </div>
            )}

            {/* Solution Box */}
            {showSolution && (
              <div className="bg-black p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">Cisco IOS Reference Solution</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentLab.solution);
                      setCopiedSolution(true);
                      setTimeout(() => setCopiedSolution(false), 1500);
                    }}
                    className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 cursor-pointer font-mono"
                  >
                    {copiedSolution ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSolution ? 'Copied' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre">
                  {currentLab.solution}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
