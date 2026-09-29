"use client"

import React from "react"
import Link from "next/link"
import { Database, Hash } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function EvidenceIntegrityCard() {
  const latestHash = "b2d56d11f8b4bb68f63bb3eb8d97607a988d5e1f018e69733c3e2f5b40cfb123"

  return (
    <Card className="border-4 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between">
      <CardHeader className="bg-purple-300 flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Database className="w-5 h-5 text-black shrink-0" />
          <CardTitle className="text-sm font-black uppercase text-black leading-tight break-words">
            EVIDENCE VAULT & INTEGRITY
          </CardTitle>
        </div>
        <Link href="/evidence" className="shrink-0">
          <Badge variant="dark" className="hover:bg-zinc-800 cursor-pointer">
            1,284 ARTIFACTS →
          </Badge>
        </Link>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 font-mono text-xs">
        {/* Verification Matrix */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 border-2 border-black bg-emerald-50 space-y-0.5">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase">VERIFIED</span>
            <span className="text-lg font-black text-emerald-700">1,284</span>
            <span className="text-[9px] text-emerald-800 block font-semibold">100% Hash Matched</span>
          </div>

          <div className="p-2.5 border-2 border-black bg-zinc-50 space-y-0.5">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase">PENDING HASH</span>
            <span className="text-lg font-black text-black">0</span>
            <span className="text-[9px] text-zinc-500 block font-semibold">Zero Pipeline Delay</span>
          </div>

          <div className="p-2.5 border-2 border-black bg-zinc-50 space-y-0.5">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase">INTEGRITY FAILS</span>
            <span className="text-lg font-black text-emerald-700">0</span>
            <span className="text-[9px] text-emerald-800 block font-semibold">Zero Tamper Alerts</span>
          </div>

          <div className="p-2.5 border-2 border-black bg-amber-50 space-y-0.5">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase">PROVENANCE LOG</span>
            <span className="text-base font-black text-black">SEALED</span>
            <span className="text-[9px] text-zinc-600 block font-semibold">Block #1045 Minted</span>
          </div>
        </div>

        {/* Latest Hash Verification Pill */}
        <div className="p-2.5 border-2 border-black bg-zinc-100 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-600">
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3 text-black" />
              LATEST SEALED ARTIFACT SHA-256:
            </span>
            <Badge variant="success" className="text-[9px] py-0 px-1">
              VALID
            </Badge>
          </div>
          <div className="font-mono text-[10px] font-bold text-black break-all bg-white p-1.5 border border-black select-all">
            {latestHash}
          </div>
        </div>

        <Link
          href="/evidence"
          className="block p-2 text-center border-2 border-black bg-white hover:bg-zinc-100 font-mono text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
        >
          EXPLORE CRYPTOGRAPHIC EVIDENCE VAULT →
        </Link>
      </CardContent>
    </Card>
  )
}
