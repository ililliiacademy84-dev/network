import { ChatUser, Conversation, ChatMessage } from '../types/messaging';

export const INITIAL_CHAT_USERS: ChatUser[] = [
  {
    id: 'usr-bethelhem',
    name: 'Eng. Bethelhem Tadesse',
    email: 'bethelhem.t@haramaya.edu.et',
    role: 'Senior Network Security Analyst',
    campus: 'Main Campus (Bati)',
    department: 'NOC / SOC Operations Center',
    ipAddress: '10.10.30.15',
    macAddress: '00E0.F73A.B101',
    vlan: 30,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: 'usr-alemayehu',
    name: 'Dr. Alemayehu Worku',
    email: 'alemayehu.w@haramaya.edu.et',
    role: 'Director of ICT & Infrastructure',
    campus: 'Main Campus (Bati)',
    department: 'ICT Directorate',
    ipAddress: '10.10.10.5',
    macAddress: '00E0.F73A.A001',
    vlan: 10,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: 'usr-girma',
    name: 'Prof. Girma Kebede',
    email: 'girma.k@hit.haramaya.edu.et',
    role: 'Dean & CCNA Instructor',
    campus: 'HiT Tech Campus',
    department: 'Electrical & Computer Engineering',
    ipAddress: '10.20.10.22',
    macAddress: '00E0.F73A.C202',
    vlan: 10,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: 'usr-selamawit',
    name: 'Eng. Selamawit Desta',
    email: 'selamawit.d@cvm.haramaya.edu.et',
    role: 'Campus Network Engineer',
    campus: 'CVM Campus',
    department: 'CVM IT Systems Unit',
    ipAddress: '10.30.10.8',
    macAddress: '00E0.F73A.D303',
    vlan: 10,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    lastSeen: 'Active now'
  },
  {
    id: 'usr-yohannes',
    name: 'Dr. Yohannes Haile',
    email: 'yohannes.h@harar.haramaya.edu.et',
    role: 'Chief Medical Information Officer',
    campus: 'Harar Campus',
    department: 'HFSUH Hospital Informatics',
    ipAddress: '10.40.30.12',
    macAddress: '00E0.F73A.E404',
    vlan: 30,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    status: 'away',
    lastSeen: '10m ago'
  },
  {
    id: 'usr-henok',
    name: 'Henok Bekele',
    email: 'henok.b@student.haramaya.edu.et',
    role: 'Senior Software & Cisco Student',
    campus: 'Main Campus (Bati)',
    department: 'College of Computing & Informatics',
    ipAddress: '10.10.20.45',
    macAddress: '00E0.F73A.F505',
    vlan: 20,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    lastSeen: 'Active now'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: ['usr-bethelhem', 'usr-girma'],
    lastMessageText: 'The OSPF Area 0 neighbor relationship between Main Core and HiT Distribution is stabilized at 10.20.0.1.',
    lastMessageAt: '2026-09-28T08:50:00.000Z',
    unreadCount: {
      'usr-bethelhem': 0,
      'usr-girma': 1
    },
    createdAt: '2026-09-28T08:00:00.000Z',
    updatedAt: '2026-09-28T08:50:00.000Z'
  },
  {
    id: 'conv-2',
    participantIds: ['usr-bethelhem', 'usr-alemayehu'],
    lastMessageText: 'ASA 5506-X inspection rules for the DMZ Web Server (172.16.10.6) are deployed and passing security checks.',
    lastMessageAt: '2026-09-28T08:42:00.000Z',
    unreadCount: {
      'usr-bethelhem': 0,
      'usr-alemayehu': 0
    },
    createdAt: '2026-09-28T07:30:00.000Z',
    updatedAt: '2026-09-28T08:42:00.000Z'
  },
  {
    id: 'conv-3',
    participantIds: ['usr-bethelhem', 'usr-selamawit'],
    lastMessageText: 'Site-to-Site IPSec VPN tunnel for CVM Campus is active with AES-256 GCM encryption.',
    lastMessageAt: '2026-09-28T08:15:00.000Z',
    unreadCount: {
      'usr-bethelhem': 0,
      'usr-selamawit': 0
    },
    createdAt: '2026-09-28T07:10:00.000Z',
    updatedAt: '2026-09-28T08:15:00.000Z'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-101',
    conversationId: 'conv-1',
    senderId: 'usr-girma',
    recipientId: 'usr-bethelhem',
    messageText: 'Eng. Bethelhem, can you verify the EtherChannel configuration on HiT-SW-Access-1?',
    status: 'read',
    createdAt: '2026-09-28T08:45:00.000Z',
    deliveredAt: '2026-09-28T08:45:02.000Z',
    readAt: '2026-09-28T08:46:10.000Z'
  },
  {
    id: 'msg-102',
    conversationId: 'conv-1',
    senderId: 'usr-bethelhem',
    recipientId: 'usr-girma',
    messageText: 'The OSPF Area 0 neighbor relationship between Main Core and HiT Distribution is stabilized at 10.20.0.1.',
    status: 'delivered',
    createdAt: '2026-09-28T08:50:00.000Z',
    deliveredAt: '2026-09-28T08:50:03.000Z'
  },
  {
    id: 'msg-201',
    conversationId: 'conv-2',
    senderId: 'usr-alemayehu',
    recipientId: 'usr-bethelhem',
    messageText: 'Please send the latest security report for the academic portal and DMZ servers.',
    status: 'read',
    createdAt: '2026-09-28T08:35:00.000Z',
    deliveredAt: '2026-09-28T08:35:01.000Z',
    readAt: '2026-09-28T08:36:00.000Z'
  },
  {
    id: 'msg-202',
    conversationId: 'conv-2',
    senderId: 'usr-bethelhem',
    recipientId: 'usr-alemayehu',
    messageText: 'ASA 5506-X inspection rules for the DMZ Web Server (172.16.10.6) are deployed and passing security checks.',
    status: 'read',
    createdAt: '2026-09-28T08:42:00.000Z',
    deliveredAt: '2026-09-28T08:42:02.000Z',
    readAt: '2026-09-28T08:43:10.000Z'
  }
];
