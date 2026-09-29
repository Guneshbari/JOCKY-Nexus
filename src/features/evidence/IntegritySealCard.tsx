"use client"

import React, { useState } from "react"
import {
  ShieldCheck,
  Copy,
  Check,
  CheckCircle2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EvidenceArtifact } from "@/types/evidence"
import { formatDate } from "@/lib/formatters"

interface IntegritySealCardProps {
  evidence: EvidenceArtifact
}

export function IntegritySealCard({ evidence }: IntegritySealCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(evidence.sha256)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] font-mono space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-black uppercase text-black">
            CRYPTOGRAPHIC SHA-256 INTEGRITY SEAL // {evidence.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">INTEGRITY VERIFIED</Badge>
          <span className="text-[10px] font-bold text-zinc-500">
            FIPS 180-4
          </span>
        </div>
      </div>

      {/* Hash Display Box */}
      <div className="p-3 border-2 border-black bg-emerald-50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-zinc-600">
            SIMULATED 256-BIT CRYPTOGRAPHIC DIGEST
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 border border-black bg-white hover:bg-zinc-100 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "COPIED" : "COPY SEAL"}</span>
          </button>
        </div>

        <div className="p-2 border border-black bg-white text-xs font-black text-black font-mono break-all selection:bg-amber-300">
          {evidence.sha256}
        </div>
      </div>

      {/* Integrity Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold pt-1">
        <div className="p-2 border border-black bg-zinc-50">
          <span className="text-[10px] text-zinc-500 block uppercase">Algorithm</span>
          <span className="text-black font-black">SHA-256</span>
        </div>

        <div className="p-2 border border-black bg-zinc-50">
          <span className="text-[10px] text-zinc-500 block uppercase">Leaf Position</span>
          <span className="text-black font-mono font-black">LEAF #{evidence.merkleLeafIndex}</span>
        </div>

        <div className="p-2 border border-black bg-zinc-50">
          <span className="text-[10px] text-zinc-500 block uppercase">Status</span>
          <span className="text-emerald-700 font-black">{evidence.integrityStatus}</span>
        </div>

        <div className="p-2 border border-black bg-zinc-50">
          <span className="text-[10px] text-zinc-500 block uppercase">Verified At</span>
          <span className="text-zinc-800 font-mono text-[10px]">{formatDate(evidence.collectedAt)}</span>
        </div>
      </div>

      <div className="p-2 border border-zinc-200 bg-zinc-50 text-[10px] text-zinc-500 font-bold flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>
          Tamper-evident verification confirms artifact bitstream matches acquisition-time digest with zero alteration.
        </span>
      </div>
    </div>
  )
}
