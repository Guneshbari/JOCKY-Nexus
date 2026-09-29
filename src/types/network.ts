export type NetworkProtocol = "TCP" | "UDP" | "ICMP" | "DNS" | "HTTP" | "HTTPS" | "SMB" | "RDP" | "SSH"

export interface NetworkConnection {
  id: string
  sourceEndpointId: string
  sourceIp: string
  sourcePort: number
  targetEndpointId?: string
  targetIp: string
  targetPort: number
  targetHostname?: string
  protocol: NetworkProtocol
  bytesTransferred: number
  packetsTransferred: number
  firstSeen: string
  lastSeen: string
  isLateralMovement: boolean
  isSuspiciousEgress: boolean
  threatScore: number
  dnsQuery?: string
  country?: string
}

export interface NetworkGraphNode {
  id: string
  label: string
  type: "ENDPOINT" | "EXTERNAL_IP" | "INTERNAL_SERVER" | "GATEWAY" | "C2_SUSPECT"
  ip: string
  isCompromised?: boolean
}

export interface NetworkGraphEdge {
  id: string
  source: string
  target: string
  label?: string
  protocol: NetworkProtocol
  isMalicious?: boolean
}
