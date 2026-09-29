"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Lock,
  CheckCircle2,
  Copy,
  Check,
  ArrowUpRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProvenanceState } from "@/store/investigationStore"
import { formatDate } from "@/lib/formatters"

interface EvidenceCollectionSummaryProps {
  provenanceState: ProvenanceState
  totalArtifacts: number
  verifiedArtifacts: number
}

export function EvidenceCollectionSummary({
  provenanceState,
  totalArtifacts,
  verifiedArtifacts,
}: EvidenceCollectionSummaryProps) {
  const [copiedRoot, setCopiedRoot] = useState(false)

  const handleCopyRoot = () => {
    navigator.clipboard.writeText(provenanceState.merkleRoot)
    setCopiedRoot(true)
    setTimeout(() => setCopiedRoot(false), 2000)
  }

  return (
    <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_#000] font-mono space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-black" />
          <h3 className="text-base font-black uppercase text-black">
            PROVENANCE SUMMARY & EVIDENCE CHAIN STATUS
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">CHAIN STATUS: SEALED</Badge>
          <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
            BLOCK #{provenanceState.blockHeight}
          </span>
        </div>
      </div>

      {/* 4-Stat Box */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
        <div className="p-3 border-2 border-black bg-zinc-50 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase block">Total Harvested</span>
          <span className="text-xl font-black text-black">{totalArtifacts}</span>
        </div>

        <div className="p-3 border-2 border-black bg-zinc-50 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase block">Verified Integrity</span>
          <span className="text-xl font-black text-emerald-600">{verifiedArtifacts}</span>
        </div>

        <div className="p-3 border-2 border-black bg-zinc-50 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase block">Chain Integrity</span>
          <span className="text-xl font-black text-emerald-700">{provenanceState.chainIntegrity}</span>
        </div>

        <div className="p-3 border-2 border-black bg-zinc-50 space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase block">Last Sealed Event</span>
          <span className="text-xs font-black text-zinc-800 font-mono truncate block">
            {formatDate(provenanceState.lastSealedTimestamp)}
          </span>
        </div>
      </div>

      {/* Merkle Root Bar */}
      <div className="p-3 border-2 border-black bg-amber-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 truncate pr-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-black text-zinc-500 uppercase text-[10px]">
            ACTIVE MERKLE ROOT:
          </span>
          <span className="font-mono text-black font-bold truncate" title={provenanceState.merkleRoot}>
            {provenanceState.merkleRoot}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyRoot}
          className="flex items-center gap-1 text-[10px] font-black px-2 py-1 border border-black bg-white hover:bg-zinc-100 cursor-pointer shrink-0"
        >
          {copiedRoot ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copiedRoot ? "COPIED" : "COPY ROOT HASH"}</span>
        </button>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t-2 border-zinc-200">
        <p className="text-[11px] text-zinc-600 font-bold">
          Non-Volatile Provenance Ledger ensures court-admissible auditability for every forensic artifact collected during this campaign.
        </p>

        <Link href="/provenance">
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 border-2 border-black bg-amber-400 text-black text-xs font-black uppercase hover:bg-amber-300 cursor-pointer shadow-[3px_3px_0px_#000] shrink-0"
          >
            <span>OPEN PROVENANCE AUDIT</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </div>
  )
}
