"use client"

import React from "react"
import Link from "next/link"
import {
  Plus,
  Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/status/StatusPill"
import { DashboardRefreshButton } from "./DashboardRefreshButton"
import { useUIStore } from "@/store/uiStore"
import { useInvestigationStore } from "@/store/investigationStore"

interface CommandCenterHeaderProps {
  isJudgeDemoActive: boolean
  onToggleJudgeDemo: () => void
}

export function CommandCenterHeader({
  isJudgeDemoActive,
  onToggleJudgeDemo,
}: CommandCenterHeaderProps) {
  const { isSimulationMode, openModal } = useUIStore()
  const activeInvestigation = useInvestigationStore((state) => state.activeInvestigation)
  const currentInvId = activeInvestigation?.id ?? "inv-2026-001"

  return (
    <div className="border-4 border-black bg-white p-5 md:p-6 shadow-[8px_8px_0px_#000] relative overflow-hidden font-mono space-y-4">
      {/* Decorative Corner Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400 border-l-4 border-b-4 border-black -mr-12 -mt-12 rotate-45 pointer-events-none" />

      {/* Top Banner: Operational Posture Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black bg-black text-amber-300 px-2.5 py-0.5 shadow-[2px_2px_0px_#FACC15]">
              JOCKY NEXUS COMMAND v1.0
            </span>
            <Badge variant="cyber">COMMAND POSTURE: ACTIVE</Badge>
            <StatusPill
              label={isSimulationMode ? "SIMULATION MODE ACTIVE" : "SYNTHETIC BENCHMARK MODE"}
              status="verified"
            />
          </div>

          <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-black flex items-center gap-3">
            <span>JOCKY NEXUS COMMAND</span>
          </h1>

          <p className="text-xs sm:text-sm font-bold text-zinc-700 max-w-3xl">
            Cross-platform forensic operations, adaptive execution, evidence integrity, and investigation intelligence.
          </p>
        </div>

        {/* Right Controls: Refresh, Simulation Mode, Judge Demo Mode */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
          <DashboardRefreshButton />

          <button
            type="button"
            onClick={onToggleJudgeDemo}
            className={`px-2.5 sm:px-3 py-1.5 border-2 border-black text-xs font-black uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5 ${
              isJudgeDemoActive
                ? "bg-amber-400 text-black ring-2 ring-black"
                : "bg-zinc-100 hover:bg-zinc-200 text-black"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-black shrink-0" />
            <span className="hidden xs:inline">{isJudgeDemoActive ? "JUDGE DEMO: ACTIVE" : "JUDGE DEMO"}</span>
            <span className="xs:hidden">{isJudgeDemoActive ? "DEMO ACTIVE" : "DEMO"}</span>
          </button>

          <Button
            variant="default"
            size="sm"
            onClick={() => openModal("NEW_INVESTIGATION")}
            className="text-xs font-black uppercase shadow-[2px_2px_0px_#000]"
          >
            <Plus className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span className="hidden xs:inline">NEW INVESTIGATION</span>
            <span className="xs:hidden">NEW CASE</span>
          </Button>
        </div>
      </div>

      {/* Secondary Status Strip: 5 Core Operational Subsystems */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t-2 border-black text-[10px] sm:text-[11px] font-bold">
        <span className="text-zinc-500 uppercase">Operational Subsystems:</span>
        <div className="flex items-center gap-1 px-2 py-0.5 border border-black bg-emerald-50 text-emerald-900">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
          <span>ADAPTIVE ENGINE: ONLINE</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 border border-black bg-blue-50 text-blue-900">
          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
          <span>EVIDENCE PIPELINE: VERIFIED</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 border border-black bg-lime-50 text-lime-900">
          <span className="w-2 h-2 rounded-full bg-lime-600 shrink-0" />
          <span>PROVENANCE: SEALED</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 border border-black bg-purple-50 text-purple-900">
          <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
          <span>NETWORK INTELLIGENCE: ONLINE</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 border border-black bg-orange-50 text-orange-900">
          <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0" />
          <span>MITRE CORRELATION: READY</span>
        </div>
      </div>

      {/* Primary & Secondary Command Action Toolbar */}
      <div className="grid grid-cols-2 xs:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2 pt-1 text-[11px] sm:text-xs">
        <Link
          href="/investigations"
          className="p-1.5 sm:p-2 border-2 border-black bg-zinc-100 hover:bg-amber-300 text-black font-black uppercase text-center truncate shadow-[2px_2px_0px_#000] transition-all"
        >
          CAMPAIGNS
        </Link>
        <Link
          href={`/investigations/${currentInvId}`}
          className="p-1.5 sm:p-2 border-2 border-black bg-zinc-100 hover:bg-amber-300 text-black font-black uppercase text-center truncate shadow-[2px_2px_0px_#000] transition-all"
        >
          ACTIVE CASE
        </Link>
        <Link
          href={`/live-investigation?id=${currentInvId}`}
          className="p-1.5 sm:p-2 border-2 border-black bg-zinc-100 hover:bg-amber-300 text-black font-black uppercase text-center truncate shadow-[2px_2px_0px_#000] transition-all"
        >
          ADAPTIVE
        </Link>
        <Link
          href={`/evidence?id=${currentInvId}`}
          className="p-1.5 sm:p-2 border-2 border-black bg-zinc-100 hover:bg-cyan-300 text-black font-black uppercase text-center truncate shadow-[2px_2px_0px_#000] transition-all"
        >
          EVIDENCE
        </Link>
        <Link
          href={`/provenance`}
          className="p-1.5 sm:p-2 border-2 border-black bg-zinc-100 hover:bg-lime-300 text-black font-black uppercase text-center truncate shadow-[2px_2px_0px_#000] transition-all"
        >
          PROVENANCE
        </Link>
        <Link
          href={`/network?id=${currentInvId}`}
          className="p-1.5 sm:p-2 border-2 border-black bg-zinc-100 hover:bg-purple-300 text-black font-black uppercase text-center truncate shadow-[2px_2px_0px_#000] transition-all"
        >
          NETWORK
        </Link>
        <Link
          href={`/mitre?id=${currentInvId}`}
          className="p-1.5 sm:p-2 border-2 border-black bg-zinc-100 hover:bg-orange-300 text-black font-black uppercase text-center truncate shadow-[2px_2px_0px_#000] transition-all"
        >
          MITRE ATT&CK
        </Link>
        <Link
          href="/endpoints"
          className="p-1.5 sm:p-2 border-2 border-black bg-zinc-100 hover:bg-zinc-200 text-black font-black uppercase text-center truncate shadow-[2px_2px_0px_#000] transition-all"
        >
          ENDPOINTS
        </Link>
      </div>
    </div>
  )
}
