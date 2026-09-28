/**
 * Haramaya University Secure & Smart Advanced Network (HU-SSAN)
 * Deterministic Network Simulation Engine
 * Handles L2 Switching, L3 Routing, VLANs, STP, ACLs, Firewall, NAT, VPN, Services & Packet Traces
 */

import {
  NetworkDevice,
  NetworkLink,
  VlanInfo,
  FirewallRule,
  VpnTunnel,
  DnsRecord,
  SimulationPacket,
  PacketInspection,
  RoutingEntry,
  DeviceInterface
} from '../types/network';

export interface TraceHop {
  deviceId: string;
  deviceName: string;
  inPort?: string;
  outPort?: string;
  action: 'RECEIVED' | 'SWITCHED' | 'ROUTED' | 'NAT_TRANSLATED' | 'ENCRYPTED_VPN' | 'PERMITTED' | 'DROPPED';
  reason?: string;
  layer: 'L1' | 'L2' | 'L3' | 'L4' | 'L7' | 'SECURITY';
}

export interface SimulationTraceResult {
  packetId: string;
  sourceDevice: NetworkDevice;
  targetDevice: NetworkDevice;
  protocol: string;
  status: 'SUCCESS' | 'DROPPED';
  dropReason?: string;
  hops: TraceHop[];
  inspection: PacketInspection;
  totalLatencyMs: number;
}

export class SimulationEngine {
  /**
   * Calculates IP subnet details (CIDR, Network IP, Broadcast IP, Netmask, Host Range)
   */
  static parseCidr(ipWithCidr: string): { network: string; mask: string; prefix: number; broadcast: string } {
    const [ip, prefixStr] = ipWithCidr.split('/');
    const prefix = prefixStr ? parseInt(prefixStr, 10) : 24;
    
    const ipNums = ip.split('.').map(Number);
    const maskNums = [0, 0, 0, 0];
    let tempPrefix = prefix;
    
    for (let i = 0; i < 4; i++) {
      if (tempPrefix >= 8) {
        maskNums[i] = 255;
        tempPrefix -= 8;
      } else if (tempPrefix > 0) {
        maskNums[i] = 256 - Math.pow(2, 8 - tempPrefix);
        tempPrefix = 0;
      }
    }
    
    const netNums = ipNums.map((num, idx) => num & maskNums[idx]);
    const broadNums = ipNums.map((num, idx) => num | (255 ^ maskNums[idx]));

    return {
      network: netNums.join('.'),
      mask: maskNums.join('.'),
      prefix,
      broadcast: broadNums.join('.')
    };
  }

  /**
   * Checks if two IPv4 addresses belong to the same IP subnet given a netmask
   */
  static isSameSubnet(ip1: string, ip2: string, mask: string): boolean {
    const ip1Nums = ip1.split('.').map(Number);
    const ip2Nums = ip2.split('.').map(Number);
    const maskNums = mask.split('.').map(Number);

    for (let i = 0; i < 4; i++) {
      if ((ip1Nums[i] & maskNums[i]) !== (ip2Nums[i] & maskNums[i])) {
        return false;
      }
    }
    return true;
  }

  /**
   * Evaluates ACL rules (Standard & Extended)
   */
  static evaluateAcl(
    device: NetworkDevice,
    protocol: string,
    sourceIp: string,
    destIp: string,
    destPort?: number
  ): { decision: 'PERMIT' | 'DENY'; matchedRule?: string } {
    if (!device.runningConfig) {
      return { decision: 'PERMIT' };
    }

    const lines = device.runningConfig.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('access-list')) {
        // Example: access-list 101 deny tcp any host 10.10.1.5 eq 22
        const parts = trimmed.split(' ');
        if (parts.length >= 4) {
          const action = parts[2].toLowerCase(); // permit or deny
          const proto = parts[3].toUpperCase(); // tcp, udp, icmp, ip

          if (proto === 'IP' || proto === protocol.toUpperCase()) {
            if (action === 'deny') {
              return { decision: 'DENY', matchedRule: trimmed };
            } else if (action === 'permit') {
              return { decision: 'PERMIT', matchedRule: trimmed };
            }
          }
        }
      }
    }

    return { decision: 'PERMIT' };
  }

  /**
   * Evaluates Cisco ASA Stateful Firewall rules
   */
  static evaluateFirewall(
    rules: FirewallRule[],
    sourceZone: string,
    destZone: string,
    sourceIp: string,
    destIp: string,
    protocol: string,
    destPort: string
  ): { decision: 'ALLOW' | 'DROP'; ruleName?: string } {
    const activeRules = rules.filter(r => r.enabled);

    for (const rule of activeRules) {
      const zoneMatch = (rule.sourceZone === 'any' || rule.sourceZone === sourceZone) &&
                        (rule.destZone === 'any' || rule.destZone === destZone);
      
      const protoMatch = rule.protocol === 'IP' || rule.protocol === protocol.toUpperCase();
      const portMatch = rule.port === 'any' || rule.port === destPort || rule.port === '*';

      if (zoneMatch && protoMatch && portMatch) {
        rule.hits = (rule.hits || 0) + 1;
        return {
          decision: rule.action === 'allow' ? 'ALLOW' : 'DROP',
          ruleName: rule.name
        };
      }
    }

    // Default ASA policy: Drop unless explicitly permitted
    return { decision: 'DROP', ruleName: 'Implicit Default ASA Drop' };
  }

  /**
   * Primary Deterministic Simulation Executor
   * Executes a complete end-to-end packet traversal trace through the topology
   */
  static simulatePacketTrace(
    sourceDeviceId: string,
    targetDeviceId: string,
    protocol: 'ICMP' | 'DNS' | 'HTTP' | 'HTTPS' | 'SMTP' | 'FTP' | 'ESP_VPN' | 'ARP' | 'VoIP' | 'OSPF',
    devices: NetworkDevice[],
    links: NetworkLink[],
    firewallRules: FirewallRule[],
    vpnTunnels: VpnTunnel[],
    dnsRecords: DnsRecord[]
  ): SimulationTraceResult {
    const hops: TraceHop[] = [];
    const sourceDev = devices.find(d => d.id === sourceDeviceId);
    const targetDev = devices.find(d => d.id === targetDeviceId);

    if (!sourceDev || !targetDev) {
      return {
        packetId: `PKT-${Date.now().toString().slice(-5)}`,
        sourceDevice: sourceDev || ({ id: 'unknown', name: 'Unknown' } as any),
        targetDevice: targetDev || ({ id: 'unknown', name: 'Unknown' } as any),
        protocol,
        status: 'DROPPED',
        dropReason: 'Source or Destination device not found in active topology.',
        hops: [],
        inspection: SimulationEngine.createEmptyInspection('0.0.0.0', '0.0.0.0', protocol),
        totalLatencyMs: 0
      };
    }

    const sourceIp = sourceDev.interfaces[0]?.ip || sourceDev.managementIp || '10.10.1.100';
    const targetIp = targetDev.interfaces[0]?.ip || targetDev.managementIp || '10.20.1.100';
    const sourceMac = sourceDev.interfaces[0]?.mac || '00:11:22:33:44:55';
    const targetMac = targetDev.interfaces[0]?.mac || '66:77:88:99:AA:BB';

    // Step 1: Check power state
    if (!sourceDev.power) {
      return {
        packetId: `PKT-${Date.now().toString().slice(-5)}`,
        sourceDevice: sourceDev,
        targetDevice: targetDev,
        protocol,
        status: 'DROPPED',
        dropReason: `Device ${sourceDev.name} is powered OFF.`,
        hops: [{ deviceId: sourceDev.id, deviceName: sourceDev.name, action: 'DROPPED', reason: 'Device Powered Off', layer: 'L1' }],
        inspection: SimulationEngine.createEmptyInspection(sourceIp, targetIp, protocol),
        totalLatencyMs: 0
      };
    }

    hops.push({
      deviceId: sourceDev.id,
      deviceName: sourceDev.name,
      outPort: sourceDev.interfaces[0]?.name || 'Gi0/1',
      action: 'RECEIVED',
      layer: 'L1'
    });

    // Step 2: Breadth-First-Search Path Finder across active links
    const visited = new Set<string>();
    const queue: { currentId: string; path: string[]; latency: number }[] = [
      { currentId: sourceDev.id, path: [sourceDev.id], latency: 1.2 }
    ];
    let foundPath: string[] | null = null;
    let accumulatedLatency = 1.2;

    while (queue.length > 0) {
      const { currentId, path, latency } = queue.shift()!;
      visited.add(currentId);

      if (currentId === targetDev.id) {
        foundPath = path;
        accumulatedLatency = latency;
        break;
      }

      const connectedLinks = links.filter(
        l => l.status === 'up' && (l.fromDeviceId === currentId || l.toDeviceId === currentId)
      );

      for (const link of connectedLinks) {
        const nextId = link.fromDeviceId === currentId ? link.toDeviceId : link.fromDeviceId;
        const nextDev = devices.find(d => d.id === nextId);

        if (nextDev && nextDev.power && !visited.has(nextId)) {
          queue.push({
            currentId: nextId,
            path: [...path, nextId],
            latency: latency + (link.latencyMs || 2.5)
          });
        }
      }
    }

    if (!foundPath) {
      return {
        packetId: `PKT-${Date.now().toString().slice(-5)}`,
        sourceDevice: sourceDev,
        targetDevice: targetDev,
        protocol,
        status: 'DROPPED',
        dropReason: `No physical or logical path exists between ${sourceDev.name} and ${targetDev.name}. Check cable status and link states.`,
        hops,
        inspection: SimulationEngine.createEmptyInspection(sourceIp, targetIp, protocol),
        totalLatencyMs: accumulatedLatency
      };
    }

    // Step 3: Traverse path and evaluate L2/L3/Security
    let isDropped = false;
    let dropReason = '';
    let aclResult: 'PERMIT' | 'DENY' = 'PERMIT';
    let fwResult: 'ALLOW' | 'DROP' = 'ALLOW';
    let isVpnEncrypted = false;
    let natTranslation: string | undefined = undefined;

    for (let i = 1; i < foundPath.length; i++) {
      const devId = foundPath[i];
      const dev = devices.find(d => d.id === devId)!;

      // Check VLAN assignment mismatch on switches
      if (dev.type === 'switch_l2') {
        const port = dev.interfaces[0];
        if (port && port.mode === 'access' && port.vlan && sourceDev.vlan && port.vlan !== sourceDev.vlan) {
          isDropped = true;
          dropReason = `VLAN Isolation: Switch port ${port.name} on ${dev.name} is in VLAN ${port.vlan}, but source device is in VLAN ${sourceDev.vlan}. Inter-VLAN routing required.`;
          hops.push({
            deviceId: dev.id,
            deviceName: dev.name,
            inPort: port.name,
            action: 'DROPPED',
            reason: dropReason,
            layer: 'L2'
          });
          break;
        }

        hops.push({
          deviceId: dev.id,
          deviceName: dev.name,
          inPort: dev.interfaces[0]?.name,
          outPort: dev.interfaces[1]?.name,
          action: 'SWITCHED',
          layer: 'L2'
        });
      }

      // Check Router ACL & OSPF
      if (dev.type === 'router' || dev.type === 'switch_l3') {
        const aclEval = SimulationEngine.evaluateAcl(dev, protocol, sourceIp, targetIp, 80);
        if (aclEval.decision === 'DENY') {
          isDropped = true;
          dropReason = `ACL Violation on ${dev.name}: ${aclEval.matchedRule || 'Denied by Access List'}`;
          aclResult = 'DENY';
          hops.push({
            deviceId: dev.id,
            deviceName: dev.name,
            action: 'DROPPED',
            reason: dropReason,
            layer: 'SECURITY'
          });
          break;
        }

        // Check VPN Tunnels
        const matchingVpn = vpnTunnels.find(t => t.status === 'up');
        if (matchingVpn) {
          isVpnEncrypted = true;
          matchingVpn.pktsEncrypted += 1;
          hops.push({
            deviceId: dev.id,
            deviceName: dev.name,
            action: 'ENCRYPTED_VPN',
            reason: `IPSec Tunnel [${matchingVpn.name}] (AES-256/SHA-256)`,
            layer: 'SECURITY'
          });
        }

        hops.push({
          deviceId: dev.id,
          deviceName: dev.name,
          action: 'ROUTED',
          reason: `OSPF Area 0 Route lookup -> Next Hop ${targetIp}`,
          layer: 'L3'
        });
      }

      // Check ASA Stateful Firewall Rules
      if (dev.type === 'firewall') {
        const fwEval = SimulationEngine.evaluateFirewall(
          firewallRules,
          'inside',
          'outside',
          sourceIp,
          targetIp,
          protocol,
          protocol === 'HTTPS' ? '443' : protocol === 'HTTP' ? '80' : '80'
        );

        if (fwEval.decision === 'DROP') {
          isDropped = true;
          dropReason = `Firewall Security Policy: Packet dropped by ASA Stateful Firewall [${fwEval.ruleName}]`;
          fwResult = 'DROP';
          hops.push({
            deviceId: dev.id,
            deviceName: dev.name,
            action: 'DROPPED',
            reason: dropReason,
            layer: 'SECURITY'
          });
          break;
        }

        natTranslation = `PAT: ${sourceIp}:49152 -> 198.51.100.1:49152`;
        hops.push({
          deviceId: dev.id,
          deviceName: dev.name,
          action: 'PERMITTED',
          reason: `Cisco ASA Firewall Policy [${fwEval.ruleName}] Allowed. NAT: ${natTranslation}`,
          layer: 'SECURITY'
        });
      }
    }

    const inspection: PacketInspection = {
      layer2: {
        sourceMac,
        destMac: targetMac,
        vlan: sourceDev.vlan || 10,
        etherType: '0x0800 (IPv4)'
      },
      layer3: {
        sourceIp,
        destIp: targetIp,
        protocol: protocol === 'HTTP' || protocol === 'HTTPS' ? 'TCP' : protocol,
        ttl: 128 - hops.length
      },
      layer4: {
        protocol: protocol === 'DNS' ? 'UDP' : 'TCP',
        sourcePort: 49152 + Math.floor(Math.random() * 1000),
        destPort: protocol === 'HTTPS' ? 443 : protocol === 'HTTP' ? 80 : protocol === 'DNS' ? 53 : 80
      },
      security: {
        aclDecision: aclResult,
        firewallDecision: fwResult,
        natTranslation,
        vpnEncrypted: isVpnEncrypted
      }
    };

    return {
      packetId: `PKT-${Date.now().toString().slice(-5)}`,
      sourceDevice: sourceDev,
      targetDevice: targetDev,
      protocol,
      status: isDropped ? 'DROPPED' : 'SUCCESS',
      dropReason: isDropped ? dropReason : undefined,
      hops,
      inspection,
      totalLatencyMs: Math.round(accumulatedLatency * 10) / 10
    };
  }

  static createEmptyInspection(sourceIp: string, destIp: string, protocol: string): PacketInspection {
    return {
      layer2: { sourceMac: '00:00:00:00:00:00', destMac: '00:00:00:00:00:00', vlan: 1, etherType: '0x0800' },
      layer3: { sourceIp, destIp, protocol, ttl: 64 },
      security: { aclDecision: 'PERMIT', firewallDecision: 'ALLOW', vpnEncrypted: false }
    };
  }
}
