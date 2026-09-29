"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Target,
  Grid,
  Layers,
  Database,
  Radio,
  ChevronDown,
  Clock,
} from "lucide-react"
import { useInvestigationStore } from "@/store/investigationStore"
import { Badge } from "@/components/ui/badge"
import { MitreTechnique } from "@/types/mitre"
import {
  MOCK_MITRE_SUMMARY,
  MOCK_MITRE_TECHNIQUES,
} from "@/data/mitre"

import { MitreMetrics } from "./MitreMetrics"
import { MitreTacticCoverage } from "./MitreTacticCoverage"
import { MitreTechniqueMatrix } from "./MitreTechniqueMatrix"
import { MitreTechniqueExplorer } from "./MitreTechniqueExplorer"
import { MitreCorrelationTimeline } from "./MitreCorrelationTimeline"
import { MitreTechniqueDrawer } from "./MitreTechniqueDrawer"

export function MitreIntelligenceWorkspace() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryInvestigationId = searchParams.get("id")
  const queryTechniqueId = searchParams.get("technique")

  const {
    investigations,
    activeInvestigation,
    selectInvestigation,
    mitreCorrelations,
  } = useInvestigationStore()

  // Selected technique (user clicked or from URL query)
  const [userSelectedTechnique, setUserSelectedTechnique] = useState<MitreTechnique | null>(null)
  const [activeTab, setActiveTab] = useState<"matrix" | "explorer" | "coverage" | "timeline">("matrix")

  const selectedTechnique = useMemo(() => {
    if (userSelectedTechnique) return userSelectedTechnique
    if (queryTechniqueId) {
      const q = queryTechniqueId.toUpperCase().trim()
      return (
        MOCK_MITRE_TECHNIQUES.find((t) => t.id === q) ??
        MOCK_MITRE_TECHNIQUES.find((t) => t.id.startsWith(q + ".") || t.id.startsWith(q)) ??
        null
      )
    }
    return null
  }, [userSelectedTechnique, queryTechniqueId])

  // Sync investigation from query parameter if provided
  useEffect(() => {
    if (queryInvestigationId && (!activeInvestigation || activeInvestigation.id !== queryInvestigationId)) {
      const match = investigations.find((inv) => inv.id === queryInvestigationId)
      if (match) {
        selectInvestigation(match.id)
      }
    }
  }, [queryInvestigationId, activeInvestigation, investigations, selectInvestigation])

  // Active techniques matching investigation if selected
  const activeTechniques = useMemo(() => {
    if (!activeInvestigation) return MOCK_MITRE_TECHNIQUES
    const filtered = MOCK_MITRE_TECHNIQUES.filter((t) =>
      t.investigationIds.includes(activeInvestigation.id)
    )
    return filtered.length > 0 ? filtered : MOCK_MITRE_TECHNIQUES
  }, [activeInvestigation])

  const handleInvestigationSelect = (id: string) => {
    selectInvestigation(id)
    router.push(`/mitre?id=${id}`)
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Workspace Header */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_#000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyber" className="text-xs px-2 py-0.5 font-black uppercase tracking-wider">
                MITRE ATT&CK INTELLIGENCE
              </Badge>
              <Badge variant="success" className="text-xs">
                STATUS: CORRELATION ENGINE: READY
              </Badge>
              <span className="text-xs text-zinc-500 font-bold">
                HERO: EVIDENCE → BEHAVIOR → TECHNIQUE → TACTIC
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black flex items-center gap-3">
              <Target className="w-7 h-7 text-rose-600 shrink-0" />
              MITRE ATT&CK Adversary Behavior Mapping
            </h1>
            <p className="text-xs sm:text-sm font-bold text-zinc-600 max-w-3xl">
              Correlate cross-platform forensic artifacts and network flows directly to standardized
              tactics, techniques, and procedures (TTPs).
            </p>
          </div>

          {/* Action Toolbar & Case Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Case Switcher */}
            <div className="relative inline-block">
              <select
                aria-label="Select Target Investigation Case"
                value={activeInvestigation?.id ?? ""}
                onChange={(e) => handleInvestigationSelect(e.target.value)}
                className="appearance-none bg-zinc-100 hover:bg-zinc-200 border-2 border-black px-3 py-2 pr-8 text-xs font-black uppercase cursor-pointer shadow-[2px_2px_0px_#000] focus:outline-none"
              >
                {investigations.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id} - {inv.title.slice(0, 22)}...
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-black absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Link to Evidence Vault */}
            <Link
              href={`/evidence${activeInvestigation ? `?id=${activeInvestigation.id}` : ""}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 border-2 border-black bg-cyan-300 hover:bg-cyan-400 text-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <Database className="w-3.5 h-3.5" />
              Evidence Vault
            </Link>

            {/* Link to Network Forensics */}
            <Link
              href="/network"
              className="inline-flex items-center gap-1.5 px-3 py-2 border-2 border-black bg-purple-300 hover:bg-purple-400 text-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <Radio className="w-3.5 h-3.5" />
              Network Flows
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Metrics Strip */}
      <MitreMetrics
        summary={MOCK_MITRE_SUMMARY}
        techniques={activeTechniques}
        correlations={mitreCorrelations}
      />

      {/* View Switcher Tabs */}
      <div className="border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap border-b-2 border-black bg-zinc-100 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("matrix")}
            className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "matrix"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            ATT&CK Matrix Grid ({activeTechniques.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("explorer")}
            className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "explorer"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Technique Explorer
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("coverage")}
            className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "coverage"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Tactic Coverage (Recharts)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "timeline"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Correlation Timeline Stream
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-4 space-y-4">
          {activeTab === "matrix" && (
            <div className="space-y-4">
              <MitreTechniqueMatrix
                techniques={activeTechniques}
                selectedTechniqueId={selectedTechnique?.id ?? null}
                onSelectTechnique={(tech) => setUserSelectedTechnique(tech)}
              />

              <MitreTacticCoverage />
            </div>
          )}

          {activeTab === "explorer" && (
            <div className="space-y-4">
              <MitreTechniqueExplorer
                techniques={activeTechniques}
                selectedTechniqueId={selectedTechnique?.id ?? null}
                onSelectTechnique={(tech) => setUserSelectedTechnique(tech)}
              />

              <MitreTacticCoverage />
            </div>
          )}

          {activeTab === "coverage" && (
            <div className="space-y-4">
              <MitreTacticCoverage />
              <MitreTechniqueMatrix
                techniques={activeTechniques}
                selectedTechniqueId={selectedTechnique?.id ?? null}
                onSelectTechnique={(tech) => setUserSelectedTechnique(tech)}
              />
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4">
              <MitreCorrelationTimeline
                correlations={mitreCorrelations}
                onSelectCorrelation={(corr) => {
                  const match = MOCK_MITRE_TECHNIQUES.find((t) => t.id === corr.techniqueId)
                  if (match) setUserSelectedTechnique(match)
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Technique Detail Drawer */}
      <MitreTechniqueDrawer
        technique={selectedTechnique}
        onClose={() => setUserSelectedTechnique(null)}
      />
    </div>
  )
}
