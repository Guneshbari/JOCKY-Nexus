"use client"

import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/status/StatusPill"
import { DashboardRefreshButton } from "./DashboardRefreshButton"
import { useUIStore } from "@/store/uiStore"
import { useInvestigationStore } from "@/store/investigationStore"
import { useEndpointStore } from "@/store/endpointStore"
import { formatDate } from "@/lib/formatters"
import { BRANDING } from "@/lib/constants"
import { JockyEmblem } from "@/components/ui/JockyLogo"

export function DashboardHeader() {
  const { isSimulationMode, setSimulationMode, openModal } = useUIStore()
  const investigations = useInvestigationStore((state) => state.investigations)
  const endpoints = useEndpointStore((state) => state.endpoints)
  const lastRefreshTimestamp = useInvestigationStore((state) => state.lastRefreshTimestamp)

  const activeCount = investigations.filter((i) => i.status === "IN_PROGRESS").length

  return (
    <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_#000] relative overflow-hidden">
      {/* Decorative Corner Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400 border-l-4 border-b-4 border-black -mr-12 -mt-12 rotate-45 pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Branding & Core Posture */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-black bg-black text-amber-300 px-2.5 py-0.5 shadow-[2px_2px_0px_#FACC15]">
              NVPL-CONSOLE v0.1
            </span>
            <Badge variant="cyber">COMMAND POSTURE: ACTIVE</Badge>
            <StatusPill
              label={isSimulationMode ? "SIMULATION MODE ACTIVE" : "LIVE TELEMETRY MODE"}
              status={isSimulationMode ? "verified" : "online"}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="p-1 sm:p-1.5 border-2 border-black bg-amber-400 shadow-[2px_2px_0px_#000] shrink-0">
              <JockyEmblem size={38} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-black flex items-center gap-3">
              <span>JOCKY NEXUS COMMAND</span>
            </h1>
          </div>

          <p className="text-xs md:text-sm font-mono font-bold text-zinc-700">
            {BRANDING.tagline}
          </p>
        </div>

        {/* Right: Operational Status Badges & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <DashboardRefreshButton />

          <Button
            variant={isSimulationMode ? "cyber" : "outline"}
            size="sm"
            onClick={() => setSimulationMode(!isSimulationMode)}
            className="text-xs font-mono font-bold"
          >
            {isSimulationMode ? "PAUSE SIMULATION" : "RESUME SIMULATION"}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => openModal("NEW_INVESTIGATION")}
            className="gap-1.5 text-xs font-mono font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>NEW INVESTIGATION</span>
          </Button>
        </div>
      </div>

      {/* Quick Status Sub-Bar */}
      <div className="mt-5 pt-4 border-t-3 border-black grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono font-bold">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-rose-500 border border-black rounded-full animate-pulse" />
          <span className="text-zinc-600">Active Campaigns:</span>
          <span className="text-black font-black">{activeCount} Cases</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 border border-black rounded-full" />
          <span className="text-zinc-600">Connected Fleet:</span>
          <span className="text-black font-black">{endpoints.length} Hosts</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-cyan-400 border border-black rounded-full" />
          <span className="text-zinc-600">Last Telemetry Sync:</span>
          <span className="text-black font-black truncate">{formatDate(lastRefreshTimestamp)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-amber-400 border border-black rounded-full" />
          <span className="text-zinc-600">Chain-of-Custody:</span>
          <span className="text-black font-black bg-zinc-100 px-1 border border-black">SEALED (NVPL)</span>
        </div>
      </div>
    </div>
  )
}
