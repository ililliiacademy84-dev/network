/**
 * Haramaya University Secure & Smart Advanced Network (HU-SSAN)
 * Educational Labs & Hands-On Engineering Curriculum (Labs 01 - 16)
 */

import { EducationalLab } from '../types/network';

export const HARAMAYA_EDUCATIONAL_LABS: EducationalLab[] = [
  {
    id: 'lab-01',
    title: 'Lab 01: Basic Campus LAN Setup & Subnetting',
    category: 'VLAN',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    objective: 'Configure static IP addressing, subnet masks, default gateways, and verify ICMP connectivity between workstations on Main Campus.',
    instructions: [
      'Navigate to the Packet Tracer Canvas on Main Campus.',
      'Assign PC-BATI-01 the IP address 10.10.1.10/24 with default gateway 10.10.1.1.',
      'Assign PC-BATI-02 the IP address 10.10.1.11/24 with default gateway 10.10.1.1.',
      'Open the CLI or Terminal on PC-BATI-01 and issue a ping to 10.10.1.11.',
      'Verify that ICMP echo requests receive echo replies with 0% packet loss.'
    ],
    tasks: [
      { id: 't1', description: 'Configure PC-BATI-01 IP 10.10.1.10/24 & Gateway 10.10.1.1', isCompleted: true, verificationKey: 'pc1_ip' },
      { id: 't2', description: 'Configure PC-BATI-02 IP 10.10.1.11/24 & Gateway 10.10.1.1', isCompleted: true, verificationKey: 'pc2_ip' },
      { id: 't3', description: 'Execute ping 10.10.1.11 and verify ICMP success', isCompleted: true, verificationKey: 'ping_pass' }
    ],
    hints: [
      'Use CIDR notation /24 which corresponds to Subnet Mask 255.255.255.0.',
      'Ensure the Ethernet interface admin state is set to UP.'
    ],
    solution: 'PC-BATI-01> ip 10.10.1.10 255.255.255.0 10.10.1.1\nPC-BATI-01> ping 10.10.1.11'
  },
  {
    id: 'lab-02',
    title: 'Lab 02: 802.1Q VLAN Creation & Trunk Configuration',
    category: 'VLAN',
    difficulty: 'Beginner',
    estimatedMinutes: 25,
    objective: 'Segregate Student and Faculty traffic across HiT Engineering Campus switches using 802.1Q VLAN trunks.',
    instructions: [
      'Open the CLI modal on Switch SW-HIT-ACC-01.',
      'Create VLAN 10 named "Faculty" and VLAN 20 named "Students".',
      'Assign FastEthernet 0/1 to access VLAN 10 and FastEthernet 0/2 to access VLAN 20.',
      'Configure GigabitEthernet 0/1 as an 802.1Q trunk port connecting to Core Switch SW-HIT-CORE.',
      'Verify trunk status using "show interface trunk" or "show vlan".'
    ],
    tasks: [
      { id: 't1', description: 'Create VLAN 10 (Faculty) and VLAN 20 (Students)', isCompleted: false, verificationKey: 'vlan_created' },
      { id: 't2', description: 'Configure switchport mode trunk on GigabitEthernet 0/1', isCompleted: false, verificationKey: 'trunk_config' },
      { id: 't3', description: 'Verify isolation between VLAN 10 and VLAN 20', isCompleted: false, verificationKey: 'vlan_isolation' }
    ],
    hints: [
      'In Cisco CLI: vlan 10 -> name Faculty',
      'For trunking: interface Gi0/1 -> switchport mode trunk'
    ],
    solution: 'SW-HIT-ACC-01# conf t\nSW-HIT-ACC-01(config)# vlan 10\nSW-HIT-ACC-01(config-vlan)# name Faculty\nSW-HIT-ACC-01(config)# interface Gi0/1\nSW-HIT-ACC-01(config-if)# switchport mode trunk'
  },
  {
    id: 'lab-03',
    title: 'Lab 03: Inter-VLAN Routing via Layer 3 Switch SVI',
    category: 'Routing',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    objective: 'Enable Switched Virtual Interfaces (SVIs) on Layer 3 Switch SW-BATI-CORE to route traffic between Bati Campus VLANs.',
    instructions: [
      'Enable IP routing on Core Switch SW-BATI-CORE using "ip routing".',
      'Create interface Vlan 10 with IP 10.10.10.1/24.',
      'Create interface Vlan 20 with IP 10.10.20.1/24.',
      'Verify that hosts in VLAN 10 can ping hosts in VLAN 20 through SVI routing.'
    ],
    tasks: [
      { id: 't1', description: 'Execute "ip routing" global configuration command', isCompleted: false, verificationKey: 'ip_routing' },
      { id: 't2', description: 'Configure SVI Interface Vlan 10 and Vlan 20', isCompleted: false, verificationKey: 'svi_created' },
      { id: 't3', description: 'Run Packet Trace from VLAN 10 to VLAN 20', isCompleted: false, verificationKey: 'svi_ping' }
    ],
    hints: [
      'Make sure both VLANs are created in the VLAN database.',
      'Issue "no shutdown" on interface Vlan 10 and interface Vlan 20.'
    ],
    solution: 'SW-BATI-CORE(config)# ip routing\nSW-BATI-CORE(config)# interface Vlan 10\nSW-BATI-CORE(config-if)# ip address 10.10.10.1 255.255.255.0\nSW-BATI-CORE(config-if)# no shutdown'
  },
  {
    id: 'lab-04',
    title: 'Lab 04: Cisco ASA Stateful Firewall & Zone Policies',
    category: 'Security',
    difficulty: 'Advanced',
    estimatedMinutes: 35,
    objective: 'Configure Cisco ASA 5506-X security zones (inside, outside, dmz) and access-list policies to protect Haramaya Server Farm.',
    instructions: [
      'Open the Stateful Firewall Manager or ASA CLI.',
      'Define security level 100 for "inside" and security level 0 for "outside".',
      'Configure rule: ALLOW inside (Student VLAN) -> dmz (Web Server) TCP/443.',
      'Configure rule: DENY outside (Internet) -> inside (Admin VLAN) All Traffic.',
      'Simulate a packet trace to test ASA Stateful inspection.'
    ],
    tasks: [
      { id: 't1', description: 'Set security-level 100 on inside interface', isCompleted: false, verificationKey: 'asa_security_level' },
      { id: 't2', description: 'Add ASA access-list permitting HTTPS (443) to DMZ', isCompleted: false, verificationKey: 'asa_acl_permit' },
      { id: 't3', description: 'Verify ASA drops unauthorized outside connection attempts', isCompleted: false, verificationKey: 'asa_drop_verify' }
    ],
    hints: [
      'Remember higher security levels (100) can initiate connections to lower security levels (0) automatically in ASA stateful engine.'
    ],
    solution: 'ASA-5506# conf t\nASA-5506(config)# access-list INSIDE_TO_DMZ extended permit tcp any host 10.10.1.5 eq 443'
  },
  {
    id: 'lab-05',
    title: 'Lab 05: Multi-Campus Single-Area OSPF (Area 0)',
    category: 'Routing',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    objective: 'Deploy OSPF Process ID 1 in Area 0 across Main Campus, HiT, CVM, and Harar Campus Core Routers.',
    instructions: [
      'Enable OSPF process 1 on Router R-BATI-CORE, R-HIT-CORE, R-CVM-CORE, and R-HARAR-CORE.',
      'Advertise campus subnets into OSPF Area 0 using wildcard masks.',
      'Verify OSPF neighbor relationships using "show ip ospf neighbor".',
      'Verify full routing table convergence using "show ip route ospf".'
    ],
    tasks: [
      { id: 't1', description: 'Configure router ospf 1 on all 4 campus core routers', isCompleted: false, verificationKey: 'ospf_enabled' },
      { id: 't2', description: 'Advertise 10.10.0.0/16, 10.20.0.0/16, 10.30.0.0/16, 10.40.0.0/16 in Area 0', isCompleted: false, verificationKey: 'ospf_networks' },
      { id: 't3', description: 'Confirm OSPF FULL neighbor state on all inter-campus links', isCompleted: false, verificationKey: 'ospf_full_neighbors' }
    ],
    hints: [
      'Wildcard mask for /16 subnet is 0.0.255.255.',
      'Command: network 10.10.0.0 0.0.255.255 area 0'
    ],
    solution: 'R-BATI-CORE(config)# router ospf 1\nR-BATI-CORE(config-router)# network 10.10.0.0 0.0.255.255 area 0'
  },
  {
    id: 'lab-06',
    title: 'Lab 06: Site-to-Site IPSec VPN Tunnels',
    category: 'VPN',
    difficulty: 'Advanced',
    estimatedMinutes: 40,
    objective: 'Establish an encrypted IPSec VPN tunnel between Main Campus (Bati) and Harar Health Campus over public WAN.',
    instructions: [
      'Configure ISAKMP Phase 1 policy (AES-256, SHA-256, DH Group 14).',
      'Define Pre-Shared Key (PSK) "HaramayaSecure2026!".',
      'Configure IPsec Phase 2 Transform Set (esp-aes 256 esp-sha256-hmac).',
      'Apply crypto map to WAN serial interface.',
      'Verify tunnel status shows "ISAKMP SA ACTIVE" and encrypted packet counters increment.'
    ],
    tasks: [
      { id: 't1', description: 'Configure ISAKMP Phase 1 Policy and Pre-Shared Key', isCompleted: false, verificationKey: 'vpn_phase1' },
      { id: 't2', description: 'Define Crypto IPsec Transform Set and Crypto Map', isCompleted: false, verificationKey: 'vpn_phase2' },
      { id: 't3', description: 'Send encrypted traffic and verify pktsEncrypted counter > 0', isCompleted: false, verificationKey: 'vpn_encrypted' }
    ],
    hints: [
      'Crypto map requires an interesting traffic ACL matching local and remote subnets.'
    ],
    solution: 'R-BATI-CORE(config)# crypto isakmp policy 10\nR-BATI-CORE(config-isakmp)# encr aes 256\nR-BATI-CORE(config-isakmp)# authentication pre-share'
  }
];
