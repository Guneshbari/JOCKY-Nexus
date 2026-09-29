"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Terminal, Cpu, Compass, Menu } from "lucide-react"
import { StatusPill } from "@/components/status/StatusPill"
import { JockyEmblem } from "@/components/ui/JockyLogo"
import { useUIStore } from "@/store/uiStore"
import { BRANDING } from "@/lib/constants"

export function Header() {
  const pathname = usePathname()
  const {
    isSimulationMode,
    setSimulationMode,
    isJudgeDemoActive,
    toggleJudgeDemo,
    judgeDemoStep,
    toggleSidebar,
  } = useUIStore()

  const currentSection = pathname === "/" ? "OVERVIEW" : pathname.replace("/", "").toUpperCase()

  return (
    <header className="h-16 border-b-4 border-black bg-white flex items-center justify-between px-3 sm:px-6 select-none z-20 shrink-0 min-w-0">
      {/* Route & USP Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle Navigation Sidebar"
          className="p-1.5 border-2 border-black bg-white hover:bg-zinc-100 md:hidden shadow-[1px_1px_0px_#000] cursor-pointer shrink-0"
        >
          <Menu className="w-4 h-4 text-black" />
        </button>

        {/* Brand Emblem Link */}
        <Link
          href="/dashboard"
          className="hidden xs:flex items-center shrink-0 hover:scale-105 transition-transform"
          title="JOCKY Nexus Command Center"
        >
          <JockyEmblem size={28} />
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm font-black border-2 border-black bg-amber-300 px-2 sm:px-3 py-1 shadow-[2px_2px_0px_#000] min-w-0">
          <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black shrink-0" />
          <span className="truncate max-w-[100px] xs:max-w-[140px] sm:max-w-none">{currentSection}</span>
        </div>

        <div className="hidden xl:flex items-center gap-2 text-xs font-mono font-bold text-zinc-600 truncate">
          <span className="truncate">{BRANDING.tagline}</span>
        </div>
      </div>

      {/* Status Badges & Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Judge Demo Quick Toggle */}
        <button
          type="button"
          onClick={toggleJudgeDemo}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 text-xs font-mono font-black border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-all ${
            isJudgeDemoActive
              ? "bg-amber-400 text-black ring-2 ring-black"
              : "bg-zinc-100 hover:bg-zinc-200 text-black"
          }`}
          title="Toggle Guided Judge Demonstration Mode"
        >
          <Compass className="w-3.5 h-3.5 text-black shrink-0" />
          <span className="hidden xs:inline">{isJudgeDemoActive ? `DEMO 0${judgeDemoStep + 1}/08` : "JUDGE DEMO"}</span>
          <span className="xs:hidden">{isJudgeDemoActive ? `D0${judgeDemoStep + 1}` : "DEMO"}</span>
        </button>

        {/* Adaptive Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 border-2 border-black bg-cyan-100 px-2.5 py-1 shadow-[2px_2px_0px_#000] text-xs font-mono font-bold text-cyan-950">
          <Cpu className="w-3.5 h-3.5 text-cyan-800" />
          <span>ADAPTIVE ONLINE</span>
        </div>

        {/* Cryptographic Proof Pill */}
        <div className="hidden sm:block">
          <StatusPill label="PROVENANCE SEALED" status="verified" />
        </div>

        {/* Simulation Mode Toggle Button */}
        <button
          type="button"
          onClick={() => setSimulationMode(!isSimulationMode)}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1 text-xs font-mono font-black border-2 border-black bg-amber-400 shadow-[2px_2px_0px_#000] hover:bg-amber-300 transition-all cursor-pointer"
          title="Toggle Simulation Mode"
        >
          <span className="w-2 h-2 rounded-full bg-black shrink-0" />
          <span className="hidden md:inline">{isSimulationMode ? "SIMULATION MODE" : "LIVE BENCHMARK"}</span>
          <span className="md:hidden">SIM</span>
        </button>
      </div>
    </header>
  )
}
