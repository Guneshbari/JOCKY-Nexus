"use client"

import React from "react"
import Link from "next/link"
import {
  Clock,
  FileCheck2,
  Radio,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MitreCorrelation } from "@/types/mitre"
import { formatDate } from "@/lib/formatters"

interface MitreCorrelationTimelineProps {
  correlations: MitreCorrelation[]
  onSelectCorrelation?: (corr: MitreCorrelation) => void
}

export function MitreCorrelationTimeline({
  correlations,
  onSelectCorrelation,
}: MitreCorrelationTimelineProps) {
  // Sort descending by timestamp
  const sorted = [...correlations].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-black" />
          <h3 className="text-sm font-black uppercase text-black">
            ATT&CK Correlation Stream & Behavior Lineage
          </h3>
        </div>
        <span className="text-[10px] bg-zinc-200 px-2 py-0.5 border border-black font-black">
          {sorted.length} CORRELATED EVENTS
        </span>
      </div>

      <p className="text-xs font-bold text-zinc-600">
        Chronological pipeline tracing raw evidence acquisition to normalized behavioral TTP patterns.
      </p>

      {/* Timeline Stream */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {sorted.map((item) => (
          <div
            key={item.correlationId}
            onClick={() => onSelectCorrelation?.(item)}
            className="p-3 border-2 border-black bg-zinc-50 hover:bg-amber-50 cursor-pointer transition-all shadow-[2px_2px_0px_#000] space-y-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-black/30 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-black text-amber-300 px-1.5 py-0.5 text-xs font-black">
                  {item.techniqueId}
                </span>
                <span className="text-xs font-black text-black">
                  {item.techniqueName}
                </span>
                <Badge variant="neutral" className="text-[10px]">
                  {item.tactic}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-right">
                <span className="text-[10px] text-zinc-500 font-mono">
                  {formatDate(item.timestamp)}
                </span>
                <Badge
                  variant={item.confidence === "HIGH" ? "success" : "warning"}
                  className="text-[10px]"
                >
                  {item.confidence} CONF
                </Badge>
              </div>
            </div>

            {/* Observed Behavior Pattern */}
            <p className="text-xs font-bold text-zinc-800 bg-white p-2 border border-black">
              {item.observedBehavior}
            </p>

            {/* Supporting Links Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-zinc-600 pt-1">
              <span>
                Endpoint: <strong className="text-black">{item.endpointHostname}</strong>
              </span>

              <div className="flex items-center gap-3">
                <Link
                  href={`/evidence?id=${item.investigationId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-blue-700 hover:underline"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Evidence: {item.evidenceName}</span>
                </Link>

                {item.networkFindingId && (
                  <Link
                    href={`/network`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-purple-700 hover:underline"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Finding: {item.networkFindingId}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
