"use client"

import React from "react"
import { Check } from "lucide-react"
import { EvidenceWorkflowStage } from "@/types/evidence"

interface EvidencePipelineProps {
  currentStage: EvidenceWorkflowStage
  onSelectStage?: (stage: EvidenceWorkflowStage) => void
}

const STAGES: { stage: EvidenceWorkflowStage; name: string; tag: string; desc: string }[] = [
  { stage: 1, name: "COLLECTION", tag: "HARVEST", desc: "Adaptive Collectors" },
  { stage: 2, name: "NORMALIZATION", tag: "SCHEMA", desc: "Common Evidence Schema" },
  { stage: 3, name: "INTEGRITY SEAL", tag: "SHA-256", desc: "Cryptographic Seal" },
  { stage: 4, name: "PROVENANCE", tag: "NVPL CHAIN", desc: "Lineage Binding" },
  { stage: 5, name: "MITRE ATT&CK", tag: "CORRELATE", desc: "Technique Mapping" },
  { stage: 6, name: "VERIFIED", tag: "ADMISSIBLE", desc: "Sealed & Provable" },
]

export function EvidencePipeline({
  currentStage,
  onSelectStage,
}: EvidencePipelineProps) {
  return (
    <div className="border-3 border-black bg-white p-3 shadow-[4px_4px_0px_#000] font-mono select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-black text-[11px] font-black">
        <span className="text-zinc-500 uppercase">
          6-STAGE EVIDENCE INTELLIGENCE & VERIFICATION PIPELINE
        </span>
        <span className="text-black bg-amber-300 px-2 py-0.5 border border-black">
          STAGE 0{currentStage} OF 06
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {STAGES.map((s) => {
          const isCompleted = currentStage > s.stage
          const isCurrent = currentStage === s.stage

          return (
            <button
              key={s.stage}
              type="button"
              onClick={() => onSelectStage?.(s.stage)}
              className={`p-2 border-2 border-black text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                isCurrent
                  ? "bg-amber-400 text-black shadow-[3px_3px_0px_#000] -translate-y-0.5"
                  : isCompleted
                  ? "bg-emerald-100 text-black hover:bg-emerald-200"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-black">
                <span>0{s.stage}</span>
                {isCompleted ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                ) : null}
              </div>

              <div>
                <div
                  className={`text-[10px] font-black uppercase leading-tight ${
                    isCurrent
                      ? "text-black"
                      : isCompleted
                      ? "text-emerald-950"
                      : "text-zinc-600"
                  }`}
                >
                  {s.name}
                </div>
                <div className="text-[9px] font-bold opacity-75 mt-0.5 truncate">
                  {`${s.tag} // ${s.desc}`}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
