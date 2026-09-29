"use client"

import React from "react"
import {
  CheckCircle2,
  Terminal,
  Cpu,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AdaptiveExecutionProfile } from "@/types/execution"

interface ExecutionProfileCardProps {
  profile: AdaptiveExecutionProfile
}

export function ExecutionProfileCard({ profile }: ExecutionProfileCardProps) {
  return (
    <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] font-mono space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase text-black">
            FORENSIC EXECUTION PROFILE // {profile.targetHostname}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">PROFILE READY</Badge>
          <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
            {profile.id}
          </span>
        </div>
      </div>

      {/* Profile Identity Bar */}
      <div className="p-3 border-2 border-black bg-amber-300 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-black uppercase text-black">
            {profile.name}
          </h3>
          <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5">
            {profile.platform}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          {profile.focus.map((f, i) => (
            <span
              key={i}
              className="text-[10px] font-bold bg-white/80 border border-black px-1.5 py-0.5 text-black"
            >
              #{f}
            </span>
          ))}
        </div>
      </div>

      {/* Safe Forensic Collectors */}
      <div className="space-y-1.5">
        <span className="text-xs font-black text-zinc-600 uppercase block">
          Dispatched Safe Forensic Collectors ({profile.collectors.length})
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
          {profile.collectors.map((c, i) => (
            <div
              key={i}
              className="p-2 border border-black bg-zinc-50 flex items-center gap-2"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-mono text-black text-[11px] truncate">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Collection Sequence */}
      <div className="space-y-1.5">
        <span className="text-xs font-black text-zinc-600 uppercase block">
          Ordered Safe Collection Sequence ({profile.collectionSequence.length} Steps)
        </span>
        <div className="space-y-1.5">
          {profile.collectionSequence.map((step) => (
            <div
              key={step.order}
              className="p-2.5 border-2 border-black bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 bg-black text-amber-300 font-black text-[11px] flex items-center justify-center border border-black shrink-0">
                  {step.order}
                </span>
                <div>
                  <div className="font-black text-black">{step.action}</div>
                  <div className="font-mono text-[10px] text-zinc-600 truncate max-w-xs">
                    Target: {step.target}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-600 font-bold shrink-0">
                <span className="bg-zinc-100 px-1.5 py-0.5 border border-black">
                  {step.collector}
                </span>
                <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 border border-amber-900 font-black">
                  {step.expectedArtifact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expected Evidence Artifacts */}
      <div className="space-y-1.5">
        <span className="text-xs font-black text-zinc-600 uppercase block">
          Expected Forensically Verifiable Evidence
        </span>
        <div className="flex flex-wrap gap-1.5">
          {profile.expectedEvidence.map((ev, i) => (
            <span
              key={i}
              className="px-2 py-1 border border-black bg-zinc-100 text-[10px] font-bold text-black flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{ev}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Safety & Integrity Policies Strip */}
      <div className="p-3 border-2 border-black bg-zinc-50 space-y-1.5 text-[10px] font-bold">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 uppercase">RESOURCE POLICY:</span>
          <span className="font-black text-black">{profile.resourcePolicy}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 uppercase">INTEGRITY POLICY:</span>
          <span className="font-black text-emerald-700">{profile.integrityPolicy}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 uppercase">PROVENANCE SEAL:</span>
          <span className="font-black text-black">{profile.provenancePolicy}</span>
        </div>
      </div>
    </div>
  )
}
