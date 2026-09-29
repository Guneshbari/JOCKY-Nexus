import { create } from "zustand"
import {
  Investigation,
  InvestigationStatus,
  InvestigationSeverity,
  InvestigationBuilderDraft,
  InvestigationConstraints,
  EvidenceRequirement,
} from "@/types/investigation"
import {
  AdaptiveExecutionProfile,
  AdaptiveDecision,
  AdaptiveSimulationStage,
  AdaptiveSimulationState,
  EndpointPosture,
  AdaptiveProfileId,
} from "@/types/execution"
import {
  EvidenceArtifact,
  EvidenceClass,
  EvidenceWorkflowStage,
  CollectionSimulationState,
} from "@/types/evidence"
import { MOCK_INVESTIGATIONS } from "@/data/investigations"
import { MOCK_ENDPOINTS } from "@/data/endpoints"
import { MOCK_EVIDENCE } from "@/data/evidence"
import {
  generateJockySpecification,
  generateJockyIR,
} from "@/lib/jockyGenerator"
import { deriveAllProfilesForInvestigation } from "@/lib/adaptivePlanner"
import { generateSimulatedEvidenceForInvestigation } from "@/lib/evidenceGenerator"

export const DEFAULT_CONSTRAINTS: InvestigationConstraints = {
  volatileEvidencePriority: true,
  minimalEndpointImpact: true,
  evidenceIntegrityRequired: true,
  networkCollectionEnabled: true,
  memoryAnalysisRequired: true,
  restrictedEndpointHandling: "ALLOW_AGENT_TUNNEL",
  maxInvestigationDuration: "30m",
  collectionPriority: "BALANCED",
}

export const DEFAULT_BUILDER_DRAFT: InvestigationBuilderDraft = {
  name: "Active Directory Kerberos & Lateral Staging Audit",
  caseName: "CASE-2026-KERB-04",
  intent: "Identify suspicious service ticket extraction and lateral process spawning across domain controllers and workstations.",
  description: "Synchronized cross-platform volatile telemetry and process inspection campaign.",
  priority: "HIGH",
  category: "CREDENTIAL ACCESS",
  evidenceRequirements: [
    "Process activity",
    "Network connections",
    "Authentication events",
    "Memory indicators",
  ],
  targetEndpoints: ["ep-dc-01", "ep-ws-44"],
  constraints: DEFAULT_CONSTRAINTS,
  adaptiveProfile: "PROFILE-A (VOLATILE TRIAGE)",
}

// Initial profile derivation
const initialInvestigation = MOCK_INVESTIGATIONS[0]
const { profiles: initialProfiles, decisions: initialDecisions, postures: initialPostures } =
  deriveAllProfilesForInvestigation(initialInvestigation, MOCK_ENDPOINTS)

export interface EvidenceFilterState {
  searchQuery: string
  endpointFilter: string | "ALL"
  evidenceClassFilter: EvidenceClass | "ALL"
  integrityFilter: "ALL" | "VERIFIED" | "PENDING"
  profileFilter: AdaptiveProfileId | "ALL"
  mitreFilter: string | "ALL"
}

export interface ProvenanceState {
  isSealed: boolean
  merkleRoot: string
  blockHeight: number
  chainIntegrity: "VERIFIED" | "TAMPERED" | "PENDING"
  lastSealedTimestamp: string
}

interface InvestigationState {
  // Collections & Active State
  investigations: Investigation[]
  selectedInvestigationId: string | null
  currentInvestigation: Investigation | null
  activeInvestigation: Investigation | null
  statusFilter: InvestigationStatus | "ALL"
  severityFilter: InvestigationSeverity | "ALL"
  searchQuery: string
  lastRefreshTimestamp: string

  // Builder Draft State
  builderDraft: InvestigationBuilderDraft
  selectedEndpoints: string[]
  selectedEvidence: EvidenceRequirement[]
  investigationConstraints: InvestigationConstraints

  // Phase 4: Adaptive Execution State
  executionStage: AdaptiveSimulationStage
  simulationPaused: boolean
  adaptiveSimulation: AdaptiveSimulationState
  selectedExecutionProfiles: Record<string, AdaptiveExecutionProfile>
  endpointDecisions: Record<string, AdaptiveDecision>
  endpointPostures: Record<string, EndpointPosture>

  // Phase 5: Evidence Intelligence State
  evidenceItems: EvidenceArtifact[]
  selectedEvidenceId: string | null
  activeEvidence: EvidenceArtifact | null
  evidenceFilters: EvidenceFilterState
  collectionSimulation: CollectionSimulationState
  provenanceState: ProvenanceState

  // Actions
  selectInvestigation: (id: string | null) => void
  setStatusFilter: (status: InvestigationStatus | "ALL") => void
  setSeverityFilter: (severity: InvestigationSeverity | "ALL") => void
  setSearchQuery: (query: string) => void
  setInvestigationStatus: (id: string, status: InvestigationStatus) => void
  updateInvestigationStatus: (id: string, status: InvestigationStatus) => void
  addInvestigation: (investigation: Investigation) => void
  createInvestigation: (customDraft?: Partial<InvestigationBuilderDraft>) => Investigation
  updateInvestigation: (id: string, updates: Partial<Investigation>) => void
  duplicateInvestigation: (id: string) => Investigation
  setBuilderDraft: (draft: Partial<InvestigationBuilderDraft>) => void
  resetBuilder: () => void
  launchAdaptiveAnalysis: (id: string) => void
  refreshTelemetry: () => void
  getInvestigationById: (id: string) => Investigation | undefined

  // Adaptive Execution Actions
  startAdaptiveAnalysis: (investigationId?: string) => void
  advanceAdaptiveStage: () => void
  setExecutionStage: (stage: AdaptiveSimulationStage) => void
  calculateExecutionProfiles: (investigationId?: string) => void
  pauseAdaptiveSimulation: () => void
  resumeAdaptiveSimulation: () => void
  resetAdaptiveSimulation: () => void
  setSelectedExecutionProfile: (endpointId: string, profile: AdaptiveExecutionProfile) => void
  beginEvidenceCollection: (investigationId?: string) => void

  // Phase 5: Evidence Intelligence Actions
  startEvidenceCollection: (investigationId?: string) => void
  advanceCollectionStage: () => void
  setCollectionStage: (stage: EvidenceWorkflowStage) => void
  pauseEvidenceSimulation: () => void
  resumeEvidenceSimulation: () => void
  resetEvidenceSimulation: () => void
  generateSimulatedEvidence: (investigationId?: string) => void
  selectEvidence: (id: string | null) => void
  setEvidenceFilter: (filters: Partial<EvidenceFilterState>) => void
  resetEvidenceFilters: () => void
  completeEvidenceCollection: () => void
}

export const useInvestigationStore = create<InvestigationState>((set, get) => ({
  investigations: MOCK_INVESTIGATIONS,
  selectedInvestigationId: MOCK_INVESTIGATIONS[0]?.id ?? null,
  currentInvestigation: MOCK_INVESTIGATIONS[0] ?? null,
  activeInvestigation: MOCK_INVESTIGATIONS[0] ?? null,
  statusFilter: "ALL",
  severityFilter: "ALL",
  searchQuery: "",
  lastRefreshTimestamp: new Date().toISOString(),

  builderDraft: DEFAULT_BUILDER_DRAFT,
  selectedEndpoints: DEFAULT_BUILDER_DRAFT.targetEndpoints,
  selectedEvidence: DEFAULT_BUILDER_DRAFT.evidenceRequirements,
  investigationConstraints: DEFAULT_BUILDER_DRAFT.constraints,

  // Adaptive execution initial state
  executionStage: 1,
  simulationPaused: false,
  selectedExecutionProfiles: initialProfiles,
  endpointDecisions: initialDecisions,
  endpointPostures: initialPostures,
  adaptiveSimulation: {
    currentStage: 1,
    isRunning: false,
    isPaused: false,
    isComplete: false,
    elapsedMs: 0,
    stageHistory: [
      {
        stage: 1,
        timestamp: new Date().toISOString(),
        note: "System online. Ingested forensic intent and case parameters.",
      },
    ],
  },

  // Evidence Intelligence initial state
  evidenceItems: MOCK_EVIDENCE,
  selectedEvidenceId: MOCK_EVIDENCE[0]?.id ?? null,
  activeEvidence: MOCK_EVIDENCE[0] ?? null,
  evidenceFilters: {
    searchQuery: "",
    endpointFilter: "ALL",
    evidenceClassFilter: "ALL",
    integrityFilter: "ALL",
    profileFilter: "ALL",
    mitreFilter: "ALL",
  },
  collectionSimulation: {
    currentStage: 6,
    isRunning: false,
    isPaused: false,
    isComplete: true,
    totalArtifacts: MOCK_EVIDENCE.length,
    verifiedArtifacts: MOCK_EVIDENCE.length,
    activeStepName: "Sealed & Verified",
    stageHistory: [
      { stage: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), title: "Collection", note: "Simulated artifacts harvested from adaptive profiles" },
      { stage: 2, timestamp: new Date(Date.now() - 3500000).toISOString(), title: "Normalization", note: "Standardized into common JOCKY evidence schema" },
      { stage: 3, timestamp: new Date(Date.now() - 3400000).toISOString(), title: "Integrity Seal", note: "Computed simulated SHA-256 integrity block seals" },
      { stage: 4, timestamp: new Date(Date.now() - 3300000).toISOString(), title: "Provenance Binding", note: "Chained into immutable non-volatile ledger" },
      { stage: 5, timestamp: new Date(Date.now() - 3200000).toISOString(), title: "MITRE Correlation", note: "Corroborated against MITRE ATT&CK techniques" },
      { stage: 6, timestamp: new Date(Date.now() - 3100000).toISOString(), title: "Verified Evidence", note: "100% evidence verified and court-admissible" },
    ],
  },
  provenanceState: {
    isSealed: true,
    merkleRoot: MOCK_INVESTIGATIONS[0].provenanceRootHash,
    blockHeight: 1045,
    chainIntegrity: "VERIFIED",
    lastSealedTimestamp: new Date().toISOString(),
  },

  selectInvestigation: (id) => {
    const inv = id ? get().investigations.find((i) => i.id === id) ?? null : null
    set({
      selectedInvestigationId: id,
      currentInvestigation: inv,
      activeInvestigation: inv,
    })
    if (inv) {
      const { profiles, decisions, postures } = deriveAllProfilesForInvestigation(inv, MOCK_ENDPOINTS)
      // Check or generate evidence for this investigation
      const generated = generateSimulatedEvidenceForInvestigation(inv, profiles, MOCK_ENDPOINTS)
      const existingIds = new Set(get().evidenceItems.map((e) => e.id))
      const merged = [
        ...get().evidenceItems,
        ...generated.filter((g) => !existingIds.has(g.id)),
      ]

      set({
        selectedExecutionProfiles: profiles,
        endpointDecisions: decisions,
        endpointPostures: postures,
        evidenceItems: merged,
        activeEvidence: merged.find((e) => e.investigationId === inv.id) ?? merged[0] ?? null,
        provenanceState: {
          ...get().provenanceState,
          merkleRoot: inv.provenanceRootHash,
        },
      })
    }
  },

  setStatusFilter: (status) => set({ statusFilter: status }),
  setSeverityFilter: (severity) => set({ severityFilter: severity }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  setInvestigationStatus: (id, status) => {
    set((state) => {
      const updated = state.investigations.map((inv) =>
        inv.id === id ? { ...inv, status, updatedAt: new Date().toISOString() } : inv
      )
      const current =
        state.selectedInvestigationId === id
          ? updated.find((i) => i.id === id) ?? null
          : state.currentInvestigation
      return {
        investigations: updated,
        currentInvestigation: current,
        activeInvestigation: current,
      }
    })
  },

  updateInvestigationStatus: (id, status) => get().setInvestigationStatus(id, status),

  addInvestigation: (investigation) => {
    set((state) => ({
      investigations: [investigation, ...state.investigations],
      selectedInvestigationId: investigation.id,
      currentInvestigation: investigation,
      activeInvestigation: investigation,
    }))
  },

  createInvestigation: (customDraft) => {
    const draft = { ...get().builderDraft, ...customDraft }
    const newId = `inv-2026-00${get().investigations.length + 1}`
    const randomHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")

    const jockySpec = generateJockySpecification(draft)
    const jockyIR = generateJockyIR(draft)

    const newInv: Investigation = {
      id: newId,
      title: draft.name,
      intent: draft.intent,
      description: draft.description,
      severity: draft.priority,
      status: "READY",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      initiatedBy: "DFIR-LEAD-ANALYST",
      targetEndpointIds: draft.targetEndpoints,
      evidenceCount: 0,
      provenanceRootHash: randomHash,
      progressPercentage: 0,
      adaptiveProfile: draft.adaptiveProfile,
      caseName: draft.caseName,
      category: draft.category,
      evidenceRequirements: draft.evidenceRequirements,
      constraints: draft.constraints,
      jockySpec,
      jockyIR,
      steps: [
        {
          id: `step-${newId}-1`,
          order: 1,
          title: "Preserve Volatile Artifacts",
          description: "Acquire ephemeral handle tables and volatile states",
          actionType: "EVIDENCE_COLLECT",
          status: "PENDING",
          targetEndpointIds: draft.targetEndpoints,
        },
        {
          id: `step-${newId}-2`,
          order: 2,
          title: "Inspect Process Lineage",
          description: "Correlate parent-child process relationships and signatures",
          actionType: "PROCESS_INTERROGATE",
          status: "PENDING",
          targetEndpointIds: draft.targetEndpoints,
        },
        {
          id: `step-${newId}-3`,
          order: 3,
          title: "Audit Network Socket Matrix",
          description: "Identify rogue TCP/UDP listening states and remote sessions",
          actionType: "NETWORK_TRACE",
          status: "PENDING",
          targetEndpointIds: draft.targetEndpoints,
        },
        {
          id: `step-${newId}-4`,
          order: 4,
          title: "Seal NVPL Merkle Block",
          description: "Generate cryptographic proof chain and seal artifacts",
          actionType: "HASH_VERIFY",
          status: "PENDING",
          targetEndpointIds: draft.targetEndpoints,
        },
      ],
      findings: [],
    }

    set((state) => ({
      investigations: [newInv, ...state.investigations],
      selectedInvestigationId: newId,
      currentInvestigation: newInv,
      activeInvestigation: newInv,
    }))

    // Automatically compute adaptive profiles and evidence for new investigation
    const { profiles, decisions, postures } = deriveAllProfilesForInvestigation(newInv, MOCK_ENDPOINTS)
    const generatedEvidence = generateSimulatedEvidenceForInvestigation(newInv, profiles, MOCK_ENDPOINTS)

    set((state) => ({
      selectedExecutionProfiles: profiles,
      endpointDecisions: decisions,
      endpointPostures: postures,
      evidenceItems: [...generatedEvidence, ...state.evidenceItems],
      activeEvidence: generatedEvidence[0] ?? state.activeEvidence,
    }))

    return newInv
  },

  updateInvestigation: (id, updates) => {
    set((state) => {
      const updated = state.investigations.map((inv) =>
        inv.id === id ? { ...inv, ...updates, updatedAt: new Date().toISOString() } : inv
      )
      const current =
        state.selectedInvestigationId === id
          ? updated.find((i) => i.id === id) ?? null
          : state.currentInvestigation
      return {
        investigations: updated,
        currentInvestigation: current,
        activeInvestigation: current,
      }
    })
  },

  duplicateInvestigation: (id) => {
    const existing = get().investigations.find((i) => i.id === id)
    const baseTitle = existing ? existing.title : "Investigation"
    const newId = `inv-2026-00${Math.floor(Math.random() * 90) + 10}`
    const randomHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")

    const duplicated: Investigation = {
      ...(existing ?? MOCK_INVESTIGATIONS[0]),
      id: newId,
      title: `${baseTitle} (Copy)`,
      caseName: `${existing?.caseName ?? "CASE"}-COPY`,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progressPercentage: 0,
      evidenceCount: 0,
      provenanceRootHash: randomHash,
      steps: (existing?.steps ?? []).map((s, idx) => ({
        ...s,
        id: `step-${newId}-${idx + 1}`,
        status: "PENDING",
        completedAt: undefined,
      })),
      findings: [],
    }

    set((state) => ({
      investigations: [duplicated, ...state.investigations],
      selectedInvestigationId: newId,
      currentInvestigation: duplicated,
      activeInvestigation: duplicated,
    }))

    return duplicated
  },

  setBuilderDraft: (updates) => {
    set((state) => {
      const newDraft = { ...state.builderDraft, ...updates }
      return {
        builderDraft: newDraft,
        selectedEndpoints: newDraft.targetEndpoints,
        selectedEvidence: newDraft.evidenceRequirements,
        investigationConstraints: newDraft.constraints,
      }
    })
  },

  resetBuilder: () => {
    set({
      builderDraft: DEFAULT_BUILDER_DRAFT,
      selectedEndpoints: DEFAULT_BUILDER_DRAFT.targetEndpoints,
      selectedEvidence: DEFAULT_BUILDER_DRAFT.evidenceRequirements,
      investigationConstraints: DEFAULT_BUILDER_DRAFT.constraints,
    })
  },

  launchAdaptiveAnalysis: (id) => {
    get().selectInvestigation(id)
    get().startAdaptiveAnalysis(id)
  },

  refreshTelemetry: () =>
    set((state) => ({
      lastRefreshTimestamp: new Date().toISOString(),
      investigations: state.investigations.map((inv) => {
        if (inv.status === "IN_PROGRESS") {
          const delta = Math.floor(Math.random() * 5) + 1
          const nextProgress = Math.min(99, inv.progressPercentage + delta)
          return {
            ...inv,
            progressPercentage: nextProgress,
            updatedAt: new Date().toISOString(),
          }
        }
        return inv
      }),
    })),

  getInvestigationById: (id) => get().investigations.find((inv) => inv.id === id),

  // Phase 4: Adaptive Execution Actions
  startAdaptiveAnalysis: (investigationId) => {
    if (investigationId) {
      get().selectInvestigation(investigationId)
    }
    const inv = get().currentInvestigation ?? get().investigations[0]
    if (inv) {
      const { profiles, decisions, postures } = deriveAllProfilesForInvestigation(inv, MOCK_ENDPOINTS)
      set({
        selectedExecutionProfiles: profiles,
        endpointDecisions: decisions,
        endpointPostures: postures,
        executionStage: 1,
        simulationPaused: false,
        adaptiveSimulation: {
          currentStage: 1,
          isRunning: true,
          isPaused: false,
          isComplete: false,
          elapsedMs: 0,
          stageHistory: [
            {
              stage: 1,
              timestamp: new Date().toISOString(),
              note: "Ingested forensic intent and case parameters.",
            },
          ],
        },
      })
    }
  },

  advanceAdaptiveStage: () => {
    const current = get().executionStage
    if (current < 7) {
      const nextStage = (current + 1) as AdaptiveSimulationStage
      const stageNotes: Record<AdaptiveSimulationStage, string> = {
        1: "Ingested forensic intent and case parameters",
        2: "Compiled platform-independent JOCKY IR AST",
        3: "Evaluated target endpoint telemetry readiness and host status",
        4: "Assessed security posture boundaries and collector restrictions",
        5: "Derived deterministic adaptive profile mapping",
        6: "Synthesized host-specific execution profiles and collector sequences",
        7: "Execution profiles verified and sealed; ready for evidence collection",
      }
      set((state) => ({
        executionStage: nextStage,
        adaptiveSimulation: {
          ...state.adaptiveSimulation,
          currentStage: nextStage,
          isComplete: nextStage === 7,
          stageHistory: [
            ...state.adaptiveSimulation.stageHistory,
            {
              stage: nextStage,
              timestamp: new Date().toISOString(),
              note: stageNotes[nextStage],
            },
          ],
        },
      }))
    }
  },

  setExecutionStage: (stage) => {
    set((state) => ({
      executionStage: stage,
      adaptiveSimulation: {
        ...state.adaptiveSimulation,
        currentStage: stage,
        isComplete: stage === 7,
      },
    }))
  },

  calculateExecutionProfiles: (investigationId) => {
    const inv = investigationId
      ? get().investigations.find((i) => i.id === investigationId) ??
        get().currentInvestigation ??
        get().investigations[0]
      : get().currentInvestigation ?? get().investigations[0]
    if (!inv) return
    const { profiles, decisions, postures } = deriveAllProfilesForInvestigation(inv, MOCK_ENDPOINTS)
    set({
      selectedExecutionProfiles: profiles,
      endpointDecisions: decisions,
      endpointPostures: postures,
    })
  },

  pauseAdaptiveSimulation: () => {
    set((state) => ({
      simulationPaused: true,
      adaptiveSimulation: {
        ...state.adaptiveSimulation,
        isRunning: false,
        isPaused: true,
      },
    }))
  },

  resumeAdaptiveSimulation: () => {
    set((state) => ({
      simulationPaused: false,
      adaptiveSimulation: {
        ...state.adaptiveSimulation,
        isRunning: true,
        isPaused: false,
      },
    }))
  },

  resetAdaptiveSimulation: () => {
    const inv = get().currentInvestigation ?? get().investigations[0]
    const { profiles, decisions, postures } = deriveAllProfilesForInvestigation(inv, MOCK_ENDPOINTS)
    set({
      executionStage: 1,
      simulationPaused: false,
      selectedExecutionProfiles: profiles,
      endpointDecisions: decisions,
      endpointPostures: postures,
      adaptiveSimulation: {
        currentStage: 1,
        isRunning: false,
        isPaused: false,
        isComplete: false,
        elapsedMs: 0,
        stageHistory: [
          {
            stage: 1,
            timestamp: new Date().toISOString(),
            note: "Simulation reset to Stage 1: Forensic Intent",
          },
        ],
      },
    })
  },

  setSelectedExecutionProfile: (endpointId, profile) => {
    set((state) => ({
      selectedExecutionProfiles: {
        ...state.selectedExecutionProfiles,
        [endpointId]: profile,
      },
    }))
  },

  beginEvidenceCollection: (investigationId) => {
    const targetId =
      investigationId ?? get().currentInvestigation?.id ?? get().investigations[0].id
    get().setInvestigationStatus(targetId, "IN_PROGRESS")
    get().generateSimulatedEvidence(targetId)
    get().startEvidenceCollection(targetId)
  },

  // Phase 5: Evidence Intelligence Actions
  startEvidenceCollection: (investigationId) => {
    const inv = investigationId
      ? get().investigations.find((i) => i.id === investigationId) ?? get().currentInvestigation ?? get().investigations[0]
      : get().currentInvestigation ?? get().investigations[0]

    const invEvidence = get().evidenceItems.filter((e) => e.investigationId === inv.id)
    const count = invEvidence.length > 0 ? invEvidence.length : 3

    set({
      collectionSimulation: {
        currentStage: 1,
        isRunning: true,
        isPaused: false,
        isComplete: false,
        totalArtifacts: count,
        verifiedArtifacts: 0,
        activeStepName: "1. Collecting Endpoint Artifacts",
        stageHistory: [
          {
            stage: 1,
            timestamp: new Date().toISOString(),
            title: "Collection Initialized",
            note: `Harvesting simulated telemetry from ${inv.targetEndpointIds.length} target hosts.`,
          },
        ],
      },
    })
  },

  advanceCollectionStage: () => {
    const current = get().collectionSimulation.currentStage
    const total = get().collectionSimulation.totalArtifacts

    if (current < 6) {
      const nextStage = (current + 1) as EvidenceWorkflowStage
      const stepNames: Record<EvidenceWorkflowStage, string> = {
        1: "1. Harvesting Adaptive Collectors",
        2: "2. Normalizing Evidence Schema",
        3: "3. Generating SHA-256 Seals",
        4: "4. Binding NVPL Provenance",
        5: "5. Correlating MITRE ATT&CK",
        6: "6. Verified & Court Admissible",
      }
      const stageNotes: Record<EvidenceWorkflowStage, string> = {
        1: "Simulated artifacts collected across Windows and Linux targets.",
        2: "Raw telemetry normalized into structured JOCKY evidence classes.",
        3: "Cryptographic SHA-256 integrity digests computed and sealed.",
        4: "Artifacts anchored into append-only cryptographic provenance ledger.",
        5: "Corroborated observations mapped against MITRE ATT&CK techniques.",
        6: "All artifacts verified with zero integrity violations.",
      }

      set((state) => ({
        collectionSimulation: {
          ...state.collectionSimulation,
          currentStage: nextStage,
          isComplete: nextStage === 6,
          isRunning: nextStage < 6,
          verifiedArtifacts: nextStage === 6 ? total : Math.floor((total * nextStage) / 6),
          activeStepName: stepNames[nextStage],
          stageHistory: [
            ...state.collectionSimulation.stageHistory,
            {
              stage: nextStage,
              timestamp: new Date().toISOString(),
              title: stepNames[nextStage],
              note: stageNotes[nextStage],
            },
          ],
        },
      }))

      if (nextStage === 6) {
        get().completeEvidenceCollection()
      }
    }
  },

  setCollectionStage: (stage) => {
    set((state) => ({
      collectionSimulation: {
        ...state.collectionSimulation,
        currentStage: stage,
        isComplete: stage === 6,
      },
    }))
  },

  pauseEvidenceSimulation: () => {
    set((state) => ({
      collectionSimulation: {
        ...state.collectionSimulation,
        isRunning: false,
        isPaused: true,
      },
    }))
  },

  resumeEvidenceSimulation: () => {
    set((state) => ({
      collectionSimulation: {
        ...state.collectionSimulation,
        isRunning: true,
        isPaused: false,
      },
    }))
  },

  resetEvidenceSimulation: () => {
    const inv = get().currentInvestigation ?? get().investigations[0]
    const invEvidence = get().evidenceItems.filter((e) => e.investigationId === inv.id)
    set({
      collectionSimulation: {
        currentStage: 1,
        isRunning: false,
        isPaused: false,
        isComplete: false,
        totalArtifacts: invEvidence.length || 3,
        verifiedArtifacts: 0,
        activeStepName: "1. Ready to Collect",
        stageHistory: [
          {
            stage: 1,
            timestamp: new Date().toISOString(),
            title: "Simulation Reset",
            note: "Reset evidence pipeline to Stage 1.",
          },
        ],
      },
    })
  },

  generateSimulatedEvidence: (investigationId) => {
    const inv = investigationId
      ? get().investigations.find((i) => i.id === investigationId) ?? get().currentInvestigation ?? get().investigations[0]
      : get().currentInvestigation ?? get().investigations[0]
    if (!inv) return

    const { profiles } = deriveAllProfilesForInvestigation(inv, MOCK_ENDPOINTS)
    const generated = generateSimulatedEvidenceForInvestigation(inv, profiles, MOCK_ENDPOINTS)
    const existingIds = new Set(get().evidenceItems.map((e) => e.id))
    const merged = [
      ...get().evidenceItems,
      ...generated.filter((g) => !existingIds.has(g.id)),
    ]

    set({
      evidenceItems: merged,
      activeEvidence: generated[0] ?? get().activeEvidence,
    })
  },

  selectEvidence: (id) => {
    const found = id ? get().evidenceItems.find((e) => e.id === id) ?? null : null
    set({
      selectedEvidenceId: id,
      activeEvidence: found,
    })
  },

  setEvidenceFilter: (filters) => {
    set((state) => ({
      evidenceFilters: {
        ...state.evidenceFilters,
        ...filters,
      },
    }))
  },

  resetEvidenceFilters: () => {
    set({
      evidenceFilters: {
        searchQuery: "",
        endpointFilter: "ALL",
        evidenceClassFilter: "ALL",
        integrityFilter: "ALL",
        profileFilter: "ALL",
        mitreFilter: "ALL",
      },
    })
  },

  completeEvidenceCollection: () => {
    const inv = get().currentInvestigation ?? get().investigations[0]
    get().setInvestigationStatus(inv.id, "COMPLETED")
    set((state) => ({
      provenanceState: {
        ...state.provenanceState,
        isSealed: true,
        chainIntegrity: "VERIFIED",
        lastSealedTimestamp: new Date().toISOString(),
      },
      evidenceItems: state.evidenceItems.map((item) =>
        item.investigationId === inv.id
          ? { ...item, integrityVerified: true, integrityStatus: "VERIFIED", provenanceStatus: "SEALED" }
          : item
      ),
    }))
  },
}))
