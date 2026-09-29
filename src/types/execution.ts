export type ExecutionState = "PENDING" | "PLANNING" | "EXECUTING" | "ADAPTING" | "VERIFYING" | "COMPLETED" | "HALTED"

export interface ExecutionCommand {
  id: string
  commandText: string
  targetEndpoint: string
  adaptiveTrigger?: string
  status: "QUEUED" | "SENT" | "ACKNOWLEDGED" | "EXECUTED" | "VERIFIED" | "FAILED"
  exitCode?: number
  stdoutExcerpt?: string
  stderrExcerpt?: string
  executedAt?: string
}

export interface AdaptiveBranch {
  condition: string
  triggeredAt: string
  decisionRationale: string
  divertedToStep: string
}

export interface ExecutionLogEntry {
  id: string
  timestamp: string
  level: "INFO" | "WARN" | "ERROR" | "DEBUG" | "SECURITY"
  endpointId?: string
  message: string
  rawProofHash?: string
}

export interface ExecutionPlan {
  id: string
  investigationId: string
  title: string
  currentState: ExecutionState
  startedAt: string
  completedAt?: string
  commands: ExecutionCommand[]
  adaptiveBranches: AdaptiveBranch[]
  logs: ExecutionLogEntry[]
}

// ==========================================
// Phase 4: Adaptive Execution Intelligence Types
// ==========================================

export type AdaptiveProfileId = "PROFILE-A" | "PROFILE-B" | "PROFILE-C" | "PROFILE-D"

export interface CollectionStepPlan {
  order: number
  action: string
  target: string
  collector: string
  expectedArtifact: string
}

export interface AdaptiveExecutionProfile {
  id: AdaptiveProfileId
  name: string
  platform: "WINDOWS" | "UBUNTU" | "CROSS_PLATFORM" | "MACOS"
  focus: string[]
  impactPolicy: "MINIMAL" | "LOW" | "STANDARD"
  targetEndpointId: string
  targetHostname: string
  collectors: string[]
  collectionSequence: CollectionStepPlan[]
  expectedEvidence: string[]
  resourcePolicy: string
  integrityPolicy: string
  provenancePolicy: string
  readinessStatus: "READY" | "COMPILING" | "ANALYZING"
}

export interface EndpointPosture {
  endpointId: string
  hostname: string
  platform: string
  postureLevel: "RESTRICTED" | "HARDENED" | "ELEVATED" | "STANDARD"
  telemetryReadiness: number
  collectionRestrictions: string[]
  availableAdapters: string[]
  riskFlags: string[]
  policyConstraints: string[]
}

export interface AdaptiveDecisionFactor {
  id: string
  category: "INTENT" | "OS_ARCHITECTURE" | "SECURITY_POSTURE" | "TELEMETRY_READINESS" | "SAFETY_CONSTRAINT"
  title: string
  observation: string
  impactOnProfile: string
}

export interface AdaptiveDecision {
  endpointId: string
  hostname: string
  selectedProfileId: AdaptiveProfileId
  profileName: string
  rationale: string
  factors: AdaptiveDecisionFactor[]
  calculatedAt: string
}

export type AdaptiveSimulationStage = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface AdaptiveSimulationState {
  currentStage: AdaptiveSimulationStage
  isRunning: boolean
  isPaused: boolean
  isComplete: boolean
  elapsedMs: number
  stageHistory: {
    stage: AdaptiveSimulationStage
    timestamp: string
    note: string
  }[]
}
