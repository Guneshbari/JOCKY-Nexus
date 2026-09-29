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
