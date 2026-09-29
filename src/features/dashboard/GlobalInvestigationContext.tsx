"use client"

import React from "react"
import Link from "next/link"
import {
  FolderGit2,
  ChevronDown,
  ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useInvestigationStore } from "@/store/investigationStore"

export function GlobalInvestigationContext() {
  const {
    investigations,
    activeInvestigation,
    selectInvestigation,
    evidenceItems,
    selectedExecutionProfiles,
  } = useInvestigationStore()

  const currentInv = activeInvestigation ?? investigations[0]
  if (!currentInv) return null

  // Evidence count for this specific investigation
  const caseEvidenceCount = evidenceItems.filter(
    (e) => e.investigationId === currentInv.id
  ).length

  // Profile count
  const profileCount = Object.keys(selectedExecutionProfiles).length

  return (
    <div className="border-3 border-black bg-amber-50 p-4 shadow-[4px_4px_0px_#000] font-mono space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-black" />
          <span className="text-xs font-black uppercase tracking-wider text-black">
            Active Investigation Context:
          </span>
          {/* Case Switcher */}
          <div className="relative inline-block">
            <select
              aria-label="Switch Active Case Context"
              value={currentInv.id}
              onChange={(e) => selectInvestigation(e.target.value)}
              className="appearance-none bg-white hover:bg-zinc-100 border-2 border-black px-2.5 py-1 pr-7 text-xs font-black uppercase cursor-pointer shadow-[2px_2px_0px_#000] focus:outline-none"
            >
              {investigations.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} — {inv.title.slice(0, 26)}...
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-black absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Quick Cross-Workspace Navigation for this Case */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <Link
            href={`/investigations/${currentInv.id}`}
            className="px-2 py-1 border border-black bg-white hover:bg-zinc-100 font-black flex items-center gap-1"
          >
            <span>Overview</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href={`/live-investigation?id=${currentInv.id}`}
            className="px-2 py-1 border border-black bg-amber-300 hover:bg-amber-400 text-black font-black flex items-center gap-1"
          >
            <span>Adaptive</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href={`/evidence?id=${currentInv.id}`}
            className="px-2 py-1 border border-black bg-cyan-300 hover:bg-cyan-400 text-black font-black flex items-center gap-1"
          >
            <span>Evidence</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href={`/network?id=${currentInv.id}`}
            className="px-2 py-1 border border-black bg-purple-300 hover:bg-purple-400 text-black font-black flex items-center gap-1"
          >
            <span>Network</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href={`/mitre?id=${currentInv.id}`}
            className="px-2 py-1 border border-black bg-orange-300 hover:bg-orange-400 text-black font-black flex items-center gap-1"
          >
            <span>MITRE</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Case Details Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        <div className="p-2 bg-white border border-black">
          <span className="text-[9px] text-zinc-500 font-bold block uppercase">Case ID</span>
          <span className="font-black text-black">{currentInv.id}</span>
        </div>

        <div className="p-2 bg-white border border-black truncate">
          <span className="text-[9px] text-zinc-500 font-bold block uppercase">Title</span>
          <span className="font-black text-black truncate block">{currentInv.title}</span>
        </div>

        <div className="p-2 bg-white border border-black">
          <span className="text-[9px] text-zinc-500 font-bold block uppercase">Status / Severity</span>
          <div className="flex items-center gap-1 mt-0.5">
            <Badge variant="neutral" className="text-[9px] px-1 py-0">{currentInv.status}</Badge>
            <Badge variant={currentInv.severity === "CRITICAL" ? "danger" : currentInv.severity === "HIGH" ? "warning" : "default"} className="text-[9px] px-1 py-0">
              {currentInv.severity}
            </Badge>
          </div>
        </div>

        <div className="p-2 bg-white border border-black">
          <span className="text-[9px] text-zinc-500 font-bold block uppercase">Target Endpoints</span>
          <span className="font-black text-black">{currentInv.targetEndpointIds.length} Hosts</span>
        </div>

        <div className="p-2 bg-white border border-black">
          <span className="text-[9px] text-zinc-500 font-bold block uppercase">Evidence Bound</span>
          <span className="font-black text-black">{caseEvidenceCount} Artifacts</span>
        </div>

        <div className="p-2 bg-white border border-black">
          <span className="text-[9px] text-zinc-500 font-bold block uppercase">Adaptive Profiles</span>
          <span className="font-black text-purple-700">{profileCount > 0 ? `${profileCount} Profiles` : "4 Profiles"}</span>
        </div>
      </div>
    </div>
  )
}
