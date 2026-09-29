// JOCKY Nexus - Execution Feature Module
// Architecture Rule: Phase 4 Adaptive Execution Intelligence Feature Components

export * from "./AdaptiveStagePipeline"
export * from "./InvestigationContextCard"
export * from "./EndpointPostureMatrix"
export * from "./AdaptiveDecisionPanel"
export * from "./ExecutionProfileCard"
export * from "./EndpointProfileTable"
export * from "./DecisionReasoningTimeline"
export * from "./AdaptiveSimulationControls"
export * from "./CollectionReadinessCard"
export * from "./AdaptiveExecutionGraph"
export * from "./AdaptiveExecutionWorkspace"

export const EXECUTION_FEATURE_META = {
  name: "execution",
  status: "ACTIVE",
  phase: "PHASE_4_ADAPTIVE_EXECUTION",
} as const
