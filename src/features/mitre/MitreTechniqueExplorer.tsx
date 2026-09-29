"use client"

import React, { useState, useMemo } from "react"
import {
  Search,
  RotateCcw,
  Target,
  FileCheck2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MitreTechnique, MitreTacticName } from "@/types/mitre"

interface MitreTechniqueExplorerProps {
  techniques: MitreTechnique[]
  selectedTechniqueId: string | null
  onSelectTechnique: (technique: MitreTechnique) => void
}

export function MitreTechniqueExplorer({
  techniques,
  selectedTechniqueId,
  onSelectTechnique,
}: MitreTechniqueExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [tacticFilter, setTacticFilter] = useState<MitreTacticName | "ALL">("ALL")
  const [confidenceFilter, setConfidenceFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL")

  // Filtered techniques
  const filteredTechniques = useMemo(() => {
    return techniques.filter((t) => {
      if (tacticFilter !== "ALL" && t.tactic !== tacticFilter) return false
      if (confidenceFilter !== "ALL" && t.confidence !== confidenceFilter) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchId = t.id.toLowerCase().includes(q)
        const matchName = t.name.toLowerCase().includes(q)
        const matchTactic = t.tactic.toLowerCase().includes(q)
        const matchEp = t.affectedEndpoints.some((ep) => ep.toLowerCase().includes(q))
        return matchId || matchName || matchTactic || matchEp
      }

      return true
    })
  }, [techniques, tacticFilter, confidenceFilter, searchQuery])

  const handleResetFilters = () => {
    setSearchQuery("")
    setTacticFilter("ALL")
    setConfidenceFilter("ALL")
  }

  // Extract unique tactics for filter
  const tacticsList = useMemo(() => {
    return Array.from(new Set(techniques.map((t) => t.tactic)))
  }, [techniques])

  return (
    <div className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono p-4 space-y-3">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-black uppercase text-black">
              ATT&CK Technique Registry & Evidence Explorer
            </h3>
            <span className="text-xs bg-amber-300 px-2 py-0.5 border border-black font-black">
              {filteredTechniques.length} / {techniques.length} TECHNIQUES
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-600">
            Searchable registry cross-referencing adversary techniques with host telemetry and evidence artifacts.
          </p>
        </div>

        {(searchQuery || tacticFilter !== "ALL" || confidenceFilter !== "ALL") && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 border-2 border-black bg-rose-100 hover:bg-rose-200 text-xs font-black cursor-pointer text-rose-900 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by ID, name, tactic, endpoint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 border-2 border-black bg-zinc-50 text-xs font-bold focus:outline-none focus:bg-white"
          />
        </div>

        {/* Tactic Filter */}
        <select
          value={tacticFilter}
          onChange={(e) => setTacticFilter(e.target.value as MitreTacticName | "ALL")}
          className="p-1.5 border-2 border-black bg-zinc-50 text-xs font-bold text-black focus:outline-none"
        >
          <option value="ALL">ALL TACTICS</option>
          {tacticsList.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Confidence Filter */}
        <select
          value={confidenceFilter}
          onChange={(e) => setConfidenceFilter(e.target.value as "ALL" | "HIGH" | "MEDIUM" | "LOW")}
          className="p-1.5 border-2 border-black bg-zinc-50 text-xs font-bold text-black focus:outline-none"
        >
          <option value="ALL">ALL CONFIDENCE LEVELS</option>
          <option value="HIGH">HIGH CONFIDENCE</option>
          <option value="MEDIUM">MEDIUM CONFIDENCE</option>
          <option value="LOW">LOW CONFIDENCE</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border-2 border-black">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-zinc-100 text-[10px] font-black uppercase text-zinc-700">
              <th className="p-2.5 border-r border-black">Technique ID</th>
              <th className="p-2.5 border-r border-black">Technique Name</th>
              <th className="p-2.5 border-r border-black">Tactic</th>
              <th className="p-2.5 border-r border-black">Detections</th>
              <th className="p-2.5 border-r border-black">Evidence</th>
              <th className="p-2.5 border-r border-black">Confidence</th>
              <th className="p-2.5 text-right">Affected Endpoints</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {filteredTechniques.map((tech) => {
              const isSelected = tech.id === selectedTechniqueId

              return (
                <tr
                  key={tech.id}
                  onClick={() => onSelectTechnique(tech)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-amber-100 font-bold" : "hover:bg-amber-50"
                  }`}
                >
                  <td className="p-2.5 border-r border-black font-mono font-black text-black">
                    <span className="bg-black text-white px-1.5 py-0.5 text-[11px]">
                      {tech.id}
                    </span>
                  </td>
                  <td className="p-2.5 border-r border-black font-bold text-black">
                    {tech.name}
                  </td>
                  <td className="p-2.5 border-r border-black">
                    <Badge variant="neutral" className="text-[10px]">
                      {tech.tactic}
                    </Badge>
                  </td>
                  <td className="p-2.5 border-r border-black font-mono font-black text-zinc-900">
                    {tech.detectionCount} hits
                  </td>
                  <td className="p-2.5 border-r border-black">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>{tech.evidenceArtifactIds.length} Artifacts</span>
                    </div>
                  </td>
                  <td className="p-2.5 border-r border-black">
                    <Badge
                      variant={tech.confidence === "HIGH" ? "success" : "warning"}
                      className="text-[10px]"
                    >
                      {tech.confidence}
                    </Badge>
                  </td>
                  <td className="p-2.5 text-right font-mono text-[11px] text-zinc-700">
                    {tech.affectedEndpoints.join(", ")}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
