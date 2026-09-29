export interface DashboardStats {
  totalInvestigations: number
  activeIncidents: number
  compromisedEndpoints: number
  isolatedEndpoints: number
  evidenceArtifactsCollected: number
  cryptographicProofsVerified: number
  coveragePercentageMitre: number
  systemReadinessScore: number
}

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalInvestigations: 14,
  activeIncidents: 3,
  compromisedEndpoints: 2,
  isolatedEndpoints: 1,
  evidenceArtifactsCollected: 48,
  cryptographicProofsVerified: 1045,
  coveragePercentageMitre: 74,
  systemReadinessScore: 96,
}

export const MOCK_RECENT_ACTIVITIES = [
  {
    id: "act-1",
    timestamp: "2026-09-29T17:25:00Z",
    title: "Adaptive Trigger fired on FIN-WS-44",
    type: "EXECUTION",
    severity: "CRITICAL",
    description: "YARA rule matched in-memory Cobalt Strike DLL injection.",
  },
  {
    id: "act-2",
    timestamp: "2026-09-29T16:20:15Z",
    title: "MFT Artifact Sealed in Merkle Root",
    type: "EVIDENCE",
    severity: "HIGH",
    description: "NTFS delta artifact locked with SHA-256 integrity signature.",
  },
  {
    id: "act-3",
    timestamp: "2026-09-29T14:48:00Z",
    title: "Workstation FIN-WS-44 Quarantined",
    type: "ENDPOINT",
    severity: "HIGH",
    description: "Isolated from corporate subnet while maintaining Nexus secure tunnel.",
  },
  {
    id: "act-4",
    timestamp: "2026-09-29T14:30:25Z",
    title: "Provenance Block #1043 Minted",
    type: "AUDIT",
    severity: "INFO",
    description: "Witness node verified cryptographic custody seal for LSASS memory dump.",
  },
]
