/**
 * Cisco Packet Tracer Devices & Links for all 11 Haramaya Colleges and 60 Departments
 * Fully integrated with three-tier hierarchical architecture and IP/VLAN schemas
 */

import { NetworkDevice, NetworkLink, CampusId } from '../types/network';
import { ALL_HARAMAYA_DEPARTMENTS, ALL_HARAMAYA_COLLEGES } from './haramayaCollegesData';

// Coordinates layout helper per campus & college
interface SwitchPosition {
  x: number;
  y: number;
  uplinkTarget: string;
  uplinkPort: string;
}

const COLLEGE_SWITCH_MAP: Record<string, {
  name: string;
  hostname: string;
  campus: CampusId;
  collegeId: string;
  building: string;
  defaultVlan: number;
  x: number;
  y: number;
  uplinkTo: string;
}> = {
  // Main Campus Colleges (8 switches)
  'c1-sw-caes': {
    name: 'SW-MAIN-CAES',
    hostname: 'HU-Main-CAES-SW',
    campus: 'main',
    collegeId: 'col-caes',
    building: 'CAES Main Academic Complex & Research Farm',
    defaultVlan: 40,
    x: 180,
    y: 380,
    uplinkTo: 'c1-ds1'
  },
  'c1-sw-cbe': {
    name: 'SW-MAIN-CBE',
    hostname: 'HU-Main-CBE-SW',
    campus: 'main',
    collegeId: 'col-cbe',
    building: 'CBE Multi-Purpose Complex',
    defaultVlan: 20,
    x: 290,
    y: 380,
    uplinkTo: 'c1-ds1'
  },
  'c1-sw-cci': {
    name: 'SW-MAIN-CCI',
    hostname: 'HU-Main-CCI-SW',
    campus: 'main',
    collegeId: 'col-cci',
    building: 'CCI Computing Complex',
    defaultVlan: 30,
    x: 400,
    y: 380,
    uplinkTo: 'c1-ds1'
  },
  'c1-sw-cebs': {
    name: 'SW-MAIN-CEBS',
    hostname: 'HU-Main-CEBS-SW',
    campus: 'main',
    collegeId: 'col-cebs',
    building: 'CEBS Academic Wing',
    defaultVlan: 20,
    x: 510,
    y: 380,
    uplinkTo: 'c1-ds1'
  },
  'c1-sw-law': {
    name: 'SW-MAIN-LAW',
    hostname: 'HU-Main-Law-SW',
    campus: 'main',
    collegeId: 'col-law',
    building: 'College of Law & Moot Court Hall',
    defaultVlan: 10,
    x: 620,
    y: 380,
    uplinkTo: 'c1-ds1'
  },
  'c1-sw-cncs': {
    name: 'SW-MAIN-CNCS',
    hostname: 'HU-Main-CNCS-SW',
    campus: 'main',
    collegeId: 'col-cncs',
    building: 'Science Complex Laboratories',
    defaultVlan: 40,
    x: 240,
    y: 470,
    uplinkTo: 'c1-ds1'
  },
  'c1-sw-cssh': {
    name: 'SW-MAIN-CSSH',
    hostname: 'HU-Main-CSSH-SW',
    campus: 'main',
    collegeId: 'col-cssh',
    building: 'CSSH Humanities Complex',
    defaultVlan: 20,
    x: 450,
    y: 470,
    uplinkTo: 'c1-ds1'
  },
  'c1-sw-sport': {
    name: 'SW-MAIN-SPORT',
    hostname: 'HU-Main-Sport-SW',
    campus: 'main',
    collegeId: 'col-sport',
    building: 'Haramaya Olympic Stadium & Gymnasium',
    defaultVlan: 30,
    x: 580,
    y: 470,
    uplinkTo: 'c1-ds1'
  },

  // HiT Campus Engineering Switches
  'hit-sw-agri': {
    name: 'SW-HIT-AGRI',
    hostname: 'HU-HiT-AgriEng-SW',
    campus: 'hit',
    collegeId: 'col-hit-eng',
    building: 'HiT Engineering Block A',
    defaultVlan: 40,
    x: 750,
    y: 230,
    uplinkTo: 'hit-core'
  },
  'hit-sw-chem': {
    name: 'SW-HIT-CHEM',
    hostname: 'HU-HiT-ChemEng-SW',
    campus: 'hit',
    collegeId: 'col-hit-eng',
    building: 'HiT Engineering Block B',
    defaultVlan: 40,
    x: 820,
    y: 230,
    uplinkTo: 'hit-core'
  },
  'hit-sw-civil': {
    name: 'SW-HIT-CIVIL',
    hostname: 'HU-HiT-CivilEng-SW',
    campus: 'hit',
    collegeId: 'col-hit-eng',
    building: 'HiT Engineering Block C',
    defaultVlan: 30,
    x: 890,
    y: 230,
    uplinkTo: 'hit-core'
  },
  'hit-sw-elect': {
    name: 'SW-HIT-ELECT',
    hostname: 'HU-HiT-ElectEng-SW',
    campus: 'hit',
    collegeId: 'col-hit-eng',
    building: 'HiT Engineering Block D',
    defaultVlan: 30,
    x: 960,
    y: 230,
    uplinkTo: 'hit-core'
  },
  'hit-sw-mech': {
    name: 'SW-HIT-MECH',
    hostname: 'HU-HiT-MechEng-SW',
    campus: 'hit',
    collegeId: 'col-hit-eng',
    building: 'HiT Central Workshops',
    defaultVlan: 30,
    x: 780,
    y: 330,
    uplinkTo: 'hit-core'
  },
  'hit-sw-food': {
    name: 'SW-HIT-FOOD',
    hostname: 'HU-HiT-FoodTech-SW',
    campus: 'hit',
    collegeId: 'col-hit-eng',
    building: 'HiT Food Pilot Plant',
    defaultVlan: 40,
    x: 870,
    y: 330,
    uplinkTo: 'hit-core'
  },
  'hit-sw-water': {
    name: 'SW-HIT-WATER',
    hostname: 'HU-HiT-WaterRes-SW',
    campus: 'hit',
    collegeId: 'col-hit-eng',
    building: 'HiT Hydraulics Flume Hall',
    defaultVlan: 30,
    x: 950,
    y: 330,
    uplinkTo: 'hit-core'
  },

  // Veterinary Campus Switches
  'cvm-sw-hosp': {
    name: 'SW-CVM-HOSP',
    hostname: 'HU-CVM-Hospital-SW',
    campus: 'cvm',
    collegeId: 'col-cvm-vet',
    building: 'Veterinary Teaching Hospital',
    defaultVlan: 140,
    x: 1090,
    y: 240,
    uplinkTo: 'cvm-core'
  },
  'cvm-sw-path': {
    name: 'SW-CVM-PATH',
    hostname: 'HU-CVM-Pathology-SW',
    campus: 'cvm',
    collegeId: 'col-cvm-vet',
    building: 'Diagnostic Pathology & Zoonoses Center',
    defaultVlan: 40,
    x: 1220,
    y: 240,
    uplinkTo: 'cvm-core'
  },

  // Harar Health Campus Switches
  'harar-sw-med': {
    name: 'SW-HARAR-MED',
    hostname: 'HU-Harar-Medicine-SW',
    campus: 'harar',
    collegeId: 'col-chms-health',
    building: 'HFSUH Clinical School of Medicine',
    defaultVlan: 30,
    x: 1420,
    y: 310,
    uplinkTo: 'harar-cs1'
  },
  'harar-sw-pharm': {
    name: 'SW-HARAR-PHARM',
    hostname: 'HU-Harar-PharmPubHealth-SW',
    campus: 'harar',
    collegeId: 'col-chms-health',
    building: 'School of Pharmacy & Public Health Complex',
    defaultVlan: 40,
    x: 1530,
    y: 310,
    uplinkTo: 'harar-cs1'
  },
  'harar-sw-hosp': {
    name: 'SW-HARAR-HOSP',
    hostname: 'HU-Harar-Hospital-SW',
    campus: 'harar',
    collegeId: 'col-chms-health',
    building: 'Hiwot Fana University Hospital Inpatient Wing',
    defaultVlan: 30,
    x: 1620,
    y: 310,
    uplinkTo: 'harar-cs1'
  }
};

// 1. Build College Access Switches
export const COLLEGE_ACCESS_SWITCHES: NetworkDevice[] = Object.entries(COLLEGE_SWITCH_MAP).map(
  ([switchId, info]) => {
    // Collect departments attached to this switch
    const attachedDepts = ALL_HARAMAYA_DEPARTMENTS.filter((d) => d.switchId === switchId);

    return {
      id: switchId,
      name: info.name,
      hostname: info.hostname,
      model: 'Cisco Catalyst 2960-24TT',
      type: 'switch_l2',
      layer: 'access',
      campus: info.campus,
      vlan: info.defaultVlan,
      department: ALL_HARAMAYA_COLLEGES.find((c) => c.id === info.collegeId)?.name || 'Academic Faculty',
      building: info.building,
      x: info.x,
      y: info.y,
      power: true,
      managementIp: `10.${info.campus === 'hit' ? '20' : info.campus === 'cvm' ? '30' : info.campus === 'harar' ? '40' : '10'}.${info.defaultVlan}.2`,
      interfaces: [
        ...attachedDepts.map((d, idx) => ({
          name: d.switchPort,
          vlan: d.vlan,
          mac: `00D0.BA0${idx + 1}.${switchId.slice(-4).replace('-', '')}`,
          status: 'up' as const,
          adminStatus: 'up' as const,
          type: 'FastEthernet' as const,
          mode: 'access' as const,
          speed: '100Mbps' as const,
          duplex: 'full' as const
        })),
        {
          name: 'Gi0/1',
          mac: `00D0.BA99.${switchId.slice(-4).replace('-', '')}`,
          status: 'up' as const,
          adminStatus: 'up' as const,
          type: 'GigabitEthernet' as const,
          mode: 'trunk' as const,
          speed: '1Gbps' as const,
          duplex: 'full' as const
        }
      ],
      notes: `Access Layer Switch serving ${attachedDepts.length} departments/schools.`
    };
  }
);

// 2. Build Department Workstations for all 60 departments
export const DEPARTMENT_WORKSTATIONS: NetworkDevice[] = ALL_HARAMAYA_DEPARTMENTS.map((dept, idx) => {
  const switchInfo = COLLEGE_SWITCH_MAP[dept.switchId];
  const switchX = switchInfo?.x || 300;
  const switchY = switchInfo?.y || 400;

  // Offset workstations radially or in a fan under the switch
  const portNum = parseInt(dept.switchPort.replace(/[^0-9]/g, ''), 10) || 1;
  const xOffset = (portNum - 3) * 36;
  const yOffset = 80 + (portNum % 2) * 25;

  return {
    id: dept.workstationId,
    name: dept.workstationName,
    hostname: `HU-${dept.code}-Workstation`,
    model: 'PC-PT',
    type: 'pc',
    layer: 'end',
    campus: dept.campusId,
    vlan: dept.vlan,
    department: dept.name,
    building: switchInfo?.building,
    x: switchX + xOffset,
    y: switchY + yOffset,
    power: true,
    managementIp: dept.workstationIp,
    gateway: dept.gateway,
    dnsServer: '10.10.150.4',
    interfaces: [
      {
        name: 'FastEthernet0',
        ip: dept.workstationIp,
        subnetMask: '255.255.255.0',
        mac: dept.workstationMac,
        status: 'up',
        adminStatus: 'up',
        type: 'FastEthernet',
        speed: '100Mbps',
        duplex: 'full'
      }
    ],
    notes: `${dept.name} primary research & academic workstation. Connected to ${dept.switchId} port ${dept.switchPort}.`
  };
});

// 3. Build Physical & Trunk Links
export const COLLEGE_NETWORK_LINKS: NetworkLink[] = [
  // Switch to Core/Distribution Trunk Uplinks
  ...Object.entries(COLLEGE_SWITCH_MAP).map(([switchId, info], idx) => ({
    id: `link-trunk-${switchId}`,
    fromDeviceId: switchId,
    fromPort: 'Gi0/1',
    toDeviceId: info.uplinkTo,
    toPort: `Gi1/0/${(idx % 12) + 5}`,
    type: (info.campus === 'main' ? 'copper' : 'fiber') as any,
    bandwidth: '1 Gbps',
    status: 'up' as const
  })),

  // Department Workstation to Switch Access Links
  ...ALL_HARAMAYA_DEPARTMENTS.map((dept) => ({
    id: `link-pc-${dept.workstationId}`,
    fromDeviceId: dept.switchId,
    fromPort: dept.switchPort,
    toDeviceId: dept.workstationId,
    toPort: 'FastEthernet0',
    type: 'copper' as const,
    bandwidth: '100 Mbps',
    status: 'up' as const
  }))
];
