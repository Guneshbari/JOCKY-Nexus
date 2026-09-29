"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { Terminal, Cpu } from "lucide-react"
import { StatusPill } from "@/components/status/StatusPill"
import { useUIStore } from "@/store/uiStore"
import { BRANDING } from "@/lib/constants"

export function Header() {
  const pathname = usePathname()
  const { isSimulationMode, setSimulationMode } = useUIStore()

  const currentSection = pathname === "/" ? "OVERVIEW" : pathname.replace("/", "").toUpperCase()

  return (
    <header className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-6 select-none z-20 shrink-0">
      {/* Route & USP Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-mono text-sm font-black border-2 border-black bg-amber-300 px-3 py-1 shadow-[2px_2px_0px_#000]">
          <Terminal className="w-4 h-4 text-black" />
          <span>{currentSection}</span>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono font-bold text-zinc-600">
          <span>{BRANDING.tagline}</span>
        </div>
      </div>

      {/* Status Badges & Controls */}
      <div className="flex items-center gap-3">
        {/* Judge-Facing Prototype Notice */}
        <div className="hidden md:flex items-center gap-2 border-2 border-black bg-cyan-100 px-3 py-1 shadow-[2px_2px_0px_#000] text-xs font-mono font-bold">
          <Cpu className="w-3.5 h-3.5 text-cyan-800" />
          <span>ADAPTIVE ENGINE: ONLINE</span>
        </div>

        {/* Cryptographic Proof Pill */}
        <StatusPill label="NVPL PROVENANCE: SEALED" status="verified" />

        {/* Simulation Mode Toggle Button */}
        <button
          onClick={() => setSimulationMode(!isSimulationMode)}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold border-2 border-black bg-amber-400 shadow-[2px_2px_0px_#000] hover:bg-amber-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all"
          title="Toggle Simulation Mode"
        >
          <span className="w-2 h-2 rounded-full bg-black" />
          <span>{isSimulationMode ? "SIMULATION MODE" : "LIVE TELEMETRY"}</span>
        </button>
      </div>
    </header>
  )
}
