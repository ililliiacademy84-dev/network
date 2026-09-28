import React, { useEffect, useState } from 'react';
import { ChatMessage, ChatUser } from '../../types/messaging';
import { messagingService } from '../../utils/messagingService';
import { Mail, X, ArrowRight, ShieldCheck, User } from 'lucide-react';

interface MessageToastProps {
  onOpenConversation: (userId: string) => void;
}

export const MessageToast: React.FC<MessageToastProps> = ({ onOpenConversation }) => {
  const [toastMessage, setToastMessage] = useState<{ message: ChatMessage; sender: ChatUser } | null>(null);

  useEffect(() => {
    const unsubscribe = messagingService.subscribe((event) => {
      if (event.type === 'MESSAGE_DELIVERED') {
        const msg: ChatMessage = event.payload.message;
        const currentUser = messagingService.getCurrentUser();
        // If the message is directed to current user, show notification
        if (msg.recipientId === currentUser.id) {
          const sender = messagingService.getUserById(msg.senderId);
          if (sender) {
            setToastMessage({ message: msg, sender });
            const timer = setTimeout(() => {
              setToastMessage(null);
            }, 6000);
            return () => clearTimeout(timer);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#0b112c]/95 backdrop-blur-xl border-2 border-[#00ff87]/50 rounded-2xl p-4 shadow-2xl shadow-[#00ff87]/20 text-slate-100 flex items-start gap-3">
        <div className="relative">
          <img
            src={toastMessage.sender.avatar}
            alt={toastMessage.sender.name}
            className="w-10 h-10 rounded-xl object-cover border border-[#00ff87]/40"
          />
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00ff87] border-2 border-slate-950 rounded-full" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#00ff87] font-bold uppercase tracking-wider flex items-center gap-1">
              <Mail className="w-3 h-3" /> New Message
            </span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <h5 className="font-bold text-xs text-white truncate mt-0.5">
            {toastMessage.sender.name}
          </h5>
          <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-relaxed font-mono">
            "{toastMessage.message.messageText}"
          </p>

          <button
            onClick={() => {
              onOpenConversation(toastMessage.sender.id);
              setToastMessage(null);
            }}
            className="mt-2.5 px-3 py-1 rounded-lg bg-[#00ff87] hover:bg-[#00e575] text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <span>Reply to {toastMessage.sender.name.split(' ')[0]}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
