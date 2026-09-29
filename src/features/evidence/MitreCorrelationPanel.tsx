"use client"

import React from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Target,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EvidenceArtifact } from "@/types/evidence"

interface MitreCorrelationPanelProps {
  evidenceItems: EvidenceArtifact[]
}

export function MitreCorrelationPanel({ evidenceItems }: MitreCorrelationPanelProps) {
  // Collect all evidence items with MITRE correlations
  const correlatedItems = evidenceItems.filter((e) => e.mitreTechniqueId)

  const getConfidenceBadge = (confidence?: "HIGH" | "MEDIUM" | "LOW") => {
    switch (confidence) {
      case "HIGH":
        return <Badge variant="danger">HIGH CONFIDENCE</Badge>
      case "MEDIUM":
        return <Badge variant="warning">MEDIUM CONFIDENCE</Badge>
      case "LOW":
      default:
        return <Badge variant="neutral">LOW CONFIDENCE</Badge>
    }
  }

  return (
    <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] font-mono space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase text-black">
            MITRE ATT&CK EVIDENCE CORRELATION MATRIX
          </span>
          <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
            {correlatedItems.length} TECHNIQUES
          </span>
        </div>

        <Link href="/mitre">
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 border border-black bg-amber-400 hover:bg-amber-300 text-xs font-black uppercase text-black cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <span>OPEN MITRE MAPPING</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {/* Grid of Correlated Findings */}
      <div className="space-y-3">
        {correlatedItems.map((item) => (
          <div
            key={item.id}
            className="p-3 border-2 border-black bg-zinc-50 shadow-[2px_2px_0px_#000] space-y-2 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
                  {item.mitreTechniqueId}
                </span>
                <span className="font-black text-black text-sm">
                  {item.mitreTechniqueName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {getConfidenceBadge(item.mitreConfidence)}
                <span className="font-bold text-zinc-600 bg-white px-2 py-0.5 border border-black text-[10px]">
                  Tactic: {item.mitreTactic}
                </span>
              </div>
            </div>

            {item.mitreObservation && (
              <p className="p-2 border border-black bg-white font-bold text-zinc-800 text-[11px] leading-relaxed">
                {item.mitreObservation}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-200 text-[10px] font-bold text-zinc-600">
              <span>Supporting Artifact: <span className="font-mono text-black font-black">{item.id} ({item.name})</span></span>
              <span>Source Host: <span className="font-mono text-black">{item.endpointHostname}</span></span>
            </div>
          </div>
        ))}

        {correlatedItems.length === 0 && (
          <div className="p-6 text-center text-zinc-500 font-bold border-2 border-dashed border-zinc-300">
            No MITRE correlations identified in the current evidence corpus.
          </div>
        )}
      </div>
    </div>
  )
}
