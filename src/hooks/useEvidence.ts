import { useState, useMemo } from "react"
import { EvidenceArtifact, EvidenceType } from "@/types/evidence"
import { MOCK_EVIDENCE } from "@/data/evidence"

export function useEvidence(investigationId?: string) {
  const [evidenceList] = useState<EvidenceArtifact[]>(MOCK_EVIDENCE)
  const [typeFilter, setTypeFilter] = useState<EvidenceType | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null)

  const filteredEvidence = useMemo(() => {
    return evidenceList.filter((artifact) => {
      const matchesInvestigation = !investigationId || artifact.investigationId === investigationId
      const matchesType = typeFilter === "ALL" || artifact.type === typeFilter
      const matchesSearch =
        searchQuery === "" ||
        artifact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.sha256.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.endpointHostname.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesInvestigation && matchesType && matchesSearch
    })
  }, [evidenceList, investigationId, typeFilter, searchQuery])

  const selectedArtifact = useMemo(() => {
    return selectedArtifactId
      ? evidenceList.find((a) => a.id === selectedArtifactId) ?? null
      : null
  }, [evidenceList, selectedArtifactId])

  const stats = useMemo(() => {
    const totalBytes = evidenceList.reduce((acc, curr) => acc + curr.sizeBytes, 0)
    const verifiedCount = evidenceList.filter((a) => a.integrityVerified).length
    return {
      totalCount: evidenceList.length,
      totalBytes,
      verifiedCount,
      verificationRate: evidenceList.length > 0 ? (verifiedCount / evidenceList.length) * 100 : 0,
    }
  }, [evidenceList])

  return {
    evidence: filteredEvidence,
    allEvidence: evidenceList,
    selectedArtifact,
    selectedArtifactId,
    typeFilter,
    searchQuery,
    stats,
    setSelectedArtifactId,
    setTypeFilter,
    setSearchQuery,
  }
}
