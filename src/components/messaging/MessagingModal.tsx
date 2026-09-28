import React, { useState, useEffect, useRef } from 'react';
import { 
  ChatUser, 
  Conversation, 
  ChatMessage, 
  NetworkPacketHop 
} from '../../types/messaging';
import { messagingService } from '../../utils/messagingService';
import { VisualPacketFlow } from './VisualPacketFlow';
import { 
  Mail, 
  Send, 
  Search, 
  X, 
  Plus, 
  Check, 
  CheckCheck, 
  Clock, 
  Radio, 
  ShieldCheck, 
  Network, 
  Activity, 
  UserCheck, 
  ChevronLeft, 
  Layers, 
  Building2, 
  Sparkles,
  RefreshCw,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecipientId?: string | null;
}

export const MessagingModal: React.FC<MessagingModalProps> = ({
  isOpen,
  onClose,
  initialRecipientId
}) => {
  const [currentUser, setCurrentUser] = useState<ChatUser>(messagingService.getCurrentUser());
  const [allUsers, setAllUsers] = useState<ChatUser[]>(messagingService.getUsers());
  const [conversations, setConversations] = useState<Conversation[]>(messagingService.getConversations());
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeRecipient, setActiveRecipient] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  
  // Search & New Message state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewMessageMode, setIsNewMessageMode] = useState<boolean>(false);
  const [selectedNewUser, setSelectedNewUser] = useState<ChatUser | null>(null);

  // Simulation Flow State
  const [isSimModeEnabled, setIsSimModeEnabled] = useState<boolean>(true);
  const [activePacketHops, setActivePacketHops] = useState<NetworkPacketHop[]>([]);
  const [activeHopIndex, setActiveHopIndex] = useState<number>(0);
  const [isSimulatingPacket, setIsSimulatingPacket] = useState<boolean>(false);
  const [activeSimSource, setActiveSimSource] = useState<ChatUser>(currentUser);
  const [activeSimDest, setActiveSimDest] = useState<ChatUser | null>(null);

  // User Switcher dropdown state
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync state on open and handle initialRecipientId
  useEffect(() => {
    if (!isOpen) return;
    refreshAllData();

    if (initialRecipientId) {
      const targetUser = messagingService.getUserById(initialRecipientId);
      if (targetUser && targetUser.id !== currentUser.id) {
        selectRecipient(targetUser);
      }
    } else {
      const convs = messagingService.getConversations();
      if (convs.length > 0) {
        const firstConv = convs[0];
        const otherId = firstConv.participantIds.find((id) => id !== currentUser.id);
        if (otherId) {
          const otherUser = messagingService.getUserById(otherId);
          if (otherUser) {
            selectRecipient(otherUser);
          }
        }
      }
    }
  }, [isOpen, initialRecipientId]);

  // Subscribe to real-time events
  useEffect(() => {
    const unsubscribe = messagingService.subscribe((event) => {
      refreshAllData();

      if (event.type === 'MESSAGE_DELIVERED' || event.type === 'MESSAGE_SENT_START') {
        const msg: ChatMessage = event.payload.message;
        if (activeConversationId && msg.conversationId === activeConversationId) {
          setMessages(messagingService.getMessages(activeConversationId));
          scrollToBottom();
        }
      }
    });

    return () => unsubscribe();
  }, [activeConversationId, currentUser.id]);

  useEffect(() => {
    if (activeConversationId) {
      setMessages(messagingService.getMessages(activeConversationId));
      messagingService.markConversationAsRead(activeConversationId);
      scrollToBottom();
    }
  }, [activeConversationId]);

  const refreshAllData = () => {
    const u = messagingService.getCurrentUser();
    setCurrentUser(u);
    setAllUsers(messagingService.getUsers());
    const convs = messagingService.getConversations(u.id);
    setConversations(convs);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const selectRecipient = (user: ChatUser) => {
    setActiveRecipient(user);
    setIsNewMessageMode(false);
    setSelectedNewUser(null);
    const conv = messagingService.getOrCreateConversation(user.id);
    setActiveConversationId(conv.id);
    setMessages(messagingService.getMessages(conv.id));
    messagingService.markConversationAsRead(conv.id);

    // Prepare simulation defaults
    const hops = messagingService.generatePacketRoute(currentUser, user);
    setActivePacketHops(hops);
    setActiveHopIndex(hops.length - 1);
    setActiveSimSource(currentUser);
    setActiveSimDest(user);
    scrollToBottom();
  };

  const handleSwitchUser = (userId: string) => {
    const newUser = messagingService.setCurrentUser(userId);
    setCurrentUser(newUser);
    setIsUserSwitcherOpen(false);
    setActiveConversationId(null);
    setActiveRecipient(null);
    setIsNewMessageMode(false);
    refreshAllData();

    // Auto select first conversation for new user if available
    const newConvs = messagingService.getConversations(newUser.id);
    if (newConvs.length > 0) {
      const otherId = newConvs[0].participantIds.find((id) => id !== newUser.id);
      if (otherId) {
        const otherUser = messagingService.getUserById(otherId);
        if (otherUser) {
          selectRecipient(otherUser);
        }
      }
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const recipient = activeRecipient || selectedNewUser;
    if (!recipient) return;
    if (!messageInput.trim()) return;

    const textToSend = messageInput.trim();
    setMessageInput('');

    try {
      if (isSimModeEnabled) {
        setIsSimulatingPacket(true);
        const hops = messagingService.generatePacketRoute(currentUser, recipient);
        setActivePacketHops(hops);
        setActiveSimSource(currentUser);
        setActiveSimDest(recipient);
        setActiveHopIndex(0);

        await messagingService.sendMessage(recipient.id, textToSend, (currentHop) => {
          setActiveHopIndex(currentHop);
        });

        setIsSimulatingPacket(false);
      } else {
        await messagingService.sendMessage(recipient.id, textToSend);
      }

      if (activeConversationId) {
        setMessages(messagingService.getMessages(activeConversationId));
      }
      refreshAllData();
      scrollToBottom();
    } catch (err: any) {
      setIsSimulatingPacket(false);
      alert(err.message || 'Failed to send message');
    }
  };

  const handleReplaySim = () => {
    if (!activeRecipient || isSimulatingPacket) return;
    setIsSimulatingPacket(true);
    setActiveHopIndex(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < activePacketHops.length) {
        setActiveHopIndex(step);
      } else {
        clearInterval(interval);
        setIsSimulatingPacket(false);
      }
    }, 400);
  };

  if (!isOpen) return null;

  // Filter conversations & users based on search
  const filteredUsers = allUsers.filter(
    (u) =>
      u.id !== currentUser.id &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.campus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.ipAddress.includes(searchQuery))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 font-sans">
      <div className="bg-[#070c1a] border-2 border-slate-800 rounded-3xl w-full max-w-6xl h-[92vh] max-h-[850px] shadow-2xl shadow-[#00ff87]/10 flex flex-col overflow-hidden text-slate-100">
        
        {/* ── TOP HEADER BAR ── */}
        <div className="px-5 py-3.5 bg-[#091024] border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00ff87] text-slate-950 flex items-center justify-center font-black shadow-lg shadow-[#00ff87]/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                <span>Haramaya Enterprise Messaging</span>
                <span className="px-2 py-0.5 rounded-full bg-[#00ff87]/20 text-[#00ff87] text-[10px] font-mono font-bold border border-[#00ff87]/40">
                  REAL-TIME NOC
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Encrypted End-to-End Inter-Campus Communication & Packet Tracer Flow
              </p>
            </div>
          </div>

          {/* User Switcher & Controls */}
          <div className="flex items-center gap-3">
            {/* Active User Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                title="Switch Active Authenticated User to test End-User to End-User Chat"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-[#00ff87]"
                />
                <span className="hidden sm:inline font-mono">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00ff87]/20 text-[#00ff87] font-bold">
                  Switch User
                </span>
              </button>

              {isUserSwitcherOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#0b112c] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[10px] font-mono text-slate-400 font-bold uppercase border-b border-slate-800">
                    Switch Authenticated Identity
                  </div>
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleSwitchUser(u.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                        u.id === currentUser.id
                          ? 'bg-[#00ff87]/20 text-[#00ff87] font-bold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-semibold text-xs">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{u.role}</div>
                      </div>
                      {u.id === currentUser.id && (
                        <Check className="w-3.5 h-3.5 text-[#00ff87] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Network Simulation Mode Toggle */}
            <button
              onClick={() => setIsSimModeEnabled(!isSimModeEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 border transition-all cursor-pointer ${
                isSimModeEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Toggle Cisco Packet Tracer style visual message flow"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulation Flow:</span>
              <span>{isSimModeEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT AREA (3-Column Layout) ── */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* ── LEFT COLUMN: CONVERSATION LIST & DIRECTORY (Col 1-4) ── */}
          <div className="md:col-span-4 lg:col-span-3 border-r border-slate-800 flex flex-col bg-[#060a16]">
            
            {/* Search Bar & New Message Button */}
            <div className="p-3 border-b border-slate-800 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users or campus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff87]"
                />
              </div>

              <button
                onClick={() => {
                  setIsNewMessageMode(true);
                  setActiveRecipient(null);
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#00ff87]/15 hover:bg-[#00ff87]/25 text-[#00ff87] border border-[#00ff87]/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Message</span>
              </button>
            </div>

            {/* Conversation List / Directory */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              
              {isNewMessageMode ? (
                <div>
                  <div className="px-2 py-1 text-[10px] font-mono text-slate-400 font-bold uppercase">
                    Select University Recipient
                  </div>
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => selectRecipient(user)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-white truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{user.role}</div>
                        <div className="text-[9px] text-[#00ff87] font-mono truncate">{user.campus} &bull; {user.ipAddress}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : conversations.length > 0 ? (
                <div>
                  <div className="px-2 py-1 text-[10px] font-mono text-slate-400 font-bold uppercase">
                    Recent Conversations
                  </div>
                  {conversations.map((conv) => {
                    const otherId = conv.participantIds.find((id) => id !== currentUser.id);
                    const otherUser = allUsers.find((u) => u.id === otherId);
                    if (!otherUser) return null;

                    const isSelected = activeRecipient?.id === otherUser.id;
                    const unread = conv.unreadCount[currentUser.id] || 0;

                    return (
                      <button
                        key={conv.id}
                        onClick={() => selectRecipient(otherUser)}
                        className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#00ff87]/15 border border-[#00ff87]/40 shadow-sm'
                            : 'hover:bg-slate-900 border border-transparent'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={otherUser.avatar}
                            alt={otherUser.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                          />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#060a16] ${
                            otherUser.status === 'online' ? 'bg-[#00ff87]' : 'bg-amber-400'
                          }`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white truncate">
                              {otherUser.name}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">
                              {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                            {conv.lastMessageText}
                          </p>

                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] text-[#00e5ff] font-mono truncate">
                              {otherUser.campus.split(' ')[0]}
                            </span>
                            {unread > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-[#00ff87] text-slate-950 font-bold text-[10px] font-mono">
                                {unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 px-4 text-slate-500">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#00ff87]" />
                  <p className="text-xs font-mono">No active conversations</p>
                  <p className="text-[10px] text-slate-600 mt-1">Click New Message to start chatting</p>
                </div>
              )}
            </div>

            {/* Current Host IP Banner */}
            <div className="p-3 bg-[#080e22] border-t border-slate-800 text-[10px] font-mono text-slate-400">
              <span className="text-slate-500 block uppercase">Local Workstation</span>
              <span className="text-[#00ff87] font-bold">{currentUser.ipAddress}</span> (VLAN {currentUser.vlan})
            </div>
          </div>

          {/* ── CENTER COLUMN: ACTIVE CHAT THREAD (Col 5-8 on Desktop, Col 5-12 without sim) ── */}
          <div className={`${isSimModeEnabled ? 'md:col-span-8 lg:col-span-5' : 'md:col-span-8 lg:col-span-9'} flex flex-col bg-[#070c1a]`}>
            
            {activeRecipient ? (
              <>
                {/* Active Chat Header */}
                <div className="p-3.5 bg-[#091024] border-b border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={activeRecipient.avatar}
                      alt={activeRecipient.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#00ff87]/40"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                          {activeRecipient.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-mono font-bold">
                          {activeRecipient.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {activeRecipient.role} &bull; {activeRecipient.campus}
                      </p>
                    </div>
                  </div>

                  {/* Recipient Network Info Pill */}
                  <div className="hidden sm:block text-right font-mono text-[10px]">
                    <div className="text-cyan-300 font-bold">{activeRecipient.ipAddress}</div>
                    <div className="text-slate-500">VLAN {activeRecipient.vlan} &bull; {activeRecipient.macAddress}</div>
                  </div>
                </div>

                {/* Message Thread History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? 'bg-[#0b2447] text-white rounded-tr-sm border border-[#00ff87]/40 shadow-lg shadow-[#00ff87]/5'
                              : 'bg-slate-900 text-slate-100 rounded-tl-sm border border-slate-800'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.messageText}</p>

                          <div className={`flex items-center gap-2 mt-1.5 text-[10px] font-mono ${
                            isMe ? 'text-cyan-300/80 justify-end' : 'text-slate-400'
                          }`}>
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>

                            {isMe && (
                              <span className="flex items-center gap-1">
                                {msg.status === 'sending' ? (
                                  <Clock className="w-3 h-3 animate-spin text-amber-400" />
                                ) : msg.status === 'sent' ? (
                                  <Check className="w-3.5 h-3.5 text-slate-400" />
                                ) : msg.status === 'delivered' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                                ) : (
                                  <CheckCheck className="w-3.5 h-3.5 text-[#00ff87]" />
                                )}
                                <span className="capitalize">{msg.status}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Network Phrases */}
                <div className="px-4 py-2 border-t border-slate-800/80 bg-[#060b18] flex items-center gap-2 overflow-x-auto text-[10px] font-mono">
                  <span className="text-slate-500 uppercase shrink-0">Quick Templates:</span>
                  {[
                    'OSPF Area 0 neighbor state verified',
                    'ASA 5506-X security ACL updated',
                    'EtherChannel LACP load-balancing active',
                    'Site-to-Site IPSec VPN tunnel stable'
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      onClick={() => setMessageInput(phrase)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white shrink-0 cursor-pointer"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>

                {/* Message Composer */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-[#080e22] border-t border-slate-800 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder={`Type message to ${activeRecipient.name.split(' ')[0]}...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff87]"
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim() || isSimulatingPacket}
                    className="px-5 py-3 rounded-2xl bg-[#00ff87] hover:bg-[#00e575] text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#00ff87]/30 transition-all cursor-pointer disabled:opacity-40"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <div className="w-16 h-16 rounded-3xl bg-[#00ff87]/10 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87] mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h4 className="text-white font-bold text-base mb-1">Select a Conversation</h4>
                <p className="text-xs text-slate-400 max-w-sm font-mono">
                  Choose a colleague from the directory or start a new message to test live Packet Tracer simulated message routing.
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN: PACKET TRACER SIMULATION FLOW (Col 9-12 on Desktop) ── */}
          {isSimModeEnabled && activeRecipient && (
            <div className="hidden lg:block lg:col-span-4 border-l border-slate-800 p-3 bg-[#050914]">
              <VisualPacketFlow
                sourceUser={activeSimSource}
                destUser={activeSimDest || activeRecipient}
                hops={activePacketHops}
                activeHopIndex={activeHopIndex}
                isSimulating={isSimulatingPacket}
                onReplay={handleReplaySim}
                onDragTransmit={() => {
                  if (!messageInput.trim()) {
                    setMessageInput('Simple PDU: End-to-End Inter-Campus Message Transmitted');
                  }
                  setTimeout(() => {
                    handleSendMessage();
                  }, 50);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
