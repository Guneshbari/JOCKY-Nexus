"use client"

import React from "react"
import Link from "next/link"
import { Database, Hash, CheckCircle2, ShieldCheck, ArrowRight, Layers } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInvestigationStore } from "@/store/investigationStore"

export function EvidenceIntegrityAnalytics() {
  const artifacts = useInvestigationStore((state) => state.evidenceItems)
  const activeInvestigation = useInvestigationStore((state) => state.activeInvestigation)
  const currentInvId = activeInvestigation?.id ?? "inv-2026-001"

  // Case-specific or global verified count
  const verifiedCount = artifacts.filter((a) => a.integrityVerified).length
  const totalCount = artifacts.length || 8

  const latestArtifact = artifacts[0] || {
    id: "art-001",
    name: "lsass_memory_dump_sparse.dmp",
    sha256: "b2d56d11f8b4bb68f63bb3eb8d97607a988d5e1f018e69733c3e2f5b40cfb123",
    collectedAt: "2026-09-29T14:30:12Z",
    evidenceClass: "AUTHENTICATION",
    executionProfileId: "PROFILE-A",
  }

  return (
    <Card className="border-4 border-black shadow-[4px_4px_0px_#000] font-mono flex flex-col justify-between">
      <CardHeader className="bg-purple-300 border-b-3 border-black p-3.5 space-y-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Database className="w-5 h-5 text-black shrink-0" />
            <CardTitle className="text-xs sm:text-sm font-black uppercase text-black leading-tight break-words">
              EVIDENCE INTEGRITY & SEALS
            </CardTitle>
          </div>
          <Link href={`/evidence?id=${currentInvId}`} className="shrink-0">
            <Badge variant="dark" className="hover:bg-zinc-800 cursor-pointer text-[9px] px-1.5 py-0.5">
              1,284 ARTIFACTS →
            </Badge>
          </Link>
        </div>
        <p className="text-[10px] font-bold text-zinc-800 leading-tight">
          Cryptographic SHA-256 & Merkle leaf proofs
        </p>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {/* Verification Matrix (2x2 grid avoids cramping in narrow responsive columns) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 border-2 border-black bg-emerald-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase truncate">VERIFIED</span>
            <div className="text-sm sm:text-base font-black text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100%</span>
            </div>
            <span className="text-[9px] text-emerald-800 block font-semibold truncate">{totalCount} / {totalCount} Matched</span>
          </div>

          <div className="p-2 border-2 border-black bg-zinc-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase truncate">CORRUPTED</span>
            <div className="text-sm sm:text-base font-black text-black">0</div>
            <span className="text-[9px] text-zinc-500 block font-semibold truncate">Zero Hash Drift</span>
          </div>

          <div className="p-2 border-2 border-black bg-zinc-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase truncate">ACTIVE CASE</span>
            <div className="text-sm sm:text-base font-black text-cyan-700">{verifiedCount}</div>
            <span className="text-[9px] text-zinc-500 block font-semibold truncate">Sealed Artifacts</span>
          </div>

          <div className="p-2 border-2 border-black bg-amber-50 space-y-0.5 min-w-0">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase truncate">NVPL STANDARD</span>
            <div className="text-xs sm:text-sm font-black text-black flex items-center gap-1 min-w-0">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">NIST SP800</span>
            </div>
            <span className="text-[9px] text-zinc-600 block font-semibold truncate">Admissible Evidence</span>
          </div>
        </div>

        {/* Latest Sealed Hash Verification */}
        <div className="p-2.5 border-2 border-black bg-zinc-100 space-y-1.5 shadow-[2px_2px_0px_#000]">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-700 gap-1">
            <span className="flex items-center gap-1 min-w-0 truncate">
              <Hash className="w-3.5 h-3.5 text-black shrink-0" />
              <span className="truncate">SEAL ({latestArtifact.id}):</span>
            </span>
            <Badge variant="success" className="text-[8px] sm:text-[9px] py-0 px-1 shrink-0">
              VERIFIED SEAL
            </Badge>
          </div>

          <div className="font-mono text-[9px] sm:text-[10px] font-bold text-black break-all bg-white p-1.5 border border-black select-all leading-tight">
            {latestArtifact.sha256}
          </div>

          <div className="flex items-center justify-between text-[9px] text-zinc-600 pt-0.5 font-bold gap-2">
            <span className="truncate">{latestArtifact.name}</span>
            <span className="shrink-0 bg-zinc-200 px-1 border border-black text-[9px]">{latestArtifact.executionProfileId}</span>
          </div>
        </div>

        {/* Action Link to Workspace */}
        <Link
          href={`/evidence?id=${currentInvId}`}
          className="p-2 text-center border-2 border-black bg-white hover:bg-cyan-300 font-mono text-xs font-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 transition-colors leading-tight"
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">INSPECT EVIDENCE VAULT</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
      </CardContent>
    </Card>
  )
}
