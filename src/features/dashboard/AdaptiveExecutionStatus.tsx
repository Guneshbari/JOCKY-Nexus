"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Cpu, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AdaptivePipelineStep {
  label: string
  subtitle: string
  value: string
  color: string
  badge: string
}

export function AdaptiveExecutionStatus() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(3)

  const pipelineSteps: AdaptivePipelineStep[] = [
    {
      label: "FORENSIC INTENT",
      subtitle: "Natural Incident Goal",
      value: "PROCESS + NETWORK FORENSICS",
      color: "bg-amber-300",
      badge: "INPUT INTENT",
    },
    {
      label: "ENDPOINT PROFILE",
      subtitle: "Target Architecture",
      value: "WINDOWS WORKSTATION (FIN-WS-44)",
      color: "bg-cyan-300",
      badge: "HOST DISCOVERY",
    },
    {
      label: "SECURITY POSTURE",
      subtitle: "Environmental Constraints",
      value: "RESTRICTED SUB-NETWORK",
      color: "bg-rose-300",
      badge: "ISOLATION ACTIVE",
    },
    {
      label: "SELECTED EXECUTION PROFILE",
      subtitle: "Adaptive Dynamic Ruleset",
      value: "COLLECTOR_PROFILE_B (VOLATILE DISSECTION)",
      color: "bg-emerald-300",
      badge: "SYNCHRONIZED",
    },
    {
      label: "EVIDENCE REQUIREMENTS",
      subtitle: "Verifiable Integrity Seal",
      value: "VERIFIED EVIDENCE (SHA-256 + NVPL)",
      color: "bg-purple-300",
      badge: "MERKLE PROOF",
    },
  ]

  return (
    <Card className="border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
      <CardHeader className="bg-cyan-300 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-black" />
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">ADAPTIVE FORENSIC EXECUTION PIPELINE</CardTitle>
              <Badge variant="dark" className="text-[10px]">CORE USP ENGINE</Badge>
            </div>
            <p className="text-[11px] font-mono font-bold text-zinc-800 mt-0.5">
              Forensic Intent → Adaptive Execution → Verifiable Evidence
            </p>
          </div>
        </div>

        <Link href="/live-investigation">
          <Button variant="default" size="sm" className="gap-1.5 font-mono text-xs">
            <span>OPEN LIVE STREAM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Interactive Pipeline Steps Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {pipelineSteps.map((step, idx) => {
            const isSelected = activeStepIndex === idx
            return (
              <div
                key={step.label}
                tabIndex={0}
                role="button"
                aria-label={`Inspect pipeline stage: ${step.label}`}
                onClick={() => setActiveStepIndex(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setActiveStepIndex(idx)
                  }
                }}
                className={`border-3 border-black p-3.5 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-white shadow-[5px_5px_0px_#000] -translate-y-1 ring-2 ring-black"
                    : "bg-zinc-50 hover:bg-white hover:shadow-[3px_3px_0px_#000] opacity-90"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 border-2 border-black bg-black text-white font-mono font-black text-xs flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <Badge variant="neutral" className="text-[9px] py-0 px-1">
                      {step.badge}
                    </Badge>
                  </div>

                  <div className="font-mono text-[10px] font-black uppercase text-zinc-600">
                    {step.label}
                  </div>
                  <div className="font-mono text-[11px] font-bold text-black mt-1 leading-tight">
                    {step.value}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t-2 border-zinc-200 text-[10px] font-mono text-zinc-500 font-bold">
                  {step.subtitle}
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="p-4 border-3 border-black bg-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-black bg-black text-amber-300 px-2 py-0.5">
                STAGE 0{activeStepIndex + 1}: {pipelineSteps[activeStepIndex].label}
              </span>
              <span className="font-bold text-zinc-700">Autonomous Reasoning Mode: ACTIVE</span>
            </div>
            <p className="font-bold text-zinc-900 max-w-2xl">
              Targeted parameter: <span className="underline">{pipelineSteps[activeStepIndex].value}</span>.
              The adaptive planner inspects host telemetry before selecting the non-invasive collection strategy, ensuring forensically sound outcomes without service disruption.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/live-investigation">
              <Button variant="cyber" size="sm" className="text-xs">
                Simulate Adaptive Branch →
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
