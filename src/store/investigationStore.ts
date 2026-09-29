import { create } from "zustand"
import { Investigation, InvestigationStatus, InvestigationSeverity } from "@/types/investigation"
import { MOCK_INVESTIGATIONS } from "@/data/investigations"

interface InvestigationState {
  investigations: Investigation[]
  selectedInvestigationId: string | null
  statusFilter: InvestigationStatus | "ALL"
  severityFilter: InvestigationSeverity | "ALL"
  searchQuery: string
  lastRefreshTimestamp: string

  // Actions
  selectInvestigation: (id: string | null) => void
  setStatusFilter: (status: InvestigationStatus | "ALL") => void
  setSeverityFilter: (severity: InvestigationSeverity | "ALL") => void
  setSearchQuery: (query: string) => void
  updateInvestigationStatus: (id: string, status: InvestigationStatus) => void
  addInvestigation: (investigation: Investigation) => void
  refreshTelemetry: () => void
  getInvestigationById: (id: string) => Investigation | undefined
}

export const useInvestigationStore = create<InvestigationState>((set, get) => ({
  investigations: MOCK_INVESTIGATIONS,
  selectedInvestigationId: MOCK_INVESTIGATIONS[0]?.id ?? null,
  statusFilter: "ALL",
  severityFilter: "ALL",
  searchQuery: "",
  lastRefreshTimestamp: new Date().toISOString(),

  selectInvestigation: (id) => set({ selectedInvestigationId: id }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSeverityFilter: (severity) => set({ severityFilter: severity }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  updateInvestigationStatus: (id, status) =>
    set((state) => ({
      investigations: state.investigations.map((inv) =>
        inv.id === id ? { ...inv, status, updatedAt: new Date().toISOString() } : inv
      ),
    })),
  addInvestigation: (investigation) =>
    set((state) => ({
      investigations: [investigation, ...state.investigations],
      selectedInvestigationId: investigation.id,
      lastRefreshTimestamp: new Date().toISOString(),
    })),
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
