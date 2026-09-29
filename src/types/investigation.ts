export type InvestigationStatus = 
  | "DRAFT" 
  | "READY" 
  | "QUEUED" 
  | "IN_PROGRESS" 
  | "COMPLETED" 
  | "PAUSED" 
  | "FAILED"

export type InvestigationSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"

export type InvestigationCategory =
  | "RANSOMWARE ANALYSIS"
  | "LATERAL MOVEMENT"
  | "CREDENTIAL ACCESS"
  | "PERSISTENCE ANALYSIS"
  | "NETWORK ANOMALY"
  | "ENDPOINT TRIAGE"
  | "ROOTKIT / KERNEL AUDIT"
  | "CUSTOM FORENSIC QUERY"

export type EvidenceRequirement =
  | "Process activity"
  | "Network connections"
  | "Services"
  | "Persistence artifacts"
  | "Authentication events"
  | "System logs"
  | "File metadata"
  | "Memory indicators"
  | "Container activity"
  | "Kernel / driver inventory"
  | "DNS activity"
  | "User activity"

export interface InvestigationConstraints {
  volatileEvidencePriority: boolean
  minimalEndpointImpact: boolean
  evidenceIntegrityRequired: boolean
  networkCollectionEnabled: boolean
  memoryAnalysisRequired: boolean
  restrictedEndpointHandling: "ALLOW_AGENT_TUNNEL" | "STRICT_QUARANTINE" | "PASSIVE_ONLY"
  maxInvestigationDuration: "15m" | "30m" | "1h" | "4h"
  collectionPriority: "HIGH" | "BALANCED" | "STEALTH_PRESERVING"
}

export interface JockySpecification {
  rawCommand: string
  intentBlock: string
  targetBlock: string[]
  evidenceBlock: string[]
  constraintBlock: string[]
  executionPolicy: string
  provenancePolicy: string
}

export interface JockyIRPreview {
  schemaVersion: "v1.0.0-jocky-ir"
  intent: string
  category: InvestigationCategory
  target: string[]
  evidence: string[]
  constraints: string[]
  execution_policy: string
  provenance_policy: string
  adaptive_routing_enabled: boolean
  merkle_tree_height: number
}

export interface InvestigationBuilderDraft {
  name: string
  caseName: string
  intent: string
  description: string
  priority: InvestigationSeverity
  category: InvestigationCategory
  evidenceRequirements: EvidenceRequirement[]
  targetEndpoints: string[]
  constraints: InvestigationConstraints
  adaptiveProfile: string
}

export interface InvestigationStep {
  id: string
  order: number
  title: string
  description: string
  actionType: "EVIDENCE_COLLECT" | "MEMORY_ACQUIRE" | "PROCESS_INTERROGATE" | "NETWORK_TRACE" | "REGISTRY_INSPECT" | "HASH_VERIFY"
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "SKIPPED"
  targetEndpointIds: string[]
  completedAt?: string
  resultArtifactId?: string
}

export interface InvestigationFinding {
  id: string
  title: string
  severity: InvestigationSeverity
  description: string
  mitreTechniqueId?: string
  endpointId: string
  confidence: number
  timestamp: string
}

export interface Investigation {
  id: string
  title: string
  intent: string
  description: string
  severity: InvestigationSeverity
  status: InvestigationStatus
  createdAt: string
  updatedAt: string
  initiatedBy: string
  targetEndpointIds: string[]
  steps: InvestigationStep[]
  findings: InvestigationFinding[]
  evidenceCount: number
  provenanceRootHash: string
  progressPercentage: number
  adaptiveProfile?: string
  caseName?: string
  category?: InvestigationCategory
  evidenceRequirements?: EvidenceRequirement[]
  constraints?: InvestigationConstraints
  jockySpec?: JockySpecification
  jockyIR?: JockyIRPreview
}
