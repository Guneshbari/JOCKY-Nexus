"use client"

import React from "react"
import {
  Clock,
  CheckCircle2,
} from "lucide-react"
import { AdaptiveSimulationState } from "@/types/execution"
import { formatDate } from "@/lib/formatters"

interface DecisionReasoningTimelineProps {
  simulationState: AdaptiveSimulationState
  activeProfileName: string
  targetHostname: string
}

export function DecisionReasoningTimeline({
  simulationState,
  activeProfileName,
  targetHostname,
}: DecisionReasoningTimelineProps) {
  return (
    <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] font-mono space-y-3">
      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase text-black">
            DECISION REASONING STREAM // {targetHostname}
          </span>
        </div>
        <span className="text-[10px] font-bold text-zinc-500">
          Deterministic Timeline Log
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {simulationState.stageHistory.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 border-2 border-black bg-zinc-50 flex items-start gap-2.5 text-xs shadow-[2px_2px_0px_#000]"
          >
            <div className="w-6 h-6 bg-black text-amber-300 font-black text-[10px] flex items-center justify-center shrink-0 border border-black mt-0.5">
              0{item.stage}
            </div>

            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-black text-black uppercase text-[11px]">
                  Stage {item.stage} Verification
                </span>
                <span className="font-mono text-[9px] text-zinc-500">
                  {formatDate(item.timestamp)}
                </span>
              </div>
              <p className="font-bold text-zinc-800 text-[11px] leading-relaxed">
                {item.note}
              </p>
            </div>
          </div>
        ))}

        {simulationState.currentStage >= 6 && (
          <div className="p-2.5 border-2 border-black bg-emerald-50 text-emerald-950 flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Target {targetHostname} bound to {activeProfileName}. Ready for simulated collection.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
