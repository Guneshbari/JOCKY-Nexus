"use client"

import React from "react"
import {
  ShieldAlert,
  Server,
  Lock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EndpointPosture } from "@/types/execution"
import { Endpoint } from "@/types/endpoint"

interface EndpointPostureMatrixProps {
  postures: Record<string, EndpointPosture>
  endpoints: Endpoint[]
  selectedEndpointId?: string
  onSelectEndpoint?: (id: string) => void
}

export function EndpointPostureMatrix({
  postures,
  endpoints,
  selectedEndpointId,
  onSelectEndpoint,
}: EndpointPostureMatrixProps) {
  const getPostureBadgeVariant = (level: EndpointPosture["postureLevel"]) => {
    switch (level) {
      case "RESTRICTED":
        return "danger"
      case "HARDENED":
        return "success"
      case "ELEVATED":
        return "warning"
      case "STANDARD":
      default:
        return "default"
    }
  }

  return (
    <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] font-mono space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase text-black">
            ENDPOINT SECURITY & COLLECTION POSTURE MATRIX
          </span>
        </div>
        <span className="text-[10px] font-bold text-zinc-500">
          Environment & Telemetry Constraints Only // Safe Forensic Sampling
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {endpoints.map((ep) => {
          const posture = postures[ep.id]
          const isSelected = selectedEndpointId === ep.id

          return (
            <div
              key={ep.id}
              onClick={() => onSelectEndpoint?.(ep.id)}
              className={`p-3 border-2 border-black transition-all cursor-pointer space-y-2.5 ${
                isSelected
                  ? "bg-amber-100 shadow-[3px_3px_0px_#000] -translate-y-0.5"
                  : "bg-zinc-50 hover:bg-zinc-100 shadow-[2px_2px_0px_#000]"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-1 pb-1 border-b border-black">
                <div className="flex items-center gap-1.5 truncate">
                  <Server className="w-3.5 h-3.5 text-black shrink-0" />
                  <span className="text-xs font-black text-black truncate">
                    {ep.hostname}
                  </span>
                </div>
                {posture && (
                  <Badge variant={getPostureBadgeVariant(posture.postureLevel)}>
                    {posture.postureLevel}
                  </Badge>
                )}
              </div>

              {/* Meta strip */}
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="font-mono text-zinc-600 uppercase">
                  {`${ep.platform} // ${ep.ipAddress}`}
                </span>
                <span className="text-emerald-700 font-mono">
                  {ep.forensicReadinessScore}% READY
                </span>
              </div>

              {/* Telemetry Bar */}
              <div className="w-full h-1.5 border border-black bg-zinc-200">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${ep.forensicReadinessScore}%` }}
                />
              </div>

              {/* Restrictions */}
              {posture && (
                <div className="space-y-1.5 text-[10px] pt-1">
                  <div>
                    <span className="font-black text-zinc-500 uppercase block">
                      Collection Boundaries:
                    </span>
                    <ul className="list-disc pl-3 text-zinc-800 font-bold space-y-0.5 mt-0.5">
                      {posture.collectionRestrictions.map((r, i) => (
                        <li key={i} className="leading-tight">{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-black text-zinc-500 uppercase block">
                      Active Telemetry Adapters:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {posture.availableAdapters.map((ad, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 bg-white border border-black text-[9px] font-mono font-bold text-black"
                        >
                          {ad}
                        </span>
                      ))}
                    </div>
                  </div>

                  {ep.isolationStatus === "ISOLATED" && (
                    <div className="flex items-center gap-1 p-1 bg-rose-100 border border-black text-rose-950 font-bold text-[9px]">
                      <Lock className="w-3 h-3 text-rose-700 shrink-0" />
                      <span>ISOLATED: Forensic acquisition via secure agent tunnel</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
