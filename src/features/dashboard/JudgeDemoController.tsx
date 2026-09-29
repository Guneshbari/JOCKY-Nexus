"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const DEMO_STEPS = [
  {
    step: 1,
    title: "DEFINE FORENSIC INTENT",
    route: "/investigations",
    desc: "Human investigator sets natural language intent, required evidence, and constraint profiles.",
  },
  {
    step: 2,
    title: "GENERATE JOCKY IR",
    route: "/investigations",
    desc: "Transforms forensic intent into a structured, platform-independent JOCKY IR specification.",
  },
  {
    step: 3,
    title: "ADAPT EXECUTION",
    route: "/live-investigation",
    desc: "Adaptive Execution Planner inspects endpoint postures and compiles target-specific profiles.",
  },
  {
    step: 4,
    title: "VERIFY EVIDENCE",
    route: "/evidence",
    desc: "Harvesters yield normalized forensic artifacts sealed with SHA-256 cryptographic digests.",
  },
  {
    step: 5,
    title: "TRACE PROVENANCE",
    route: "/provenance",
    desc: "Audits contiguous non-volatile provenance blocks with zero-deviation Merkle proofs.",
  },
  {
    step: 6,
    title: "ANALYZE NETWORK",
    route: "/network",
    desc: "Traces simulated inter-endpoint socket flows, lateral movement hops, and C2 beacons.",
  },
  {
    step: 7,
    title: "CORRELATE MITRE",
    route: "/mitre",
    desc: "Maps forensic artifacts and network observations to MITRE ATT&CK TTPs.",
  },
  {
    step: 8,
    title: "RETURN TO COMMAND",
    route: "/dashboard",
    desc: "Central command consolidation unifying all operations, health metrics, and verified findings.",
  },
]

interface JudgeDemoControllerProps {
  isOpen?: boolean
  onClose: () => void
}

export function JudgeDemoController({ onClose }: JudgeDemoControllerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const activeStep = DEMO_STEPS[currentStepIndex]

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  return (
    <div className="border-4 border-black bg-amber-400 p-4 shadow-[6px_6px_0px_#000] font-mono space-y-3">
      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-black" />
          <span className="text-xs font-black uppercase text-black">
            JUDGE DEMONSTRATION MODE // GUIDED 8-STAGE WORKFLOW
          </span>
          <Badge variant="dark" className="text-[10px]">
            STAGE {activeStep.step} OF {DEMO_STEPS.length}
          </Badge>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Exit Judge Demo"
          className="p-1 border border-black bg-white hover:bg-zinc-100 cursor-pointer text-xs font-black"
        >
          <X className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
        {DEMO_STEPS.map((s, idx) => {
          const isDone = idx < currentStepIndex
          const isCurrent = idx === currentStepIndex

          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStepIndex(idx)}
              className={`p-1 border border-black text-center text-[10px] font-black cursor-pointer transition-all ${
                isCurrent
                  ? "bg-black text-amber-300 shadow-[2px_2px_0px_#000]"
                  : isDone
                  ? "bg-emerald-300 text-black"
                  : "bg-white text-zinc-600"
              }`}
            >
              0{s.step}
            </button>
          )
        })}
      </div>

      {/* Current Step Card */}
      <div className="p-3 bg-white border-2 border-black flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[2px_2px_0px_#000]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-amber-300 px-2 py-0.5 border border-black">
              STAGE 0{activeStep.step}
            </span>
            <span className="text-sm font-black text-black">
              {activeStep.title}
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-700 mt-1 max-w-2xl">
            {activeStep.desc}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentStepIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-2.5 py-1.5 border-2 border-black bg-zinc-100 hover:bg-zinc-200 text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>PREV</span>
            </button>
          )}

          <Link
            href={activeStep.route}
            className="px-3 py-1.5 border-2 border-black bg-black text-amber-300 hover:bg-zinc-800 text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
          >
            <span>VISIT WORKSPACE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {currentStepIndex < DEMO_STEPS.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1.5 border-2 border-black bg-amber-300 hover:bg-amber-400 text-black text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              <span>NEXT STEP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
