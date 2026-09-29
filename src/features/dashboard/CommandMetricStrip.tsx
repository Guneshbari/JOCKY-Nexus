"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import {
  GitBranch,
  CheckCircle2,
  Server,
  Database,
  ShieldCheck,
  Target,
  Radio,
  Lock,
} from "lucide-react"
import { useInvestigationStore } from "@/store/investigationStore"
import { useEndpointStore } from "@/store/endpointStore"
import { MOCK_MITRE_TECHNIQUES } from "@/data/mitre"

export function CommandMetricStrip() {
  const investigations = useInvestigationStore((state) => state.investigations)
  const evidenceItems = useInvestigationStore((state) => state.evidenceItems)
  const provenanceState = useInvestigationStore((state) => state.provenanceState)
  const networkConnections = useInvestigationStore((state) => state.networkConnections)
  const endpoints = useEndpointStore((state) => state.endpoints)

  const stats = useMemo(() => {
    const active = investigations.filter(
      (i) => i.status === "ACTIVE" || i.status === "IN_PROGRESS"
    ).length
    const completed = investigations.filter((i) => i.status === "COMPLETED").length
    const totalEvidence = evidenceItems.length
    const verifiedEvidence = evidenceItems.filter((e) => e.integrityVerified).length
    const verificationRate =
      totalEvidence > 0 ? Math.round((verifiedEvidence / totalEvidence) * 100) : 100
    const flaggedFlows = networkConnections.filter(
      (c) => c.status === "FLAGGED" || c.riskLevel === "HIGH"
    ).length
    const mitreCount = MOCK_MITRE_TECHNIQUES.length

    return {
      activeInvestigations: active,
      completedInvestigations: completed,
      endpointsCount: endpoints.length,
      totalEvidence,
      verifiedEvidence,
      verificationRate,
      mitreCount,
      flaggedFlows,
      blockHeight: provenanceState.blockHeight,
    }
  }, [investigations, evidenceItems, provenanceState, networkConnections, endpoints])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono">
      {/* 1. Active Investigations */}
      <Link
        href="/investigations"
        className="p-3 border-3 border-black bg-white hover:bg-amber-50 shadow-[3px_3px_0px_#000] flex flex-col justify-between transition-transform active:translate-x-0.5 active:translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Active Cases</span>
          <GitBranch className="w-3.5 h-3.5 text-black" />
        </div>
        <div className="text-2xl font-black text-black mt-1">
          {stats.activeInvestigations}
        </div>
        <span className="text-[9px] font-bold text-zinc-600">In triage / analysis</span>
      </Link>

      {/* 2. Completed Investigations */}
      <Link
        href="/investigations"
        className="p-3 border-3 border-black bg-white hover:bg-emerald-50 shadow-[3px_3px_0px_#000] flex flex-col justify-between transition-transform active:translate-x-0.5 active:translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Completed</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="text-2xl font-black text-emerald-600 mt-1">
          {stats.completedInvestigations}
        </div>
        <span className="text-[9px] font-bold text-zinc-600">Sealed & archived</span>
      </Link>

      {/* 3. Monitored Endpoints */}
      <Link
        href="/endpoints"
        className="p-3 border-3 border-black bg-white hover:bg-cyan-50 shadow-[3px_3px_0px_#000] flex flex-col justify-between transition-transform active:translate-x-0.5 active:translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Endpoints</span>
          <Server className="w-3.5 h-3.5 text-cyan-600" />
        </div>
        <div className="text-2xl font-black text-black mt-1">
          {stats.endpointsCount}
        </div>
        <span className="text-[9px] font-bold text-zinc-600">Windows & Linux</span>
      </Link>

      {/* 4. Evidence Artifacts */}
      <Link
        href="/evidence"
        className="p-3 border-3 border-black bg-white hover:bg-purple-50 shadow-[3px_3px_0px_#000] flex flex-col justify-between transition-transform active:translate-x-0.5 active:translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Evidence</span>
          <Database className="w-3.5 h-3.5 text-purple-600" />
        </div>
        <div className="text-2xl font-black text-black mt-1">
          {stats.totalEvidence}
        </div>
        <span className="text-[9px] font-bold text-zinc-600">Raw & normalized</span>
      </Link>

      {/* 5. Verified Evidence */}
      <Link
        href="/evidence"
        className="p-3 border-3 border-black bg-emerald-50 hover:bg-emerald-100 shadow-[3px_3px_0px_#000] flex flex-col justify-between transition-transform active:translate-x-0.5 active:translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-emerald-800 uppercase">Integrity</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="text-2xl font-black text-emerald-700 mt-1">
          {stats.verificationRate}%
        </div>
        <span className="text-[9px] font-bold text-emerald-700">SHA-256 verified</span>
      </Link>

      {/* 6. MITRE Techniques */}
      <Link
        href="/mitre"
        className="p-3 border-3 border-black bg-white hover:bg-amber-50 shadow-[3px_3px_0px_#000] flex flex-col justify-between transition-transform active:translate-x-0.5 active:translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">MITRE TTPs</span>
          <Target className="w-3.5 h-3.5 text-rose-600" />
        </div>
        <div className="text-2xl font-black text-rose-600 mt-1">
          {stats.mitreCount}
        </div>
        <span className="text-[9px] font-bold text-zinc-600">8 Tactics covered</span>
      </Link>

      {/* 7. Flagged Flows */}
      <Link
        href="/network"
        className="p-3 border-3 border-black bg-rose-50 hover:bg-rose-100 shadow-[3px_3px_0px_#000] flex flex-col justify-between transition-transform active:translate-x-0.5 active:translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-rose-800 uppercase">Flagged Flows</span>
          <Radio className="w-3.5 h-3.5 text-rose-600" />
        </div>
        <div className="text-2xl font-black text-rose-600 mt-1">
          {stats.flaggedFlows}
        </div>
        <span className="text-[9px] font-bold text-rose-600">C2 / Lateral hops</span>
      </Link>

      {/* 8. Provenance Health */}
      <Link
        href="/provenance"
        className="p-3 border-3 border-black bg-lime-50 hover:bg-lime-100 shadow-[3px_3px_0px_#000] flex flex-col justify-between transition-transform active:translate-x-0.5 active:translate-y-0.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-lime-900 uppercase">Ledger</span>
          <Lock className="w-3.5 h-3.5 text-lime-700" />
        </div>
        <div className="text-xl font-black text-lime-800 mt-1">
          #{stats.blockHeight}
        </div>
        <span className="text-[9px] font-bold text-lime-800">Chain sealed</span>
      </Link>
    </div>
  )
}
