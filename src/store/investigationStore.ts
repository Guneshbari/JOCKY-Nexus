import { create } from "zustand"
import {
  Investigation,
  InvestigationStatus,
  InvestigationSeverity,
  InvestigationBuilderDraft,
  InvestigationConstraints,
  EvidenceRequirement,
} from "@/types/investigation"
import { MOCK_INVESTIGATIONS } from "@/data/investigations"
import {
  generateJockySpecification,
  generateJockyIR,
} from "@/lib/jockyGenerator"

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

interface InvestigationState {
  // Collections & Active State
  investigations: Investigation[]
  selectedInvestigationId: string | null
  currentInvestigation: Investigation | null
  statusFilter: InvestigationStatus | "ALL"
  severityFilter: InvestigationSeverity | "ALL"
  searchQuery: string
  lastRefreshTimestamp: string

  // Builder Draft State
  builderDraft: InvestigationBuilderDraft
  selectedEndpoints: string[]
  selectedEvidence: EvidenceRequirement[]
  investigationConstraints: InvestigationConstraints

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
}

export const useInvestigationStore = create<InvestigationState>((set, get) => ({
  investigations: MOCK_INVESTIGATIONS,
  selectedInvestigationId: MOCK_INVESTIGATIONS[0]?.id ?? null,
  currentInvestigation: MOCK_INVESTIGATIONS[0] ?? null,
  statusFilter: "ALL",
  severityFilter: "ALL",
  searchQuery: "",
  lastRefreshTimestamp: new Date().toISOString(),

  builderDraft: DEFAULT_BUILDER_DRAFT,
  selectedEndpoints: DEFAULT_BUILDER_DRAFT.targetEndpoints,
  selectedEvidence: DEFAULT_BUILDER_DRAFT.evidenceRequirements,
  investigationConstraints: DEFAULT_BUILDER_DRAFT.constraints,

  selectInvestigation: (id) => {
    const inv = id ? get().investigations.find((i) => i.id === id) ?? null : null
    set({ selectedInvestigationId: id, currentInvestigation: inv })
  },

  setStatusFilter: (status) => set({ statusFilter: status }),
  setSeverityFilter: (severity) => set({ severityFilter: severity }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setInvestigationStatus: (id, status) => {
    set((state) => {
      const updated = state.investigations.map((inv) =>
        inv.id === id ? { ...inv, status, updatedAt: new Date().toISOString() } : inv
      )
      const current = state.selectedInvestigationId === id 
        ? updated.find((i) => i.id === id) ?? null 
        : state.currentInvestigation
      return { investigations: updated, currentInvestigation: current }
    })
  },

  updateInvestigationStatus: (id, status) => get().setInvestigationStatus(id, status),

  addInvestigation: (investigation) =>
    set((state) => ({
      investigations: [investigation, ...state.investigations],
      selectedInvestigationId: investigation.id,
      currentInvestigation: investigation,
      lastRefreshTimestamp: new Date().toISOString(),
    })),

  createInvestigation: (customDraft) => {
    const draft: InvestigationBuilderDraft = {
      ...get().builderDraft,
      ...(customDraft ?? {}),
    }

    const newId = `inv-2026-00${Math.floor(Math.random() * 90) + 10}`
    const randomHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")

    const jockySpec = generateJockySpecification(draft)
    const jockyIR = generateJockyIR(draft)

    const newInv: Investigation = {
      id: newId,
      title: draft.name,
      caseName: draft.caseName,
      intent: draft.intent,
      description: draft.description,
      severity: draft.priority,
      status: "READY",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      initiatedBy: "Lead-Forensic-Analyst (JOCKY Builder)",
      targetEndpointIds: draft.targetEndpoints,
      progressPercentage: 0,
      evidenceCount: 0,
      adaptiveProfile: draft.adaptiveProfile,
      category: draft.category,
      evidenceRequirements: draft.evidenceRequirements,
      constraints: draft.constraints,
      jockySpec,
      jockyIR,
      provenanceRootHash: randomHash,
      steps: [
        {
          id: `step-${newId}-1`,
          order: 1,
          title: "Capture Process Handle Hierarchy & Memory Maps",
          description: "Acquire thread stacks and unbacked executable allocations.",
          actionType: "PROCESS_INTERROGATE",
          status: "PENDING",
          targetEndpointIds: draft.targetEndpoints,
        },
        {
          id: `step-${newId}-2`,
          order: 2,
          title: "Network Flow Correlation & Egress Tracing",
          description: "Analyze anomalous socket connections and beacon frequency.",
          actionType: "NETWORK_TRACE",
          status: "PENDING",
          targetEndpointIds: draft.targetEndpoints,
        },
        {
          id: `step-${newId}-3`,
          order: 3,
          title: "Cryptographic Evidence Sealing & Merkle Leaf Minting",
          description: "Seal collected artifacts into immutable audit trail.",
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
      lastRefreshTimestamp: new Date().toISOString(),
    }))

    return newInv
  },

  updateInvestigation: (id, updates) => {
    set((state) => {
      const updated = state.investigations.map((inv) =>
        inv.id === id ? { ...inv, ...updates, updatedAt: new Date().toISOString() } : inv
      )
      const current = state.selectedInvestigationId === id
        ? updated.find((i) => i.id === id) ?? null
        : state.currentInvestigation
      return { investigations: updated, currentInvestigation: current }
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
    get().setInvestigationStatus(id, "IN_PROGRESS")
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
}))
