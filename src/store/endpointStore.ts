import { create } from "zustand"
import { Endpoint, EndpointIsolationStatus, EndpointPlatform } from "@/types/endpoint"
import { MOCK_ENDPOINTS } from "@/data/endpoints"

interface EndpointState {
  endpoints: Endpoint[]
  selectedEndpointId: string | null
  platformFilter: EndpointPlatform | "ALL"
  isolationFilter: EndpointIsolationStatus | "ALL"
  searchQuery: string

  // Actions
  selectEndpoint: (id: string | null) => void
  setPlatformFilter: (platform: EndpointPlatform | "ALL") => void
  setIsolationFilter: (status: EndpointIsolationStatus | "ALL") => void
  setSearchQuery: (query: string) => void
  toggleIsolation: (endpointId: string) => void
  getEndpointById: (id: string) => Endpoint | undefined
}

export const useEndpointStore = create<EndpointState>((set, get) => ({
  endpoints: MOCK_ENDPOINTS,
  selectedEndpointId: null,
  platformFilter: "ALL",
  isolationFilter: "ALL",
  searchQuery: "",

  selectEndpoint: (id) => set({ selectedEndpointId: id }),
  setPlatformFilter: (platform) => set({ platformFilter: platform }),
  setIsolationFilter: (isolationFilter) => set({ isolationFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  toggleIsolation: (endpointId) =>
    set((state) => ({
      endpoints: state.endpoints.map((ep) => {
        if (ep.id !== endpointId) return ep
        const newStatus: EndpointIsolationStatus =
          ep.isolationStatus === "ISOLATED" ? "UNRESTRICTED" : "ISOLATED"
        return { ...ep, isolationStatus: newStatus }
      }),
    })),
  getEndpointById: (id) => get().endpoints.find((ep) => ep.id === id),
}))
