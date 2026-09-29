"use client"

import React, { useState, useMemo } from "react"
import {
  Search,
  Database,
  ShieldCheck,
  Server,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EvidenceArtifact, EvidenceClass } from "@/types/evidence"
import { AdaptiveProfileId } from "@/types/execution"
import { truncateHash } from "@/lib/formatters"

interface EvidenceExplorerProps {
  evidenceItems: EvidenceArtifact[]
  selectedEvidenceId: string | null
  onSelectEvidence: (evidence: EvidenceArtifact) => void
}

const ALL_CLASSES: EvidenceClass[] = [
  "PROCESS",
  "NETWORK",
  "AUTHENTICATION",
  "PERSISTENCE",
  "FILESYSTEM",
  "SYSTEM_LOG",
  "MEMORY_INDICATOR",
  "DNS",
  "SERVICE",
  "DRIVER_INVENTORY",
  "CONTAINER",
  "USER_ACTIVITY",
]

export function EvidenceExplorer({
  evidenceItems,
  selectedEvidenceId,
  onSelectEvidence,
}: EvidenceExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [endpointFilter, setEndpointFilter] = useState<string>("ALL")
  const [classFilter, setClassFilter] = useState<EvidenceClass | "ALL">("ALL")
  const [profileFilter, setProfileFilter] = useState<AdaptiveProfileId | "ALL">("ALL")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")

  // Extract unique endpoints
  const endpointsList = useMemo(() => {
    const list = Array.from(new Set(evidenceItems.map((e) => e.endpointHostname)))
    return list
  }, [evidenceItems])

  // Filtered & sorted artifacts
  const filteredEvidence = useMemo(() => {
    return evidenceItems
      .filter((item) => {
        if (endpointFilter !== "ALL" && item.endpointHostname !== endpointFilter) return false
        if (classFilter !== "ALL" && item.evidenceClass !== classFilter) return false
        if (profileFilter !== "ALL" && item.executionProfileId !== profileFilter) return false

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchId = item.id.toLowerCase().includes(q)
          const matchName = item.name.toLowerCase().includes(q)
          const matchHost = item.endpointHostname.toLowerCase().includes(q)
          const matchHash = item.sha256.toLowerCase().includes(q)
          const matchMitre = item.mitreTechniqueId?.toLowerCase().includes(q) ?? false
          const matchObs = item.mitreObservation?.toLowerCase().includes(q) ?? false
          if (!matchId && !matchName && !matchHost && !matchHash && !matchMitre && !matchObs) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => {
        const timeA = new Date(a.collectedAt).getTime()
        const timeB = new Date(b.collectedAt).getTime()
        return sortOrder === "desc" ? timeB - timeA : timeA - timeB
      })
  }, [evidenceItems, endpointFilter, classFilter, profileFilter, searchQuery, sortOrder])

  const handleResetFilters = () => {
    setSearchQuery("")
    setEndpointFilter("ALL")
    setClassFilter("ALL")
    setProfileFilter("ALL")
  }

  const getProfileBadgeVariant = (id: AdaptiveProfileId) => {
    switch (id) {
      case "PROFILE-A":
        return "warning"
      case "PROFILE-B":
        return "cyber"
      case "PROFILE-C":
        return "success"
      case "PROFILE-D":
        return "default"
      default:
        return "neutral"
    }
  }

  return (
    <div className="border-3 border-black bg-white shadow-[4px_4px_0px_#000] font-mono space-y-3 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-black" />
          <h3 className="text-xs font-black uppercase text-black">
            INTERACTIVE EVIDENCE EXPLORER & REGISTRY
          </h3>
          <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
            {filteredEvidence.length} / {evidenceItems.length}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(searchQuery || endpointFilter !== "ALL" || classFilter !== "ALL" || profileFilter !== "ALL") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2 py-1 border border-black bg-rose-100 hover:bg-rose-200 text-xs font-black cursor-pointer text-rose-900"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-black bg-zinc-100 hover:bg-zinc-200 text-xs font-black cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>SORT: {sortOrder === "desc" ? "NEWEST FIRST" : "OLDEST FIRST"}</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by ID, name, hash, MITRE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 border-2 border-black bg-zinc-50 text-xs font-bold focus:outline-none focus:bg-white"
          />
        </div>

        {/* Endpoint filter */}
        <select
          value={endpointFilter}
          onChange={(e) => setEndpointFilter(e.target.value)}
          className="p-1.5 border-2 border-black bg-zinc-50 text-xs font-bold text-black focus:outline-none"
        >
          <option value="ALL">ALL ENDPOINTS</option>
          {endpointsList.map((ep) => (
            <option key={ep} value={ep}>
              {ep}
            </option>
          ))}
        </select>

        {/* Evidence Class Filter */}
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value as EvidenceClass | "ALL")}
          className="p-1.5 border-2 border-black bg-zinc-50 text-xs font-bold text-black focus:outline-none"
        >
          <option value="ALL">ALL EVIDENCE CLASSES</option>
          {ALL_CLASSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Adaptive Profile Filter */}
        <select
          value={profileFilter}
          onChange={(e) => setProfileFilter(e.target.value as AdaptiveProfileId | "ALL")}
          className="p-1.5 border-2 border-black bg-zinc-50 text-xs font-bold text-black focus:outline-none"
        >
          <option value="ALL">ALL PROFILES</option>
          <option value="PROFILE-A">PROFILE-A (VOLATILE)</option>
          <option value="PROFILE-B">PROFILE-B (CONTAINMENT)</option>
          <option value="PROFILE-C">PROFILE-C (LINUX AUDIT)</option>
          <option value="PROFILE-D">PROFILE-D (NETWORK)</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border-2 border-black w-full min-w-0">
        <table className="w-full min-w-[900px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-zinc-100 text-[10px] font-black uppercase text-zinc-700">
              <th className="p-2.5 border-r border-black">Artifact ID</th>
              <th className="p-2.5 border-r border-black">Source Host</th>
              <th className="p-2.5 border-r border-black">Artifact Name</th>
              <th className="p-2.5 border-r border-black">Evidence Class</th>
              <th className="p-2.5 border-r border-black">Execution Profile</th>
              <th className="p-2.5 border-r border-black">SHA-256 Seal</th>
              <th className="p-2.5 border-r border-black">MITRE</th>
              <th className="p-2.5 border-r border-black">Provenance</th>
              <th className="p-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvidence.map((art) => {
              const isSelected = selectedEvidenceId === art.id

              return (
                <tr
                  key={art.id}
                  onClick={() => onSelectEvidence(art)}
                  className={`border-b border-black transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-amber-100 font-bold"
                      : "hover:bg-zinc-50 bg-white"
                  }`}
                >
                  {/* ID */}
                  <td className="p-2.5 border-r border-black">
                    <span className="font-mono text-[11px] font-black bg-black text-amber-300 px-1.5 py-0.5 border border-black">
                      {art.id}
                    </span>
                  </td>

                  {/* Endpoint */}
                  <td className="p-2.5 border-r border-black font-bold">
                    <div className="flex items-center gap-1.5 truncate">
                      <Server className="w-3.5 h-3.5 text-black shrink-0" />
                      <span className="truncate">{art.endpointHostname}</span>
                    </div>
                  </td>

                  {/* Name */}
                  <td className="p-2.5 border-r border-black font-black text-black">
                    <div className="truncate max-w-xs">{art.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Collector: {art.collector}
                    </div>
                  </td>

                  {/* Class */}
                  <td className="p-2.5 border-r border-black">
                    <Badge variant="neutral" className="text-[10px]">
                      {art.evidenceClass}
                    </Badge>
                  </td>

                  {/* Execution Profile */}
                  <td className="p-2.5 border-r border-black">
                    <Badge variant={getProfileBadgeVariant(art.executionProfileId)}>
                      {art.executionProfileId}
                    </Badge>
                  </td>

                  {/* SHA-256 */}
                  <td className="p-2.5 border-r border-black font-mono text-[11px]">
                    <div className="flex items-center gap-1 text-emerald-700 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span title={art.sha256}>{truncateHash(art.sha256, 4, 4)}</span>
                    </div>
                  </td>

                  {/* MITRE */}
                  <td className="p-2.5 border-r border-black">
                    {art.mitreTechniqueId ? (
                      <span className="font-mono text-[10px] font-black bg-amber-200 border border-black px-1.5 py-0.5">
                        {art.mitreTechniqueId}
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>

                  {/* Provenance */}
                  <td className="p-2.5 border-r border-black font-mono text-[11px] font-bold">
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-600">
                      LEAF #{art.merkleLeafIndex}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-2.5 text-right font-black">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectEvidence(art)
                      }}
                      className="px-2 py-1 text-[10px] bg-black text-amber-300 border border-black hover:bg-zinc-800"
                    >
                      INSPECT
                    </button>
                  </td>
                </tr>
              )
            })}

            {filteredEvidence.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-zinc-500 font-bold">
                  No forensic artifacts match the active filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
