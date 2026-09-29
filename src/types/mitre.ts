export type MitreTacticName =
  | "Initial Access"
  | "Execution"
  | "Persistence"
  | "Privilege Escalation"
  | "Defense Evasion"
  | "Credential Access"
  | "Discovery"
  | "Lateral Movement"
  | "Collection"
  | "Command and Control"
  | "Exfiltration"
  | "Impact"

export interface MitreTechnique {
  id: string
  name: string
  tactic: MitreTacticName
  description: string
  detectionCount: number
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  confidence: "HIGH" | "MEDIUM" | "LOW"
  affectedEndpoints: string[]
  evidenceArtifactIds: string[]
  subTechniques?: string[]
  investigationIds: string[]
  mitreUrl?: string
  networkFindingIds?: string[]
}

export interface MitreCorrelation {
  correlationId: string
  investigationId: string
  evidenceId: string
  evidenceName: string
  techniqueId: string
  techniqueName: string
  tactic: MitreTacticName
  confidence: "HIGH" | "MEDIUM" | "LOW"
  endpointHostname: string
  observedBehavior: string
  timestamp: string
  adaptiveProfileId?: string
  networkFindingId?: string
}

export interface MitreMatrixSummary {
  totalTechniquesDetected: number
  tacticsCoveredCount: number
  topThreatVector: string
  coveragePercentage: number
  highConfidenceCount: number
  mediumConfidenceCount: number
}

export interface MitreFilterState {
  search: string
  tactic: MitreTacticName | "ALL"
  confidence: "ALL" | "HIGH" | "MEDIUM" | "LOW"
  investigationId: string | "ALL"
}
