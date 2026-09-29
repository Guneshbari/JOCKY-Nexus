"use client"

import React, { useState } from "react"
import {
  ShieldCheck,
  Database,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Clock,
} from "lucide-react"
import { EvidenceArtifact } from "@/types/evidence"
import { truncateHash } from "@/lib/formatters"

interface EvidenceMetricsProps {
  evidenceItems: EvidenceArtifact[]
  merkleRoot: string
}

export function EvidenceMetrics({
  evidenceItems,
  merkleRoot,
}: EvidenceMetricsProps) {
  const [copiedHash, setCopiedHash] = useState(false)

  const total = evidenceItems.length
  const verified = evidenceItems.filter((e) => e.integrityVerified).length
  const pending = total - verified
  const exceptions = 0
  const verificationRate = total > 0 ? Math.round((verified / total) * 100) : 100
  const latestSeal = evidenceItems[0]?.sha256 ?? merkleRoot

  const handleCopyHash = () => {
    navigator.clipboard.writeText(latestSeal)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  return (
    <div className="space-y-3 font-mono">
      {/* 5-Card Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Evidence */}
        <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-500 block">
              TOTAL ARTIFACTS
            </span>
            <span className="text-2xl font-black text-black">{total}</span>
          </div>
          <Database className="w-5 h-5 text-zinc-500" />
        </div>

        {/* Verified Count */}
        <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-500 block">
              VERIFIED SEALED
            </span>
            <span className="text-2xl font-black text-emerald-600">{verified}</span>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
        </div>

        {/* Pending Verification */}
        <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-500 block">
              PENDING DIGEST
            </span>
            <span className="text-2xl font-black text-zinc-600">{pending}</span>
          </div>
          <Clock className="w-5 h-5 text-zinc-400" />
        </div>

        {/* Integrity Exceptions */}
        <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-500 block">
              EXCEPTIONS
            </span>
            <span className="text-2xl font-black text-emerald-600">{exceptions}</span>
          </div>
          <AlertCircle className="w-5 h-5 text-emerald-500" />
        </div>

        {/* Verification Rate */}
        <div className="p-3 border-3 border-black bg-white shadow-[3px_3px_0px_#000] flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-500 block">
              VERIFICATION RATE
            </span>
            <span className="text-2xl font-black text-amber-500">{verificationRate}%</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      {/* Latest Seal Bar with Prototype Disclaimer */}
      <div className="p-3 border-2 border-black bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-[2px_2px_0px_#000]">
        <div className="flex items-center gap-2 truncate pr-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-black text-zinc-500 uppercase text-[10px]">
            LATEST SHA-256 SEAL:
          </span>
          <span className="font-mono text-black font-bold truncate" title={latestSeal}>
            {truncateHash(latestSeal, 14, 14)}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-zinc-500 italic hidden md:inline">
            [Simulated Prototype Cryptographic Seal]
          </span>
          <button
            type="button"
            onClick={handleCopyHash}
            className="flex items-center gap-1 text-[10px] font-black px-2 py-1 border border-black bg-white hover:bg-zinc-100 cursor-pointer"
          >
            {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copiedHash ? "COPIED" : "COPY HASH"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
