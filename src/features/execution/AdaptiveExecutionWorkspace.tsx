"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  FileCode2,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/status/StatusPill"
import { AdaptiveStagePipeline } from "./AdaptiveStagePipeline"
import { InvestigationContextCard } from "./InvestigationContextCard"
import { EndpointPostureMatrix } from "./EndpointPostureMatrix"
import { AdaptiveDecisionPanel } from "./AdaptiveDecisionPanel"
import { ExecutionProfileCard } from "./ExecutionProfileCard"
import { EndpointProfileTable } from "./EndpointProfileTable"
import { DecisionReasoningTimeline } from "./DecisionReasoningTimeline"
import { AdaptiveSimulationControls } from "./AdaptiveSimulationControls"
import { CollectionReadinessCard } from "./CollectionReadinessCard"
import { AdaptiveExecutionGraph } from "./AdaptiveExecutionGraph"
import { useInvestigationStore } from "@/store/investigationStore"
import { useEndpointStore } from "@/store/endpointStore"
import { Endpoint } from "@/types/endpoint"

export function AdaptiveExecutionWorkspace() {
  const searchParams = useSearchParams()
  const initialCaseId = searchParams.get("id")

  const investigations = useInvestigationStore((state) => state.investigations)
  const currentInvestigation = useInvestigationStore((state) => state.currentInvestigation)
  const selectInvestigation = useInvestigationStore((state) => state.selectInvestigation)

  const executionStage = useInvestigationStore((state) => state.executionStage)
  const simulationPaused = useInvestigationStore((state) => state.simulationPaused)
  const adaptiveSimulation = useInvestigationStore((state) => state.adaptiveSimulation)
  const selectedExecutionProfiles = useInvestigationStore((state) => state.selectedExecutionProfiles)
  const endpointDecisions = useInvestigationStore((state) => state.endpointDecisions)
  const endpointPostures = useInvestigationStore((state) => state.endpointPostures)

  const startAdaptiveAnalysis = useInvestigationStore((state) => state.startAdaptiveAnalysis)
  const advanceAdaptiveStage = useInvestigationStore((state) => state.advanceAdaptiveStage)
  const setExecutionStage = useInvestigationStore((state) => state.setExecutionStage)
  const pauseAdaptiveSimulation = useInvestigationStore((state) => state.pauseAdaptiveSimulation)
  const resumeAdaptiveSimulation = useInvestigationStore((state) => state.resumeAdaptiveSimulation)
  const resetAdaptiveSimulation = useInvestigationStore((state) => state.resetAdaptiveSimulation)
  const calculateExecutionProfiles = useInvestigationStore((state) => state.calculateExecutionProfiles)

  const allEndpoints = useEndpointStore((state) => state.endpoints)

  // Active investigation fallback
  const activeInvestigation =
    (initialCaseId ? investigations.find((i) => i.id === initialCaseId) : null) ??
    currentInvestigation ??
    investigations[0]

  // Endpoints targeted by this investigation
  const targetEndpoints: Endpoint[] = (
    activeInvestigation.targetEndpointIds.length > 0
      ? allEndpoints.filter((e) => activeInvestigation.targetEndpointIds.includes(e.id))
      : allEndpoints.slice(0, 3)
  )

  // User-selected endpoint override
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>("")

  // Derived focused endpoint ID to avoid cascading setState in effects
  const focusedEndpointId =
    selectedEndpointId && targetEndpoints.some((e) => e.id === selectedEndpointId)
      ? selectedEndpointId
      : targetEndpoints[0]?.id ?? allEndpoints[0]?.id ?? "ep-dc-01"

  // IR Modal state
  const [isIRModalOpen, setIsIRModalOpen] = useState(false)

  // Active endpoint's profile, decision, posture
  const activeProfile = selectedExecutionProfiles[focusedEndpointId] ?? Object.values(selectedExecutionProfiles)[0]
  const activeDecision = endpointDecisions[focusedEndpointId] ?? Object.values(endpointDecisions)[0]
  const activeEndpoint = allEndpoints.find((e) => e.id === focusedEndpointId) ?? targetEndpoints[0]

  return (
    <div className="space-y-6 font-mono select-none">
      {/* Top Banner Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
            ADAPTIVE ENGINE: ONLINE
          </span>
          <span className="text-xs font-bold text-zinc-600">
            SIMULATION MODE: ACTIVE // HIGH-FIDELITY FORENSIC PLANNING
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill label="ADAPTIVE PLANNER: ONLINE" status="verified" />
        </div>
      </div>

      {/* Main Workspace Header */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_#000] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black bg-amber-400 text-black px-2 py-0.5 border border-black">
                CORE USP WORKSPACE
              </span>
              <Badge variant="cyber">DIFFERENTIATED EXECUTION</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight">
              ADAPTIVE EXECUTION INTELLIGENCE
            </h1>
            <p className="text-xs font-bold text-zinc-600 max-w-3xl">
              The same forensic intent is translated into a controlled execution profile according to endpoint context, OS kernel architecture, and investigation constraints.
            </p>
          </div>

          <div className="p-3 border-2 border-black bg-black text-amber-300 text-center shrink-0">
            <span className="text-[10px] font-black uppercase block tracking-wider text-zinc-400">
              CORE PARADIGM
            </span>
            <span className="text-sm font-black uppercase">
              ONE INTENT → MULTIPLE PROFILES
            </span>
          </div>
        </div>
      </div>

      {/* 7-Stage Pipeline Visualizer */}
      <AdaptiveStagePipeline
        currentStage={executionStage}
        onSelectStage={(s) => setExecutionStage(s)}
      />

      {/* Simulation Controls Strip */}
      <AdaptiveSimulationControls
        simulationState={adaptiveSimulation}
        currentStage={executionStage}
        isPaused={simulationPaused}
        onStart={() => startAdaptiveAnalysis(activeInvestigation.id)}
        onPause={pauseAdaptiveSimulation}
        onResume={resumeAdaptiveSimulation}
        onReset={resetAdaptiveSimulation}
        onRecalculate={() => calculateExecutionProfiles(activeInvestigation.id)}
        onAdvanceStage={advanceAdaptiveStage}
        onJumpStage={setExecutionStage}
        onViewIR={() => setIsIRModalOpen(true)}
      />

      {/* Investigation Context & Intent Card */}
      <InvestigationContextCard
        investigation={activeInvestigation}
        allInvestigations={investigations}
        onSelectInvestigation={(id) => {
          selectInvestigation(id)
          calculateExecutionProfiles(id)
        }}
      />

      {/* React Flow Adaptive Decision Graph */}
      <AdaptiveExecutionGraph
        investigation={activeInvestigation}
        endpoints={targetEndpoints}
        profiles={selectedExecutionProfiles}
        postures={endpointPostures}
        currentStage={executionStage}
      />

      {/* Multi-Endpoint Differentiation Matrix Table */}
      <EndpointProfileTable
        endpoints={targetEndpoints}
        profiles={selectedExecutionProfiles}
        postures={endpointPostures}
        selectedEndpointId={focusedEndpointId}
        onSelectEndpoint={(id) => setSelectedEndpointId(id)}
      />

      {/* Deep-Dive Grid: Posture & Decision Reasoning (Left) + Execution Profile (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (6 cols): Security Posture & Decision Explanation */}
        <div className="lg:col-span-6 space-y-6">
          {/* Posture Matrix */}
          <EndpointPostureMatrix
            postures={endpointPostures}
            endpoints={targetEndpoints}
            selectedEndpointId={focusedEndpointId}
            onSelectEndpoint={(id) => setSelectedEndpointId(id)}
          />

          {/* Decision Explanation */}
          {activeDecision && <AdaptiveDecisionPanel decision={activeDecision} />}

          {/* Reasoning Timeline */}
          <DecisionReasoningTimeline
            simulationState={adaptiveSimulation}
            activeProfileName={activeProfile?.name ?? "Adaptive Profile"}
            targetHostname={activeEndpoint?.hostname ?? focusedEndpointId}
          />
        </div>

        {/* Right Column (6 cols): Profile Card & Readiness */}
        <div className="lg:col-span-6 space-y-6">
          {activeProfile && <ExecutionProfileCard profile={activeProfile} />}

          {/* Stage 7 Ready Card */}
          <CollectionReadinessCard
            investigation={activeInvestigation}
            profiles={selectedExecutionProfiles}
          />
        </div>
      </div>

      {/* JOCKY IR Modal */}
      {isIRModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl border-4 border-black bg-white shadow-[8px_8px_0px_#000] font-mono space-y-3 max-h-[85vh] flex flex-col">
            <div className="p-3 bg-zinc-900 text-white flex items-center justify-between border-b-2 border-black">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black uppercase">
                  JOCKY INTERMEDIATE REPRESENTATION (IR AST)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsIRModalOpen(false)}
                className="p-1 hover:bg-zinc-800 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-zinc-50">
              <pre className="font-mono text-xs text-zinc-900 leading-relaxed">
                <code>
                  {JSON.stringify(
                    activeInvestigation.jockyIR ?? {
                      ir_version: "2.0-SIM",
                      campaign_id: activeInvestigation.id,
                      schema_version: "v1.0.0-jocky-ir",
                      intent: activeInvestigation.intent,
                      targets: activeInvestigation.targetEndpointIds,
                      adaptive_routing_enabled: true,
                    },
                    null,
                    2
                  )}
                </code>
              </pre>
            </div>

            <div className="p-3 border-t-2 border-black bg-zinc-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsIRModalOpen(false)}
                className="px-4 py-1.5 border-2 border-black bg-white text-xs font-black uppercase hover:bg-zinc-200"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
