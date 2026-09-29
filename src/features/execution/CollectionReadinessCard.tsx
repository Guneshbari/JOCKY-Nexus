"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  ShieldCheck,
  Play,
  ArrowRight,
  Database,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Investigation } from "@/types/investigation"
import { AdaptiveExecutionProfile } from "@/types/execution"
import { useInvestigationStore } from "@/store/investigationStore"

interface CollectionReadinessCardProps {
  investigation: Investigation
  profiles: Record<string, AdaptiveExecutionProfile>
}

export function CollectionReadinessCard({
  investigation,
  profiles,
}: CollectionReadinessCardProps) {
  const router = useRouter()
  const beginEvidenceCollection = useInvestigationStore((state) => state.beginEvidenceCollection)
  const [isLaunching, setIsLaunching] = useState(false)

  const profileCount = Object.keys(profiles).length
  const totalCollectors = Object.values(profiles).reduce(
    (acc, p) => acc + p.collectors.length,
    0
  )

  const handleBeginCollection = () => {
    setIsLaunching(true)
    beginEvidenceCollection(investigation.id)
    setTimeout(() => {
      router.push(`/evidence?id=${investigation.id}`)
    }, 400)
  }

  return (
    <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_#000] font-mono space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          <h3 className="text-base font-black uppercase text-black">
            STAGE 07 // ADAPTIVE EXECUTION PLAN SEALED & READY
          </h3>
        </div>
        <Badge variant="success">EVIDENCE REQUIREMENTS SATISFIED</Badge>
      </div>

      {/* Description */}
      <p className="text-xs font-bold text-zinc-700 leading-relaxed">
        The Adaptive Execution Planner has resolved all host architectures, security postures, and safety boundaries. Tailored forensic collection profiles are compiled across all {profileCount} target nodes with non-repudiation guarantees.
      </p>

      {/* Verification Matrix Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
        <div className="p-3 border-2 border-black bg-emerald-50 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-950 font-black">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>COLLECTION PROFILES</span>
          </div>
          <p className="text-[11px] text-zinc-700">
            {profileCount} distinct profiles bound with {totalCollectors} safe forensic collectors.
          </p>
        </div>

        <div className="p-3 border-2 border-black bg-emerald-50 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-950 font-black">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>SHA-256 INTEGRITY</span>
          </div>
          <p className="text-[11px] text-zinc-700">
            Cryptographic Merkle tree hashing enabled for all acquired streams.
          </p>
        </div>

        <div className="p-3 border-2 border-black bg-emerald-50 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-950 font-black">
            <Database className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>NVPL PROVENANCE</span>
          </div>
          <p className="text-[11px] text-zinc-700">
            Chain-of-custody immutable ledger recording active collection parameters.
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t-2 border-zinc-200">
        <div className="text-[11px] text-zinc-600 font-bold">
          Clicking begin will mark the campaign as <span className="text-black font-black bg-amber-200 px-1 border border-black">IN_PROGRESS</span> and transition to the Evidence Pipeline workspace.
        </div>

        <Button
          type="button"
          size="lg"
          variant="cyber"
          onClick={handleBeginCollection}
          disabled={isLaunching}
          className="gap-2 px-6 py-3 font-black text-sm uppercase shadow-[4px_4px_0px_#000] cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>{isLaunching ? "DISPATCHING AGENTS..." : "BEGIN SIMULATED COLLECTION"}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
