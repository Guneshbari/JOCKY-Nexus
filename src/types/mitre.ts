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
  affectedEndpoints: string[]
  evidenceArtifactIds: string[]
  subTechniques?: string[]
}

export interface MitreMatrixSummary {
  totalTechniquesDetected: number
  tacticsCoveredCount: number
  topThreatVector: string
  coveragePercentage: number
}
