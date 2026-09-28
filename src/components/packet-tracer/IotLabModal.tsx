/**
 * Interactive IoT Campus Automation Laboratory
 * Replicates Figures 9.15, 9.16, and 9.17 from the thesis:
 * - Motion Detective Devices (PIR, Camera, Light, Fan)
 * - Fire Prevention System (Fire monitor, Siren, Sprinkler)
 * - RFID Smart Door System (RFID Reader, Keycards 1001/1002, Lock)
 */

import React, { useState } from 'react';
import { IotCampusState } from '../../types/network';
import { soundManager } from '../../utils/audio';
import { 
  Flame, 
  Lightbulb, 
  Fan, 
  DoorClosed, 
  DoorOpen, 
  Radio, 
  Camera, 
  ShieldAlert, 
  Droplets, 
  X, 
  Play, 
  RefreshCw,
  CreditCard,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface IotLabModalProps {
  iotState: IotCampusState;
  onUpdateIot: (updater: (prev: IotCampusState) => IotCampusState) => void;
  onClose: () => void;
  onLogEvent?: (msg: string, severity: 'EMERG' | 'WARNING' | 'INFO') => void;
}

export const IotLabModal: React.FC<IotLabModalProps> = ({
  iotState,
  onUpdateIot,
  onClose,
  onLogEvent
}) => {
  const [activeSubsystem, setActiveSubsystem] = useState<'all' | 'motion' | 'fire' | 'rfid'>('all');
  const [cameraRecording, setCameraRecording] = useState<boolean>(true);

  // Trigger motion simulation
  const handleTriggerMotion = () => {
    soundManager.playChime(true);
    onUpdateIot((prev) => ({
      ...prev,
      motionDetected: true,
      lightBrightness: 100,
      fanActive: true,
      fanSpeed: 'high'
    }));
    onLogEvent?.('%IOT-6-MOTION_TRIGGER: PIR Sensor C1-MD16 activated. Smart light at 100%, Fan HIGH.', 'INFO');

    // Auto reset motion after 4 seconds
    setTimeout(() => {
      onUpdateIot((prev) => ({
        ...prev,
        motionDetected: false,
        lightBrightness: 25,
        fanSpeed: 'low'
      }));
    }, 4000);
  };

  // Trigger fire drill
  const handleTriggerFire = () => {
    soundManager.playSiren();
    onUpdateIot((prev) => ({
      ...prev,
      fireDetected: true,
      smokeDensityPpm: 680,
      sirenAlert: true,
      sprinklerActive: true
    }));
    onLogEvent?.('%FIRE-1-CRITICAL: Smoke & thermal threshold exceeded at C1-FM10. Sprinkler C1-FS10 activated.', 'EMERG');
  };

  const handleResetFire = () => {
    onUpdateIot((prev) => ({
      ...prev,
      fireDetected: false,
      smokeDensityPpm: 12,
      sirenAlert: false,
      sprinklerActive: false
    }));
    onLogEvent?.('%FIRE-5-CLEAR: Environmental safety sensors normalized.', 'INFO');
  };

  // RFID scan simulation
  const handleSwipeCard = (cardId: string, holder: string) => {
    const isAuthorized = cardId === '1001' || cardId === '1002';
    soundManager.playChime(isAuthorized);

    onUpdateIot((prev) => ({
      ...prev,
      doorLocked: !isAuthorized,
      lastRfidScan: {
        cardId,
        holder,
        accessGranted: isAuthorized,
        timestamp: new Date().toLocaleTimeString()
      }
    }));

    if (isAuthorized) {
      onLogEvent?.(`%RFID-6-ACCESS_GRANTED: Door C1-D10 unlocked for ${holder} (ID ${cardId}).`, 'INFO');
      setTimeout(() => {
        onUpdateIot((prev) => ({ ...prev, doorLocked: true }));
      }, 3500);
    } else {
      onLogEvent?.(`%RFID-3-SECURITY_ALERT: Unauthorized card scan attempt at Door C1-D10 (Card: ${cardId}).`, 'WARNING');
    }
  };

  return (
    <div className="fixed z-50 inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl h-[720px] flex flex-col overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Haramaya Smart Campus IoT Laboratory</h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  MCU Telemetry: 192.168.10.100
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive real-time demonstration of Motion detection, Fire prevention & RFID Smart access systems
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subsystem Tabs */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-6 py-2 flex items-center gap-2">
          {[
            { id: 'all', label: 'All Subsystems' },
            { id: 'motion', label: 'Motion & Automation (Fig 9.15)' },
            { id: 'fire', label: 'Fire Safety & Sprinklers (Fig 9.16)' },
            { id: 'rfid', label: 'RFID Door Access (Fig 9.17)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubsystem(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeSubsystem === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lab Content Screen */}
        <div className="flex-1 bg-slate-950 p-6 overflow-y-auto space-y-6">
          {/* ── SUBSYSTEM 1: MOTION & AUTOMATION ── */}
          {(activeSubsystem === 'all' || activeSubsystem === 'motion') && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Motion Detective & Automated Room System</h4>
                    <span className="text-[11px] text-slate-400">PIR Sensor C1-MD16 &bull; Camera C1-C16 &bull; Light C1-L16 &bull; Fan C1-F16</span>
                  </div>
                </div>

                <button
                  onClick={handleTriggerMotion}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulate Walk-in Motion</span>
                </button>
              </div>

              {/* Status Nodes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* CC Camera */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-blue-400" />
                      CCTV (C1-C16)
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-rose-400 font-mono">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      REC
                    </span>
                  </div>
                  <div className="h-20 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800/80 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/5 scanlines pointer-events-none" />
                    <span className="text-[11px] text-slate-400 font-mono">
                      {iotState.motionDetected ? 'PERSON DETECTED' : 'STANDBY - FEED LIVE'}
                    </span>
                  </div>
                </div>

                {/* Motion Detector */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">PIR Sensor (C1-MD16)</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${iotState.motionDetected ? 'bg-emerald-400 ring-4 ring-emerald-500/20' : 'bg-slate-700'}`} />
                  </div>
                  <div className="text-center py-2">
                    <span className="text-lg font-bold font-mono text-white block">
                      {iotState.motionDetected ? 'TRIPPED' : 'CLEAR'}
                    </span>
                    <span className="text-[11px] text-slate-400">IR Field: 120&deg; Active</span>
                  </div>
                </div>

                {/* Smart Light */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Lightbulb className={`w-4 h-4 ${iotState.lightBrightness > 50 ? 'text-amber-300' : 'text-slate-600'}`} />
                      Light (C1-L16)
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">{iotState.lightBrightness}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${iotState.lightBrightness}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 text-center">
                    {iotState.lightBrightness > 50 ? 'Bright (Active)' : 'Dim Energy Save'}
                  </span>
                </div>

                {/* Smart Fan */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Fan className={`w-4 h-4 text-cyan-400 ${iotState.fanActive ? 'animate-spin' : ''}`} />
                      Fan (C1-F16)
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">{iotState.fanSpeed}</span>
                  </div>
                  <div className="text-center py-2">
                    <span className="text-sm font-semibold text-white block">
                      {iotState.fanActive ? 'Cooling Active' : 'Idle'}
                    </span>
                    <span className="text-[11px] text-slate-400">Eco Climate Sync</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SUBSYSTEM 2: FIRE SAFETY & SPRINKLERS ── */}
          {(activeSubsystem === 'all' || activeSubsystem === 'fire') && (
            <div className={`bg-slate-900/60 border rounded-2xl p-5 space-y-4 transition-colors ${
              iotState.fireDetected ? 'border-rose-500/60 bg-rose-950/20' : 'border-slate-800'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Automated Fire & Smoke Suppression System</h4>
                    <span className="text-[11px] text-slate-400">Smoke Sensor C1-FM10 &bull; Water Sprinkler C1-FS10 &bull; Siren C1-S10</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {iotState.fireDetected ? (
                    <button
                      onClick={handleResetFire}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Fire Safety Alarm</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleTriggerFire}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/30 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Simulate Smoke / Fire Alert</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Fire Components */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Fire Monitor */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">Fire Monitor (C1-FM10)</span>
                    <span className={`text-xs font-mono font-bold ${iotState.fireDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {iotState.smokeDensityPpm} PPM
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">Optical smoke obscuration threshold: 150 PPM</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    iotState.fireDetected ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {iotState.fireDetected ? 'FIRE DETECTED - ALARM' : 'SAFE - NORMAL LEVEL'}
                  </span>
                </div>

                {/* Alarm Siren */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <ShieldAlert className={`w-4 h-4 ${iotState.sirenAlert ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
                      Siren (C1-S10)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">105 dB Strobe</span>
                  </div>
                  <div className="text-center py-2">
                    <span className={`text-sm font-bold block ${iotState.sirenAlert ? 'text-rose-400' : 'text-slate-400'}`}>
                      {iotState.sirenAlert ? 'BLARING & FLASHING' : 'STANDBY'}
                    </span>
                    <span className="text-[11px] text-slate-500">Audio evacuation beacon</span>
                  </div>
                </div>

                {/* Fire Sprinkler */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Droplets className={`w-4 h-4 ${iotState.sprinklerActive ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                      Sprinkler (C1-FS10)
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">Water Suppression</span>
                  </div>
                  <div className="text-center py-2">
                    <span className={`text-sm font-bold block ${iotState.sprinklerActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                      {iotState.sprinklerActive ? 'WATER SPRAYING (45 PSI)' : 'STANDBY'}
                    </span>
                    <span className="text-[11px] text-slate-500">Auto solenoid actuated</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SUBSYSTEM 3: RFID SMART DOOR ACCESS ── */}
          {(activeSubsystem === 'all' || activeSubsystem === 'rfid') && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <DoorClosed className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">RFID Smart Door Access System</h4>
                    <span className="text-[11px] text-slate-400">RFID Reader C1-RR10 &bull; Door C1-D10 &bull; Admin & Executive Keycards</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSwipeCard('1001', 'Admin Officer (Mehad Alam)')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Swipe Card 1001 (Admin)</span>
                  </button>
                  <button
                    onClick={() => handleSwipeCard('1002', 'University President')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Swipe Card 1002 (President)</span>
                  </button>
                  <button
                    onClick={() => handleSwipeCard('9999', 'Unknown Visitor')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Swipe Unregistered Card</span>
                  </button>
                </div>
              </div>

              {/* Door & Reader Interface */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Physical Door Graphic */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all ${
                      iotState.doorLocked ? 'bg-slate-800 border border-slate-700' : 'bg-emerald-600 border border-emerald-400 shadow-lg shadow-emerald-500/20'
                    }`}>
                      {iotState.doorLocked ? <DoorClosed className="w-7 h-7 text-slate-400" /> : <DoorOpen className="w-7 h-7 text-white" />}
                    </div>
                    <div>
                      <h5 className="font-semibold text-white text-sm">Server Room Door C1-D10</h5>
                      <span className={`text-xs font-mono font-bold ${iotState.doorLocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {iotState.doorLocked ? 'LOCKED (Motorized Bolt Engaged)' : 'UNLOCKED (Access Granted)'}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1">Direct relay connected to MCU Digital Pin D3</p>
                    </div>
                  </div>
                </div>

                {/* Reader Scan Log */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 block mb-1">Last RFID Scan Event:</span>
                    {iotState.lastRfidScan ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {iotState.lastRfidScan.accessGranted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <span className="text-white font-semibold">{iotState.lastRfidScan.holder}</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Card ID: <span className="text-indigo-400">{iotState.lastRfidScan.cardId}</span> &bull; Time: {iotState.lastRfidScan.timestamp}
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-500">No cards scanned yet. Click swipe card above.</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                    RFID Reader 13.56MHz Mifare Protocol &bull; VLAN 10
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
