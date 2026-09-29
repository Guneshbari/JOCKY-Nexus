export type NetworkProtocol =
  | "TCP"
  | "UDP"
  | "ICMP"
  | "DNS"
  | "HTTP"
  | "HTTPS"
  | "SMB"
  | "RDP"
  | "SSH"
  | "TLS"

export type NetworkRiskLevel = "INFO" | "LOW" | "MEDIUM" | "HIGH"

export type NetworkConnectionStatus = "OBSERVED" | "FLAGGED" | "BLOCKED"

export interface NetworkConnection {
  id: string
  investigationId: string
  sourceEndpointId: string
  sourceEndpointHostname: string
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
  timestamp: string
  status: NetworkConnectionStatus
  riskLevel: NetworkRiskLevel
  isLateralMovement: boolean
  isSuspiciousEgress: boolean
  threatScore: number
  dnsQuery?: string
  country?: string
  executionProfileId?: string
  mitreTechniques?: string[]
  evidenceId?: string
  supportingEvidence?: string
}

export interface NetworkFinding {
  findingId: string
  investigationId: string
  evidenceId: string
  sourceEndpoint: string
  destination: string
  protocol: NetworkProtocol
  port: number
  timestamp: string
  status: NetworkConnectionStatus
  riskLevel: NetworkRiskLevel
  mitreTechniques: string[]
  supportingEvidence: string
  executionProfileId?: string
  details?: string
}

export interface NetworkFilterState {
  search: string
  protocol: NetworkProtocol | "ALL"
  endpoint: string | "ALL"
  riskLevel: "ALL" | NetworkRiskLevel
  investigationId: string | "ALL"
}

export interface NetworkGraphNode {
  id: string
  label: string
  type:
    | "ENDPOINT"
    | "EXTERNAL_IP"
    | "INTERNAL_SERVER"
    | "GATEWAY"
    | "DNS_RESOLVER"
    | "SERVICE"
    | "C2_SUSPECT"
  ip: string
  isCompromised?: boolean
  endpointId?: string
  os?: string
}

export interface NetworkGraphEdge {
  id: string
  source: string
  target: string
  label?: string
  protocol: NetworkProtocol
  port?: number
  isMalicious?: boolean
  connectionId?: string
}
