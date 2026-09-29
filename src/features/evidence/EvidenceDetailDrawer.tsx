"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  Database,
  ArrowUpRight,
  GitBranch,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EvidenceArtifact } from "@/types/evidence"
import { formatBytes, formatDate } from "@/lib/formatters"

interface EvidenceDetailDrawerProps {
  evidence: EvidenceArtifact | null
  onClose: () => void
}

export function EvidenceDetailDrawer({
  evidence,
  onClose,
}: EvidenceDetailDrawerProps) {
  const [copiedHash, setCopiedHash] = useState(false)
  const [copiedId, setCopiedId] = useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!evidence) return null

  const handleCopyHash = () => {
    navigator.clipboard.writeText(evidence.sha256)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(evidence.id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Evidence Artifact Details"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-end font-mono"
      onClick={onClose}
    >
      <div
        className="w-full max-w-full sm:max-w-xl md:max-w-2xl h-full bg-white border-l-0 sm:border-l-4 border-black shadow-none sm:shadow-[-8px_0px_0px_#000] flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-3.5 sm:p-4 bg-zinc-900 text-white flex items-center justify-between border-b-3 border-black shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Database className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider truncate">
              EVIDENCE ARTIFACT INSPECTOR // {evidence.id}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border border-white hover:bg-zinc-800 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-zinc-50">
          {/* Identity Block */}
          <div className="p-4 border-3 border-black bg-white shadow-[4px_4px_0px_#000] space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
                  {evidence.id}
                </span>
                <Badge variant="purple">{evidence.evidenceClass}</Badge>
                <Badge variant="success">{evidence.integrityStatus}</Badge>
              </div>

              <button
                type="button"
                onClick={handleCopyId}
                className="text-[10px] font-black px-2 py-0.5 border border-black bg-zinc-100 hover:bg-zinc-200 cursor-pointer flex items-center gap-1"
              >
                {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId ? "COPIED" : "COPY ID"}</span>
              </button>
            </div>

            <h2 className="text-base font-black text-black break-all">
              {evidence.name}
            </h2>

            <div className="text-xs font-bold text-zinc-600 font-mono">
              Source Path: <span className="text-black">{evidence.sourcePath}</span>
            </div>
          </div>

          {/* SHA-256 Cryptographic Seal Card */}
          <div className="p-4 border-3 border-black bg-emerald-50 shadow-[4px_4px_0px_#000] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950 uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>SHA-256 CRYPTOGRAPHIC INTEGRITY SEAL</span>
              </div>
              <Badge variant="success">SEALED</Badge>
            </div>

            <div className="p-2.5 border-2 border-black bg-white font-mono text-xs text-black break-all font-bold">
              {evidence.sha256}
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-600 pt-1">
              <span>Merkle Leaf Position: #{evidence.merkleLeafIndex}</span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="text-[10px] font-black px-2 py-1 border border-black bg-amber-300 hover:bg-amber-400 text-black cursor-pointer flex items-center gap-1"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? "COPIED HASH" : "COPY SHA-256"}</span>
              </button>
            </div>
          </div>

          {/* Collection Context & Adaptive Profile */}
          <div className="p-4 border-3 border-black bg-white shadow-[4px_4px_0px_#000] space-y-3">
            <div className="text-xs font-black uppercase text-zinc-600 pb-1 border-b border-black">
              Execution Context & Adaptive Routing
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className="p-2 border border-black bg-zinc-50">
                <span className="text-[10px] text-zinc-500 block uppercase">Source Host</span>
                <span className="text-black font-black">{evidence.endpointHostname}</span>
              </div>

              <div className="p-2 border border-black bg-zinc-50">
                <span className="text-[10px] text-zinc-500 block uppercase">Adaptive Profile</span>
                <span className="text-black font-black">{evidence.executionProfileId}</span>
              </div>

              <div className="p-2 border border-black bg-zinc-50">
                <span className="text-[10px] text-zinc-500 block uppercase">Collector Tool</span>
                <span className="text-black font-mono text-[11px]">{evidence.collector}</span>
              </div>

              <div className="p-2 border border-black bg-zinc-50">
                <span className="text-[10px] text-zinc-500 block uppercase">Artifact Size</span>
                <span className="text-black font-mono">{formatBytes(evidence.sizeBytes)}</span>
              </div>
            </div>
          </div>

          {/* MITRE ATT&CK Correlation */}
          {evidence.mitreTechniqueId && (
            <div className="p-4 border-3 border-black bg-amber-50 shadow-[4px_4px_0px_#000] space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black uppercase text-amber-950">
                  MITRE ATT&CK CORRELATION
                </div>
                <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
                  {evidence.mitreTechniqueId}
                </span>
              </div>

              <div className="text-xs font-black text-black">
                {`${evidence.mitreTechniqueName} // Tactic: ${evidence.mitreTactic}`}
              </div>

              {evidence.mitreObservation && (
                <p className="text-xs font-bold text-zinc-800 bg-white p-2 border border-black">
                  {evidence.mitreObservation}
                </p>
              )}
            </div>
          )}

          {/* Provenance Chain Link */}
          <div className="p-4 border-3 border-black bg-white shadow-[4px_4px_0px_#000] space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase text-zinc-600">
              <span>Non-Volatile Provenance Ledger (NVPL)</span>
              <Badge variant="cyber">CHAIN BOUND</Badge>
            </div>

            <div className="space-y-1.5 text-xs font-bold font-mono">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Previous Block Hash:</span>
                <span className="text-zinc-700 break-all text-[11px]">
                  {evidence.previousChainHash ?? "0000000000000000000000000000000000000000000000000000000000000000"}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase block">Current Chain Digest:</span>
                <span className="text-black break-all text-[11px] font-black">
                  {evidence.chainHash}
                </span>
              </div>
            </div>
          </div>

          {/* Chain-of-Custody Events */}
          <div className="p-4 border-3 border-black bg-white shadow-[4px_4px_0px_#000] space-y-2">
            <div className="text-xs font-black uppercase text-zinc-600 pb-1 border-b border-black">
              Custody Chain Verification Trail ({evidence.custodyChain.length} Actions)
            </div>

            <div className="space-y-1.5">
              {evidence.custodyChain.map((c, i) => (
                <div key={i} className="p-2 border border-black bg-zinc-50 text-[11px] font-bold flex items-center justify-between">
                  <div>
                    <span className="font-black text-black mr-2">[{c.action}]</span>
                    <span className="text-zinc-600 font-mono">{c.operator}</span>
                  </div>
                  <span className="font-mono text-zinc-500 text-[10px]">{formatDate(c.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-zinc-100 border-t-3 border-black flex flex-wrap items-center justify-between gap-2">
          <Link href={`/investigations/${evidence.investigationId}`}>
            <button
              type="button"
              className="px-3 py-1.5 border-2 border-black bg-white text-xs font-black uppercase hover:bg-zinc-200 cursor-pointer flex items-center gap-1.5"
            >
              <span>OPEN INVESTIGATION</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </Link>

          <Link href="/provenance">
            <button
              type="button"
              className="px-3 py-1.5 border-2 border-black bg-amber-400 text-black text-xs font-black uppercase hover:bg-amber-300 cursor-pointer flex items-center gap-1.5"
            >
              <span>INSPECT PROVENANCE AUDIT</span>
              <GitBranch className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
