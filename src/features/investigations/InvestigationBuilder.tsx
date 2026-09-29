"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Wand2,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import { InvestigationStepIndicator } from "./InvestigationStepIndicator"
import { ForensicIntentForm } from "./ForensicIntentForm"
import { EvidenceRequirementSelector } from "./EvidenceRequirementSelector"
import { EndpointSelector } from "./EndpointSelector"
import { InvestigationConstraints } from "./InvestigationConstraints"
import { JockyCommandPreview } from "./JockyCommandPreview"
import { JockyIRPreview } from "./JockyIRPreview"
import { InvestigationReadinessCard } from "./InvestigationReadinessCard"
import { useInvestigationStore } from "@/store/investigationStore"
import { Investigation } from "@/types/investigation"
import { Badge } from "@/components/ui/badge"

const BUILDER_STEPS = [
  { id: 1, name: "1. FORENSIC INTENT" },
  { id: 2, name: "2. EVIDENCE REQ" },
  { id: 3, name: "3. TARGET HOSTS" },
  { id: 4, name: "4. CONSTRAINTS" },
  { id: 5, name: "5. GENERATE JOCKY" },
]

interface InvestigationBuilderProps {
  onInvestigationCreated?: (inv: Investigation) => void
}

export function InvestigationBuilder({ onInvestigationCreated }: InvestigationBuilderProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [generatedInvestigation, setGeneratedInvestigation] = useState<Investigation | null>(null)

  const builderDraft = useInvestigationStore((state) => state.builderDraft)
  const setBuilderDraft = useInvestigationStore((state) => state.setBuilderDraft)
  const resetBuilder = useInvestigationStore((state) => state.resetBuilder)
  const createInvestigation = useInvestigationStore((state) => state.createInvestigation)

  const handleGenerate = () => {
    const newInv = createInvestigation()
    setGeneratedInvestigation(newInv)
    setCurrentStep(5)
    if (onInvestigationCreated) {
      onInvestigationCreated(newInv)
    }
  }

  const handleReset = () => {
    resetBuilder()
    setGeneratedInvestigation(null)
    setCurrentStep(1)
  }

  return (
    <div className="space-y-6 select-none font-mono">
      {/* Workspace Header */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5">
              JOCKY COMPILER INTERFACE
            </span>
            <Badge variant="success">SIMULATION READY</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight">
            INVESTIGATION BUILDER
          </h1>
          <p className="text-xs font-bold text-zinc-600">
            Define forensic intent and generate a structured JOCKY investigation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-white text-xs font-bold hover:bg-zinc-100 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET DRAFT</span>
          </button>
        </div>
      </div>

      {/* Step Indicator */}
      <InvestigationStepIndicator
        currentStep={currentStep}
        onStepClick={(s) => setCurrentStep(s)}
        steps={BUILDER_STEPS}
      />

      {/* Two-Column Guided Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Steps (7 cols) */}
        <div className="lg:col-span-7 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
          <div className="pb-4 mb-5 border-b-2 border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 border-2 border-black bg-black text-amber-300 flex items-center justify-center font-black text-xs">
                0{currentStep}
              </span>
              <h2 className="text-base font-black uppercase text-black">
                {BUILDER_STEPS.find((s) => s.id === currentStep)?.name}
              </h2>
            </div>
            <span className="text-[11px] font-bold text-zinc-500">
              STEP {currentStep} OF 5
            </span>
          </div>

          {currentStep === 1 && (
            <ForensicIntentForm
              draft={builderDraft}
              onChange={setBuilderDraft}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <EvidenceRequirementSelector
              selectedEvidence={builderDraft.evidenceRequirements}
              onChange={(evidenceRequirements) => setBuilderDraft({ evidenceRequirements })}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <EndpointSelector
              selectedEndpoints={builderDraft.targetEndpoints}
              onChange={(targetEndpoints) => setBuilderDraft({ targetEndpoints })}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <InvestigationConstraints
              constraints={builderDraft.constraints}
              adaptiveProfile={builderDraft.adaptiveProfile}
              onChange={setBuilderDraft}
              onNext={() => setCurrentStep(5)}
              onBack={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 5 && (
            <div className="space-y-5 text-xs">
              <div className="p-4 border-2 border-black bg-amber-50 space-y-2">
                <span className="font-black text-black uppercase block">
                  READY TO GENERATE JOCKY INVESTIGATION
                </span>
                <p className="text-zinc-800 font-bold leading-relaxed">
                  Review the live specification in the right panel. Clicking generate will compile your intent into a deterministic platform-independent JOCKY IR and register it with the client state.
                </p>
              </div>

              {generatedInvestigation ? (
                <InvestigationReadinessCard
                  investigation={generatedInvestigation}
                  onLaunch={() => router.push(`/live-investigation?id=${generatedInvestigation.id}`)}
                />
              ) : (
                <div className="p-4 border-2 border-black bg-white flex flex-col items-center justify-center gap-3 text-center">
                  <Wand2 className="w-8 h-8 text-black animate-bounce" />
                  <div>
                    <div className="font-black text-sm text-black uppercase">
                      Compiler Ready for Intent Compilation
                    </div>
                    <div className="text-[11px] text-zinc-600 font-bold mt-1">
                      Targeting {builderDraft.targetEndpoints.length} endpoints with {builderDraft.evidenceRequirements.length} evidence requirements
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="mt-2 px-6 py-3 border-3 border-black bg-amber-400 text-black font-black uppercase shadow-[4px_4px_0px_#000] hover:bg-amber-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer text-sm flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>GENERATE JOCKY INVESTIGATION</span>
                  </button>
                </div>
              )}

              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 border-2 border-black bg-white text-black font-bold uppercase hover:bg-zinc-100 shadow-[2px_2px_0px_#000]"
                >
                  ← Back to Constraints
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live JOCKY Command DSL Preview */}
          <JockyCommandPreview draft={builderDraft} />

          {/* Live JOCKY IR Representation Preview */}
          <JockyIRPreview draft={builderDraft} />
        </div>
      </div>
    </div>
  )
}
