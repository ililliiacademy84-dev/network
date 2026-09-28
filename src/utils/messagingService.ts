import { ChatUser, Conversation, ChatMessage, MessageStatus, NetworkPacketHop } from '../types/messaging';
import { INITIAL_CHAT_USERS, INITIAL_CONVERSATIONS, INITIAL_MESSAGES } from '../data/messagingData';

const USERS_STORAGE_KEY = 'hu_chat_users_v1';
const CONVERSATIONS_STORAGE_KEY = 'hu_chat_conversations_v1';
const MESSAGES_STORAGE_KEY = 'hu_chat_messages_v1';
const CURRENT_USER_KEY = 'hu_chat_current_user_v1';

export type MessagingEventListener = (event: { type: string; payload: any }) => void;

class MessagingService {
  private listeners: Set<MessagingEventListener> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    this.initStorage();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('hu_network_messaging_channel');
        this.broadcastChannel.onmessage = (event) => {
          this.notifyLocalListeners(event.data.type, event.data.payload);
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported or restricted', e);
      }
    }
  }

  private initStorage() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_CHAT_USERS));
    }
    if (!localStorage.getItem(CONVERSATIONS_STORAGE_KEY)) {
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
    }
    if (!localStorage.getItem(MESSAGES_STORAGE_KEY)) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
    }
    if (!localStorage.getItem(CURRENT_USER_KEY)) {
      localStorage.setItem(CURRENT_USER_KEY, 'usr-bethelhem'); // Default active authenticated user
    }
  }

  public subscribe(listener: MessagingEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyLocalListeners(type: string, payload: any) {
    this.listeners.forEach((listener) => {
      try {
        listener({ type, payload });
      } catch (err) {
        console.error('Messaging listener error:', err);
      }
    });
  }

  private broadcast(type: string, payload: any) {
    this.notifyLocalListeners(type, payload);
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type, payload });
      } catch (e) {
        // BroadcastChannel post error ignored
      }
    }
  }

  public getUsers(): ChatUser[] {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_CHAT_USERS;
    } catch {
      return INITIAL_CHAT_USERS;
    }
  }

  public getCurrentUser(): ChatUser {
    const users = this.getUsers();
    const currentId = localStorage.getItem(CURRENT_USER_KEY) || 'usr-bethelhem';
    return users.find((u) => u.id === currentId) || users[0];
  }

  public setCurrentUser(userId: string): ChatUser {
    localStorage.setItem(CURRENT_USER_KEY, userId);
    const user = this.getCurrentUser();
    this.broadcast('USER_SWITCHED', { user });
    return user;
  }

  public getUserById(userId: string): ChatUser | undefined {
    return this.getUsers().find((u) => u.id === userId);
  }

  public getConversations(currentUserId?: string): Conversation[] {
    try {
      const uId = currentUserId || this.getCurrentUser().id;
      const data = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      const convs: Conversation[] = data ? JSON.parse(data) : INITIAL_CONVERSATIONS;
      return convs
        .filter((c) => c.participantIds.includes(uId))
        .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    } catch {
      return [];
    }
  }

  public getMessages(conversationId: string): ChatMessage[] {
    try {
      const data = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const msgs: ChatMessage[] = data ? JSON.parse(data) : INITIAL_MESSAGES;
      return msgs.filter((m) => m.conversationId === conversationId);
    } catch {
      return [];
    }
  }

  public getUnreadCount(currentUserId?: string): number {
    const uId = currentUserId || this.getCurrentUser().id;
    const convs = this.getConversations(uId);
    return convs.reduce((acc, c) => acc + (c.unreadCount[uId] || 0), 0);
  }

  public getOrCreateConversation(otherUserId: string): Conversation {
    const currentUser = this.getCurrentUser();
    const convs = this.getAllConversations();
    
    // Check if conversation already exists
    const existing = convs.find(
      (c) =>
        c.participantIds.includes(currentUser.id) &&
        c.participantIds.includes(otherUserId) &&
        c.participantIds.length === 2
    );

    if (existing) return existing;

    const newConv: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      participantIds: [currentUser.id, otherUserId],
      lastMessageText: 'Started conversation',
      lastMessageAt: new Date().toISOString(),
      unreadCount: {
        [currentUser.id]: 0,
        [otherUserId]: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedConvs = [newConv, ...convs];
    localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(updatedConvs));
    this.broadcast('CONVERSATION_CREATED', { conversation: newConv });
    return newConv;
  }

  private getAllConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  }

  private getAllMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(MESSAGES_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  }

  /**
   * Generates realistic Cisco Packet Tracer network hops between two campus users
   */
  public generatePacketRoute(sourceUser: ChatUser, destUser: ChatUser): NetworkPacketHop[] {
    const isSameCampus = sourceUser.campus === destUser.campus;
    const sourceCampusName = sourceUser.campus.includes('Main') ? 'Main Campus' : sourceUser.campus;
    const destCampusName = destUser.campus.includes('Main') ? 'Main Campus' : destUser.campus;

    const hops: NetworkPacketHop[] = [];

    // Hop 1: Source Workstation
    hops.push({
      nodeId: `src-host-${sourceUser.id}`,
      nodeName: `${sourceUser.name} (Host)`,
      nodeType: 'host',
      campus: sourceCampusName,
      action: `Encapsulate TCP Chat Payload (Port 8443) -> Gateway ARP Resolve`,
      layerDetails: {
        layer2: `Src MAC: ${sourceUser.macAddress} | Dst MAC: Gateway MLS`,
        layer3: `Src IP: ${sourceUser.ipAddress} | Dst IP: ${destUser.ipAddress}`,
        layer4: `Protocol: TCP | Port: 8443 (TLS Encrypted Messaging)`,
        status: 'forwarded'
      }
    });

    // Hop 2: Campus Access Switch
    hops.push({
      nodeId: `src-sw-acc-${sourceUser.vlan}`,
      nodeName: `C1-SW-Access (VLAN ${sourceUser.vlan})`,
      nodeType: 'switch',
      campus: sourceCampusName,
      action: `802.1Q VLAN Tagging & FastEthernet Trunk Forwarding`,
      layerDetails: {
        layer2: `802.1Q Tag: VLAN ${sourceUser.vlan} | Port-channel 1 (LACP)`,
        layer3: `Pass-through Layer 2 Switching`,
        layer4: `TCP Stream Synchronized`,
        status: 'forwarded'
      }
    });

    // Hop 3: Campus Distribution Multi-Layer Switch (MLS)
    hops.push({
      nodeId: `src-mls-dist-1`,
      nodeName: `C1-MLS-Dist (OSPF Area 0)`,
      nodeType: 'router',
      campus: sourceCampusName,
      action: `Inter-VLAN Routing & OSPF Cost Metric Calculation (Area 0)`,
      layerDetails: {
        layer2: `Decapsulate 802.1Q Tag -> Route Lookup in FIB`,
        layer3: `Routing Table: 10.0.0.0/8 via 10.10.0.1 OSPF Area 0`,
        layer4: `TTL: 128 -> 127`,
        status: 'routed'
      }
    });

    // Hop 4: Security Inspection (Cisco ASA 5506-X Firewall)
    hops.push({
      nodeId: `core-asa-5506x`,
      nodeName: `C1-ASA-5506X Security Gateway`,
      nodeType: 'firewall',
      campus: 'Core NOC / Security Tier',
      action: `Stateful Packet Inspection & Cryptographic Security ACL Evaluation`,
      layerDetails: {
        layer2: `Inside Interface -> Outside Interface Inspection`,
        layer3: `ACL PERMIT: ip ${sourceUser.ipAddress} -> ${destUser.ipAddress}`,
        layer4: `State: ESTABLISHED | Threat Engine: CLEAN (0 Anomalies)`,
        status: 'inspected'
      }
    });

    if (!isSameCampus) {
      // Inter-Campus Site-to-Site IPSec VPN Tunnel hop
      hops.push({
        nodeId: `wan-ipsec-tunnel`,
        nodeName: `Site-to-Site IPSec VPN Tunnel (Gig0/0/0)`,
        nodeType: 'router',
        campus: 'Inter-Campus Backbone Link',
        action: `IPSec ESP Encapsulation (AES-256 GCM / SHA-384 / DH Group 14)`,
        layerDetails: {
          layer2: `WAN HDLC / Ethernet Frame Over Dark Fiber Link`,
          layer3: `Tunnel Endpoints: 172.16.20.1 <-> 172.16.20.2`,
          layer4: `ESP Payload Encrypted | SPI: 0x7F8B1290`,
          status: 'routed'
        }
      });

      // Destination Campus MLS
      hops.push({
        nodeId: `dst-mls-dist`,
        nodeName: `Dest-MLS-Dist (${destCampusName})`,
        nodeType: 'router',
        campus: destCampusName,
        action: `Decapsulate IPSec Tunnel & Route to Local Access Switch`,
        layerDetails: {
          layer2: `Rewrite Dst MAC to ${destUser.macAddress}`,
          layer3: `Direct Subnet Delivery: VLAN ${destUser.vlan}`,
          layer4: `TCP ACK Verification`,
          status: 'routed'
        }
      });
    }

    // Final Hop: Destination Host
    hops.push({
      nodeId: `dst-host-${destUser.id}`,
      nodeName: `${destUser.name} (Recipient)`,
      nodeType: 'host',
      campus: destCampusName,
      action: `Packet Accepted & Rendered in End-User Secure Inbox`,
      layerDetails: {
        layer2: `Dst MAC Matched (${destUser.macAddress})`,
        layer3: `Dst IP Matched (${destUser.ipAddress})`,
        layer4: `Application Layer Socket Delivered (Port 8443)`,
        status: 'delivered'
      }
    });

    return hops;
  }

  /**
   * Send a new message with simulation flow and realistic delivery state
   */
  public async sendMessage(
    recipientId: string,
    text: string,
    onHopProgress?: (currentHop: number, totalHops: number, hop: NetworkPacketHop) => void
  ): Promise<ChatMessage> {
    const sender = this.getCurrentUser();
    const recipient = this.getUserById(recipientId);
    
    if (!recipient) {
      throw new Error('Recipient not found or unauthorized');
    }
    if (!text.trim()) {
      throw new Error('Message cannot be empty');
    }

    const conversation = this.getOrCreateConversation(recipientId);
    const packetRoute = this.generatePacketRoute(sender, recipient);

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newMessage: ChatMessage = {
      id: messageId,
      conversationId: conversation.id,
      senderId: sender.id,
      recipientId: recipient.id,
      messageText: text.trim(),
      status: 'sending',
      createdAt: new Date().toISOString(),
      packetRoute
    };

    // Save initial sending state
    const allMsgs = this.getAllMessages();
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify([...allMsgs, newMessage]));
    
    // Update conversation snippet
    this.updateConversationSnippet(conversation.id, newMessage.messageText, newMessage.createdAt, recipient.id);
    this.broadcast('MESSAGE_SENT_START', { message: newMessage });

    // Step through packet hops if progress handler provided (or simulate fast delivery)
    if (onHopProgress) {
      for (let i = 0; i < packetRoute.length; i++) {
        onHopProgress(i, packetRoute.length, packetRoute[i]);
        await new Promise((r) => setTimeout(r, 450));
      }
    } else {
      await new Promise((r) => setTimeout(r, 200));
    }

    // Update status to 'delivered'
    newMessage.status = 'delivered';
    newMessage.deliveredAt = new Date().toISOString();

    const updatedMsgs = this.getAllMessages().map((m) =>
      m.id === messageId ? newMessage : m
    );
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMsgs));

    this.broadcast('MESSAGE_DELIVERED', { message: newMessage });
    return newMessage;
  }

  public markConversationAsRead(conversationId: string) {
    const currentUser = this.getCurrentUser();
    const allConvs = this.getAllConversations();
    let convChanged = false;

    const updatedConvs = allConvs.map((c) => {
      if (c.id === conversationId && c.unreadCount[currentUser.id] > 0) {
        convChanged = true;
        return {
          ...c,
          unreadCount: {
            ...c.unreadCount,
            [currentUser.id]: 0
          }
        };
      }
      return c;
    });

    if (convChanged) {
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(updatedConvs));
    }

    // Mark messages as read
    const allMsgs = this.getAllMessages();
    let msgsChanged = false;
    const updatedMsgs = allMsgs.map((m) => {
      if (m.conversationId === conversationId && m.recipientId === currentUser.id && m.status !== 'read') {
        msgsChanged = true;
        return {
          ...m,
          status: 'read' as MessageStatus,
          readAt: new Date().toISOString()
        };
      }
      return m;
    });

    if (msgsChanged) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMsgs));
    }

    if (convChanged || msgsChanged) {
      this.broadcast('CONVERSATION_READ', { conversationId, userId: currentUser.id });
    }
  }

  private updateConversationSnippet(conversationId: string, text: string, timestamp: string, recipientId: string) {
    const allConvs = this.getAllConversations();
    const updated = allConvs.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessageText: text,
          lastMessageAt: timestamp,
          updatedAt: timestamp,
          unreadCount: {
            ...c.unreadCount,
            [recipientId]: (c.unreadCount[recipientId] || 0) + 1
          }
        };
      }
      return c;
    });
    localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(updated));
  }
}

export const messagingService = new MessagingService();
