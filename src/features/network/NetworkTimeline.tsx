"use client"

import React from "react"
import {
  Clock,
  Radio,
  Globe,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { NetworkConnection } from "@/types/network"
import { formatDate } from "@/lib/formatters"

interface NetworkTimelineProps {
  connections: NetworkConnection[]
  onSelectConnection?: (conn: NetworkConnection) => void
}

export function NetworkTimeline({
  connections,
  onSelectConnection,
}: NetworkTimelineProps) {
  // Sort connections chronologically descending
  const sorted = [...connections].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const getEventIcon = (conn: NetworkConnection) => {
    if (conn.protocol === "DNS") {
      return <Globe className="w-3.5 h-3.5 text-emerald-600" />
    }
    if (conn.status === "FLAGGED") {
      return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
    }
    return <Radio className="w-3.5 h-3.5 text-blue-600" />
  }

  return (
    <div className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-black" />
          <h3 className="text-sm font-black uppercase text-black">
            Chronological Network Observation Stream
          </h3>
        </div>
        <span className="text-[10px] bg-zinc-200 px-2 py-0.5 border border-black font-black">
          {sorted.length} EVENTS
        </span>
      </div>

      <p className="text-xs font-bold text-zinc-600">
        Time-sequenced network events capturing socket sessions, DNS lookups, and lateral hops.
      </p>

      {/* Stream List */}
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {sorted.map((conn) => {
          const isFlagged = conn.status === "FLAGGED"

          return (
            <div
              key={conn.id}
              onClick={() => onSelectConnection?.(conn)}
              className={`p-2.5 border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer transition-all hover:-translate-y-0.5 shadow-[2px_2px_0px_#000] ${
                isFlagged ? "bg-rose-50 hover:bg-rose-100" : "bg-zinc-50 hover:bg-zinc-100"
              }`}
            >
              <div className="flex items-start sm:items-center gap-2">
                <span className="p-1 border border-black bg-white shrink-0">
                  {getEventIcon(conn)}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-black text-black">
                    <span>{conn.sourceEndpointHostname}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                    <span>{conn.targetHostname || conn.targetIp}</span>
                    <Badge variant="purple" className="text-[9px] px-1 py-0">
                      {conn.protocol}:{conn.targetPort}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-zinc-600 font-bold">
                    {conn.dnsQuery
                      ? `DNS Query: ${conn.dnsQuery}`
                      : conn.supportingEvidence ?? "Observed raw transport socket session"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 text-right shrink-0">
                <span className="text-[10px] text-zinc-500 font-mono">
                  {formatDate(conn.timestamp)}
                </span>
                <Badge variant={isFlagged ? "danger" : "neutral"} className="text-[10px]">
                  {conn.status}
                </Badge>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
