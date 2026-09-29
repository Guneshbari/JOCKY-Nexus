"use client"

import React from "react"
import Link from "next/link"
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useUIStore } from "@/store/uiStore"
import { useInvestigationStore } from "@/store/investigationStore"

export interface DemoStepItem {
  step: number
  title: string
  route: (invId: string) => string
  actionLabel: string
  desc: string
  whatJudgeSees: string
}

export const DEMO_STEPS: DemoStepItem[] = [
  {
    step: 1,
    title: "DEFINE FORENSIC INTENT",
    route: () => "/investigations?tab=builder",
    actionLabel: "OPEN BUILDER",
    desc: "Human investigator sets natural language incident intent, required evidence types, and safety constraints.",
    whatJudgeSees: "Human Forensic Intent prompt input + constraint configuration.",
  },
  {
    step: 2,
    title: "GENERATE JOCKY IR",
    route: (id) => `/investigations/${id}`,
    actionLabel: "INSPECT JOCKY IR",
    desc: "Transforms forensic intent into a structured, platform-independent JOCKY IR specification.",
    whatJudgeSees: "Compiled JOCKY DSL and Platform-Independent IR AST.",
  },
  {
    step: 3,
    title: "ADAPT EXECUTION",
    route: (id) => `/live-investigation?id=${id}`,
    actionLabel: "LIVE ADAPTIVE STREAM",
    desc: "Adaptive Execution Planner evaluates endpoint security postures and selects PROFILE-A, B, C, or D.",
    whatJudgeSees: "Heuristic decision trees and dynamic collector assignment per OS.",
  },
  {
    step: 4,
    title: "VERIFY EVIDENCE",
    route: (id) => `/evidence?id=${id}`,
    actionLabel: "EVIDENCE VAULT",
    desc: "Harvesters yield normalized forensic artifacts sealed with SHA-256 cryptographic digests.",
    whatJudgeSees: "Zero hash-drift validation, Merkle proof leaves, and normalized schemas.",
  },
  {
    step: 5,
    title: "TRACE PROVENANCE",
    route: () => "/provenance",
    actionLabel: "PROVENANCE LEDGER",
    desc: "Audits contiguous non-volatile provenance blocks with zero-deviation Merkle proofs and witness signatures.",
    whatJudgeSees: "Block #1045 minted with 3/3 witness quorum consensus.",
  },
  {
    step: 6,
    title: "ANALYZE NETWORK",
    route: (id) => `/network?id=${id}`,
    actionLabel: "NETWORK FORENSICS",
    desc: "Traces simulated inter-endpoint socket flows, lateral movement hops, and C2 beacons.",
    whatJudgeSees: "Interactive React Flow topology + Beacon C2 flag on 185.220.101.5:443.",
  },
  {
    step: 7,
    title: "CORRELATE MITRE",
    route: (id) => `/mitre?id=${id}`,
    actionLabel: "MITRE MATRIX",
    desc: "Maps forensic artifacts and network observations to MITRE ATT&CK TTPs.",
    whatJudgeSees: "27 techniques mapped with 96% detection confidence across 8 tactics.",
  },
  {
    step: 8,
    title: "RETURN TO COMMAND",
    route: () => "/dashboard",
    actionLabel: "COMMAND CENTER",
    desc: "Central command consolidation unifying all operations, health metrics, and verified findings.",
    whatJudgeSees: "Fully updated multi-phase operational posture across the enterprise.",
  },
]

interface JudgeDemoControllerProps {
  isOpen?: boolean
  onClose?: () => void
}

export function JudgeDemoController({ onClose }: JudgeDemoControllerProps) {
  const {
    judgeDemoStep,
    setJudgeDemoStep,
    nextJudgeDemoStep,
    prevJudgeDemoStep,
    setJudgeDemoActive,
  } = useUIStore()

  const activeInvestigation = useInvestigationStore((state) => state.activeInvestigation)
  const currentInvId = activeInvestigation?.id ?? "inv-2026-001"

  const activeStep = DEMO_STEPS[judgeDemoStep] || DEMO_STEPS[0]
  const targetHref = activeStep.route(currentInvId)

  const handleClose = () => {
    setJudgeDemoActive(false)
    if (onClose) onClose()
  }

  return (
    <div className="border-4 border-black bg-amber-400 p-4 shadow-[6px_6px_0px_#000] font-mono space-y-3">
      {/* Top Bar with Step counter and close */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
        <div className="flex flex-wrap items-center gap-2">
          <div className="p-1 bg-black text-amber-300 border border-black shadow-[1px_1px_0px_#000]">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-xs font-black uppercase text-black tracking-wide">
            JUDGE DEMONSTRATION MODE // GUIDED 8-STAGE WORKFLOW
          </span>
          <Badge variant="dark" className="text-[10px]">
            STAGE {activeStep.step} OF {DEMO_STEPS.length}
          </Badge>
          <span className="text-[10px] font-bold text-zinc-900 bg-amber-300 px-1.5 py-0.2 border border-black hidden sm:inline">
            Active Case: {currentInvId}
          </span>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Exit Judge Demo Mode"
          className="p-1 border-2 border-black bg-white hover:bg-zinc-200 cursor-pointer text-xs font-black shadow-[2px_2px_0px_#000]"
        >
          <X className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
        {DEMO_STEPS.map((s, idx) => {
          const isDone = idx < judgeDemoStep
          const isCurrent = idx === judgeDemoStep

          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setJudgeDemoStep(idx)}
              className={`p-1.5 border-2 border-black text-center text-[10px] font-black cursor-pointer transition-all ${
                isCurrent
                  ? "bg-black text-amber-300 shadow-[2px_2px_0px_#000] -translate-y-0.5"
                  : isDone
                  ? "bg-emerald-300 text-black hover:bg-emerald-200"
                  : "bg-white text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              0{s.step}
            </button>
          )
        })}
      </div>

      {/* Current Step Card */}
      <div className="p-3.5 bg-white border-2 border-black flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-[2px_2px_0px_#000]">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black bg-amber-300 px-2 py-0.5 border border-black">
              STAGE 0{activeStep.step}
            </span>
            <span className="text-sm font-black text-black">
              {activeStep.title}
            </span>
            <span className="text-[10px] font-bold text-zinc-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>{activeStep.whatJudgeSees}</span>
            </span>
          </div>

          <p className="text-xs font-bold text-zinc-700 max-w-2xl">
            {activeStep.desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {judgeDemoStep > 0 && (
            <button
              type="button"
              onClick={prevJudgeDemoStep}
              className="px-2.5 py-1.5 border-2 border-black bg-zinc-100 hover:bg-zinc-200 text-xs font-black flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_#000]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>PREV</span>
            </button>
          )}

          <Link
            href={targetHref}
            className="px-3 py-1.5 border-2 border-black bg-black text-amber-300 hover:bg-zinc-800 text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
          >
            <span>{activeStep.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {judgeDemoStep < DEMO_STEPS.length - 1 && (
            <button
              type="button"
              onClick={nextJudgeDemoStep}
              className="px-3 py-1.5 border-2 border-black bg-amber-300 hover:bg-amber-400 text-black text-xs font-black flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_#000]"
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
