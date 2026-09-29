import { useState, useCallback } from "react"
import { useUIStore } from "@/store/uiStore"

export interface SimulationEvent {
  id: string
  timestamp: string
  source: string
  message: string
  type: "INFO" | "EXECUTION" | "ADAPTIVE_TRIGGER" | "MERKLE_MINT"
}

export function useSimulation() {
  const isSimulationMode = useUIStore((state) => state.isSimulationMode)
  const setSimulationMode = useUIStore((state) => state.setSimulationMode)

  const [simulationLogs, setSimulationLogs] = useState<SimulationEvent[]>([
    {
      id: "sim-1",
      timestamp: new Date().toISOString(),
      source: "ENGINE",
      message: "Adaptive Forensic Simulation Core initialized.",
      type: "INFO",
    },
  ])

  const triggerAdaptiveEvent = useCallback((message: string, source: string = "ADAPTIVE_PLANNER") => {
    const newEvent: SimulationEvent = {
      id: `sim-${Date.now()}`,
      timestamp: new Date().toISOString(),
      source,
      message,
      type: "ADAPTIVE_TRIGGER",
    }
    setSimulationLogs((prev) => [newEvent, ...prev])
  }, [])

  const triggerEvidenceSeal = useCallback((artifactName: string, hash: string) => {
    const newEvent: SimulationEvent = {
      id: `sim-${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: "PROVENANCE_LEDGER",
      message: `Artifact [${artifactName}] sealed into Merkle Root: ${hash.slice(0, 16)}...`,
      type: "MERKLE_MINT",
    }
    setSimulationLogs((prev) => [newEvent, ...prev])
  }, [])

  return {
    isSimulationMode,
    setSimulationMode,
    simulationLogs,
    triggerAdaptiveEvent,
    triggerEvidenceSeal,
  }
}
