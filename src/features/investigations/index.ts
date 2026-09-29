// JOCKY Nexus - Investigations Feature Module
// Architecture Rule: Feature-specific UI and interaction logic for multi-endpoint investigations

export * from "./InvestigationStepIndicator"
export * from "./ForensicIntentForm"
export * from "./EvidenceRequirementSelector"
export * from "./EndpointSelector"
export * from "./InvestigationConstraints"
export * from "./JockyCommandPreview"
export * from "./JockyIRPreview"
export * from "./InvestigationReadinessCard"
export * from "./InvestigationFilters"
export * from "./InvestigationBuilder"
export * from "./InvestigationList"
export * from "./InvestigationDetailView"

export const INVESTIGATIONS_FEATURE_META = {
  name: "investigations",
  status: "ACTIVE",
  phase: "PHASE_3_INVESTIGATION_BUILDER",
} as const
