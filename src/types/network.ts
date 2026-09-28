/**
 * Haramaya University Network Configuration & Simulation Platform
 * Technical Data Types & Enterprise Schemas
 */

export type CampusId = 'main' | 'hit' | 'cvm' | 'harar' | 'wan';

export type NetworkLayer = 'core' | 'distribution' | 'access' | 'dmz' | 'outside' | 'iot' | 'voip' | 'end';

export type DeviceType = 
  | 'router' 
  | 'switch_l3' 
  | 'switch_l2' 
  | 'firewall' 
  | 'server' 
  | 'pc' 
  | 'laptop' 
  | 'tablet' 
  | 'smartphone' 
  | 'printer' 
  | 'ip_phone' 
  | 'access_point' 
  | 'iot_sensor' 
  | 'iot_actuator' 
  | 'cloud';

export interface DeviceInterface {
  name: string;
  ip?: string;
  subnetMask?: string;
  mac: string;
  status: 'up' | 'down';
  adminStatus: 'up' | 'down';
  vlan?: number;
  mode?: 'access' | 'trunk';
  nativeVlan?: number;
  allowedVlans?: string;
  speed?: '10Mbps' | '100Mbps' | '1Gbps' | '10Gbps' | 'Auto';
  duplex?: 'half' | 'full' | 'auto';
  portSecurity?: {
    enabled: boolean;
    maxMacs: number;
    violationAction: 'shutdown' | 'restrict' | 'protect';
  };
  type: 'FastEthernet' | 'GigabitEthernet' | 'TenGigabit' | 'Serial' | 'PortChannel' | 'Wireless';
  connectedLinkId?: string;
}

export interface RoutingEntry {
  network: string;
  mask: string;
  nextHop: string;
  interfaceName: string;
  protocol: 'C' | 'S' | 'O' | 'B';
  metric?: number;
  adminDistance?: number;
}

export interface NetworkDevice {
  id: string;
  name: string;
  hostname: string;
  model: string;
  type: DeviceType;
  layer: NetworkLayer;
  campus: CampusId;
  building?: string;
  x: number;
  y: number;
  vlan?: number;
  department?: string;
  managementIp?: string;
  gateway?: string;
  dnsServer?: string;
  interfaces: DeviceInterface[];
  routingTable?: RoutingEntry[];
  power: boolean;
  notes?: string;
  runningConfig?: string;
  dhcpEnabled?: boolean;
}

export interface NetworkLink {
  id: string;
  fromDeviceId: string;
  fromPort: string;
  toDeviceId: string;
  toPort: string;
  type: 'copper' | 'crossover' | 'fiber' | 'serial' | 'iot' | 'vpn' | 'wireless';
  bandwidth?: string;
  status: 'up' | 'down';
  latencyMs?: number;
}

export interface VlanInfo {
  id: number;
  name: string;
  subnet: string;
  subnetMask: string;
  gateway: string;
  campus: CampusId;
  description: string;
  dhcpPoolName?: string;
}

export interface FirewallRule {
  id: string;
  name: string;
  sourceZone: 'inside' | 'outside' | 'dmz' | 'any';
  destZone: 'inside' | 'outside' | 'dmz' | 'any';
  sourceIp: string;
  destIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'IP' | 'ESP';
  port: string;
  action: 'allow' | 'deny';
  enabled: boolean;
  hits: number;
}

export interface VpnTunnel {
  id: string;
  name: string;
  localEndpoint: string;
  remoteEndpoint: string;
  localSubnet: string;
  remoteSubnet: string;
  encryption: 'AES-256' | 'AES-128' | '3DES';
  hash: 'SHA-256' | 'SHA-1';
  pfsGroup: 'Group 2' | 'Group 5' | 'Group 14';
  status: 'up' | 'down';
  pktsEncrypted: number;
  pktsDecrypted: number;
  uptimeSeconds: number;
}

export interface DnsRecord {
  domain: string;
  type: 'A' | 'CNAME' | 'MX' | 'TXT';
  target: string;
}

export interface MailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export interface FtpFile {
  name: string;
  size: string;
  date: string;
  content: string;
}

export interface SyslogEntry {
  id: string;
  timestamp: string;
  source: string;
  severity: 'EMERG' | 'ALERT' | 'CRIT' | 'ERR' | 'WARNING' | 'NOTICE' | 'INFO' | 'DEBUG';
  message: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  sourceIp: string;
  destIp: string;
  type: 'FIREWALL_DROP' | 'PORT_SCAN' | 'BRUTE_FORCE' | 'ACL_VIOLATION' | 'UNAUTHORIZED_VLAN' | 'MALWARE_SIGNATURE' | 'DOS_ATTEMPT';
  description: string;
  actionTaken: 'BLOCKED' | 'LOGGED' | 'FLAGGED';
  remediation: string;
}

export interface PacketInspection {
  layer2: {
    sourceMac: string;
    destMac: string;
    vlan?: number;
    etherType: string;
  };
  layer3: {
    sourceIp: string;
    destIp: string;
    protocol: string;
    ttl: number;
  };
  layer4?: {
    protocol: 'TCP' | 'UDP';
    sourcePort: number;
    destPort: number;
  };
  security: {
    aclDecision: 'PERMIT' | 'DENY';
    firewallDecision: 'ALLOW' | 'DROP';
    natTranslation?: string;
    vpnEncrypted: boolean;
  };
}

export interface SimulationPacket {
  id: string;
  sourceDeviceId: string;
  targetDeviceId: string;
  protocol: 'ICMP' | 'DNS' | 'HTTP' | 'HTTPS' | 'SMTP' | 'FTP' | 'ESP_VPN' | 'ARP' | 'VoIP' | 'OSPF';
  path: string[];
  currentHopIndex: number;
  status: 'transmitting' | 'success' | 'failed';
  color: string;
  details: string;
  inspection: PacketInspection;
}

export interface IotCampusState {
  motionDetected: boolean;
  lightBrightness: number;
  fanActive: boolean;
  fanSpeed: 'off' | 'low' | 'high';
  fireDetected: boolean;
  smokeDensityPpm: number;
  temperatureCelsius: number;
  sirenAlert: boolean;
  sprinklerActive: boolean;
  doorLocked: boolean;
  lastRfidScan?: {
    cardId: string;
    holder: string;
    accessGranted: boolean;
    timestamp: string;
  };
}

export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  deviceId?: string;
  fixRecommendation: string;
}

export interface EducationalLab {
  id: string;
  title: string;
  category: 'VLAN' | 'Routing' | 'Security' | 'Services' | 'VPN' | 'VoIP' | 'IoT' | 'Troubleshooting';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  objective: string;
  instructions: string[];
  tasks: {
    id: string;
    description: string;
    isCompleted: boolean;
    verificationKey: string;
  }[];
  hints: string[];
  solution: string;
}

export interface ProjectSaveState {
  id: string;
  name: string;
  updatedAt: string;
  version: string;
  devices: NetworkDevice[];
  links: NetworkLink[];
  vlans: VlanInfo[];
  firewallRules: FirewallRule[];
  dnsRecords: DnsRecord[];
  mailMessages: MailMessage[];
  ftpFiles: FtpFile[];
  syslogLogs: SyslogEntry[];
  securityEvents: SecurityEvent[];
}

export interface HaramayaDepartmentInfo {
  id: string;
  name: string;
  code: string;
  collegeId: string;
  campusId: CampusId;
  vlan: number;
  subnet: string;
  gateway: string;
  switchId: string;
  switchPort: string;
  workstationId: string;
  workstationIp: string;
  workstationName: string;
  workstationMac: string;
  headOfDepartment?: string;
  programsOffered: string[];
  researchAreas: string[];
  description: string;
  labFacility?: string;
}

export interface HaramayaCollegeInfo {
  id: string;
  name: string;
  shortName: string;
  campusId: CampusId;
  dean: string;
  building: string;
  distributionSwitchId: string;
  departments: HaramayaDepartmentInfo[];
  description: string;
  studentCount: number;
  facultyCount: number;
  iconName?: string;
}

export interface HaramayaCampusNode {
  id: CampusId;
  name: string;
  location: string;
  subnet: string;
  colleges: HaramayaCollegeInfo[];
}
