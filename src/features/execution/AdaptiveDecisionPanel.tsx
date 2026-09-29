"use client"

import React, { useState } from "react"
import {
  Cpu,
  ChevronDown,
  ChevronRight,
  Sparkles,
  GitBranch,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AdaptiveDecision, AdaptiveDecisionFactor } from "@/types/execution"

interface AdaptiveDecisionPanelProps {
  decision: AdaptiveDecision
}

export function AdaptiveDecisionPanel({ decision }: AdaptiveDecisionPanelProps) {
  const [expandedFactorIds, setExpandedFactorIds] = useState<Record<string, boolean>>({
    "f-os": true,
    "f-readiness": true,
    "f-intent": true,
    "f-safety": false,
  })

  const toggleFactor = (id: string) => {
    setExpandedFactorIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const getCategoryColor = (cat: AdaptiveDecisionFactor["category"]) => {
    switch (cat) {
      case "OS_ARCHITECTURE":
        return "bg-blue-100 text-blue-900 border-blue-900"
      case "TELEMETRY_READINESS":
        return "bg-emerald-100 text-emerald-900 border-emerald-900"
      case "INTENT":
        return "bg-amber-100 text-amber-900 border-amber-900"
      case "SAFETY_CONSTRAINT":
        return "bg-purple-100 text-purple-900 border-purple-900"
      default:
        return "bg-zinc-100 text-zinc-900 border-zinc-900"
    }
  }

  return (
    <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] font-mono space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase text-black">
            ADAPTIVE REASONING ENGINE // {decision.hostname}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="cyber">DETERMINISTIC EVALUATION</Badge>
          <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
            {decision.selectedProfileId}
          </span>
        </div>
      </div>

      {/* Rationale Banner */}
      <div className="p-3 border-2 border-black bg-amber-50 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-zinc-600">
          <GitBranch className="w-3.5 h-3.5 text-black" />
          <span>Decision Synthesis Rationale</span>
        </div>
        <p className="text-xs font-bold text-zinc-900 leading-relaxed">
          {decision.rationale}
        </p>
      </div>

      {/* Decision Factors */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-zinc-600 uppercase">
          <span>Evaluated Decision Factors ({decision.factors.length})</span>
          <span className="text-[10px] text-zinc-500 font-bold">Click to expand details</span>
        </div>

        <div className="space-y-2">
          {decision.factors.map((factor) => {
            const isExpanded = !!expandedFactorIds[factor.id]

            return (
              <div
                key={factor.id}
                className="border-2 border-black bg-white shadow-[2px_2px_0px_#000]"
              >
                <button
                  type="button"
                  onClick={() => toggleFactor(factor.id)}
                  className="w-full text-left p-2.5 flex items-center justify-between gap-2 hover:bg-zinc-50 cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-black shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-black shrink-0" />
                    )}
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.5 border ${getCategoryColor(
                        factor.category
                      )}`}
                    >
                      {factor.category}
                    </span>
                    <span className="text-xs font-black text-black truncate">
                      {factor.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-zinc-500 shrink-0">
                    {isExpanded ? "HIDE" : "INSPECT"}
                  </span>
                </button>

                {isExpanded && (
                  <div className="p-3 border-t-2 border-black bg-zinc-50/70 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-black uppercase text-zinc-500 block">
                        Observed Endpoint / Intent State:
                      </span>
                      <p className="font-mono text-zinc-900 font-bold mt-0.5 bg-white p-2 border border-black">
                        {factor.observation}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase text-zinc-500 block">
                        Adaptive Profile Impact:
                      </span>
                      <p className="font-bold text-black mt-0.5 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{factor.impactOnProfile}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
