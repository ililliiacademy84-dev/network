/**
 * Types for Haramaya University End-User Messaging & Packet Tracer Simulation Flow
 */

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  role: string;
  campus: string;
  department: string;
  ipAddress: string;
  macAddress: string;
  vlan: number;
  avatar: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  lastSeen?: string;
}

export interface NetworkPacketHop {
  nodeId: string;
  nodeName: string;
  nodeType: 'host' | 'switch' | 'router' | 'firewall';
  campus: string;
  action: string;
  layerDetails: {
    layer2: string;
    layer3: string;
    layer4: string;
    status: 'forwarded' | 'inspected' | 'routed' | 'delivered';
  };
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  messageText: string;
  status: MessageStatus;
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
  packetRoute?: NetworkPacketHop[];
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageText: string;
  lastMessageAt: string;
  unreadCount: { [userId: string]: number };
  createdAt: string;
  updatedAt: string;
}

export interface PacketSimulationState {
  isActive: boolean;
  messageId: string;
  sourceUser: ChatUser;
  destUser: ChatUser;
  currentHopIndex: number;
  hops: NetworkPacketHop[];
  isCompleted: boolean;
}
