import { create } from "zustand"

interface UIState {
  isSidebarOpen: boolean
  isSimulationMode: boolean
  activeModal: string | null
  activeInspectorId: string | null

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSimulationMode: (active: boolean) => void
  openModal: (modalId: string) => void
  closeModal: () => void
  inspectItem: (id: string | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isSimulationMode: true,
  activeModal: null,
  activeInspectorId: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setSimulationMode: (active) => set({ isSimulationMode: active }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  inspectItem: (id) => set({ activeInspectorId: id }),
}))
