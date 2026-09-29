import { useMemo } from "react"
import { useInvestigationStore } from "@/store/investigationStore"

export function useInvestigation() {
  const {
    investigations,
    selectedInvestigationId,
    statusFilter,
    severityFilter,
    searchQuery,
    selectInvestigation,
    setStatusFilter,
    setSeverityFilter,
    setSearchQuery,
    updateInvestigationStatus,
    getInvestigationById,
  } = useInvestigationStore()

  const selectedInvestigation = useMemo(() => {
    return selectedInvestigationId
      ? investigations.find((inv) => inv.id === selectedInvestigationId) ?? null
      : null
  }, [investigations, selectedInvestigationId])

  const filteredInvestigations = useMemo(() => {
    return investigations.filter((inv) => {
      const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter
      const matchesSeverity = severityFilter === "ALL" || inv.severity === severityFilter
      const matchesSearch =
        searchQuery === "" ||
        inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.intent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesSeverity && matchesSearch
    })
  }, [investigations, statusFilter, severityFilter, searchQuery])

  const stats = useMemo(() => {
    return {
      total: investigations.length,
      inProgress: investigations.filter((inv) => inv.status === "IN_PROGRESS").length,
      completed: investigations.filter((inv) => inv.status === "COMPLETED").length,
      failed: investigations.filter((inv) => inv.status === "FAILED").length,
    }
  }, [investigations])

  return {
    investigations: filteredInvestigations,
    allInvestigations: investigations,
    selectedInvestigation,
    selectedInvestigationId,
    statusFilter,
    severityFilter,
    searchQuery,
    stats,
    selectInvestigation,
    setStatusFilter,
    setSeverityFilter,
    setSearchQuery,
    updateInvestigationStatus,
    getInvestigationById,
  }
}
