import React, { useState, useRef, useEffect } from 'react';
import { Mail, Sparkles, Send, GripHorizontal, Activity } from 'lucide-react';

interface DraggableMessagePduProps {
  onOpenMessaging: () => void;
  unreadCount?: number;
}

export const DraggableMessagePdu: React.FC<DraggableMessagePduProps> = ({
  onOpenMessaging,
  unreadCount = 0
}) => {
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    // Default bottom-left placement so it doesn't obstruct other tools
    return { x: 24, y: typeof window !== 'undefined' ? window.innerHeight - 110 : 600 };
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDraggedRef = useRef<boolean>(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    hasDraggedRef.current = false;
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    hasDraggedRef.current = true;
    const newX = Math.max(12, Math.min(window.innerWidth - 80, e.clientX - dragOffset.x));
    const newY = Math.max(12, Math.min(window.innerHeight - 80, e.clientY - dragOffset.y));
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      // If was just clicked rather than dragged a significant distance, trigger open
      if (!hasDraggedRef.current) {
        onOpenMessaging();
      }
    }
  };

  return (
    <div
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`fixed top-0 left-0 z-40 select-none cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging ? 'scale-110 shadow-2xl shadow-[#00ff87]/50' : 'hover:scale-105'
      }`}
    >
      <div className="relative group flex items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-[#091129]/95 backdrop-blur-xl border-2 border-[#00ff87]/60 shadow-xl shadow-[#00ff87]/20 text-white transition-all">
        
        {/* Packet Tracer Simple PDU Envelope */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#00ff87] to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-[#00ff87]/40 relative">
          <Mail className="w-5 h-5 fill-slate-950/20" />
          
          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono font-bold text-[9px] border-2 border-slate-950 animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Label and Drag Indicator */}
        <div className="hidden sm:flex flex-col pr-1 font-mono">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#00ff87] leading-none">
            <span>DRAG & SEND PDU</span>
          </div>
          <span className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-1">
            <GripHorizontal className="w-3 h-3 text-cyan-400" />
            <span>Position anywhere</span>
          </span>
        </div>

        {/* Hover Tooltip */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-9 px-2.5 py-1 rounded-lg bg-slate-950 text-[10px] font-mono text-cyan-300 whitespace-nowrap border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Click or Drag PDU to Send Message
        </div>
      </div>
    </div>
  );
};
