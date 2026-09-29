"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  X,
  Copy,
  Check,
  FileCheck2,
  Radio,
  Server,
  GitBranch,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MitreTechnique } from "@/types/mitre"

interface MitreTechniqueDrawerProps {
  technique: MitreTechnique | null
  onClose: () => void
}

export function MitreTechniqueDrawer({
  technique,
  onClose,
}: MitreTechniqueDrawerProps) {
  const [copied, setCopied] = useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!technique) return null

  const handleCopyId = () => {
    navigator.clipboard.writeText(technique.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isCritical = technique.severity === "CRITICAL"

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="MITRE ATT&CK Technique Details"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs font-mono"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-white border-l-4 border-black p-5 shadow-[-8px_0px_0px_#000] overflow-y-auto space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b-3 border-black">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase bg-black text-amber-300 px-2 py-0.5">
                MITRE ATT&CK TECHNIQUE
              </span>
              <Badge variant={isCritical ? "danger" : "warning"} className="text-[10px]">
                {technique.severity}
              </Badge>
              <Badge variant={technique.confidence === "HIGH" ? "success" : "neutral"} className="text-[10px]">
                {technique.confidence} CONF
              </Badge>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <h2 className="text-xl font-black text-black">
                {technique.id}
              </h2>
              <button
                type="button"
                onClick={handleCopyId}
                className="p-1 hover:bg-zinc-100 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-zinc-500" />
                )}
              </button>
            </div>
            <div className="text-sm font-black text-black">
              {technique.name}
            </div>
            <div className="text-xs text-zinc-600 font-bold">
              Tactic Category: <strong className="text-black">{technique.tactic}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close detail drawer"
            className="p-1 border-2 border-black bg-zinc-100 hover:bg-zinc-200 cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Section 1: Tradecraft Description */}
        <div className="p-3 border-2 border-black bg-zinc-50 space-y-1.5">
          <div className="text-xs font-black uppercase text-zinc-700">
            Adversary Tradecraft Description
          </div>
          <p className="text-xs font-bold text-zinc-800 leading-relaxed bg-white p-2.5 border border-black">
            {technique.description}
          </p>
        </div>

        {/* Section 2: Affected Target Endpoints */}
        <div className="p-3 border-2 border-black bg-zinc-50 space-y-2">
          <div className="text-xs font-black uppercase text-zinc-700">
            Observed On Host Endpoints ({technique.affectedEndpoints.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {technique.affectedEndpoints.map((ep) => (
              <Link
                key={ep}
                href="/endpoints"
                className="inline-flex items-center gap-1 text-xs font-black bg-white hover:bg-zinc-100 border border-black px-2 py-1 shadow-[2px_2px_0px_#000]"
              >
                <Server className="w-3.5 h-3.5 text-zinc-600" />
                <span>{ep}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 3: Supporting Evidence Artifacts */}
        <div className="p-3 border-2 border-black bg-blue-50 space-y-2">
          <div className="text-xs font-black uppercase text-blue-950">
            Linked Forensic Evidence Artifacts ({technique.evidenceArtifactIds.length})
          </div>
          <div className="space-y-1.5">
            {technique.evidenceArtifactIds.map((artId) => (
              <div
                key={artId}
                className="p-2 bg-white border border-black flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 font-black text-black">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>{artId}</span>
                </div>
                <Link
                  href={`/evidence?id=${technique.investigationIds[0] ?? "inv-2026-001"}`}
                  className="inline-flex items-center gap-1 text-[11px] font-black text-blue-700 hover:underline"
                >
                  <span>Inspect Vault</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Related Network Findings */}
        {technique.networkFindingIds && technique.networkFindingIds.length > 0 && (
          <div className="p-3 border-2 border-black bg-purple-50 space-y-2">
            <div className="text-xs font-black uppercase text-purple-950">
              Correlated Network Observations ({technique.networkFindingIds.length})
            </div>
            <div className="space-y-1.5">
              {technique.networkFindingIds.map((fid) => (
                <div
                  key={fid}
                  className="p-2 bg-white border border-black flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 font-black text-black">
                    <Radio className="w-4 h-4 text-purple-600" />
                    <span>{fid}</span>
                  </div>
                  <Link
                    href="/network"
                    className="inline-flex items-center gap-1 text-[11px] font-black text-purple-700 hover:underline"
                  >
                    <span>View Flow Graph</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Sub-Techniques */}
        {technique.subTechniques && technique.subTechniques.length > 0 && (
          <div className="p-3 border-2 border-black bg-zinc-50 space-y-1.5">
            <div className="text-xs font-black uppercase text-zinc-700">
              Related Sub-Techniques
            </div>
            <div className="flex flex-wrap gap-1.5">
              {technique.subTechniques.map((sub) => (
                <span
                  key={sub}
                  className="bg-zinc-200 border border-black text-[11px] font-bold px-2 py-0.5"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions Toolbar */}
        <div className="pt-2 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <Link
              href={`/evidence?id=${technique.investigationIds[0] ?? "inv-2026-001"}`}
              className="p-2 border-2 border-black bg-cyan-300 hover:bg-cyan-400 text-black font-black uppercase text-center flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000]"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Evidence Vault</span>
            </Link>

            <Link
              href="/network"
              className="p-2 border-2 border-black bg-purple-300 hover:bg-purple-400 text-black font-black uppercase text-center flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000]"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Network Forensics</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <Link
              href={`/investigations/${technique.investigationIds[0] ?? "inv-2026-001"}`}
              className="p-2 border-2 border-black bg-white hover:bg-zinc-100 text-black font-black uppercase text-center flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000]"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Case Campaign</span>
            </Link>

            {technique.mitreUrl && (
              <a
                href={technique.mitreUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 border-2 border-black bg-zinc-100 hover:bg-zinc-200 text-black font-black uppercase text-center flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000]"
              >
                <span>ATT&CK Official</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
