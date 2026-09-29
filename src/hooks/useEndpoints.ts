import { useMemo } from "react"
import { useEndpointStore } from "@/store/endpointStore"

export function useEndpoints() {
  const {
    endpoints,
    selectedEndpointId,
    platformFilter,
    isolationFilter,
    searchQuery,
    selectEndpoint,
    setPlatformFilter,
    setIsolationFilter,
    setSearchQuery,
    toggleIsolation,
    getEndpointById,
  } = useEndpointStore()

  const selectedEndpoint = useMemo(() => {
    return selectedEndpointId ? endpoints.find((ep) => ep.id === selectedEndpointId) ?? null : null
  }, [endpoints, selectedEndpointId])

  const filteredEndpoints = useMemo(() => {
    return endpoints.filter((ep) => {
      const matchesPlatform = platformFilter === "ALL" || ep.platform === platformFilter
      const matchesIsolation = isolationFilter === "ALL" || ep.isolationStatus === isolationFilter
      const matchesSearch =
        searchQuery === "" ||
        ep.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.ipAddress.includes(searchQuery) ||
        ep.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesPlatform && matchesIsolation && matchesSearch
    })
  }, [endpoints, platformFilter, isolationFilter, searchQuery])

  const stats = useMemo(() => {
    return {
      total: endpoints.length,
      online: endpoints.filter((ep) => ep.agentStatus === "ONLINE").length,
      isolated: endpoints.filter((ep) => ep.isolationStatus === "ISOLATED").length,
      compromised: endpoints.filter((ep) => ep.activeInvestigations.length > 0).length,
    }
  }, [endpoints])

  return {
    endpoints: filteredEndpoints,
    allEndpoints: endpoints,
    selectedEndpoint,
    selectedEndpointId,
    platformFilter,
    isolationFilter,
    searchQuery,
    stats,
    selectEndpoint,
    setPlatformFilter,
    setIsolationFilter,
    setSearchQuery,
    toggleIsolation,
    getEndpointById,
  }
}
