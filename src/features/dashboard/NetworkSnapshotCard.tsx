"use client"

import React from "react"
import Link from "next/link"
import { Network, Radio } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function NetworkSnapshotCard() {
  const protocols = [
    { name: "HTTPS", percentage: 72, color: "bg-cyan-400" },
    { name: "TCP Raw", percentage: 18, color: "bg-amber-400" },
    { name: "SMB/RPC", percentage: 6, color: "bg-rose-400" },
    { name: "DNS", percentage: 4, color: "bg-emerald-400" },
  ]

  return (
    <Card className="border-4 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between">
      <CardHeader className="bg-blue-300 flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Network className="w-5 h-5 text-black shrink-0" />
          <CardTitle className="text-sm font-black uppercase text-black leading-tight break-words">
            NETWORK & LATERAL MOVEMENT
          </CardTitle>
        </div>
        <Link href="/network" className="shrink-0">
          <Badge variant="dark" className="hover:bg-zinc-800 cursor-pointer">
            FLOW TOPOLOGY →
          </Badge>
        </Link>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 font-mono text-xs">
        {/* Network Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 border border-black bg-zinc-50">
            <span className="text-[10px] text-zinc-500 font-bold block">FLOWS</span>
            <span className="text-base font-black text-black">4,892</span>
          </div>
          <div className="p-2 border border-black bg-zinc-50">
            <span className="text-[10px] text-zinc-500 font-bold block">DESTS</span>
            <span className="text-base font-black text-black">142</span>
          </div>
          <div className="p-2 border border-black bg-rose-50">
            <span className="text-[10px] text-rose-600 font-bold block">ALERT C2</span>
            <span className="text-base font-black text-rose-700">2</span>
          </div>
        </div>

        {/* Protocol Breakdown Bars */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase block">
            Protocol Breakdown:
          </span>
          <div className="space-y-1.5">
            {protocols.map((proto) => (
              <div key={proto.name} className="space-y-0.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>{proto.name}</span>
                  <span>{proto.percentage}%</span>
                </div>
                <div className="w-full h-2 border border-black bg-zinc-200">
                  <div
                    className={`h-full border-r border-black ${proto.color}`}
                    style={{ width: `${proto.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Flagged Connection */}
        <div className="p-2.5 border-2 border-black bg-rose-50 flex items-center justify-between">
          <div className="truncate">
            <div className="flex items-center gap-1 text-[10px] font-black text-rose-700">
              <Radio className="w-3 h-3 text-rose-600 animate-pulse" />
              <span>SUSPICIOUS OUTBOUND BEACON:</span>
            </div>
            <div className="text-[10px] font-bold text-black truncate mt-0.5">
              10.0.99.5:44380 → 185.220.101.5:443
            </div>
          </div>
          <Badge variant="danger" className="text-[9px] py-0 shrink-0 ml-1">
            FLAGGED C2
          </Badge>
        </div>

        <Link
          href="/network"
          className="block p-2 text-center border-2 border-black bg-white hover:bg-zinc-100 font-mono text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
        >
          ANALYZE LATERAL SPREAD & EGRESS GRAPH →
        </Link>
      </CardContent>
    </Card>
  )
}
