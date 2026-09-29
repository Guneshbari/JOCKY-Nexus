// JOCKY Nexus - Evidence Intelligence Feature Module

export { EvidenceIntelligenceWorkspace } from "./EvidenceIntelligenceWorkspace"
export { EvidencePipeline } from "./EvidencePipeline"
export { EvidenceMetrics } from "./EvidenceMetrics"
export { CollectionSimulationPanel } from "./CollectionSimulationPanel"
export { EvidenceExplorer } from "./EvidenceExplorer"
export { EvidenceDetailDrawer } from "./EvidenceDetailDrawer"
export { IntegritySealCard } from "./IntegritySealCard"
export { ProvenanceChain } from "./ProvenanceChain"
export { MerkleTreeView } from "./MerkleTreeView"
export { MitreCorrelationPanel } from "./MitreCorrelationPanel"
export { EvidenceCollectionSummary } from "./EvidenceCollectionSummary"

export const EVIDENCE_FEATURE_META = {
  name: "evidence",
  status: "ACTIVE",
  phase: "PHASE_5_EVIDENCE_INTELLIGENCE",
} as const
