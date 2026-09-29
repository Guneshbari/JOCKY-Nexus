"use client"

import React, { useState } from "react"
import {
  FileText,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  Layers,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Investigation, InvestigationSeverity } from "@/types/investigation"
import { truncateHash } from "@/lib/formatters"

interface InvestigationContextCardProps {
  investigation: Investigation
  allInvestigations: Investigation[]
  onSelectInvestigation: (id: string) => void
}

export function InvestigationContextCard({
  investigation,
  allInvestigations,
  onSelectInvestigation,
}: InvestigationContextCardProps) {
  const [copiedHash, setCopiedHash] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleCopyHash = () => {
    navigator.clipboard.writeText(investigation.provenanceRootHash)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const getSeverityBadgeVariant = (sev: InvestigationSeverity) => {
    switch (sev) {
      case "CRITICAL":
        return "danger"
      case "HIGH":
        return "warning"
      case "MEDIUM":
        return "default"
      case "LOW":
      default:
        return "neutral"
    }
  }

  return (
    <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] font-mono space-y-3">
      {/* Top Header with Case Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase text-zinc-500">
            ACTIVE FORENSIC CASE
          </span>
          <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
            {investigation.id}
          </span>
        </div>

        {/* Case Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-black border-2 border-black bg-zinc-100 hover:bg-zinc-200 cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <span>SWITCH CASE</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 max-w-[90vw] border-3 border-black bg-white shadow-[4px_4px_0px_#000] z-30 py-1">
              <div className="px-3 py-1 text-[10px] font-black text-zinc-400 uppercase border-b border-zinc-200">
                Available Investigations
              </div>
              {allInvestigations.map((inv) => (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => {
                    onSelectInvestigation(inv.id)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center justify-between border-b border-zinc-100 ${
                    inv.id === investigation.id ? "bg-amber-50 font-black" : ""
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-black text-black">{inv.id}</div>
                    <div className="text-[10px] text-zinc-600 truncate">{inv.title}</div>
                  </div>
                  <Badge variant={getSeverityBadgeVariant(inv.severity)}>
                    {inv.severity}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Case Details */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-black">
            {investigation.title}
          </h2>
          <Badge variant={getSeverityBadgeVariant(investigation.severity)}>
            {investigation.severity}
          </Badge>
          {investigation.category && (
            <span className="font-mono text-[10px] font-black uppercase bg-amber-200 border border-black px-2 py-0.5">
              {investigation.category}
            </span>
          )}
        </div>

        {/* Intent Box */}
        <div className="p-2.5 border-2 border-black bg-amber-50/70 text-xs">
          <span className="text-[10px] font-black uppercase text-zinc-500 block mb-0.5">
            FORENSIC INTENT SPECIFICATION
          </span>
          <p className="font-bold text-zinc-900 leading-relaxed">
            &quot;{investigation.intent}&quot;
          </p>
        </div>

        {/* Evidence Requirements Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-black uppercase text-zinc-500 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Evidence Requirements:
          </span>
          {(
            investigation.evidenceRequirements ?? [
              "Process activity",
              "Network connections",
              "Authentication events",
            ]
          ).map((req, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 border border-black bg-white text-[10px] font-bold text-black shadow-[1px_1px_0px_#000]"
            >
              {req}
            </span>
          ))}
        </div>

        {/* Merkle Hash Bar */}
        <div className="flex items-center justify-between p-2 border border-black bg-zinc-50 text-[11px] font-bold">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-zinc-500 uppercase text-[10px]">
              Provenance Root:
            </span>
            <span className="font-mono text-black truncate" title={investigation.provenanceRootHash}>
              {truncateHash(investigation.provenanceRootHash, 10, 10)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyHash}
            className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 border border-black bg-white hover:bg-zinc-100 shrink-0"
          >
            {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copiedHash ? "COPIED" : "COPY"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
