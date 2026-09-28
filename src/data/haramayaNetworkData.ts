/**
 * Haramaya University Network Specification & Topology Dataset
 * 4 Campuses: Main Campus (Bati), HiT Campus, Veterinary (CVM), and Harar Campus
 * Verified university faculties & logical three-tier architecture
 */

import { 
  NetworkDevice, 
  NetworkLink, 
  VlanInfo, 
  DnsRecord, 
  MailMessage, 
  FtpFile, 
  SyslogEntry, 
  FirewallRule, 
  VpnTunnel,
  SecurityEvent,
  EducationalLab
} from '../types/network';

import { 
  COLLEGE_ACCESS_SWITCHES, 
  DEPARTMENT_WORKSTATIONS, 
  COLLEGE_NETWORK_LINKS 
} from './haramayaCollegeDevices';

// ─── 15 ENTERPRISE VLANS ─────────────────────────────────────────────────────
export const HARAMAYA_ENTERPRISE_VLANS: VlanInfo[] = [
  { id: 10, name: 'ADMIN', subnet: '10.10.10.0/24', subnetMask: '255.255.255.0', gateway: '10.10.10.1', campus: 'main', description: 'Central Administration, Deans, Finance & Registrars', dhcpPoolName: 'HU_ADMIN_POOL' },
  { id: 20, name: 'FACULTY', subnet: '10.10.20.0/24', subnetMask: '255.255.255.0', gateway: '10.10.20.1', campus: 'main', description: 'Professors, Academic Staff & Department Offices', dhcpPoolName: 'HU_FACULTY_POOL' },
  { id: 30, name: 'STUDENT', subnet: '10.10.30.0/24', subnetMask: '255.255.255.0', gateway: '10.10.30.1', campus: 'main', description: 'Undergraduate & Graduate Student Labs & Wi-Fi', dhcpPoolName: 'HU_STUDENT_POOL' },
  { id: 40, name: 'RESEARCH', subnet: '10.10.40.0/24', subnetMask: '255.255.255.0', gateway: '10.10.40.1', campus: 'main', description: 'Research Directorates, Agro-ecology & Computing Labs', dhcpPoolName: 'HU_RESEARCH_POOL' },
  { id: 50, name: 'LIBRARY', subnet: '10.10.50.0/24', subnetMask: '255.255.255.0', gateway: '10.10.50.1', campus: 'main', description: 'Central E-Library, Digital Repositories & Catalog Stations', dhcpPoolName: 'HU_LIBRARY_POOL' },
  { id: 60, name: 'ICT', subnet: '10.10.60.0/24', subnetMask: '255.255.255.0', gateway: '10.10.60.1', campus: 'main', description: 'ICT Infrastructure Directorate & Systems Operations', dhcpPoolName: 'HU_ICT_POOL' },
  { id: 70, name: 'SERVER', subnet: '10.10.70.0/24', subnetMask: '255.255.255.0', gateway: '10.10.70.1', campus: 'main', description: 'Internal Campus Enterprise Application & Database Servers', dhcpPoolName: 'HU_SERVER_POOL' },
  { id: 80, name: 'VOICE', subnet: '10.10.80.0/24', subnetMask: '255.255.255.0', gateway: '10.10.80.1', campus: 'main', description: 'Cisco CallManager Express VoIP Telephony VLAN', dhcpPoolName: 'HU_VOICE_POOL' },
  { id: 90, name: 'CCTV', subnet: '10.10.90.0/24', subnetMask: '255.255.255.0', gateway: '10.10.90.1', campus: 'main', description: 'Campus Physical Security Surveillance & Video Network', dhcpPoolName: 'HU_CCTV_POOL' },
  { id: 100, name: 'IOT', subnet: '10.10.100.0/24', subnetMask: '255.255.255.0', gateway: '10.10.100.1', campus: 'main', description: 'Smart Campus Sensors, Microcontrollers & Actuators', dhcpPoolName: 'HU_IOT_POOL' },
  { id: 110, name: 'GUEST', subnet: '10.10.110.0/24', subnetMask: '255.255.255.0', gateway: '10.10.110.1', campus: 'main', description: 'Isolated Captive Portal Wi-Fi for Campus Visitors', dhcpPoolName: 'HU_GUEST_POOL' },
  { id: 120, name: 'MANAGEMENT', subnet: '10.10.120.0/24', subnetMask: '255.255.255.0', gateway: '10.10.120.1', campus: 'main', description: 'Out-of-Band Switch/Router SSH Management & Syslog', dhcpPoolName: 'HU_MGMT_POOL' },
  { id: 130, name: 'SECURITY', subnet: '10.10.130.0/24', subnetMask: '255.255.255.0', gateway: '10.10.130.1', campus: 'main', description: 'Biometric Access Control & Guard Post Gateways', dhcpPoolName: 'HU_SEC_POOL' },
  { id: 140, name: 'LAB', subnet: '10.10.140.0/24', subnetMask: '255.255.255.0', gateway: '10.10.140.1', campus: 'main', description: 'Hardware, Embedded Systems & Engineering Laboratories', dhcpPoolName: 'HU_LAB_POOL' },
  { id: 150, name: 'DMZ', subnet: '10.10.150.0/24', subnetMask: '255.255.255.0', gateway: '10.10.150.1', campus: 'main', description: 'Demilitarized Zone for Public Web, Mail, DNS & FTP', dhcpPoolName: 'HU_DMZ_POOL' }
];

// ─── HARAMAYA REAL BUILDING PROFILES ──────────────────────────────────────────
export const HARAMAYA_BUILDINGS = [
  {
    id: 'bldg-admin',
    name: 'Senate & Central Administration Building',
    campus: 'main',
    location: 'Haramaya Main Campus, Central Quad',
    blocks: 'Block 01 & 02',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80',
    description: 'Houses President Office, Academic Vice-President, Registrar Directorate, and Central Data Center.'
  },
  {
    id: 'bldg-cci',
    name: 'College of Computing & Informatics Complex',
    campus: 'main',
    location: 'Haramaya Main Campus, Science Zone',
    blocks: 'Block 24, 25 & 26',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80',
    description: 'High-performance computer science laboratories, Cisco Academy lab, and Software Engineering incubation center.'
  },
  {
    id: 'bldg-hit',
    name: 'Haramaya Institute of Technology (HiT)',
    campus: 'hit',
    location: 'HiT Engineering Campus, West Wing',
    blocks: 'HiT Complex A-D',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    description: 'Home to Electrical & Computer Engineering, Mechanical, Civil, and IoT Research Workshops.'
  },
  {
    id: 'bldg-cvm',
    name: 'College of Veterinary Medicine & Animal Hospital',
    campus: 'cvm',
    location: 'Veterinary Campus, North Boundary',
    blocks: 'CVM Clinical Blocks 1-4',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80',
    description: 'Veterinary Teaching Hospital, Pathology Labs, Animal Diagnostics, and Clinical Telemedicine.'
  },
  {
    id: 'bldg-harar',
    name: 'College of Health & Medical Sciences (CHMS)',
    campus: 'harar',
    location: 'Harar City Campus, HiOT Facility',
    blocks: 'HiOT Medical Complex',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    description: 'HiOT Specialized Hospital, Medical School, Anatomy labs, and Telehealth operations connecting to Main Campus.'
  }
];

// ─── MULTI-CAMPUS COMPLETE NETWORK DEVICES ───────────────────────────────────
const BASE_NETWORK_DEVICES: NetworkDevice[] = [
  // ── WAN / ISP INFRASTRUCTURE ──
  {
    id: 'isp-router',
    name: 'EthioTelecom-ISP',
    hostname: 'ETHIO-TELECOM-GATEWAY',
    model: 'Cisco ISR4331',
    type: 'router',
    layer: 'outside',
    campus: 'wan',
    building: 'Telecom Central Office',
    x: 600,
    y: 50,
    power: true,
    managementIp: '10.100.1.1',
    interfaces: [
      { name: 'Gi0/0/0', ip: '10.100.1.1', subnetMask: '255.255.255.252', mac: '0001.9678.A001', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi0/0/1', ip: '10.100.2.1', subnetMask: '255.255.255.252', mac: '0001.9678.A002', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi0/0/2', ip: '10.100.3.1', subnetMask: '255.255.255.252', mac: '0001.9678.A003', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi0/0/3', ip: '10.100.4.1', subnetMask: '255.255.255.252', mac: '0001.9678.A004', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' }
    ],
    notes: 'Public ISP core backbone interconnecting all 4 Haramaya University campuses with BGP & Static routing.'
  },

  // ── CAMPUS 1: MAIN CAMPUS (HARAMAYA / BATI) ──
  {
    id: 'c1-asa1',
    name: 'HU-MAIN-ASA1',
    hostname: 'HU-Main-ASA5506-Primary',
    model: 'Cisco ASA 5506-X',
    type: 'firewall',
    layer: 'outside',
    campus: 'main',
    building: 'Central Administration Building',
    x: 420,
    y: 130,
    power: true,
    managementIp: '10.100.1.2',
    interfaces: [
      { name: 'Gi1/1 (OUTSIDE)', ip: '10.100.1.2', subnetMask: '255.255.255.252', mac: '0050.0F20.1001', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/2 (DMZ)', ip: '10.10.150.1', subnetMask: '255.255.255.0', mac: '0050.0F20.1002', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/3 (INSIDE1)', ip: '10.10.0.50', subnetMask: '255.255.255.252', mac: '0050.0F20.1003', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/4 (INSIDE2)', ip: '10.10.0.58', subnetMask: '255.255.255.252', mac: '0050.0F20.1004', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' }
    ],
    notes: 'Primary Edge Firewall. Stateful packet inspection, NAT, and crypto map for Site-to-Site IPSec VPN.'
  },
  {
    id: 'c1-dmz-router',
    name: 'HU-MAIN-DMZ',
    hostname: 'HU-Main-DMZ-Router',
    model: 'Cisco ISR4331',
    type: 'router',
    layer: 'dmz',
    campus: 'main',
    building: 'Central Data Center',
    x: 220,
    y: 130,
    power: true,
    managementIp: '10.10.150.1',
    gateway: '10.100.1.2',
    interfaces: [
      { name: 'Gi0/0/0', ip: '10.10.150.1', subnetMask: '255.255.255.0', mac: '0060.7011.0001', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi0/0/1', ip: '10.10.150.254', subnetMask: '255.255.255.252', mac: '0060.7011.0002', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'c1-cs1',
    name: 'HU-MAIN-CS1',
    hostname: 'HU-Main-CoreSwitch1',
    model: 'Cisco Catalyst WS-C3650-24PS',
    type: 'switch_l3',
    layer: 'core',
    campus: 'main',
    building: 'Central Data Center',
    x: 420,
    y: 220,
    power: true,
    managementIp: '10.10.0.1',
    interfaces: [
      { name: 'Po1', ip: '10.10.0.1', subnetMask: '255.255.255.240', mac: '0002.1680.0001', status: 'up', adminStatus: 'up', type: 'PortChannel', speed: '10Gbps', duplex: 'full' },
      { name: 'Po2', ip: '10.10.0.17', subnetMask: '255.255.255.248', mac: '0002.1680.0002', status: 'up', adminStatus: 'up', type: 'PortChannel', speed: '10Gbps', duplex: 'full' },
      { name: 'Gi1/0/1', ip: '10.10.0.49', subnetMask: '255.255.255.252', mac: '0002.1680.0003', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'c1-ds1',
    name: 'HU-MAIN-DS1',
    hostname: 'HU-Main-DistSwitch1',
    model: 'Cisco Catalyst WS-C3650-24PS',
    type: 'switch_l3',
    layer: 'distribution',
    campus: 'main',
    building: 'Central Administration Building',
    x: 420,
    y: 300,
    power: true,
    managementIp: '10.10.1.1',
    interfaces: [
      { name: 'Po1', ip: '10.10.1.1', subnetMask: '255.255.255.248', mac: '0003.3650.0001', status: 'up', adminStatus: 'up', type: 'PortChannel', speed: '10Gbps', duplex: 'full' },
      { name: 'Po2', ip: '10.10.0.18', subnetMask: '255.255.255.248', mac: '0003.3650.0002', status: 'up', adminStatus: 'up', type: 'PortChannel', speed: '10Gbps', duplex: 'full' },
      { name: 'Gi1/0/1', mac: '0003.3650.0010', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/0/2', mac: '0003.3650.0011', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'c1-voip',
    name: 'HU-MAIN-VOIP',
    hostname: 'HU-Main-CME-VoIP',
    model: 'Cisco 2811',
    type: 'router',
    layer: 'voip',
    campus: 'main',
    building: 'Central Data Center',
    x: 580,
    y: 300,
    power: true,
    managementIp: '10.10.80.254',
    interfaces: [
      { name: 'Fa0/0', ip: '10.10.80.254', subnetMask: '255.255.255.0', mac: '0009.7C11.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }
    ]
  },

  // ── MAIN CAMPUS ACCESS SWITCHES ──
  {
    id: 'c1-sw-admin',
    name: 'SW-MAIN-ADMIN',
    hostname: 'HU-Main-AccSW-Admin',
    model: 'Cisco Catalyst 2960-24TT',
    type: 'switch_l2',
    layer: 'access',
    campus: 'main',
    vlan: 10,
    department: 'Central Administration',
    building: 'Senate & Central Administration Building',
    x: 280,
    y: 400,
    power: true,
    interfaces: [
      { name: 'Fa0/1', vlan: 10, mac: '00D0.FF01.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Fa0/2', vlan: 10, mac: '00D0.FF01.0002', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Fa0/3', vlan: 80, mac: '00D0.FF01.0003', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Fa0/10', vlan: 100, mac: '00D0.FF01.0010', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Gi0/1', mac: '00D0.FF01.0020', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'c1-sw-cci',
    name: 'SW-MAIN-CCI',
    hostname: 'HU-Main-AccSW-CCI',
    model: 'Cisco Catalyst 2960-24TT',
    type: 'switch_l2',
    layer: 'access',
    campus: 'main',
    vlan: 30,
    department: 'Computing & Informatics',
    building: 'College of Computing & Informatics Complex',
    x: 420,
    y: 400,
    power: true,
    interfaces: [
      { name: 'Fa0/1', vlan: 30, mac: '00D0.FF02.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Fa0/2', vlan: 140, mac: '00D0.FF02.0002', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Gi0/1', mac: '00D0.FF02.0020', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'c1-sw-lib',
    name: 'SW-MAIN-LIB',
    hostname: 'HU-Main-AccSW-Library',
    model: 'Cisco Catalyst 2960-24TT',
    type: 'switch_l2',
    layer: 'access',
    campus: 'main',
    vlan: 50,
    department: 'Central Library',
    building: 'Central Library & Learning Resource Center',
    x: 540,
    y: 400,
    power: true,
    interfaces: [
      { name: 'Fa0/1', vlan: 50, mac: '00D0.FF03.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Gi0/1', mac: '00D0.FF03.0020', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ]
  },

  // ── MAIN CAMPUS DMZ SERVERS ──
  {
    id: 'c1-dns',
    name: 'HU-DNS',
    hostname: 'dns.haramaya.edu.et',
    model: 'Cisco Server-PT',
    type: 'server',
    layer: 'dmz',
    campus: 'main',
    building: 'Central Data Center',
    x: 80,
    y: 80,
    power: true,
    managementIp: '10.10.150.4',
    gateway: '10.10.150.1',
    dnsServer: '10.10.150.4',
    interfaces: [{ name: 'FastEthernet0', ip: '10.10.150.4', subnetMask: '255.255.255.0', mac: '0001.64A1.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },
  {
    id: 'c1-web',
    name: 'HU-WEB',
    hostname: 'www.haramaya.edu.et',
    model: 'Cisco Server-PT',
    type: 'server',
    layer: 'dmz',
    campus: 'main',
    building: 'Central Data Center',
    x: 80,
    y: 150,
    power: true,
    managementIp: '10.10.150.6',
    gateway: '10.10.150.1',
    dnsServer: '10.10.150.4',
    interfaces: [{ name: 'FastEthernet0', ip: '10.10.150.6', subnetMask: '255.255.255.0', mac: '0001.64A1.0003', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },
  {
    id: 'c1-dhcp',
    name: 'HU-DHCP',
    hostname: 'dhcp.haramaya.edu.et',
    model: 'Cisco Server-PT',
    type: 'server',
    layer: 'dmz',
    campus: 'main',
    building: 'Central Data Center',
    x: 80,
    y: 220,
    power: true,
    managementIp: '10.10.150.5',
    gateway: '10.10.150.1',
    dnsServer: '10.10.150.4',
    interfaces: [{ name: 'FastEthernet0', ip: '10.10.150.5', subnetMask: '255.255.255.0', mac: '0001.64A1.0002', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },
  {
    id: 'c1-mail',
    name: 'HU-MAIL',
    hostname: 'mail.haramaya.edu.et',
    model: 'Cisco Server-PT',
    type: 'server',
    layer: 'dmz',
    campus: 'main',
    building: 'Central Data Center',
    x: 80,
    y: 290,
    power: true,
    managementIp: '10.10.150.7',
    gateway: '10.10.150.1',
    dnsServer: '10.10.150.4',
    interfaces: [{ name: 'FastEthernet0', ip: '10.10.150.7', subnetMask: '255.255.255.0', mac: '0001.64A1.0004', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },

  // ── MAIN CAMPUS WORKSTATIONS & IOT ──
  {
    id: 'c1-pc-admin1',
    name: 'PC-ADMIN-01',
    hostname: 'HU-Admin-Workstation-1',
    model: 'PC-PT',
    type: 'pc',
    layer: 'end',
    campus: 'main',
    vlan: 10,
    department: 'Administration',
    building: 'Senate & Central Administration Building',
    x: 240,
    y: 490,
    power: true,
    managementIp: '10.10.10.25',
    gateway: '10.10.10.1',
    dnsServer: '10.10.150.4',
    interfaces: [{ name: 'FastEthernet0', ip: '10.10.10.25', subnetMask: '255.255.255.0', mac: '00E0.F725.1001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },
  {
    id: 'c1-pc-cci',
    name: 'PC-CCI-LAB01',
    hostname: 'HU-CCI-LabPC-01',
    model: 'PC-PT',
    type: 'pc',
    layer: 'end',
    campus: 'main',
    vlan: 30,
    department: 'Computing & Informatics',
    building: 'College of Computing & Informatics Complex',
    x: 400,
    y: 490,
    power: true,
    managementIp: '10.10.30.50',
    gateway: '10.10.30.1',
    dnsServer: '10.10.150.4',
    interfaces: [{ name: 'FastEthernet0', ip: '10.10.30.50', subnetMask: '255.255.255.0', mac: '00E0.F725.1002', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },
  {
    id: 'c1-phone-1001',
    name: 'IP-PHONE-1001',
    hostname: 'HU-IPPhone-Main-Admin',
    model: 'Cisco 7960 IP Phone',
    type: 'ip_phone',
    layer: 'voip',
    campus: 'main',
    vlan: 80,
    department: 'Admin',
    building: 'Senate & Central Administration Building',
    x: 290,
    y: 560,
    power: true,
    managementIp: '10.10.80.101',
    gateway: '10.10.80.1',
    interfaces: [{ name: 'Fa0/1', ip: '10.10.80.101', subnetMask: '255.255.255.0', mac: '000B.BE11.1001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }],
    notes: 'Configured extension: 1001 (Main Campus President Office).'
  },
  {
    id: 'c1-iot-mcu',
    name: 'MCU-MAIN-01',
    hostname: 'HU-SmartCampus-MCU',
    model: 'MCU-PT',
    type: 'iot_sensor',
    layer: 'iot',
    campus: 'main',
    vlan: 100,
    department: 'ICT Directorate',
    building: 'Senate & Central Administration Building',
    x: 160,
    y: 400,
    power: true,
    managementIp: '10.10.100.100',
    gateway: '10.10.100.1',
    interfaces: [{ name: 'Fa0', ip: '10.10.100.100', subnetMask: '255.255.255.0', mac: '0060.4701.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },

  // ── CAMPUS 2: HARAMAYA INSTITUTE OF TECHNOLOGY (HiT) ──
  {
    id: 'hit-core',
    name: 'HU-HIT-CORE',
    hostname: 'HU-HiT-CoreRouter',
    model: 'Cisco Catalyst WS-C3650-24PS',
    type: 'switch_l3',
    layer: 'core',
    campus: 'hit',
    building: 'Haramaya Institute of Technology (HiT)',
    x: 850,
    y: 130,
    power: true,
    managementIp: '10.20.0.1',
    interfaces: [
      { name: 'Gi1/0/1', ip: '10.100.2.2', subnetMask: '255.255.255.252', mac: '0002.1691.0001', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/0/2', ip: '10.20.0.1', subnetMask: '255.255.255.0', mac: '0002.1691.0002', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/0/3', mac: '0002.1691.0003', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/0/4', mac: '0002.1691.0004', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ],
    notes: 'HiT Core Switch terminating IPSec VPN to Main Campus.'
  },
  {
    id: 'hit-sw-cyber',
    name: 'SW-HIT-CYBER',
    hostname: 'HU-HiT-CyberLab-SW',
    model: 'Cisco Catalyst 2960-24TT',
    type: 'switch_l2',
    layer: 'access',
    campus: 'hit',
    vlan: 40,
    department: 'Cybersecurity Lab',
    building: 'Haramaya Institute of Technology (HiT)',
    x: 780,
    y: 240,
    power: true,
    interfaces: [
      { name: 'Fa0/1', vlan: 40, mac: '00D0.FF11.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Fa0/2', vlan: 80, mac: '00D0.FF11.0002', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Gi0/1', mac: '00D0.FF11.0020', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'hit-sw-iot',
    name: 'SW-HIT-IOT',
    hostname: 'HU-HiT-Robotics-SW',
    model: 'Cisco Catalyst 2960-24TT',
    type: 'switch_l2',
    layer: 'access',
    campus: 'hit',
    vlan: 100,
    department: 'IoT & Embedded Robotics',
    building: 'Haramaya Institute of Technology (HiT)',
    x: 920,
    y: 240,
    power: true,
    interfaces: [
      { name: 'Fa0/1', vlan: 30, mac: '00D0.FF12.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Fa0/10', vlan: 100, mac: '00D0.FF12.0010', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Gi0/1', mac: '00D0.FF12.0020', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'hit-pc-cyber',
    name: 'PC-HIT-CYBER01',
    hostname: 'HU-HiT-CyberWorkstation',
    model: 'PC-PT',
    type: 'pc',
    layer: 'end',
    campus: 'hit',
    vlan: 40,
    department: 'Cybersecurity',
    building: 'Haramaya Institute of Technology (HiT)',
    x: 780,
    y: 350,
    power: true,
    managementIp: '10.20.40.15',
    gateway: '10.20.40.1',
    dnsServer: '10.10.150.4',
    interfaces: [{ name: 'FastEthernet0', ip: '10.20.40.15', subnetMask: '255.255.255.0', mac: '00E0.F725.2001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },
  {
    id: 'hit-phone-2001',
    name: 'IP-PHONE-2001',
    hostname: 'HU-IPPhone-HiT-Dean',
    model: 'Cisco 7960 IP Phone',
    type: 'ip_phone',
    layer: 'voip',
    campus: 'hit',
    vlan: 80,
    department: 'Engineering Dean',
    building: 'Haramaya Institute of Technology (HiT)',
    x: 780,
    y: 440,
    power: true,
    managementIp: '10.20.80.102',
    gateway: '10.20.80.1',
    interfaces: [{ name: 'Fa0/1', ip: '10.20.80.102', subnetMask: '255.255.255.0', mac: '000B.BE11.2001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }],
    notes: 'Configured extension: 2001 (HiT Engineering Dean Desk).'
  },
  {
    id: 'hit-pc-eng',
    name: 'PC-HIT-ENG01',
    hostname: 'HU-HiT-CAD-Station',
    model: 'PC-PT',
    type: 'pc',
    layer: 'end',
    campus: 'hit',
    vlan: 30,
    department: 'Engineering Workshops',
    building: 'Haramaya Institute of Technology (HiT)',
    x: 920,
    y: 350,
    power: true,
    managementIp: '10.20.30.55',
    gateway: '10.20.30.1',
    dnsServer: '10.10.150.4',
    interfaces: [{ name: 'FastEthernet0', ip: '10.20.30.55', subnetMask: '255.255.255.0', mac: '00E0.F725.2002', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },
  {
    id: 'hit-iot-mcu',
    name: 'MCU-HIT-01',
    hostname: 'HU-HiT-Robotics-MCU',
    model: 'MCU-PT',
    type: 'iot_actuator',
    layer: 'iot',
    campus: 'hit',
    vlan: 100,
    department: 'HiT Robotics & IoT Lab',
    building: 'Haramaya Institute of Technology (HiT)',
    x: 920,
    y: 440,
    power: true,
    managementIp: '10.20.100.10',
    gateway: '10.20.100.1',
    interfaces: [{ name: 'Fa0', ip: '10.20.100.10', subnetMask: '255.255.255.0', mac: '0060.4702.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },

  // ── CAMPUS 3: COLLEGE OF VETERINARY MEDICINE (CVM) ──
  {
    id: 'cvm-core',
    name: 'HU-CVM-CORE',
    hostname: 'HU-CVM-CoreRouter',
    model: 'Cisco Catalyst WS-C3650-24PS',
    type: 'switch_l3',
    layer: 'core',
    campus: 'cvm',
    building: 'College of Veterinary Medicine & Animal Hospital',
    x: 1160,
    y: 130,
    power: true,
    managementIp: '10.30.0.1',
    interfaces: [
      { name: 'Gi1/0/1', ip: '10.100.3.2', subnetMask: '255.255.255.252', mac: '0002.1692.0001', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/0/2', ip: '10.30.0.1', subnetMask: '255.255.255.0', mac: '0002.1692.0002', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/0/3', mac: '0002.1692.0003', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/0/4', mac: '0002.1692.0004', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'cvm-sw-hosp',
    name: 'SW-CVM-HOSP',
    hostname: 'HU-CVM-Hospital-SW',
    model: 'Cisco Catalyst 2960-24TT',
    type: 'switch_l2',
    layer: 'access',
    campus: 'cvm',
    vlan: 140,
    department: 'Veterinary Teaching Hospital',
    building: 'College of Veterinary Medicine & Animal Hospital',
    x: 1090,
    y: 240,
    power: true,
    interfaces: [
      { name: 'Fa0/1', vlan: 140, mac: '00D0.FF21.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Fa0/2', vlan: 80, mac: '00D0.FF21.0002', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Gi0/1', mac: '00D0.FF21.0020', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'cvm-sw-pathology',
    name: 'SW-CVM-PATH',
    hostname: 'HU-CVM-Pathology-SW',
    model: 'Cisco Catalyst 2960-24TT',
    type: 'switch_l2',
    layer: 'access',
    campus: 'cvm',
    vlan: 40,
    department: 'Pathology & Diagnostic Laboratory',
    building: 'College of Veterinary Medicine & Animal Hospital',
    x: 1230,
    y: 240,
    power: true,
    interfaces: [
      { name: 'Fa0/1', vlan: 40, mac: '00D0.FF22.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Fa0/10', vlan: 100, mac: '00D0.FF22.0010', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Gi0/1', mac: '00D0.FF22.0020', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'cvm-pc-clinic',
    name: 'PC-CVM-CLINIC01',
    hostname: 'HU-CVM-ClinicalWorkstation',
    model: 'PC-PT',
    type: 'pc',
    layer: 'end',
    campus: 'cvm',
    vlan: 140,
    department: 'Veterinary Clinic',
    building: 'College of Veterinary Medicine & Animal Hospital',
    x: 1090,
    y: 350,
    power: true,
    managementIp: '10.30.140.20',
    gateway: '10.30.140.1',
    dnsServer: '10.10.150.4',
    interfaces: [{ name: 'FastEthernet0', ip: '10.30.140.20', subnetMask: '255.255.255.0', mac: '00E0.F725.3001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },
  {
    id: 'cvm-phone-3001',
    name: 'IP-PHONE-3001',
    hostname: 'HU-IPPhone-CVM-Hospital',
    model: 'Cisco 7960 IP Phone',
    type: 'ip_phone',
    layer: 'voip',
    campus: 'cvm',
    vlan: 80,
    department: 'Veterinary Hospital',
    building: 'College of Veterinary Medicine & Animal Hospital',
    x: 1090,
    y: 440,
    power: true,
    managementIp: '10.30.80.103',
    gateway: '10.30.80.1',
    interfaces: [{ name: 'Fa0/1', ip: '10.30.80.103', subnetMask: '255.255.255.0', mac: '000B.BE11.3001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }],
    notes: 'Configured extension: 3001 (Veterinary Emergency Clinic).'
  },
  {
    id: 'cvm-pc-pathology',
    name: 'PC-CVM-PATH01',
    hostname: 'HU-CVM-Pathology-Station',
    model: 'PC-PT',
    type: 'pc',
    layer: 'end',
    campus: 'cvm',
    vlan: 40,
    department: 'Diagnostic Pathology',
    building: 'College of Veterinary Medicine & Animal Hospital',
    x: 1230,
    y: 350,
    power: true,
    managementIp: '10.30.40.35',
    gateway: '10.30.40.1',
    dnsServer: '10.10.150.4',
    interfaces: [{ name: 'FastEthernet0', ip: '10.30.40.35', subnetMask: '255.255.255.0', mac: '00E0.F725.3002', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },
  {
    id: 'cvm-iot-cold',
    name: 'IOT-CVM-COLD',
    hostname: 'HU-CVM-Vaccine-ColdChain',
    model: 'MCU-PT',
    type: 'iot_sensor',
    layer: 'iot',
    campus: 'cvm',
    vlan: 100,
    department: 'Veterinary Pharmacy & Vaccines',
    building: 'College of Veterinary Medicine & Animal Hospital',
    x: 1230,
    y: 440,
    power: true,
    managementIp: '10.30.100.25',
    gateway: '10.30.100.1',
    interfaces: [{ name: 'Fa0', ip: '10.30.100.25', subnetMask: '255.255.255.0', mac: '0060.4703.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }],
    notes: 'Vaccine storage temperature monitor alert threshold: 2°C - 8°C.'
  },

  // ── CAMPUS 4: HARAR CAMPUS (HEALTH & MEDICAL SCIENCES - CHMS) ──
  {
    id: 'harar-asa1',
    name: 'HU-HARAR-ASA1',
    hostname: 'HU-Harar-ASA5506',
    model: 'Cisco ASA 5506-X',
    type: 'firewall',
    layer: 'outside',
    campus: 'harar',
    building: 'College of Health & Medical Sciences (CHMS)',
    x: 1480,
    y: 130,
    power: true,
    managementIp: '10.100.4.2',
    interfaces: [
      { name: 'Gi1/1 (OUTSIDE)', ip: '10.100.4.2', subnetMask: '255.255.255.252', mac: '0050.0F20.4001', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/2 (INSIDE)', ip: '10.40.0.1', subnetMask: '255.255.255.0', mac: '0050.0F20.4002', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' }
    ],
    notes: 'Harar Campus Edge Firewall with IPsec VPN tunnel peer with HU-MAIN-ASA1.'
  },
  {
    id: 'harar-cs1',
    name: 'HU-HARAR-CS1',
    hostname: 'HU-Harar-CoreSwitch1',
    model: 'Cisco Catalyst WS-C3650-24PS',
    type: 'switch_l3',
    layer: 'core',
    campus: 'harar',
    building: 'College of Health & Medical Sciences (CHMS)',
    x: 1480,
    y: 220,
    power: true,
    managementIp: '10.40.0.1',
    interfaces: [
      { name: 'Gi1/0/1', ip: '10.40.0.1', subnetMask: '255.255.255.0', mac: '0002.1693.0001', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/0/2', mac: '0002.1693.0002', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' },
      { name: 'Gi1/0/3', mac: '0002.1693.0003', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'harar-sw-hosp',
    name: 'SW-HARAR-HOSP',
    hostname: 'HU-Harar-Hospital-SW',
    model: 'Cisco Catalyst 2960-24TT',
    type: 'switch_l2',
    layer: 'access',
    campus: 'harar',
    vlan: 30,
    department: 'Hiwot Fana Comprehensive Specialized University Hospital',
    building: 'College of Health & Medical Sciences (CHMS)',
    x: 1410,
    y: 310,
    power: true,
    interfaces: [
      { name: 'Fa0/1', vlan: 30, mac: '00D0.FF31.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Fa0/2', vlan: 80, mac: '00D0.FF31.0002', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Gi0/1', mac: '00D0.FF31.0020', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'harar-sw-med',
    name: 'SW-HARAR-MED',
    hostname: 'HU-Harar-Telehealth-SW',
    model: 'Cisco Catalyst 2960-24TT',
    type: 'switch_l2',
    layer: 'access',
    campus: 'harar',
    vlan: 40,
    department: 'Medical School & Telehealth EHR',
    building: 'College of Health & Medical Sciences (CHMS)',
    x: 1550,
    y: 310,
    power: true,
    interfaces: [
      { name: 'Fa0/1', vlan: 40, mac: '00D0.FF32.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Fa0/10', vlan: 130, mac: '00D0.FF32.0010', status: 'up', adminStatus: 'up', type: 'FastEthernet', mode: 'access', speed: '100Mbps', duplex: 'full' },
      { name: 'Gi0/1', mac: '00D0.FF32.0020', status: 'up', adminStatus: 'up', type: 'GigabitEthernet', mode: 'trunk', speed: '1Gbps', duplex: 'full' }
    ]
  },
  {
    id: 'harar-pc-med',
    name: 'PC-HARAR-MED01',
    hostname: 'HU-Harar-DoctorPC',
    model: 'PC-PT',
    type: 'pc',
    layer: 'end',
    campus: 'harar',
    vlan: 30,
    department: 'Hiwot Fana Hospital Clinical Care',
    building: 'College of Health & Medical Sciences (CHMS)',
    x: 1410,
    y: 410,
    power: true,
    managementIp: '10.40.30.22',
    gateway: '10.40.30.1',
    dnsServer: '10.10.150.4',
    interfaces: [{ name: 'FastEthernet0', ip: '10.40.30.22', subnetMask: '255.255.255.0', mac: '00E0.F725.4001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }]
  },
  {
    id: 'harar-phone-4001',
    name: 'IP-PHONE-4001',
    hostname: 'HU-IPPhone-Harar-Dean',
    model: 'Cisco 7960 IP Phone',
    type: 'ip_phone',
    layer: 'voip',
    campus: 'harar',
    vlan: 80,
    department: 'Medical Dean Desk',
    building: 'College of Health & Medical Sciences (CHMS)',
    x: 1410,
    y: 500,
    power: true,
    managementIp: '10.40.80.104',
    gateway: '10.40.80.1',
    interfaces: [{ name: 'Fa0/1', ip: '10.40.80.104', subnetMask: '255.255.255.0', mac: '000B.BE11.4001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }],
    notes: 'Configured extension: 4001 (Harar Medical Dean Desk).'
  },
  {
    id: 'harar-pc-telemed',
    name: 'PC-HARAR-PACS',
    hostname: 'HU-Harar-TelemedStation',
    model: 'PC-PT',
    type: 'pc',
    layer: 'end',
    campus: 'harar',
    vlan: 40,
    department: 'Telehealth & PACS Radiology',
    building: 'College of Health & Medical Sciences (CHMS)',
    x: 1550,
    y: 410,
    power: true,
    managementIp: '10.40.40.80',
    gateway: '10.40.40.1',
    dnsServer: '10.10.150.4',
    interfaces: [{ name: 'FastEthernet0', ip: '10.40.40.80', subnetMask: '255.255.255.0', mac: '00E0.F725.4002', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }],
    notes: 'Tele-consultation station linking to Main Campus specialist consultants via IPSec VPN.'
  },
  {
    id: 'harar-iot-rfid',
    name: 'RFID-HARAR-ICU',
    hostname: 'HU-Harar-SmartGate',
    model: 'MCU-PT',
    type: 'iot_actuator',
    layer: 'iot',
    campus: 'harar',
    vlan: 130,
    department: 'HFSUH ICU & Surgery Access Control',
    building: 'College of Health & Medical Sciences (CHMS)',
    x: 1550,
    y: 500,
    power: true,
    managementIp: '10.40.130.50',
    gateway: '10.40.130.1',
    interfaces: [{ name: 'Fa0', ip: '10.40.130.50', subnetMask: '255.255.255.0', mac: '0060.4704.0001', status: 'up', adminStatus: 'up', type: 'FastEthernet', speed: '100Mbps', duplex: 'full' }],
    notes: 'HFSUH ICU Smart Access RFID barrier control.'
  }
];

// Merge base devices and all 11 colleges with 60 department workstations
const deviceMap = new Map<string, NetworkDevice>();
[...BASE_NETWORK_DEVICES, ...COLLEGE_ACCESS_SWITCHES, ...DEPARTMENT_WORKSTATIONS].forEach((dev) =>
  deviceMap.set(dev.id, dev)
);
export const COMPLETE_NETWORK_DEVICES: NetworkDevice[] = Array.from(deviceMap.values());

// ─── COMPLETE NETWORK LINKS ──────────────────────────────────────────────────
const BASE_NETWORK_LINKS: NetworkLink[] = [
  // ISP WAN Interconnects
  { id: 'link-isp-main', fromDeviceId: 'isp-router', fromPort: 'Gi0/0/0', toDeviceId: 'c1-asa1', toPort: 'Gi1/1 (OUTSIDE)', type: 'fiber', bandwidth: '1 Gbps', status: 'up', latencyMs: 2 },
  { id: 'link-isp-hit', fromDeviceId: 'isp-router', fromPort: 'Gi0/0/1', toDeviceId: 'hit-core', toPort: 'Gi1/0/1', type: 'fiber', bandwidth: '1 Gbps', status: 'up', latencyMs: 4 },
  { id: 'link-isp-cvm', fromDeviceId: 'isp-router', fromPort: 'Gi0/0/2', toDeviceId: 'cvm-core', toPort: 'Gi1/0/1', type: 'fiber', bandwidth: '1 Gbps', status: 'up', latencyMs: 5 },
  { id: 'link-isp-harar', fromDeviceId: 'isp-router', fromPort: 'Gi0/0/3', toDeviceId: 'harar-asa1', toPort: 'Gi1/1 (OUTSIDE)', type: 'fiber', bandwidth: '1 Gbps', status: 'up', latencyMs: 14 },

  // Site-to-Site IPSec VPN Tunnels
  { id: 'vpn-main-hit', fromDeviceId: 'c1-asa1', fromPort: 'IPSec Tunnel 1', toDeviceId: 'hit-core', toPort: 'IPSec Tunnel', type: 'vpn', bandwidth: 'AES-256 / SHA-256', status: 'up', latencyMs: 6 },
  { id: 'vpn-main-cvm', fromDeviceId: 'c1-asa1', fromPort: 'IPSec Tunnel 2', toDeviceId: 'cvm-core', toPort: 'IPSec Tunnel', type: 'vpn', bandwidth: 'AES-256 / SHA-256', status: 'up', latencyMs: 8 },
  { id: 'vpn-main-harar', fromDeviceId: 'c1-asa1', fromPort: 'IPSec Tunnel 3', toDeviceId: 'harar-asa1', toPort: 'IPSec Tunnel', type: 'vpn', bandwidth: 'AES-256 / SHA-256', status: 'up', latencyMs: 18 },

  // Main Campus Internal Infrastructure
  { id: 'link-c1-asa-dmz', fromDeviceId: 'c1-asa1', fromPort: 'Gi1/2 (DMZ)', toDeviceId: 'c1-dmz-router', toPort: 'Gi0/0/0', type: 'copper', bandwidth: '1 Gbps', status: 'up' },
  { id: 'link-c1-asa-cs1', fromDeviceId: 'c1-asa1', fromPort: 'Gi1/3 (INSIDE1)', toDeviceId: 'c1-cs1', toPort: 'Gi1/0/1', type: 'copper', bandwidth: '1 Gbps', status: 'up' },
  { id: 'link-c1-cs1-ds1', fromDeviceId: 'c1-cs1', fromPort: 'Po2', toDeviceId: 'c1-ds1', toPort: 'Po2', type: 'fiber', bandwidth: '10 Gbps', status: 'up' },
  { id: 'link-c1-ds1-voip', fromDeviceId: 'c1-ds1', fromPort: 'Gi1/0/20', toDeviceId: 'c1-voip', toPort: 'Fa0/0', type: 'copper', bandwidth: '1 Gbps', status: 'up' },
  { id: 'link-c1-ds1-admin', fromDeviceId: 'c1-ds1', fromPort: 'Gi1/0/1', toDeviceId: 'c1-sw-admin', toPort: 'Gi0/1', type: 'copper', bandwidth: '1 Gbps', status: 'up' },
  { id: 'link-c1-ds1-cci', fromDeviceId: 'c1-ds1', fromPort: 'Gi1/0/2', toDeviceId: 'c1-sw-cci', toPort: 'Gi0/1', type: 'copper', bandwidth: '1 Gbps', status: 'up' },
  { id: 'link-c1-ds1-lib', fromDeviceId: 'c1-ds1', fromPort: 'Gi1/0/3', toDeviceId: 'c1-sw-lib', toPort: 'Gi0/1', type: 'copper', bandwidth: '1 Gbps', status: 'up' },

  // Main Campus DMZ Servers
  { id: 'link-dmz-dns', fromDeviceId: 'c1-dmz-router', fromPort: 'Fa0/1', toDeviceId: 'c1-dns', toPort: 'FastEthernet0', type: 'copper', status: 'up' },
  { id: 'link-dmz-web', fromDeviceId: 'c1-dmz-router', fromPort: 'Fa0/2', toDeviceId: 'c1-web', toPort: 'FastEthernet0', type: 'copper', status: 'up' },
  { id: 'link-dmz-dhcp', fromDeviceId: 'c1-dmz-router', fromPort: 'Fa0/3', toDeviceId: 'c1-dhcp', toPort: 'FastEthernet0', type: 'copper', status: 'up' },
  { id: 'link-dmz-mail', fromDeviceId: 'c1-dmz-router', fromPort: 'Fa0/4', toDeviceId: 'c1-mail', toPort: 'FastEthernet0', type: 'copper', status: 'up' },

  // Main Campus Workstations & IoT
  { id: 'link-admin-pc', fromDeviceId: 'c1-sw-admin', fromPort: 'Fa0/1', toDeviceId: 'c1-pc-admin1', toPort: 'FastEthernet0', type: 'copper', status: 'up' },
  { id: 'link-admin-phone', fromDeviceId: 'c1-sw-admin', fromPort: 'Fa0/3', toDeviceId: 'c1-phone-1001', toPort: 'Fa0/1', type: 'copper', status: 'up' },
  { id: 'link-admin-mcu', fromDeviceId: 'c1-sw-admin', fromPort: 'Fa0/10', toDeviceId: 'c1-iot-mcu', toPort: 'Fa0', type: 'copper', status: 'up' },
  { id: 'link-cci-pc', fromDeviceId: 'c1-sw-cci', fromPort: 'Fa0/1', toDeviceId: 'c1-pc-cci', toPort: 'FastEthernet0', type: 'copper', status: 'up' },

  // HiT Campus Links
  { id: 'link-hit-core-cyber', fromDeviceId: 'hit-core', fromPort: 'Gi1/0/3', toDeviceId: 'hit-sw-cyber', toPort: 'Gi0/1', type: 'fiber', bandwidth: '1 Gbps', status: 'up' },
  { id: 'link-hit-core-iot', fromDeviceId: 'hit-core', fromPort: 'Gi1/0/4', toDeviceId: 'hit-sw-iot', toPort: 'Gi0/1', type: 'fiber', bandwidth: '1 Gbps', status: 'up' },
  { id: 'link-hit-sw-pc', fromDeviceId: 'hit-sw-cyber', fromPort: 'Fa0/1', toDeviceId: 'hit-pc-cyber', toPort: 'FastEthernet0', type: 'copper', status: 'up' },
  { id: 'link-hit-sw-phone', fromDeviceId: 'hit-sw-cyber', fromPort: 'Fa0/2', toDeviceId: 'hit-phone-2001', toPort: 'Fa0/1', type: 'copper', status: 'up' },
  { id: 'link-hit-sw-eng', fromDeviceId: 'hit-sw-iot', fromPort: 'Fa0/1', toDeviceId: 'hit-pc-eng', toPort: 'FastEthernet0', type: 'copper', status: 'up' },
  { id: 'link-hit-sw-mcu', fromDeviceId: 'hit-sw-iot', fromPort: 'Fa0/10', toDeviceId: 'hit-iot-mcu', toPort: 'Fa0', type: 'copper', status: 'up' },

  // CVM Campus Links
  { id: 'link-cvm-core-hosp', fromDeviceId: 'cvm-core', fromPort: 'Gi1/0/3', toDeviceId: 'cvm-sw-hosp', toPort: 'Gi0/1', type: 'fiber', bandwidth: '1 Gbps', status: 'up' },
  { id: 'link-cvm-core-path', fromDeviceId: 'cvm-core', fromPort: 'Gi1/0/4', toDeviceId: 'cvm-sw-pathology', toPort: 'Gi0/1', type: 'fiber', bandwidth: '1 Gbps', status: 'up' },
  { id: 'link-cvm-sw-pc', fromDeviceId: 'cvm-sw-hosp', fromPort: 'Fa0/1', toDeviceId: 'cvm-pc-clinic', toPort: 'FastEthernet0', type: 'copper', status: 'up' },
  { id: 'link-cvm-sw-phone', fromDeviceId: 'cvm-sw-hosp', fromPort: 'Fa0/2', toDeviceId: 'cvm-phone-3001', toPort: 'Fa0/1', type: 'copper', status: 'up' },
  { id: 'link-cvm-sw-pathpc', fromDeviceId: 'cvm-sw-pathology', fromPort: 'Fa0/1', toDeviceId: 'cvm-pc-pathology', toPort: 'FastEthernet0', type: 'copper', status: 'up' },
  { id: 'link-cvm-sw-cold', fromDeviceId: 'cvm-sw-pathology', fromPort: 'Fa0/10', toDeviceId: 'cvm-iot-cold', toPort: 'Fa0', type: 'copper', status: 'up' },

  // Harar Campus Links
  { id: 'link-harar-asa-cs', fromDeviceId: 'harar-asa1', fromPort: 'Gi1/2 (INSIDE)', toDeviceId: 'harar-cs1', toPort: 'Gi1/0/1', type: 'copper', bandwidth: '1 Gbps', status: 'up' },
  { id: 'link-harar-cs-sw', fromDeviceId: 'harar-cs1', fromPort: 'Gi1/0/2', toDeviceId: 'harar-sw-hosp', toPort: 'Gi0/1', type: 'copper', bandwidth: '1 Gbps', status: 'up' },
  { id: 'link-harar-cs-med', fromDeviceId: 'harar-cs1', fromPort: 'Gi1/0/3', toDeviceId: 'harar-sw-med', toPort: 'Gi0/1', type: 'copper', bandwidth: '1 Gbps', status: 'up' },
  { id: 'link-harar-sw-pc', fromDeviceId: 'harar-sw-hosp', fromPort: 'Fa0/1', toDeviceId: 'harar-pc-med', toPort: 'FastEthernet0', type: 'copper', status: 'up' },
  { id: 'link-harar-sw-phone', fromDeviceId: 'harar-sw-hosp', fromPort: 'Fa0/2', toDeviceId: 'harar-phone-4001', toPort: 'Fa0/1', type: 'copper', status: 'up' },
  { id: 'link-harar-sw-telemed', fromDeviceId: 'harar-sw-med', fromPort: 'Fa0/1', toDeviceId: 'harar-pc-telemed', toPort: 'FastEthernet0', type: 'copper', status: 'up' },
  { id: 'link-harar-sw-rfid', fromDeviceId: 'harar-sw-med', fromPort: 'Fa0/10', toDeviceId: 'harar-iot-rfid', toPort: 'Fa0', type: 'copper', status: 'up' }
];

// Merge base links and all 11 college distribution & department access links
const linkMap = new Map<string, NetworkLink>();
[...BASE_NETWORK_LINKS, ...COLLEGE_NETWORK_LINKS].forEach((l) => linkMap.set(l.id, l));
export const COMPLETE_NETWORK_LINKS: NetworkLink[] = Array.from(linkMap.values());

// ─── FIREWALL RULES ──────────────────────────────────────────────────────────
export const INITIAL_FIREWALL_RULES: FirewallRule[] = [
  { id: 'fw-01', name: 'ALLOW_HTTPS_TO_DMZ_WEB', sourceZone: 'outside', destZone: 'dmz', sourceIp: 'any', destIp: '10.10.150.6', protocol: 'TCP', port: '443', action: 'allow', enabled: true, hits: 1420 },
  { id: 'fw-02', name: 'ALLOW_HTTP_TO_DMZ_WEB', sourceZone: 'outside', destZone: 'dmz', sourceIp: 'any', destIp: '10.10.150.6', protocol: 'TCP', port: '80', action: 'allow', enabled: true, hits: 890 },
  { id: 'fw-03', name: 'ALLOW_DNS_QUERIES', sourceZone: 'outside', destZone: 'dmz', sourceIp: 'any', destIp: '10.10.150.4', protocol: 'UDP', port: '53', action: 'allow', enabled: true, hits: 4510 },
  { id: 'fw-04', name: 'ALLOW_SMTP_MAIL_EXCHANGE', sourceZone: 'outside', destZone: 'dmz', sourceIp: 'any', destIp: '10.10.150.7', protocol: 'TCP', port: '25', action: 'allow', enabled: true, hits: 620 },
  { id: 'fw-05', name: 'ALLOW_INTER_CAMPUS_VPN_ESP', sourceZone: 'outside', destZone: 'inside', sourceIp: '10.100.0.0/16', destIp: '10.10.0.0/16', protocol: 'ESP', port: 'any', action: 'allow', enabled: true, hits: 8790 },
  { id: 'fw-06', name: 'DENY_STUDENT_TO_MGMT', sourceZone: 'inside', destZone: 'inside', sourceIp: '10.10.30.0/24', destIp: '10.10.120.0/24', protocol: 'IP', port: 'any', action: 'deny', enabled: true, hits: 114 },
  { id: 'fw-07', name: 'ALLOW_ICT_TO_MGMT', sourceZone: 'inside', destZone: 'inside', sourceIp: '10.10.60.0/24', destIp: '10.10.120.0/24', protocol: 'TCP', port: '22', action: 'allow', enabled: true, hits: 340 },
  { id: 'fw-08', name: 'DROP_UNAUTHORIZED_PORT_SCANS', sourceZone: 'outside', destZone: 'any', sourceIp: 'any', destIp: 'any', protocol: 'TCP', port: '23,445,3389', action: 'deny', enabled: true, hits: 5210 }
];

// ─── VPN TUNNELS ─────────────────────────────────────────────────────────────
export const INITIAL_VPN_TUNNELS: VpnTunnel[] = [
  {
    id: 'vpn-main-harar',
    name: 'MAIN-HARAR-IPSEC-TUNNEL',
    localEndpoint: '10.100.1.2 (Main ASA)',
    remoteEndpoint: '10.100.4.2 (Harar ASA)',
    localSubnet: '10.10.0.0/16',
    remoteSubnet: '10.40.0.0/16',
    encryption: 'AES-256',
    hash: 'SHA-256',
    pfsGroup: 'Group 14',
    status: 'up',
    pktsEncrypted: 4820,
    pktsDecrypted: 4790,
    uptimeSeconds: 84210
  },
  {
    id: 'vpn-main-hit',
    name: 'MAIN-HIT-IPSEC-TUNNEL',
    localEndpoint: '10.100.1.2 (Main ASA)',
    remoteEndpoint: '10.100.2.2 (HiT Core)',
    localSubnet: '10.10.0.0/16',
    remoteSubnet: '10.20.0.0/16',
    encryption: 'AES-256',
    hash: 'SHA-256',
    pfsGroup: 'Group 14',
    status: 'up',
    pktsEncrypted: 11200,
    pktsDecrypted: 10980,
    uptimeSeconds: 124500
  },
  {
    id: 'vpn-main-cvm',
    name: 'MAIN-CVM-IPSEC-TUNNEL',
    localEndpoint: '10.100.1.2 (Main ASA)',
    remoteEndpoint: '10.100.3.2 (CVM Core)',
    localSubnet: '10.10.0.0/16',
    remoteSubnet: '10.30.0.0/16',
    encryption: 'AES-256',
    hash: 'SHA-256',
    pfsGroup: 'Group 14',
    status: 'up',
    pktsEncrypted: 3120,
    pktsDecrypted: 3050,
    uptimeSeconds: 61200
  }
];

// ─── SECURITY OPERATIONS CENTER ALERTS ───────────────────────────────────────
export const INITIAL_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'sec-01',
    timestamp: '09:42:18',
    severity: 'HIGH',
    sourceIp: '198.51.100.45',
    destIp: '10.10.150.6 (HU-WEB)',
    type: 'PORT_SCAN',
    description: 'Rapid TCP SYN connection attempts across ports 1-1024 detected at HU-MAIN-ASA1.',
    actionTaken: 'BLOCKED',
    remediation: 'IP address automatically banned on Edge ASA firewall for 24 hours.'
  },
  {
    id: 'sec-02',
    timestamp: '09:35:10',
    severity: 'MEDIUM',
    sourceIp: '10.10.30.50 (PC-CCI-LAB01)',
    destIp: '10.10.120.1 (HU-MGMT-SW)',
    type: 'UNAUTHORIZED_VLAN',
    description: 'Student VLAN 30 client attempted SSH connection to Management VLAN 120.',
    actionTaken: 'BLOCKED',
    remediation: 'Blocked by Distribution Switch ACL rule ACL-DIST-10-DENY.'
  },
  {
    id: 'sec-03',
    timestamp: '09:12:05',
    severity: 'CRITICAL',
    sourceIp: '203.0.113.88',
    destIp: '10.10.150.7 (HU-MAIL)',
    type: 'BRUTE_FORCE',
    description: 'Exceeded 20 failed SMTP authentication attempts in 60 seconds.',
    actionTaken: 'BLOCKED',
    remediation: 'Mail daemon rate-limiting tripped; source blacklisted in Postfix access map.'
  }
];

// ─── 12 INTERACTIVE EDUCATIONAL LABS ─────────────────────────────────────────
export const HARAMAYA_EDUCATIONAL_LABS: EducationalLab[] = [
  {
    id: 'lab-01',
    title: 'Lab 01: Enterprise VLAN Creation & Port Assignment',
    category: 'VLAN',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    objective: 'Create VLAN 10 (ADMIN) and VLAN 30 (STUDENT) on SW-MAIN-ADMIN and configure access switchports.',
    instructions: [
      'Enter privileged mode using "enable" on SW-MAIN-ADMIN.',
      'Enter global configuration mode using "configure terminal".',
      'Create VLAN 10 with name ADMIN: "vlan 10", "name ADMIN".',
      'Create VLAN 30 with name STUDENT: "vlan 30", "name STUDENT".',
      'Assign interface FastEthernet0/1 to VLAN 10 in access mode.',
      'Verify with "show vlan brief".'
    ],
    tasks: [
      { id: 't1', description: 'Create VLAN 10 and VLAN 30', isCompleted: true, verificationKey: 'vlan_created' },
      { id: 't2', description: 'Configure Fa0/1 as switchport mode access', isCompleted: true, verificationKey: 'port_access' },
      { id: 't3', description: 'Assign Fa0/1 to VLAN 10', isCompleted: true, verificationKey: 'vlan_assigned' }
    ],
    hints: [
      'Use "switchport mode access" followed by "switchport access vlan 10".',
      'Check active assignments using "show vlan brief".'
    ],
    solution: `enable
configure terminal
vlan 10
 name ADMIN
vlan 30
 name STUDENT
exit
interface FastEthernet0/1
 switchport mode access
 switchport access vlan 10
 no shutdown
exit`
  },
  {
    id: 'lab-02',
    title: 'Lab 02: Inter-VLAN Routing with Catalyst 3650 Multilayer Switch',
    category: 'Routing',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    objective: 'Configure Switched Virtual Interfaces (SVIs) on HU-MAIN-DS1 to enable routing between Admin and Faculty VLANs.',
    instructions: [
      'Enable IP routing on the Layer 3 switch: "ip routing".',
      'Create interface Vlan 10 with IP 10.10.10.1 255.255.255.0.',
      'Create interface Vlan 20 with IP 10.10.20.1 255.255.255.0.',
      'Test connectivity between Admin and Faculty workstations.'
    ],
    tasks: [
      { id: 't1', description: 'Enable "ip routing" on distribution switch', isCompleted: true, verificationKey: 'ip_routing' },
      { id: 't2', description: 'Configure SVI for VLAN 10 and VLAN 20', isCompleted: true, verificationKey: 'svi_configured' },
      { id: 't3', description: 'Verify Inter-VLAN ping from PC-ADMIN-01 to 10.10.20.1', isCompleted: true, verificationKey: 'ping_success' }
    ],
    hints: [
      'Do not forget "no shutdown" inside the interface Vlan mode.',
      'Run "show ip interface brief" to verify SVI states are UP/UP.'
    ],
    solution: `enable
configure terminal
ip routing
interface Vlan10
 description Gateway for Administration
 ip address 10.10.10.1 255.255.255.0
 no shutdown
interface Vlan20
 description Gateway for Faculty
 ip address 10.10.20.1 255.255.255.0
 no shutdown
exit`
  },
  {
    id: 'lab-03',
    title: 'Lab 03: Multi-Campus OSPF Area 0 Dynamic Routing',
    category: 'Routing',
    difficulty: 'Intermediate',
    estimatedMinutes: 35,
    objective: 'Establish OSPF Process 1 in Area 0 across Main Campus Core and Distribution switches.',
    instructions: [
      'Enter router configuration mode: "router ospf 1".',
      'Set router-id to 1.1.1.1 on Core Switch 1.',
      'Advertise network 10.10.0.0 0.0.255.255 in area 0.',
      'Verify adjacency with "show ip ospf neighbor".'
    ],
    tasks: [
      { id: 't1', description: 'Initialize OSPF process 1', isCompleted: true, verificationKey: 'ospf_started' },
      { id: 't2', description: 'Set Router ID 1.1.1.1', isCompleted: true, verificationKey: 'router_id_set' },
      { id: 't3', description: 'Verify OSPF adjacency state FULL', isCompleted: true, verificationKey: 'ospf_full' }
    ],
    hints: ['Remember OSPF uses wildcard masks: 0.0.255.255 for a /16 prefix.'],
    solution: `enable
configure terminal
router ospf 1
 router-id 1.1.1.1
 network 10.10.0.0 0.0.255.255 area 0
 default-information originate
exit`
  },
  {
    id: 'lab-04',
    title: 'Lab 04: Extended Access Control Lists (ACL) Policy',
    category: 'Security',
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    objective: 'Implement an Access Control List on the Distribution Switch to isolate Student VLAN from Admin VLAN.',
    instructions: [
      'Create extended ACL 101: "access-list 101 deny ip 10.10.30.0 0.0.0.255 10.10.10.0 0.0.0.255".',
      'Permit all other campus traffic: "access-list 101 permit ip any any".',
      'Apply to interface Vlan 30 in inbound direction: "ip access-group 101 in".'
    ],
    tasks: [
      { id: 't1', description: 'Create ACL rule denying student traffic to Admin', isCompleted: true, verificationKey: 'acl_rule_created' },
      { id: 't2', description: 'Add permit any any statement', isCompleted: true, verificationKey: 'acl_permit_any' },
      { id: 't3', description: 'Apply ACL to interface Vlan 30', isCompleted: true, verificationKey: 'acl_applied' }
    ],
    hints: ['Always remember the implicit deny at the end of every Cisco ACL.'],
    solution: `enable
configure terminal
access-list 101 deny ip 10.10.30.0 0.0.0.255 10.10.10.0 0.0.0.255
access-list 101 permit ip any any
interface Vlan30
 ip access-group 101 in
exit`
  },
  {
    id: 'lab-08',
    title: 'Lab 08: Cisco ASA 5506-X Zone & DMZ Security Rules',
    category: 'Security',
    difficulty: 'Advanced',
    estimatedMinutes: 40,
    objective: 'Configure security levels and DMZ access policies on the Main Campus Edge ASA firewall.',
    instructions: [
      'Assign nameif outside1 with security-level 0 on Gi1/1.',
      'Assign nameif dmz with security-level 70 on Gi1/2.',
      'Assign nameif inside1 with security-level 100 on Gi1/3.',
      'Create access-list allowing HTTP/HTTPS to DMZ Web Server (10.10.150.6).'
    ],
    tasks: [
      { id: 't1', description: 'Configure ASA zone names and security levels', isCompleted: true, verificationKey: 'asa_zones' },
      { id: 't2', description: 'Create access-list for DMZ Web traffic', isCompleted: true, verificationKey: 'asa_acl' },
      { id: 't3', description: 'Attach access-group to outside interface', isCompleted: true, verificationKey: 'asa_group' }
    ],
    hints: ['Traffic by default can flow from higher to lower security level, but requires ACL to flow from lower to higher.'],
    solution: `enable
configure terminal
interface GigabitEthernet1/1
 nameif outside1
 security-level 0
 no shutdown
interface GigabitEthernet1/2
 nameif dmz
 security-level 70
 no shutdown
access-list OUTSIDE_TO_DMZ extended permit tcp any host 10.10.150.6 eq 443
access-group OUTSIDE_TO_DMZ in interface outside1
exit`
  },
  {
    id: 'lab-09',
    title: 'Lab 09: Site-to-Site IPSec VPN Tunnel (Main <-> Harar)',
    category: 'VPN',
    difficulty: 'Advanced',
    estimatedMinutes: 45,
    objective: 'Configure ISAKMP Phase 1 and IPsec Phase 2 to securely tunnel medical data between Main Campus and Harar Campus.',
    instructions: [
      'Define crypto transform-set: "crypto ipsec ikev1 transform-set ESP-AES256-SHA esp-aes 256 esp-sha-hmac".',
      'Create crypto map VPN_MAP_OUTSIDE1 with peer 10.100.4.2.',
      'Match interesting traffic ACL for subnets 10.10.0.0/16 and 10.40.0.0/16.',
      'Verify encryption with "show crypto ipsec sa".'
    ],
    tasks: [
      { id: 't1', description: 'Define Phase 2 Transform Set ESP-AES256-SHA', isCompleted: true, verificationKey: 'vpn_transform' },
      { id: 't2', description: 'Bind Crypto Map to outside interface', isCompleted: true, verificationKey: 'vpn_map_bound' },
      { id: 't3', description: 'Verify SA encryption counter increments', isCompleted: true, verificationKey: 'vpn_sa_up' }
    ],
    hints: ['Both peers must have perfectly symmetrical phase 1 and phase 2 proposals.'],
    solution: `enable
configure terminal
crypto ipsec ikev1 transform-set ESP-AES256-SHA esp-aes 256 esp-sha-hmac
crypto map VPN_MAP_OUTSIDE1 10 match address VPN_TRAFFIC
crypto map VPN_MAP_OUTSIDE1 10 set peer 10.100.4.2
crypto map VPN_MAP_OUTSIDE1 10 set ikev1 transform-set ESP-AES256-SHA
crypto map VPN_MAP_OUTSIDE1 interface outside1
exit`
  }
];

// ─── INITIAL DNS & MAIL RECORDS ──────────────────────────────────────────────
export const HARAMAYA_DNS_RECORDS: DnsRecord[] = [
  { domain: 'www.haramaya.edu.et', type: 'A', target: '10.10.150.6' },
  { domain: 'portal.haramaya.edu.et', type: 'CNAME', target: 'www.haramaya.edu.et' },
  { domain: 'hit.haramaya.edu.et', type: 'A', target: '10.20.150.6' },
  { domain: 'cvm.haramaya.edu.et', type: 'A', target: '10.30.150.6' },
  { domain: 'chms.haramaya.edu.et', type: 'A', target: '10.40.150.6' },
  { domain: 'mail.haramaya.edu.et', type: 'A', target: '10.10.150.7' },
  { domain: 'ftp.haramaya.edu.et', type: 'A', target: '10.10.150.10' },
  { domain: 'dns.haramaya.edu.et', type: 'A', target: '10.10.150.4' },
  { domain: 'ntp.haramaya.edu.et', type: 'A', target: '10.10.150.8' },
  { domain: 'syslog.haramaya.edu.et', type: 'A', target: '10.10.150.9' }
];

export const HARAMAYA_MAIL_MESSAGES: MailMessage[] = [
  {
    id: 'm1',
    from: 'president@haramaya.edu.et',
    to: 'ict.director@haramaya.edu.et',
    subject: 'Four-Campus Optical Backbone & VPN Commissioning',
    body: 'Dear ICT Directorate, We applaud the completion of the 10Gbps Core layer stack and the IPsec VPN tunnels connecting Main Campus, HiT, CVM, and Harar Campus. Please ensure VoIP dial-peers 1001, 2001, 3001, and 4001 are tested across all deans offices.',
    timestamp: '2026-09-28 08:30:15',
    read: true
  },
  {
    id: 'm2',
    from: 'dean.hit@haramaya.edu.et',
    to: 'ict.director@haramaya.edu.et',
    subject: 'HiT Cybersecurity Laboratory Dedicated VLAN 40 Request',
    body: 'The Haramaya Institute of Technology requests VLAN 40 routing rules to be permitted to reach DMZ FTP server 10.10.150.10 for student kernel and network packet capture submissions.',
    timestamp: '2026-09-28 09:14:22',
    read: false
  },
  {
    id: 'm3',
    from: 'dean.chms@haramaya.edu.et',
    to: 'ict.director@haramaya.edu.et',
    subject: 'Harar HiOT Hospital Telemedicine Stream Verification',
    body: 'Greetings from Harar Campus. The medical imaging stream to Main Campus over IPSec tunnel MAIN-HARAR-IPSEC-TUNNEL has sustained 0% packet loss during today clinical conference.',
    timestamp: '2026-09-28 10:02:44',
    read: true
  }
];

export const HARAMAYA_FTP_FILES: FtpFile[] = [
  { name: 'hu-network-blueprint.pkt', size: '5.2 MB', date: 'Sep 28 08:00', content: '[Haramaya University 4-Campus Three-Tier Packet Tracer Model]' },
  { name: 'c3650-universalk9-mz.152-4.E.bin', size: '340 MB', date: 'Aug 20 11:30', content: '[Cisco Catalyst 3650 IOS XE Enterprise Universal Image]' },
  { name: 'asa5506-k9-912.bin', size: '84 MB', date: 'Aug 22 14:15', content: '[Cisco ASA 5506-X FirePOWER System Software]' },
  { name: 'firewall-acl-export.cfg', size: '18 KB', date: 'Sep 28 09:45', content: 'access-list OUTSIDE_TO_DMZ extended permit tcp any host 10.10.150.6 eq 443' }
];

export const HARAMAYA_SYSLOG_LOGS: SyslogEntry[] = [
  { id: 's1', timestamp: '08:00:01', source: 'HU-MAIN-ASA1', severity: 'NOTICE', message: '%ASA-5-713119: Group = HU_VPN_GRP, IP = 10.100.4.2, PHASE 1 ISAKMP SA established.' },
  { id: 's2', timestamp: '08:00:02', source: 'HU-MAIN-ASA1', severity: 'NOTICE', message: '%ASA-5-713120: Group = HU_VPN_GRP, IP = 10.100.4.2, PHASE 2 IPsec SA established (transform: esp-aes-256 esp-sha256-hmac).' },
  { id: 's3', timestamp: '08:05:14', source: 'HU-MAIN-CS1', severity: 'INFO', message: '%OSPF-5-ADJCHG: Process 1, Nbr 10.10.0.18 on Port-channel2 from LOADING to FULL, Loading Done.' },
  { id: 's4', timestamp: '08:12:30', source: 'HU-MAIN-DS1', severity: 'INFO', message: '%HSRP-5-STATECHANGE: Vlan10 Grp 10 state Standby -> Active (Priority 110).' },
  { id: 's5', timestamp: '08:20:00', source: 'HU-MAIN-VOIP', severity: 'NOTICE', message: '%CME-6-REGISTRATION: ephone-1 (Ext 1001) registered at 10.10.80.101 via SCCP.' },
  { id: 's6', timestamp: '08:45:22', source: 'HU-HIT-CORE', severity: 'INFO', message: '%OSPF-5-ADJCHG: OSPF neighbor 10.10.0.1 established over IPSec tunnel.' }
];

export const HARAMAYA_CISCO_CONFIGS: Record<string, string> = {
  'c1-asa1': `!
! ==============================================================================
! HARAMAYA UNIVERSITY - MAIN CAMPUS EDGE CISCO ASA 5506-X FIREWALL
! ==============================================================================
hostname HU-MAIN-ASA1
domain-name haramaya.edu.et
enable password 5 $1$mERr$vTbHu11N28cEp81kLqr0f/
!
names
!
interface GigabitEthernet1/1
 nameif outside1
 security-level 0
 ip address 10.100.1.2 255.255.255.252
 no shutdown
!
interface GigabitEthernet1/2
 nameif dmz
 security-level 70
 ip address 10.10.150.1 255.255.255.0
 no shutdown
!
interface GigabitEthernet1/3
 nameif inside1
 security-level 100
 ip address 10.10.0.50 255.255.255.252
 no shutdown
!
interface GigabitEthernet1/4
 nameif inside2
 security-level 100
 ip address 10.10.0.58 255.255.255.252
 no shutdown
!
object network DMZ_POOL
 subnet 10.10.150.0 255.255.255.0
 nat (dmz,outside1) dynamic interface
!
object network INSIDE_POOL
 subnet 10.10.0.0 255.255.0.0
 nat (inside1,outside1) dynamic interface
!
access-list OUTSIDE_TO_DMZ extended permit tcp any host 10.10.150.6 eq 443
access-list OUTSIDE_TO_DMZ extended permit tcp any host 10.10.150.6 eq 80
access-list OUTSIDE_TO_DMZ extended permit udp any host 10.10.150.4 eq domain
access-list OUTSIDE_TO_DMZ extended permit tcp any host 10.10.150.7 eq smtp
access-list OUTSIDE_TO_DMZ extended permit tcp any host 10.10.150.10 eq ftp
access-list OUTSIDE_TO_DMZ extended permit esp 10.100.0.0 255.255.0.0 10.10.0.0 255.255.0.0
!
access-group OUTSIDE_TO_DMZ in interface outside1
!
crypto ipsec ikev1 transform-set ESP-AES256-SHA esp-aes 256 esp-sha-hmac
!
crypto map VPN_MAP_OUTSIDE1 10 match address VPN_HARAR_TRAFFIC
crypto map VPN_MAP_OUTSIDE1 10 set peer 10.100.4.2
crypto map VPN_MAP_OUTSIDE1 10 set ikev1 transform-set ESP-AES256-SHA
!
crypto map VPN_MAP_OUTSIDE1 20 match address VPN_HIT_TRAFFIC
crypto map VPN_MAP_OUTSIDE1 20 set peer 10.100.2.2
crypto map VPN_MAP_OUTSIDE1 20 set ikev1 transform-set ESP-AES256-SHA
!
crypto map VPN_MAP_OUTSIDE1 30 match address VPN_CVM_TRAFFIC
crypto map VPN_MAP_OUTSIDE1 30 set peer 10.100.3.2
crypto map VPN_MAP_OUTSIDE1 30 set ikev1 transform-set ESP-AES256-SHA
!
crypto map VPN_MAP_OUTSIDE1 interface outside1
!
route outside1 0.0.0.0 0.0.0.0 10.100.1.1 1
route inside1 10.10.0.0 255.255.0.0 10.10.0.49 1
route dmz 10.10.150.0 255.255.255.0 10.10.150.254 1
end`,

  'c1-cs1': `!
! ==============================================================================
! HARAMAYA UNIVERSITY - CORE LAYER CATALYST WS-C3650-24PS (BACKBONE)
! ==============================================================================
hostname HU-MAIN-CS1
ip routing
!
interface Port-channel1
 description Peer Backbone Link to HU-MAIN-CS2
 ip address 10.10.0.1 255.255.255.240
!
interface Port-channel2
 description 10Gbps Downlink to HU-MAIN-DS1
 ip address 10.10.0.17 255.255.255.248
!
interface GigabitEthernet1/0/1
 description Direct Uplink to HU-MAIN-ASA1
 no switchport
 ip address 10.10.0.49 255.255.255.252
!
router ospf 1
 router-id 1.1.1.1
 network 10.10.0.0 0.0.255.255 area 0
 default-information originate
!
ip route 0.0.0.0 0.0.0.0 10.10.0.50
end`,

  'c1-ds1': `!
! ==============================================================================
! HARAMAYA UNIVERSITY - DISTRIBUTION LAYER SWITCH HU-MAIN-DS1
! ==============================================================================
hostname HU-MAIN-DS1
ip routing
!
vlan 10
 name ADMIN
vlan 20
 name FACULTY
vlan 30
 name STUDENT
vlan 40
 name RESEARCH
vlan 50
 name LIBRARY
vlan 60
 name ICT
vlan 70
 name SERVER
vlan 80
 name VOICE
vlan 90
 name CCTV
vlan 100
 name IOT
vlan 110
 name GUEST
vlan 120
 name MANAGEMENT
vlan 130
 name SECURITY
vlan 140
 name LAB
vlan 150
 name DMZ
!
interface Vlan10
 ip address 10.10.10.2 255.255.255.0
 standby 10 ip 10.10.10.1
 standby 10 priority 110
 standby 10 preempt
!
interface Vlan30
 ip address 10.10.30.2 255.255.255.0
 standby 30 ip 10.10.30.1
 standby 30 priority 110
 standby 30 preempt
!
router ospf 1
 router-id 2.2.2.1
 network 10.10.0.0 0.0.255.255 area 0
end`,

  'c1-voip': `!
! ==============================================================================
! HARAMAYA UNIVERSITY - CISCO 2811 CME TELEPHONY VOIP GATEWAY
! ==============================================================================
hostname HU-MAIN-VOIP
!
telephony-service
 max-ephones 50
 max-dn 100
 ip source-address 10.10.80.254 port 2000
 auto assign 1 to 50
 create cnf-files
!
ephone-dn 1
 number 1001
 name Haramaya Main President
!
ephone-dn 2
 number 1002
 name Haramaya Central Registrar
!
dial-peer voice 2000 voip
 destination-pattern 2...
 session target ipv4:10.20.80.254
 codec g711ulaw
!
dial-peer voice 3000 voip
 destination-pattern 3...
 session target ipv4:10.30.80.254
 codec g711ulaw
!
dial-peer voice 4000 voip
 destination-pattern 4...
 session target ipv4:10.40.80.254
 codec g711ulaw
end`,

  'c1-sw-caes': `!
! ==============================================================================
! HARAMAYA UNIVERSITY - CAES COLLEGE ACCESS SWITCH (SW-MAIN-CAES)
! ==============================================================================
hostname SW-MAIN-CAES
!
vlan 20
 name FACULTY-AGEC
vlan 40
 name RESEARCH-ANSC-PLSC-NRES
!
interface GigabitEthernet0/1
 description 802.1Q Trunk Uplink to HU-MAIN-DS1
 switchport mode trunk
 switchport trunk allowed vlan 20,40,80,100
 no shutdown
!
interface FastEthernet0/1
 description School of Agricultural Economics & Agribusiness (PC-AGEC-01)
 switchport mode access
 switchport access vlan 20
 spanning-tree portfast
 no shutdown
!
interface FastEthernet0/2
 description School of Animal & Range Sciences (PC-ANSC-01)
 switchport mode access
 switchport access vlan 40
 spanning-tree portfast
 no shutdown
!
interface FastEthernet0/3
 description School of Natural Resources Management (PC-NRES-01)
 switchport mode access
 switchport access vlan 40
 spanning-tree portfast
 no shutdown
!
interface FastEthernet0/4
 description School of Plant Sciences Coffee Research Lab (PC-PLSC-01)
 switchport mode access
 switchport access vlan 40
 spanning-tree portfast
 no shutdown
!
interface FastEthernet0/5
 description School of Rural Development & Agricultural Innovation (PC-RDAI-01)
 switchport mode access
 switchport access vlan 20
 spanning-tree portfast
 no shutdown
!
interface Vlan40
 ip address 10.10.40.2 255.255.255.0
 no shutdown
!
ip default-gateway 10.10.40.1
end`,

  'harar-sw-med': `!
! ==============================================================================
! HARAMAYA UNIVERSITY - CHMS SCHOOL OF MEDICINE SWITCH (SW-HARAR-MED)
! ==============================================================================
hostname SW-HARAR-MED
!
vlan 30
 name CLINICAL-CARE
vlan 40
 name TELEMED-RESEARCH
vlan 80
 name MEDICAL-VOICE
!
interface GigabitEthernet0/1
 description 802.1Q Trunk Uplink to HU-HARAR-CS1
 switchport mode trunk
 switchport trunk allowed vlan 30,40,80,130
 no shutdown
!
interface FastEthernet0/1
 description Internal Medicine Inpatient Ward (PC-MED-INT01)
 switchport mode access
 switchport access vlan 30
 spanning-tree portfast
 no shutdown
!
interface FastEthernet0/2
 description Major Surgery Operating Theaters (PC-MED-SURG01)
 switchport mode access
 switchport access vlan 30
 spanning-tree portfast
 no shutdown
!
interface FastEthernet0/3
 description Pediatrics & Neonatal ICU (PC-MED-PED01)
 switchport mode access
 switchport access vlan 30
 spanning-tree portfast
 no shutdown
!
interface FastEthernet0/4
 description Gynecology & Obstetrics Labor Ward (PC-MED-OBGYN01)
 switchport mode access
 switchport access vlan 30
 spanning-tree portfast
 no shutdown
!
interface FastEthernet0/5
 description Orthopedics & Trauma Imaging (PC-MED-ORTH01)
 switchport mode access
 switchport access vlan 30
 spanning-tree portfast
 no shutdown
!
interface FastEthernet0/6
 description Emergency & Critical Care Resuscitation (PC-MED-EMERG01)
 switchport mode access
 switchport access vlan 30
 spanning-tree portfast
 no shutdown
!
interface FastEthernet0/7
 description Anesthesia & Pain Medicine (PC-MED-ANES01)
 switchport mode access
 switchport access vlan 30
 spanning-tree portfast
 no shutdown
!
interface Vlan30
 ip address 10.40.30.2 255.255.255.0
 no shutdown
!
ip default-gateway 10.40.30.1
end`
};

export const HARAMAYA_VLANS = HARAMAYA_ENTERPRISE_VLANS;
export const CISCO_CONFIG_SNIPPETS = HARAMAYA_CISCO_CONFIGS;
