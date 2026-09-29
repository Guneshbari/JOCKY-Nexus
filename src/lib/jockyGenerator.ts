import {
  InvestigationBuilderDraft,
  JockySpecification,
  JockyIRPreview,
} from "@/types/investigation"

export function formatEvidenceSlug(req: string): string {
  return req.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
}

export function generateJockyCommand(draft: InvestigationBuilderDraft): string {
  const targetStr = draft.targetEndpoints.length > 0 
    ? draft.targetEndpoints.join(",") 
    : "all_monitored_nodes"
  
  const evidenceStr = draft.evidenceRequirements.length > 0
    ? draft.evidenceRequirements.map(formatEvidenceSlug).join(",")
    : "process_activity,network_connections"

  const constraintFlags: string[] = []
  if (draft.constraints.volatileEvidencePriority) constraintFlags.push("priority:volatile")
  if (draft.constraints.minimalEndpointImpact) constraintFlags.push("impact:minimal")
  if (draft.constraints.evidenceIntegrityRequired) constraintFlags.push("integrity:sha256_merkle")
  if (draft.constraints.networkCollectionEnabled) constraintFlags.push("capture:network_flows")
  if (draft.constraints.memoryAnalysisRequired) constraintFlags.push("acquire:memory_handles")
  constraintFlags.push(`duration:${draft.constraints.maxInvestigationDuration}`)
  constraintFlags.push(`quarantine:${draft.constraints.restrictedEndpointHandling}`)

  const intentClean = draft.intent.replace(/"/g, "'").trim()

  return `INVESTIGATE targets:[${targetStr}]
  FOR intent:"${intentClean}"
  CATEGORY ${draft.category.replace(/\s+/g, "_")}
  ANALYZE [${evidenceStr}]
  CONSTRAIN [${constraintFlags.join(", ")}]
  REQUIRE integrity:sha256_sealed
  PROFILE adaptive:"${draft.adaptiveProfile}"`
}

export function generateJockySpecification(draft: InvestigationBuilderDraft): JockySpecification {
  const rawCommand = generateJockyCommand(draft)
  
  const constraintList: string[] = []
  if (draft.constraints.volatileEvidencePriority) constraintList.push("Volatile Evidence First (LSASS/Heap)")
  if (draft.constraints.minimalEndpointImpact) constraintList.push("Minimal Agent Overhead (<5% CPU)")
  if (draft.constraints.evidenceIntegrityRequired) constraintList.push("Cryptographic SHA-256 + Merkle Seal")
  if (draft.constraints.networkCollectionEnabled) constraintList.push("Live PCAP/Flow Telemetry")
  if (draft.constraints.memoryAnalysisRequired) constraintList.push("In-Memory Section Dissection")
  constraintList.push(`Max Window: ${draft.constraints.maxInvestigationDuration}`)
  constraintList.push(`Policy: ${draft.constraints.restrictedEndpointHandling}`)

  return {
    rawCommand,
    intentBlock: draft.intent,
    targetBlock: draft.targetEndpoints,
    evidenceBlock: draft.evidenceRequirements,
    constraintBlock: constraintList,
    executionPolicy: `ADAPTIVE (${draft.adaptiveProfile})`,
    provenancePolicy: draft.constraints.evidenceIntegrityRequired ? "NVPL-SEALED (MERKLE-256)" : "STANDARD-LOGGED",
  }
}

export function generateJockyIR(draft: InvestigationBuilderDraft): JockyIRPreview {
  return {
    schemaVersion: "v1.0.0-jocky-ir",
    intent: draft.intent,
    category: draft.category,
    target: draft.targetEndpoints,
    evidence: draft.evidenceRequirements.map(formatEvidenceSlug),
    constraints: [
      `volatile_priority:${draft.constraints.volatileEvidencePriority}`,
      `minimal_impact:${draft.constraints.minimalEndpointImpact}`,
      `integrity_seal:${draft.constraints.evidenceIntegrityRequired}`,
      `duration:${draft.constraints.maxInvestigationDuration}`,
      `quarantine_mode:${draft.constraints.restrictedEndpointHandling}`,
    ],
    execution_policy: `ADAPTIVE_${draft.adaptiveProfile.replace(/[^A-Z0-9]/g, "_")}`,
    provenance_policy: "SEALED_MERKLE_TREE",
    adaptive_routing_enabled: true,
    merkle_tree_height: 16,
  }
}
