"use client"

import React, { useState } from "react"
import {
  Activity,
  Cpu,
  FileCheck,
  Server,
  Crosshair,
  Lock,
  GitBranch,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInvestigationStore } from "@/store/investigationStore"
import { formatDate } from "@/lib/formatters"

interface TimelineEvent {
  id: string
  title: string
  category: "ADAPTIVE" | "EVIDENCE" | "AUDIT" | "ENDPOINT" | "MITRE"
  description: string
  timestamp: string
  proofHash?: string
  badgeVariant: "danger" | "warning" | "cyber" | "success" | "neutral" | "purple"
  icon: React.ElementType
}

export function InvestigationActivityTimeline() {
  const lastRefreshTimestamp = useInvestigationStore((state) => state.lastRefreshTimestamp)
  const [filter, setFilter] = useState<string>("ALL")

  const events: TimelineEvent[] = [
    {
      id: "evt-7",
      title: "Provenance Chain Block #1045 Sealed",
      category: "AUDIT",
      description: "Witness quorum certified Merkle root. Investigation chain-of-custody export locked.",
      timestamp: lastRefreshTimestamp,
      proofHash: "7a8b9c0d1e2f3a4b...",
      badgeVariant: "success",
      icon: Lock,
    },
    {
      id: "evt-6",
      title: "MITRE ATT&CK Technique T1558.003 Correlated",
      category: "MITRE",
      description: "Kerberoasting behavior matched against Active Directory TGS query event logs.",
      timestamp: "2026-09-29T17:18:22Z",
      proofHash: "3f4a5b6c7d8e9f0a...",
      badgeVariant: "warning",
      icon: Crosshair,
    },
    {
      id: "evt-5",
      title: "Evidence Hash Verified: lsass_memory_dump_sparse.dmp",
      category: "EVIDENCE",
      description: "SHA-256 integrity match verified against initial agent collection seal.",
      timestamp: "2026-09-29T16:45:10Z",
      proofHash: "b2d56d11f8b4bb68...",
      badgeVariant: "cyber",
      icon: FileCheck,
    },
    {
      id: "evt-4",
      title: "Adaptive Profile B Selected for FIN-WS-44",
      category: "ADAPTIVE",
      description: "Reflective DLL trigger diverted collection from disk scan to real-time volatile memory capture.",
      timestamp: "2026-09-29T16:05:30Z",
      proofHash: "5e6f7a8b9c0d1e2f...",
      badgeVariant: "danger",
      icon: GitBranch,
    },
    {
      id: "evt-3",
      title: "Endpoint FIN-WS-44 Quarantined",
      category: "ENDPOINT",
      description: "Host network filtering applied: default DENY all, allow TCP:8443 (Nexus Agent Tunnel).",
      timestamp: "2026-09-29T15:48:00Z",
      proofHash: "b1c2d3e4f5a6b7c8...",
      badgeVariant: "warning",
      icon: Server,
    },
    {
      id: "evt-2",
      title: "Volatile Memory Acquired: PID 684 (LSASS)",
      category: "EVIDENCE",
      description: "Non-invasive process handle snapshot completed on DC-PROD-PRIMARY.",
      timestamp: "2026-09-29T14:30:12Z",
      proofHash: "9a8b7c6d5e4f3a2b...",
      badgeVariant: "cyber",
      icon: FileCheck,
    },
    {
      id: "evt-1",
      title: "Investigation Campaign Initialized: CASE-2026-LAT-01",
      category: "ADAPTIVE",
      description: "Natural forensic intent compiled into 4 sequential verification steps across 3 endpoints.",
      timestamp: "2026-09-29T14:15:00Z",
      proofHash: "1a8b9c2d3e4f5a6b...",
      badgeVariant: "neutral",
      icon: Cpu,
    },
  ]

  const filteredEvents = events.filter((e) => filter === "ALL" || e.category === filter)

  return (
    <Card className="border-4 border-black shadow-[6px_6px_0px_#000]">
      <CardHeader className="bg-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-black" />
          <CardTitle>Recent Investigation Telemetry Timeline</CardTitle>
          <Badge variant="neutral">{filteredEvents.length} EVENTS</Badge>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
          {["ALL", "ADAPTIVE", "EVIDENCE", "AUDIT", "ENDPOINT", "MITRE"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2 py-1 font-bold border-2 border-black transition-all ${
                filter === cat
                  ? "bg-black text-amber-300 shadow-[2px_2px_0px_#000]"
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-1 before:bg-black">
          {filteredEvents.map((evt) => {
            const Icon = evt.icon
            return (
              <div key={evt.id} className="relative group">
                {/* Timeline node dot */}
                <div className="absolute -left-[27px] top-1 w-5 h-5 border-2 border-black bg-white flex items-center justify-center shadow-[1px_1px_0px_#000] group-hover:bg-amber-300 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-black" />
                </div>

                <div className="border-2 border-black bg-white p-3.5 shadow-[3px_3px_0px_#000] space-y-1.5 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={evt.badgeVariant} className="text-[9px] py-0 px-1.5 flex items-center gap-1">
                        <Icon className="w-2.5 h-2.5" />
                        <span>{evt.category}</span>
                      </Badge>
                      <span className="font-bold text-black text-sm">{evt.title}</span>
                    </div>
                    <span className="text-[11px] font-bold text-zinc-500 shrink-0">
                      {formatDate(evt.timestamp)}
                    </span>
                  </div>

                  <p className="text-zinc-700 font-bold text-xs">{evt.description}</p>

                  {evt.proofHash && (
                    <div className="pt-1 flex items-center gap-2 text-[10px] text-zinc-500">
                      <span className="font-bold">Cryptographic Leaf Digest:</span>
                      <code className="bg-zinc-100 px-1 border border-black font-black text-black">
                        {evt.proofHash}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
