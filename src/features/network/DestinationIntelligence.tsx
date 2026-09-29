"use client"

import React from "react"
import Link from "next/link"
import { Globe, FileCheck2, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DESTINATION_INTELLIGENCE } from "@/data/network"
import { formatDate } from "@/lib/formatters"

export function DestinationIntelligence() {
  return (
    <div className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-black uppercase text-black">
            Destination Intelligence & Threat Association
          </h3>
        </div>
        <span className="text-[10px] bg-emerald-200 px-2 py-0.5 border border-emerald-600 font-black">
          {DESTINATION_INTELLIGENCE.length} TARGET ENTITIES
        </span>
      </div>

      <p className="text-xs font-bold text-zinc-600">
        Aggregated endpoint communication profiles mapped against suspect external IPs and core infrastructure.
      </p>

      {/* Grid of Destination Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DESTINATION_INTELLIGENCE.map((item) => {
          const isHighRisk = item.riskLevel === "HIGH"

          return (
            <div
              key={item.destination}
              className={`p-3 border-3 border-black space-y-2 shadow-[3px_3px_0px_#000] ${
                isHighRisk ? "bg-rose-50" : "bg-zinc-50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[9px] font-black uppercase text-zinc-500 block">
                    {item.category.replace("_", " ")}
                  </span>
                  <span className="text-xs font-black text-black break-all block">
                    {item.destination}
                  </span>
                </div>
                <Badge variant={isHighRisk ? "danger" : "neutral"} className="text-[10px] shrink-0">
                  {item.riskLevel}
                </Badge>
              </div>

              {/* Observed Hosts & Protocols */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-black">
                <div>
                  <span className="text-[9px] text-zinc-500 font-bold block uppercase">
                    Observed Hosts:
                  </span>
                  <span className="font-bold text-black truncate block">
                    {item.observedHosts.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 font-bold block uppercase">
                    Protocols & Flows:
                  </span>
                  <span className="font-bold text-black block">
                    {item.protocols.join(", ")} ({item.connectionCount} hits)
                  </span>
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-[10px] text-zinc-600 flex justify-between pt-1">
                <span>First Seen: {formatDate(item.firstSeen)}</span>
                <span>Last Seen: {formatDate(item.lastSeen)}</span>
              </div>

              {/* Cross-Link Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-black text-xs font-black">
                <Link
                  href={`/evidence?id=inv-2026-001`}
                  className="inline-flex items-center gap-1 text-blue-700 hover:underline"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Evidence: {item.evidenceId}</span>
                </Link>

                {item.mitreTechnique && (
                  <Link
                    href={`/mitre?technique=${item.mitreTechnique}`}
                    className="inline-flex items-center gap-1 text-amber-800 hover:underline"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>MITRE: {item.mitreTechnique}</span>
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
