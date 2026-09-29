"use client"

import React from "react"
import { Check } from "lucide-react"

interface InvestigationStepIndicatorProps {
  currentStep: number
  onStepClick: (step: number) => void
  steps: { id: number; name: string }[]
}

export function InvestigationStepIndicator({
  currentStep,
  onStepClick,
  steps,
}: InvestigationStepIndicatorProps) {
  return (
    <div className="w-full border-3 border-black bg-white p-2 shadow-[4px_4px_0px_#000] overflow-x-auto">
      <div className="flex items-center justify-between min-w-[620px] gap-2">
        {steps.map((s) => {
          const isActive = currentStep === s.id
          const isCompleted = currentStep > s.id

          return (
            <button
              key={s.id}
              onClick={() => onStepClick(s.id)}
              className={`flex-1 flex items-center justify-center gap-2 p-2 border-2 border-black font-mono text-xs font-black transition-all ${
                isActive
                  ? "bg-amber-300 text-black shadow-[2px_2px_0px_#000] -translate-y-0.5"
                  : isCompleted
                  ? "bg-emerald-100 text-black hover:bg-emerald-200"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-black"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-none border border-black flex items-center justify-center text-[10px] ${
                  isActive
                    ? "bg-black text-amber-300"
                    : isCompleted
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.id}
              </span>
              <span className="truncate">{s.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
