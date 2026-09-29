export type EvidenceType = 
  | "MEMORY_DUMP" 
  | "DISK_IMAGE" 
  | "PCAP_NETWORK" 
  | "PROCESS_DUMP" 
  | "SYSTEM_LOG" 
  | "REGISTRY_HIVE"
  | "FILE_ARTIFACT"

export interface CustodyAction {
  timestamp: string
  action: "COLLECTED" | "HASHED" | "VERIFIED" | "SEALED" | "TRANSFERRED" | "EXPORTED"
  operator: string
  nodeId: string
  signature: string
}

export interface EvidenceArtifact {
  id: string
  investigationId: string
  endpointId: string
  endpointHostname: string
  name: string
  type: EvidenceType
  sizeBytes: number
  sha256: string
  sha1?: string
  md5?: string
  collectedAt: string
  sourcePath: string
  chainHash: string
  merkleLeafIndex: number
  integrityVerified: boolean
  custodyChain: CustodyAction[]
  tags: string[]
  metadata: Record<string, string | number | boolean>
}
