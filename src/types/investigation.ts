export type InvestigationStatus = "DRAFT" | "QUEUED" | "IN_PROGRESS" | "COMPLETED" | "FAILED"

export type InvestigationSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"

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
}
