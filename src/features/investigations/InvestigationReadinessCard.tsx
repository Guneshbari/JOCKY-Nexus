"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Zap } from "lucide-react"
import { Investigation } from "@/types/investigation"
import { Badge } from "@/components/ui/badge"
import { useInvestigationStore } from "@/store/investigationStore"

interface InvestigationReadinessCardProps {
  investigation: Investigation
  onLaunch?: () => void
}

export function InvestigationReadinessCard({
  investigation,
  onLaunch,
}: InvestigationReadinessCardProps) {
  const router = useRouter()
  const launchAdaptiveAnalysis = useInvestigationStore((state) => state.launchAdaptiveAnalysis)

  const handleLaunch = () => {
    launchAdaptiveAnalysis(investigation.id)
    if (onLaunch) {
      onLaunch()
    } else {
      router.push(`/live-investigation?id=${investigation.id}`)
    }
  }

  return (
    <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000] space-y-5 font-mono text-xs select-none">
      {/* Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-3 border-black bg-emerald-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 border-2 border-black bg-black text-emerald-300 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-black uppercase text-black tracking-wide">
              INVESTIGATION SPECIFICATION READY
            </h3>
            <p className="text-[11px] font-bold text-zinc-900 mt-0.5">
              Compiled into verifiable JOCKY IR and ready for Adaptive Execution dispatch.
            </p>
          </div>
        </div>

        <Badge variant="dark" className="text-xs shrink-0 py-1 px-2.5">
          CASE ID: {investigation.id}
        </Badge>
      </div>

      {/* Visual Pipeline Progression Indicator */}
      <div className="p-3 border-2 border-black bg-zinc-50 space-y-1.5">
        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
          Forensic Transformation Flow:
        </div>
        <div className="flex flex-wrap items-center gap-1.5 font-bold text-[11px] text-black">
          <span className="bg-amber-200 px-2 py-0.5 border border-black">FORENSIC INTENT</span>
          <span className="text-zinc-400">→</span>
          <span className="bg-cyan-200 px-2 py-0.5 border border-black">JOCKY SPEC</span>
          <span className="text-zinc-400">→</span>
          <span className="bg-purple-200 px-2 py-0.5 border border-black">PLATFORM IR</span>
          <span className="text-zinc-400">→</span>
          <span className="bg-emerald-300 px-2 py-0.5 border border-black animate-pulse">
            ADAPTIVE ANALYSIS READY
          </span>
        </div>
      </div>

      {/* Eligibility Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 border-2 border-black bg-zinc-50">
          <span className="text-[10px] text-zinc-500 font-black block">TARGET NODES</span>
          <span className="text-xl font-black text-black">
            {investigation.targetEndpointIds.length} Hosts
          </span>
          <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
            Agent Tunnels Verified
          </span>
        </div>

        <div className="p-3 border-2 border-black bg-zinc-50">
          <span className="text-[10px] text-zinc-500 font-black block">EVIDENCE CLASSES</span>
          <span className="text-xl font-black text-black">
            {investigation.evidenceRequirements?.length ?? 4} Requirements
          </span>
          <span className="text-[10px] text-cyan-700 font-bold block mt-0.5">
            Pre-Collection Mapped
          </span>
        </div>

        <div className="p-3 border-2 border-black bg-zinc-50">
          <span className="text-[10px] text-zinc-500 font-black block">ADAPTIVE PROFILE</span>
          <span className="text-xs font-black text-black truncate block mt-1">
            {investigation.adaptiveProfile ?? "PROFILE-A"}
          </span>
          <span className="text-[10px] text-amber-700 font-bold block mt-0.5">
            Autonomous Pivot OK
          </span>
        </div>

        <div className="p-3 border-2 border-black bg-zinc-50">
          <span className="text-[10px] text-zinc-500 font-black block">PROVENANCE SEAL</span>
          <span className="text-xs font-black text-purple-700 truncate block mt-1">
            NVPL MERKLE-256
          </span>
          <span className="text-[10px] text-zinc-600 font-bold block mt-0.5">
            Block Minting Ready
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="text-zinc-600 font-bold text-xs">
          Click below to initiate the Phase 4 simulated execution pipeline.
        </div>

        <button
          type="button"
          onClick={handleLaunch}
          className="flex items-center justify-center gap-2 px-6 py-3 border-3 border-black bg-emerald-400 text-black font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:bg-emerald-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>LAUNCH ADAPTIVE ANALYSIS →</span>
        </button>
      </div>
    </div>
  )
}
