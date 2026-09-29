"use client"

import React from "react"
import Link from "next/link"
import { Network, AlertTriangle, ArrowRight, Activity, Radio } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInvestigationStore } from "@/store/investigationStore"

export function NetworkIntelligenceSummary() {
  const activeInvestigation = useInvestigationStore((state) => state.activeInvestigation)
  const currentInvId = activeInvestigation?.id ?? "inv-2026-001"

  return (
    <Card className="border-4 border-black shadow-[4px_4px_0px_#000] font-mono flex flex-col justify-between">
      <CardHeader className="bg-purple-300 border-b-3 border-black p-3.5 space-y-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Network className="w-5 h-5 text-black shrink-0" />
            <CardTitle className="text-xs sm:text-sm font-black uppercase text-black leading-tight break-words">
              NETWORK FORENSICS & C2
            </CardTitle>
          </div>
          <Link href={`/network?id=${currentInvId}`} className="shrink-0">
            <Badge variant="dark" className="hover:bg-zinc-800 cursor-pointer text-[9px] px-1.5 py-0.5">
              12 FLOWS →
            </Badge>
          </Link>
        </div>
        <p className="text-[10px] font-bold text-zinc-800 leading-tight">
          Protocol distribution, beacon detection & packet traces
        </p>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {/* Network Metrics Strip */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="p-2 border-2 border-black bg-zinc-50 space-y-0.5 min-w-0">
            <span className="text-[8px] sm:text-[9px] text-zinc-600 font-bold block uppercase truncate">TOTAL FLOWS</span>
            <span className="text-base font-black text-black">12</span>
            <span className="text-[8px] sm:text-[9px] text-zinc-500 block truncate">Active Sockets</span>
          </div>

          <div className="p-2 border-2 border-black bg-rose-50 space-y-0.5 min-w-0">
            <span className="text-[8px] sm:text-[9px] text-zinc-600 font-bold block uppercase truncate">FLAGGED C2</span>
            <span className="text-base font-black text-rose-700 flex items-center justify-center gap-1">
              <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse shrink-0" />
              <span>3</span>
            </span>
            <span className="text-[8px] sm:text-[9px] text-rose-800 block truncate">Beacon Alert</span>
          </div>

          <div className="p-2 border-2 border-black bg-emerald-50 space-y-0.5 min-w-0">
            <span className="text-[8px] sm:text-[9px] text-zinc-600 font-bold block uppercase truncate">PCAP SEALS</span>
            <span className="text-base font-black text-emerald-700">100%</span>
            <span className="text-[8px] sm:text-[9px] text-emerald-800 block truncate">Sealed Streams</span>
          </div>
        </div>

        {/* Phase 6 Protocol Distribution Bar */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between text-[10px] font-black uppercase text-zinc-700 gap-1">
            <span>Protocol Spectrum:</span>
            <span className="text-zinc-500 text-[9px]">HTTPS 72% • SSH 18% • DNS 6% • SMB 4%</span>
          </div>

          <div className="h-4 border-2 border-black flex overflow-hidden">
            <div
              className="bg-cyan-400 border-r border-black h-full flex items-center justify-center text-[9px] font-black text-black"
              style={{ width: "72%" }}
              title="HTTPS / TLS: 72%"
            >
              72%
            </div>
            <div
              className="bg-purple-400 border-r border-black h-full flex items-center justify-center text-[9px] font-black text-black"
              style={{ width: "18%" }}
              title="SSH: 18%"
            >
              18%
            </div>
            <div
              className="bg-amber-400 border-r border-black h-full flex items-center justify-center text-[9px] font-black text-black"
              style={{ width: "6%" }}
              title="DNS: 6%"
            >
              6%
            </div>
            <div
              className="bg-rose-400 h-full flex items-center justify-center text-[9px] font-black text-black"
              style={{ width: "4%" }}
              title="SMB / Kerberos: 4%"
            >
              4%
            </div>
          </div>
        </div>

        {/* Flagged Threat Sample */}
        <div className="p-2 border border-black bg-rose-50 space-y-1">
          <div className="flex items-center justify-between text-[10px] gap-1">
            <span className="font-black text-rose-900 flex items-center gap-1 min-w-0 truncate">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">SUSPICIOUS C2 EGRESS:</span>
            </span>
            <Badge variant="danger" className="text-[8px] py-0 px-1 shrink-0">
              BEACON
            </Badge>
          </div>
          <div className="text-[10px] font-mono text-black font-bold break-all">
            185.220.101.5:443 (CobaltStrike C2)
          </div>
          <div className="text-[9px] text-zinc-600 font-mono break-words">
            Origin: FIN-WS-44 (PID: 4812) • Jitter: 42s
          </div>
        </div>

        {/* Action Link */}
        <Link
          href={`/network?id=${currentInvId}`}
          className="p-2 text-center border-2 border-black bg-white hover:bg-purple-300 font-mono text-xs font-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 transition-colors leading-tight"
        >
          <Activity className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">OPEN NETWORK TOPOLOGY & FLOWS</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
      </CardContent>
    </Card>
  )
}
