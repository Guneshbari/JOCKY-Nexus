"use client"

import { Server, Check } from "lucide-react"
import { MOCK_ENDPOINTS } from "@/data/endpoints"
import { Badge } from "@/components/ui/badge"

interface EndpointSelectorProps {
  selectedEndpoints: string[]
  onChange: (endpoints: string[]) => void
  onNext: () => void
  onBack: () => void
}

export function EndpointSelector({
  selectedEndpoints,
  onChange,
  onNext,
  onBack,
}: EndpointSelectorProps) {
  const toggleEndpoint = (id: string) => {
    if (selectedEndpoints.includes(id)) {
      onChange(selectedEndpoints.filter((e) => e !== id))
    } else {
      onChange([...selectedEndpoints, id])
    }
  }

  const selectAll = () => onChange(MOCK_ENDPOINTS.map((e) => e.id))
  const selectWindowsOnly = () =>
    onChange(MOCK_ENDPOINTS.filter((e) => e.platform === "windows").map((e) => e.id))
  const selectLinuxOnly = () =>
    onChange(MOCK_ENDPOINTS.filter((e) => e.platform === "linux").map((e) => e.id))

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-2 border-black bg-zinc-100">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-black" />
          <span className="font-black text-black uppercase">
            Target Host Nodes ({selectedEndpoints.length} / {MOCK_ENDPOINTS.length} Selected)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={selectWindowsOnly}
            className="px-2 py-1 text-[10px] font-bold border-2 border-black bg-white hover:bg-zinc-200 transition-colors shadow-[1px_1px_0px_#000]"
          >
            Windows Only
          </button>
          <button
            type="button"
            onClick={selectLinuxOnly}
            className="px-2 py-1 text-[10px] font-bold border-2 border-black bg-white hover:bg-zinc-200 transition-colors shadow-[1px_1px_0px_#000]"
          >
            Linux Only
          </button>
          <button
            type="button"
            onClick={selectAll}
            className="px-2 py-1 text-[10px] font-bold border-2 border-black bg-white hover:bg-zinc-200 transition-colors shadow-[1px_1px_0px_#000]"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={() => onChange([])}
            className="px-2 py-1 text-[10px] font-bold border-2 border-black bg-white hover:bg-rose-100 transition-colors shadow-[1px_1px_0px_#000]"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-2.5">
        {MOCK_ENDPOINTS.map((ep) => {
          const isSelected = selectedEndpoints.includes(ep.id)
          return (
            <div
              key={ep.id}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => toggleEndpoint(ep.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  toggleEndpoint(ep.id)
                }
              }}
              className={`p-3.5 border-2 border-black cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none ${
                isSelected
                  ? "bg-cyan-100 shadow-[3px_3px_0px_#000] -translate-y-0.5 border-black"
                  : "bg-white hover:bg-zinc-50 shadow-[2px_2px_0px_#000]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 border-2 border-black flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-black text-cyan-300" : "bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-black">
                      {ep.hostname}
                    </span>
                    <span className="px-1.5 py-0.2 border border-black bg-zinc-100 text-[10px] font-black uppercase">
                      {ep.platform}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold">
                      {ep.ipAddress}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-600 font-bold mt-0.5">
                    {ep.osVersion} • <span className="text-zinc-500">{ep.agentVersion}</span>
                  </div>
                </div>
              </div>

              {/* Status and Health Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-[11px] font-black px-2 py-0.5 border border-black bg-zinc-50">
                  Readiness: {ep.forensicReadinessScore}%
                </div>

                <Badge variant={ep.isolationStatus === "ISOLATED" ? "danger" : "neutral"} className="text-[10px]">
                  {ep.isolationStatus}
                </Badge>

                <Badge variant={ep.agentStatus === "ONLINE" ? "success" : "default"} className="text-[10px]">
                  {ep.agentStatus}
                </Badge>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation action */}
      <div className="pt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border-2 border-black bg-white text-black font-bold uppercase hover:bg-zinc-100 shadow-[2px_2px_0px_#000]"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selectedEndpoints.length === 0}
          className="px-5 py-2.5 border-2 border-black bg-amber-400 text-black font-black uppercase shadow-[3px_3px_0px_#000] hover:bg-amber-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          Proceed to Constraints →
        </button>
      </div>
    </div>
  )
}
