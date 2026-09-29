"use client"

import React, { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  Layers,
  Wand2,
  Activity,
  Server,
  Sparkles,
} from "lucide-react"
import { InvestigationList } from "@/features/investigations/InvestigationList"
import { InvestigationBuilder } from "@/features/investigations/InvestigationBuilder"
import { useInvestigationStore } from "@/store/investigationStore"
import { useEndpointStore } from "@/store/endpointStore"
import { StatusPill } from "@/components/status/StatusPill"

function InvestigationsContent() {
  const searchParams = useSearchParams()
  const queryTab = searchParams.get("tab")

  const [tabOverride, setTabOverride] = useState<"campaigns" | "builder" | null>(null)
  const activeTab = tabOverride ?? (queryTab === "builder" ? "builder" : "campaigns")

  const investigations = useInvestigationStore((state) => state.investigations)
  const endpoints = useEndpointStore((state) => state.endpoints)

  const inProgressCount = investigations.filter((i) => i.status === "IN_PROGRESS").length
  const readyCount = investigations.filter((i) => i.status === "READY").length

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
            NEXUS ENGINE // V2.4
          </span>
          <span className="text-xs font-bold text-zinc-600">
            Forensic Intent → JOCKY IR → Adaptive Execution
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill label="ADAPTIVE PLANNER ACTIVE" status="verified" />
        </div>
      </div>

      {/* Main Page Title Header */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight">
            FORENSIC INVESTIGATIONS CONSOLE
          </h1>
          <p className="text-xs font-bold text-zinc-600 max-w-2xl">
            Coordinate multi-endpoint forensic investigations across Windows, Linux, and macOS. Define natural intent, compile to platform-independent JOCKY IR, and maintain verifiable hash chains.
          </p>
        </div>

        {/* Tab Toggle Switcher */}
        <div className="flex items-center gap-2 bg-zinc-100 p-1.5 border-3 border-black shadow-[3px_3px_0px_#000] shrink-0">
          <button
            type="button"
            onClick={() => setTabOverride("campaigns")}
            className={`flex items-center gap-2 px-3 py-1.5 font-black text-xs uppercase border-2 border-black transition-all cursor-pointer ${
              activeTab === "campaigns"
                ? "bg-black text-amber-300 shadow-[2px_2px_0px_#000]"
                : "bg-white text-black hover:bg-zinc-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CAMPAIGNS ({investigations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTabOverride("builder")}
            className={`flex items-center gap-2 px-3 py-1.5 font-black text-xs uppercase border-2 border-black transition-all cursor-pointer ${
              activeTab === "builder"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-black hover:bg-zinc-200"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>INVESTIGATION BUILDER</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-500 block">TOTAL CAMPAIGNS</span>
            <span className="text-xl font-black text-black">{investigations.length}</span>
          </div>
          <Layers className="w-5 h-5 text-zinc-500" />
        </div>

        <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-500 block">ACTIVE RUNNING</span>
            <span className="text-xl font-black text-amber-600">{inProgressCount}</span>
          </div>
          <Activity className="w-5 h-5 text-amber-500" />
        </div>

        <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-500 block">READY TO LAUNCH</span>
            <span className="text-xl font-black text-blue-600">{readyCount}</span>
          </div>
          <Sparkles className="w-5 h-5 text-blue-500" />
        </div>

        <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-500 block">MONITORED HOSTS</span>
            <span className="text-xl font-black text-emerald-600">{endpoints.length}</span>
          </div>
          <Server className="w-5 h-5 text-emerald-500" />
        </div>
      </div>

      {/* Main Workspace Render */}
      {activeTab === "campaigns" ? (
        <InvestigationList onOpenBuilder={() => setTabOverride("builder")} />
      ) : (
        <InvestigationBuilder
          onInvestigationCreated={() => {
            // Once generated, switch back to campaigns view
            setTabOverride("campaigns")
          }}
        />
      )}
    </div>
  )
}

export default function InvestigationsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 border-4 border-black bg-white font-mono text-center shadow-[6px_6px_0px_#000]">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-black border-t-amber-400 rounded-full" />
          <p className="text-xs font-bold uppercase mt-2">Loading Investigations Console...</p>
        </div>
      }
    >
      <InvestigationsContent />
    </Suspense>
  )
}
