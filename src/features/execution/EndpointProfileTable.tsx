"use client"

import React from "react"
import {
  Server,
  Layers,
  CheckCircle2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Endpoint } from "@/types/endpoint"
import {
  AdaptiveExecutionProfile,
  EndpointPosture,
} from "@/types/execution"

interface EndpointProfileTableProps {
  endpoints: Endpoint[]
  profiles: Record<string, AdaptiveExecutionProfile>
  postures: Record<string, EndpointPosture>
  selectedEndpointId?: string
  onSelectEndpoint?: (id: string) => void
}

export function EndpointProfileTable({
  endpoints,
  profiles,
  postures,
  selectedEndpointId,
  onSelectEndpoint,
}: EndpointProfileTableProps) {
  const getProfileBadgeVariant = (id: string) => {
    switch (id) {
      case "PROFILE-A":
        return "warning"
      case "PROFILE-B":
        return "cyber"
      case "PROFILE-C":
        return "success"
      case "PROFILE-D":
        return "default"
      default:
        return "neutral"
    }
  }

  const getPostureBadgeVariant = (level?: string) => {
    switch (level) {
      case "RESTRICTED":
        return "danger"
      case "HARDENED":
        return "success"
      case "ELEVATED":
        return "warning"
      default:
        return "default"
    }
  }

  return (
    <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] font-mono space-y-3">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-black" />
            <h3 className="text-xs font-black uppercase text-black">
              ENDPOINT ADAPTIVE EXECUTION MATRIX
            </h3>
          </div>
          <span className="text-[10px] font-black text-amber-600 uppercase block">
            ONE INVESTIGATION → MULTIPLE ADAPTIVE PROFILES
          </span>
        </div>

        <div className="text-[10px] font-bold text-zinc-500">
          Showing {endpoints.length} Heterogeneous Endpoint Targets
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto w-full min-w-0">
        <table className="w-full min-w-[700px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-zinc-100 text-[10px] font-black text-zinc-600 uppercase">
              <th className="p-2 border-r border-black">Endpoint Node</th>
              <th className="p-2 border-r border-black">OS Platform</th>
              <th className="p-2 border-r border-black">Telemetry</th>
              <th className="p-2 border-r border-black">Posture</th>
              <th className="p-2 border-r border-black">Selected Profile</th>
              <th className="p-2 border-r border-black">Forensic Focus</th>
              <th className="p-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((ep) => {
              const profile = profiles[ep.id]
              const posture = postures[ep.id]
              const isSelected = selectedEndpointId === ep.id

              return (
                <tr
                  key={ep.id}
                  onClick={() => onSelectEndpoint?.(ep.id)}
                  className={`border-b border-black cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-amber-100 font-bold"
                      : "hover:bg-zinc-50 bg-white"
                  }`}
                >
                  {/* Endpoint Node */}
                  <td className="p-2 border-r border-black font-bold">
                    <div className="flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-black shrink-0" />
                      <div>
                        <div className="text-black font-black">{ep.hostname}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {`${ep.id} // ${ep.ipAddress}`}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* OS Platform */}
                  <td className="p-2 border-r border-black uppercase font-bold text-zinc-700">
                    {ep.platform}
                  </td>

                  {/* Telemetry Readiness */}
                  <td className="p-2 border-r border-black">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="font-mono text-emerald-700">
                        {ep.forensicReadinessScore}%
                      </span>
                      <div className="w-12 h-1.5 border border-black bg-zinc-200">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${ep.forensicReadinessScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Posture */}
                  <td className="p-2 border-r border-black">
                    {posture && (
                      <Badge variant={getPostureBadgeVariant(posture.postureLevel)}>
                        {posture.postureLevel}
                      </Badge>
                    )}
                  </td>

                  {/* Selected Profile */}
                  <td className="p-2 border-r border-black">
                    {profile ? (
                      <div className="flex items-center gap-1.5">
                        <Badge variant={getProfileBadgeVariant(profile.id)}>
                          {profile.id}
                        </Badge>
                        <span className="text-[11px] font-black text-black">
                          {profile.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-zinc-400">ANALYZING...</span>
                    )}
                  </td>

                  {/* Forensic Focus */}
                  <td className="p-2 border-r border-black text-[10px] text-zinc-600 font-mono">
                    {profile ? profile.focus.slice(0, 2).join(", ") : "—"}
                  </td>

                  {/* Status */}
                  <td className="p-2 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-600">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>READY</span>
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
