"use client"

import React, { useEffect, useRef } from "react"
import {
  Play,
  Pause,
  RotateCcw,
  Terminal,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CollectionSimulationState, EvidenceWorkflowStage } from "@/types/evidence"

interface CollectionSimulationPanelProps {
  simulation: CollectionSimulationState
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
  onAdvanceStage: () => void
  onSelectStage: (stage: EvidenceWorkflowStage) => void
}

export function CollectionSimulationPanel({
  simulation,
  onStart,
  onPause,
  onResume,
  onReset,
  onAdvanceStage,
  onSelectStage,
}: CollectionSimulationPanelProps) {
  const isRunning = simulation.isRunning
  const isPaused = simulation.isPaused
  const currentStage = simulation.currentStage
  const isComplete = simulation.isComplete

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && !isPaused && currentStage < 6) {
      timerRef.current = setTimeout(() => {
        onAdvanceStage()
      }, 1500)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isRunning, isPaused, currentStage, onAdvanceStage])

  const progressPercent = Math.min(100, Math.round((currentStage / 6) * 100))

  return (
    <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] font-mono space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase text-black">
            SIMULATED EVIDENCE COLLECTION CONTROLLER
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              isComplete
                ? "success"
                : isRunning && !isPaused
                ? "cyber"
                : isPaused
                ? "warning"
                : "neutral"
            }
          >
            {isComplete
              ? "ALL EVIDENCE SEALED (100%)"
              : isRunning && !isPaused
              ? "SIMULATING COLLECTION..."
              : isPaused
              ? "COLLECTION PAUSED"
              : "READY TO SIMULATE"}
          </Badge>
          <span className="text-[10px] font-bold text-zinc-500">
            {simulation.verifiedArtifacts} / {simulation.totalArtifacts} ARTIFACTS
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-zinc-600 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-zinc-500" />
            {simulation.activeStepName}
          </span>
          <span className="font-mono text-black font-black">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2.5 border-2 border-black bg-zinc-200 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isComplete
                ? "bg-emerald-500"
                : isRunning
                ? "bg-amber-400 animate-pulse"
                : "bg-zinc-400"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {!isRunning && !isComplete && (
          <Button
            size="sm"
            variant="cyber"
            onClick={onStart}
            className="gap-1.5 text-xs font-black"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>START COLLECTION RUN</span>
          </Button>
        )}

        {isRunning && !isPaused && (
          <Button
            size="sm"
            variant="outline"
            onClick={onPause}
            className="gap-1.5 text-xs font-bold"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>PAUSE</span>
          </Button>
        )}

        {isPaused && (
          <Button
            size="sm"
            variant="cyber"
            onClick={onResume}
            className="gap-1.5 text-xs font-black"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>RESUME</span>
          </Button>
        )}

        {!isComplete && (
          <Button
            size="sm"
            variant="default"
            onClick={onAdvanceStage}
            className="gap-1.5 text-xs font-bold"
          >
            <span>NEXT STAGE (0{currentStage < 6 ? currentStage + 1 : 6})</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={onReset}
          className="gap-1 text-xs font-bold text-zinc-600 hover:text-black hover:bg-zinc-100"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET PIPELINE</span>
        </Button>
      </div>

      {/* Jump Stage Strip */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-200">
        <span className="text-[10px] font-black uppercase text-zinc-500 mr-1">
          Direct Stage:
        </span>
        {([1, 2, 3, 4, 5, 6] as const).map((stageNum) => (
          <button
            key={stageNum}
            type="button"
            onClick={() => onSelectStage(stageNum)}
            className={`px-2 py-0.5 border border-black text-[10px] font-bold transition-all cursor-pointer ${
              currentStage === stageNum
                ? "bg-black text-amber-300 font-black shadow-[1px_1px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            0{stageNum}
          </button>
        ))}
      </div>
    </div>
  )
}
