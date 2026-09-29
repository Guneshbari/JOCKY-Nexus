"use client"

import React, { useEffect, useRef } from "react"
import {
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  Terminal,
  FileCode2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AdaptiveSimulationState,
  AdaptiveSimulationStage,
} from "@/types/execution"

interface AdaptiveSimulationControlsProps {
  simulationState: AdaptiveSimulationState
  currentStage: AdaptiveSimulationStage
  isPaused: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
  onRecalculate: () => void
  onAdvanceStage: () => void
  onJumpStage: (stage: AdaptiveSimulationStage) => void
  onViewIR?: () => void
}

export function AdaptiveSimulationControls({
  simulationState,
  currentStage,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
  onRecalculate,
  onAdvanceStage,
  onJumpStage,
  onViewIR,
}: AdaptiveSimulationControlsProps) {
  const isRunning = simulationState.isRunning
  const isComplete = currentStage === 7

  // Auto-advance interval when running and not paused
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && !isPaused && currentStage < 7) {
      timerRef.current = setTimeout(() => {
        onAdvanceStage()
      }, 1600)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isRunning, isPaused, currentStage, onAdvanceStage])

  return (
    <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] font-mono space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase text-black">
            ADAPTIVE ENGINE SIMULATION CONTROLLER
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">
            STATUS:
          </span>
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
              ? "EXECUTION PROFILES READY"
              : isRunning && !isPaused
              ? "EVALUATING PIPELINE..."
              : isPaused
              ? "SIMULATION PAUSED"
              : "IDLE / READY"}
          </Badge>
        </div>
      </div>

      {/* Button Controls Row */}
      <div className="flex flex-wrap items-center gap-2">
        {!isRunning && currentStage === 1 && (
          <Button
            size="sm"
            variant="cyber"
            onClick={onStart}
            className="gap-1.5 text-xs font-black"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>START ADAPTIVE ANALYSIS</span>
          </Button>
        )}

        {isRunning && !isPaused && currentStage < 7 && (
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

        {isPaused && currentStage < 7 && (
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

        {currentStage < 7 && (
          <Button
            size="sm"
            variant="default"
            onClick={onAdvanceStage}
            className="gap-1.5 text-xs font-bold"
          >
            <span>STEP NEXT (0{currentStage + 1})</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={onRecalculate}
          className="gap-1.5 text-xs font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RECALCULATE PROFILES</span>
        </Button>

        {onViewIR && (
          <Button
            size="sm"
            variant="outline"
            onClick={onViewIR}
            className="gap-1.5 text-xs font-bold"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>INSPECT JOCKY IR</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={onReset}
          className="gap-1 text-xs font-bold text-zinc-600 hover:text-black hover:bg-zinc-100"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </Button>
      </div>

      {/* Direct Stage Jump Strip */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-200">
        <span className="text-[10px] font-black uppercase text-zinc-500 mr-1">
          Jump to Stage:
        </span>
        {([1, 2, 3, 4, 5, 6, 7] as const).map((stageNum) => (
          <button
            key={stageNum}
            type="button"
            onClick={() => onJumpStage(stageNum)}
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
