import { AdaptiveProfileId } from "./execution"

export type EvidenceType = 
  | "MEMORY_DUMP" 
  | "DISK_IMAGE" 
  | "PCAP_NETWORK" 
  | "PROCESS_DUMP" 
  | "SYSTEM_LOG" 
  | "REGISTRY_HIVE"
  | "FILE_ARTIFACT"

export type EvidenceClass =
  | "PROCESS"
  | "NETWORK"
  | "AUTHENTICATION"
  | "PERSISTENCE"
  | "FILESYSTEM"
  | "SYSTEM_LOG"
  | "MEMORY_INDICATOR"
  | "DNS"
  | "SERVICE"
  | "DRIVER_INVENTORY"
  | "CONTAINER"
  | "USER_ACTIVITY"

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
  evidenceClass: EvidenceClass
  executionProfileId: AdaptiveProfileId
  executionProfileName: string
  collector: string
  sizeBytes: number
  sha256: string
  sha1?: string
  md5?: string
  collectedAt: string
  sourcePath: string
  chainHash: string
  previousChainHash?: string
  merkleLeafIndex: number
  merkleProof?: string[]
  integrityVerified: boolean
  integrityStatus: "VERIFIED" | "PENDING" | "SEALED" | "EXCEPTION"
  provenanceStatus: "SEALED" | "BOUND" | "PENDING"
  normalizedType: string
  schemaStatus: "NORMALIZED" | "STANDARDIZED" | "CONVERTED"
  mitreTechniqueId?: string
  mitreTechniqueName?: string
  mitreTactic?: string
  mitreConfidence?: "HIGH" | "MEDIUM" | "LOW"
  mitreObservation?: string
  custodyChain: CustodyAction[]
  tags: string[]
  metadata: Record<string, string | number | boolean>
}

// ==========================================
// Phase 5: Evidence Intelligence Domain Models
// ==========================================

export interface EvidenceIntegrity {
  evidenceId: string
  sha256: string
  sealStatus: "VERIFIED" | "PENDING" | "TAMPER_EVIDENT"
  verificationTimestamp: string
  algorithm: "SHA-256"
  merkleLeafIndex: number
  merkleRoot: string
}

export interface EvidenceProvenance {
  evidenceId: string
  investigationId: string
  executionProfileId: AdaptiveProfileId
  endpointId: string
  evidenceHash: string
  previousChainHash: string
  currentChainHash: string
  blockHeight: number
  chainStatus: "SEALED" | "LINKED"
  sealedAt: string
}

export interface EvidenceCorrelation {
  evidenceId: string
  observation: string
  techniqueId: string
  techniqueName: string
  tactic: string
  confidence: "HIGH" | "MEDIUM" | "LOW"
  supportingEvidence: string
}

export type EvidenceWorkflowStage = 1 | 2 | 3 | 4 | 5 | 6

export interface CollectionSimulationState {
  currentStage: EvidenceWorkflowStage
  isRunning: boolean
  isPaused: boolean
  isComplete: boolean
  totalArtifacts: number
  verifiedArtifacts: number
  activeStepName: string
  stageHistory: {
    stage: EvidenceWorkflowStage
    timestamp: string
    title: string
    note: string
  }[]
}
