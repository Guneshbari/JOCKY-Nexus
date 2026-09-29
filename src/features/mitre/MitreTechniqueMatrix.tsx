"use client"

import React, { useMemo } from "react"
import { Grid } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MitreTechnique, MitreTacticName } from "@/types/mitre"

interface MitreTechniqueMatrixProps {
  techniques: MitreTechnique[]
  selectedTechniqueId: string | null
  onSelectTechnique: (technique: MitreTechnique) => void
}

const ORDERED_TACTICS: MitreTacticName[] = [
  "Initial Access",
  "Execution",
  "Persistence",
  "Privilege Escalation",
  "Defense Evasion",
  "Credential Access",
  "Discovery",
  "Lateral Movement",
  "Command and Control",
  "Impact",
]

export function MitreTechniqueMatrix({
  techniques,
  selectedTechniqueId,
  onSelectTechnique,
}: MitreTechniqueMatrixProps) {
  // Group techniques by tactic
  const grouped = useMemo(() => {
    const map: Partial<Record<MitreTacticName, MitreTechnique[]>> = {}
    ORDERED_TACTICS.forEach((tactic) => {
      map[tactic] = techniques.filter((t) => t.tactic === tactic)
    })
    return map
  }, [techniques])

  // Filter out tactics with zero detected techniques for a cleaner responsive matrix
  const activeTactics = useMemo(() => {
    return ORDERED_TACTICS.filter((tactic) => (grouped[tactic]?.length ?? 0) > 0)
  }, [grouped])

  return (
    <div className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-black" />
          <h3 className="text-sm font-black uppercase text-black">
            Interactive ATT&CK TTP Correlation Matrix
          </h3>
        </div>
        <span className="text-[10px] bg-amber-300 px-2 py-0.5 border border-black font-black">
          CLICK ANY TECHNIQUE TO INSPECT
        </span>
      </div>

      <p className="text-xs font-bold text-zinc-600">
        Tactical alignment matrix mapping active investigation observations to standardized adversary behaviors.
      </p>

      {/* Responsive Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 pt-1">
        {activeTactics.map((tactic) => {
          const list = grouped[tactic] ?? []

          return (
            <div
              key={tactic}
              className="border-2 border-black bg-zinc-50 flex flex-col shadow-[3px_3px_0px_#000]"
            >
              {/* Tactic Column Header */}
              <div className="p-2 border-b-2 border-black bg-zinc-200">
                <span className="text-[10px] font-black uppercase text-zinc-800 block truncate">
                  {tactic}
                </span>
                <span className="text-[9px] font-bold text-zinc-500">
                  {list.length} {list.length === 1 ? "Technique" : "Techniques"}
                </span>
              </div>

              {/* Stacked Technique Cards */}
              <div className="p-2 space-y-2 flex-1">
                {list.map((tech) => {
                  const isSelected = tech.id === selectedTechniqueId
                  const isCritical = tech.severity === "CRITICAL"

                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => onSelectTechnique(tech)}
                      className={`w-full p-2 border-2 border-black text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] shadow-[2px_2px_0px_#000] ${
                        isSelected
                          ? "bg-amber-400 text-black ring-2 ring-black"
                          : isCritical
                          ? "bg-rose-50 hover:bg-rose-100"
                          : "bg-white hover:bg-zinc-100"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-black bg-black text-white px-1 py-0.2">
                          {tech.id}
                        </span>
                        <Badge
                          variant={isCritical ? "danger" : "warning"}
                          className="text-[9px] px-1 py-0"
                        >
                          {tech.severity}
                        </Badge>
                      </div>

                      <div className="text-[11px] font-black text-black line-clamp-2 my-1 leading-snug">
                        {tech.name}
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-bold text-zinc-600 pt-1 border-t border-black/30">
                        <span>{tech.detectionCount} hits</span>
                        <span className="text-emerald-700">{tech.confidence} CONF</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
