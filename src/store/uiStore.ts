import { create } from "zustand"

export const TOTAL_DEMO_STEPS = 8

interface UIState {
  isSidebarOpen: boolean
  isSimulationMode: boolean
  activeModal: string | null
  activeInspectorId: string | null
  isJudgeDemoActive: boolean
  judgeDemoStep: number

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSimulationMode: (active: boolean) => void
  openModal: (modalId: string) => void
  closeModal: () => void
  inspectItem: (id: string | null) => void
  setJudgeDemoActive: (active: boolean) => void
  toggleJudgeDemo: () => void
  setJudgeDemoStep: (step: number) => void
  nextJudgeDemoStep: () => void
  prevJudgeDemoStep: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isSimulationMode: true,
  activeModal: null,
  activeInspectorId: null,
  isJudgeDemoActive: false,
  judgeDemoStep: 0,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setSimulationMode: (active) => set({ isSimulationMode: active }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  inspectItem: (id) => set({ activeInspectorId: id }),
  setJudgeDemoActive: (active) => set({ isJudgeDemoActive: active }),
  toggleJudgeDemo: () => set((state) => ({ isJudgeDemoActive: !state.isJudgeDemoActive })),
  setJudgeDemoStep: (step) =>
    set({
      judgeDemoStep: Math.max(0, Math.min(step, TOTAL_DEMO_STEPS - 1)),
    }),
  nextJudgeDemoStep: () =>
    set((state) => ({
      judgeDemoStep: Math.min(state.judgeDemoStep + 1, TOTAL_DEMO_STEPS - 1),
    })),
  prevJudgeDemoStep: () =>
    set((state) => ({
      judgeDemoStep: Math.max(state.judgeDemoStep - 1, 0),
    })),
}))
