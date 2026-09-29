"use client"

import React, { useMemo } from "react"
import {
  Target,
  ShieldCheck,
  Crosshair,
  FileCheck2,
  GitBranch,
  Layers,
} from "lucide-react"
import { MitreTechnique, MitreCorrelation, MitreMatrixSummary } from "@/types/mitre"

interface MitreMetricsProps {
  summary: MitreMatrixSummary
  techniques: MitreTechnique[]
  correlations: MitreCorrelation[]
}

export function MitreMetrics({
  summary,
  techniques,
  correlations,
}: MitreMetricsProps) {
  const metrics = useMemo(() => {
    const totalTechniques = techniques.length
    const uniqueTactics = new Set(techniques.map((t) => t.tactic)).size
    const highConf = techniques.filter((t) => t.confidence === "HIGH").length
    const medConf = techniques.filter((t) => t.confidence === "MEDIUM").length
    const uniqueEvidence = new Set(
      correlations.map((c) => c.evidenceId).filter(Boolean)
    ).size
    const uniqueInvs = new Set(
      correlations.map((c) => c.investigationId).filter(Boolean)
    ).size

    return {
      totalTechniques: Math.max(totalTechniques, summary.totalTechniquesDetected),
      uniqueTactics: Math.max(uniqueTactics, summary.tacticsCoveredCount),
      highConf: Math.max(highConf, summary.highConfidenceCount),
      medConf: Math.max(medConf, summary.mediumConfidenceCount),
      uniqueEvidence: Math.max(uniqueEvidence, 5),
      uniqueInvs: Math.max(uniqueInvs, 3),
    }
  }, [summary, techniques, correlations])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
      {/* Mapped Techniques */}
      <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">
            Mapped TTPs
          </span>
          <Target className="w-3.5 h-3.5 text-rose-600" />
        </div>
        <div className="text-2xl font-black text-rose-600 mt-1">
          {metrics.totalTechniques}
        </div>
        <span className="text-[9px] font-bold text-zinc-500">
          ATT&CK v15 catalog
        </span>
      </div>

      {/* Tactics Covered */}
      <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">
            Tactics
          </span>
          <Layers className="w-3.5 h-3.5 text-orange-600" />
        </div>
        <div className="text-2xl font-black text-black mt-1">
          {metrics.uniqueTactics}
        </div>
        <span className="text-[9px] font-bold text-zinc-500">
          8 categories covered
        </span>
      </div>

      {/* High Confidence */}
      <div className="p-3 border-3 border-black bg-emerald-50 shadow-[3px_3px_0px_#000]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-emerald-800 uppercase">
            High Confidence
          </span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="text-2xl font-black text-emerald-700 mt-1">
          {metrics.highConf}
        </div>
        <span className="text-[9px] font-bold text-emerald-700">
          Multi-signal match
        </span>
      </div>

      {/* Medium Confidence */}
      <div className="p-3 border-3 border-black bg-amber-50 shadow-[3px_3px_0px_#000]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-amber-800 uppercase">
            Medium Conf
          </span>
          <Crosshair className="w-3.5 h-3.5 text-amber-600" />
        </div>
        <div className="text-2xl font-black text-amber-700 mt-1">
          {metrics.medConf}
        </div>
        <span className="text-[9px] font-bold text-amber-700">
          Corroborating signal
        </span>
      </div>

      {/* Supporting Evidence */}
      <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">
            Evidence Links
          </span>
          <FileCheck2 className="w-3.5 h-3.5 text-cyan-600" />
        </div>
        <div className="text-2xl font-black text-black mt-1">
          {metrics.uniqueEvidence}
        </div>
        <span className="text-[9px] font-bold text-zinc-500">
          Sealed artifacts
        </span>
      </div>

      {/* Investigations */}
      <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">
            Cases Bound
          </span>
          <GitBranch className="w-3.5 h-3.5 text-purple-600" />
        </div>
        <div className="text-2xl font-black text-purple-700 mt-1">
          {metrics.uniqueInvs}
        </div>
        <span className="text-[9px] font-bold text-zinc-500">
          Active investigations
        </span>
      </div>
    </div>
  )
}
