"use client"

import React from "react"
import Link from "next/link"
import { Shield, GitCommit, ArrowRight, CheckCircle2, Lock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_PROVENANCE_LOGS } from "@/data/provenance"

export function ProvenanceHealthCard() {
  const latestBlock = MOCK_PROVENANCE_LOGS[MOCK_PROVENANCE_LOGS.length - 1] || {
    blockHeight: 1045,
    recordId: "REC-2026-9904",
    action: "CHAIN_OF_CUSTODY_EXPORT",
    merkleRoot: "7b4c9e12089ef0398bb129fae0892019ab928479e01894ba74812b192837bc91",
    verificationStatus: "VERIFIED",
    auditWitnessId: "witness-node-01.auditor.nexus",
  }

  return (
    <Card className="border-4 border-black shadow-[4px_4px_0px_#000] font-mono flex flex-col justify-between">
      <CardHeader className="bg-lime-300 border-b-3 border-black p-3.5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-black" />
          <div>
            <CardTitle className="text-sm font-black uppercase text-black">
              TAMPER-EVIDENT PROVENANCE
            </CardTitle>
            <p className="text-[10px] font-bold text-zinc-800">
              Immutable chain-of-custody & cryptographic consensus
            </p>
          </div>
        </div>

        <Link href="/provenance">
          <Badge variant="dark" className="hover:bg-zinc-800 cursor-pointer text-[10px]">
            HEIGHT #{latestBlock.blockHeight} →
          </Badge>
        </Link>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {/* Ledger Quorum & Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 border-2 border-black bg-zinc-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase">LEDGER STATE</span>
            <span className="text-sm font-black text-black flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5 text-lime-700" />
              <span>SEALED</span>
            </span>
            <span className="text-[9px] text-zinc-500 block">Court Admissible</span>
          </div>

          <div className="p-2 border-2 border-black bg-zinc-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase">WITNESS QUORUM</span>
            <span className="text-sm font-black text-emerald-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>3 / 3</span>
            </span>
            <span className="text-[9px] text-zinc-500 block">Full Consensus</span>
          </div>

          <div className="p-2 border-2 border-black bg-zinc-50 space-y-0.5">
            <span className="text-[9px] text-zinc-600 font-bold block uppercase">TAMPER DRIFT</span>
            <span className="text-sm font-black text-emerald-700">0.00%</span>
            <span className="text-[9px] text-zinc-500 block">Zero Violations</span>
          </div>
        </div>

        {/* Current Merkle Root Hash */}
        <div className="p-2 border-2 border-black bg-zinc-100 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-700">
            <span className="flex items-center gap-1">
              <GitCommit className="w-3.5 h-3.5 text-black" />
              <span>MERKLE ROOT CONSENSUS:</span>
            </span>
            <span className="bg-lime-200 text-lime-900 px-1.5 py-0.2 border border-black font-black text-[9px]">
              BLOCK #{latestBlock.blockHeight}
            </span>
          </div>

          <div className="font-mono text-[10px] font-bold text-black break-all bg-white p-1.5 border border-black select-all">
            {latestBlock.merkleRoot}
          </div>
        </div>

        {/* Recent Ledger Blocks */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-black uppercase text-zinc-700">
            Recent Sealed Blocks:
          </div>
          <div className="space-y-1">
            {MOCK_PROVENANCE_LOGS.slice(-3).map((log) => (
              <div
                key={log.recordId}
                className="p-1.5 border border-black bg-white flex items-center justify-between text-[10px]"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-black bg-black text-lime-400 px-1 border border-black">
                    #{log.blockHeight}
                  </span>
                  <span className="font-bold text-black">{log.action}</span>
                </div>
                <span className="text-zinc-600 font-mono text-[9px] truncate max-w-[120px]">
                  {log.actorId}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Link */}
        <Link
          href="/provenance"
          className="p-2 text-center border-2 border-black bg-white hover:bg-lime-300 font-mono text-xs font-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>VIEW FULL PROVENANCE LEDGER</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
