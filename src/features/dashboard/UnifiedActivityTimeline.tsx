"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  Activity,
  Cpu,
  Layers,
  Network,
  Crosshair,
  Lock,
  ShieldAlert,
  ArrowRight,
  Filter,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInvestigationStore } from "@/store/investigationStore"
import { formatDate } from "@/lib/formatters"

export type UnifiedEventCategory =
  | "ALL"
  | "INVESTIGATION"
  | "ADAPTIVE"
  | "EVIDENCE"
  | "NETWORK"
  | "MITRE"
  | "PROVENANCE"

export interface UnifiedTimelineEvent {
  id: string
  title: string
  category: "INVESTIGATION" | "ADAPTIVE" | "EVIDENCE" | "NETWORK" | "MITRE" | "PROVENANCE"
  investigationId: string
  endpointId?: string
  endpointName?: string
  description: string
  timestamp: string
  proofHash?: string
  badgeVariant: "danger" | "warning" | "cyber" | "success" | "neutral" | "purple"
  actionRoute: string
  actionLabel: string
}

const UNIFIED_EVENTS: UnifiedTimelineEvent[] = [
  {
    id: "evt-009",
    title: "Provenance Chain Block #1045 Sealed & Exported",
    category: "PROVENANCE",
    investigationId: "inv-2026-001",
    description:
      "Consensus Merkle root verified by 3/3 witness authorities. Court-admissible chain of custody sealed.",
    timestamp: "2026-09-29T17:35:00Z",
    proofHash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1a8b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
    badgeVariant: "success",
    actionRoute: "/provenance",
    actionLabel: "INSPECT BLOCK",
  },
  {
    id: "evt-008",
    title: "CobaltStrike C2 Beacon Flow Identified",
    category: "NETWORK",
    investigationId: "inv-2026-001",
    endpointId: "ep-sec-proxy",
    endpointName: "SEC-EGRESS-PROXY-01",
    description:
      "Outbound TLS connection on TCP:443 to known adversary infrastructure 185.220.101.5 flagged with 42s jitter.",
    timestamp: "2026-09-29T17:28:15Z",
    proofHash: "4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d",
    badgeVariant: "danger",
    actionRoute: "/network?id=inv-2026-001",
    actionLabel: "ANALYZE FLOW",
  },
  {
    id: "evt-007",
    title: "MITRE ATT&CK T1558.003 Correlated: Kerberoasting",
    category: "MITRE",
    investigationId: "inv-2026-001",
    endpointId: "ep-dc-01",
    endpointName: "DC-PROD-PRIMARY",
    description:
      "TGS ticket extraction matched anomalous SPN requests in Active Directory Security Log against volatile LSASS memory.",
    timestamp: "2026-09-29T17:18:22Z",
    proofHash: "3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a",
    badgeVariant: "warning",
    actionRoute: "/mitre?id=inv-2026-001",
    actionLabel: "VIEW TECHNIQUE",
  },
  {
    id: "evt-006",
    title: "Cryptographic SHA-256 Seal Validated: lsass_memory_dump_sparse.dmp",
    category: "EVIDENCE",
    investigationId: "inv-2026-001",
    endpointId: "ep-dc-01",
    endpointName: "DC-PROD-PRIMARY",
    description:
      "Zero hash drift detected across 154 MB volatile memory artifact. Merkle proof leaf index #1 certified.",
    timestamp: "2026-09-29T16:45:10Z",
    proofHash: "b2d56d11f8b4bb68f63bb3eb8d97607a988d5e1f018e69733c3e2f5b40cfb123",
    badgeVariant: "cyber",
    actionRoute: "/evidence?id=inv-2026-001",
    actionLabel: "VERIFY ARTIFACT",
  },
  {
    id: "evt-005",
    title: "Adaptive Profile Selection: PROFILE-B (Containment & Filesystem)",
    category: "ADAPTIVE",
    investigationId: "inv-2026-001",
    endpointId: "ep-ws-44",
    endpointName: "FIN-WS-44",
    description:
      "Security posture detected isolated workstation status. Synthesized NTFS MFT recovery and registry run keys.",
    timestamp: "2026-09-29T16:05:30Z",
    proofHash: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1a8b9c2d3e4f5a6b7c8d9e0f1a2b3c4d",
    badgeVariant: "purple",
    actionRoute: "/live-investigation?id=inv-2026-001",
    actionLabel: "VIEW PROFILE",
  },
  {
    id: "evt-004",
    title: "Host Isolated: FIN-WS-44 (10.0.4.44)",
    category: "ADAPTIVE",
    investigationId: "inv-2026-001",
    endpointId: "ep-ws-44",
    endpointName: "FIN-WS-44",
    description:
      "Host loopback policy applied: default DENY all external traffic, maintain secure Nexus agent tunnel on TCP:8443.",
    timestamp: "2026-09-29T15:48:00Z",
    proofHash: "b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
    badgeVariant: "warning",
    actionRoute: "/endpoints",
    actionLabel: "CHECK HOST",
  },
  {
    id: "evt-003",
    title: "Volatile Artifact Acquired: PID 684 Handle Table",
    category: "EVIDENCE",
    investigationId: "inv-2026-001",
    endpointId: "ep-dc-01",
    endpointName: "DC-PROD-PRIMARY",
    description:
      "Non-invasive memory acquisition completed using PROFILE-A Volatile Triage collector.",
    timestamp: "2026-09-29T14:30:12Z",
    proofHash: "9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    badgeVariant: "cyber",
    actionRoute: "/evidence?id=inv-2026-001",
    actionLabel: "VIEW EVIDENCE",
  },
  {
    id: "evt-002",
    title: "Investigation Intent Compiled to JOCKY IR Specification",
    category: "INVESTIGATION",
    investigationId: "inv-2026-001",
    description:
      "Human natural language prompt compiled into 4 adaptive verification stages across 3 target nodes.",
    timestamp: "2026-09-29T14:20:00Z",
    proofHash: "2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b",
    badgeVariant: "neutral",
    actionRoute: "/investigations/inv-2026-001",
    actionLabel: "INSPECT IR",
  },
  {
    id: "evt-001",
    title: "Multi-Endpoint Campaign Initialized: CASE-2026-LAT-01",
    category: "INVESTIGATION",
    investigationId: "inv-2026-001",
    description:
      "High-severity lateral movement incident launched across DC-PROD-PRIMARY, FIN-WS-44, and SEC-EGRESS-PROXY-01.",
    timestamp: "2026-09-29T14:15:00Z",
    proofHash: "1a8b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    badgeVariant: "neutral",
    actionRoute: "/investigations",
    actionLabel: "VIEW CASE",
  },
]

export function UnifiedActivityTimeline() {
  const [selectedCategory, setSelectedCategory] = useState<UnifiedEventCategory>("ALL")
  const [filterActiveCaseOnly, setFilterActiveCaseOnly] = useState<boolean>(false)
  const activeInvestigation = useInvestigationStore((state) => state.activeInvestigation)
  const currentInvId = activeInvestigation?.id ?? "inv-2026-001"

  const filteredEvents = useMemo(() => {
    return UNIFIED_EVENTS.filter((e) => {
      const matchCategory = selectedCategory === "ALL" || e.category === selectedCategory
      const matchCase = !filterActiveCaseOnly || e.investigationId === currentInvId
      return matchCategory && matchCase
    })
  }, [selectedCategory, filterActiveCaseOnly, currentInvId])

  const getCategoryIcon = (category: UnifiedTimelineEvent["category"]) => {
    switch (category) {
      case "INVESTIGATION":
        return ShieldAlert
      case "ADAPTIVE":
        return Cpu
      case "EVIDENCE":
        return Layers
      case "NETWORK":
        return Network
      case "MITRE":
        return Crosshair
      case "PROVENANCE":
        return Lock
      default:
        return Activity
    }
  }

  return (
    <Card className="border-4 border-black shadow-[6px_6px_0px_#000] font-mono">
      {/* Header */}
      <CardHeader className="bg-zinc-100 border-b-4 border-black p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-black text-amber-300 border border-black shadow-[2px_2px_0px_#000]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-black uppercase tracking-tight text-black">
                UNIFIED INVESTIGATION ACTIVITY TIMELINE
              </CardTitle>
              <Badge variant="dark" className="text-[10px]">
                {filteredEvents.length} EVENTS
              </Badge>
            </div>
            <p className="text-[11px] font-bold text-zinc-700">
              Aggregated cryptographic events across Intent, Adaptive, Evidence, Network, MITRE, and Provenance
            </p>
          </div>
        </div>

        {/* Filter for Current Case */}
        <button
          type="button"
          onClick={() => setFilterActiveCaseOnly((prev) => !prev)}
          className={`px-2.5 py-1 text-xs font-black uppercase border-2 border-black transition-all shadow-[2px_2px_0px_#000] flex items-center gap-1.5 ${
            filterActiveCaseOnly
              ? "bg-amber-400 text-black ring-2 ring-black"
              : "bg-white text-black hover:bg-zinc-200"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{filterActiveCaseOnly ? `CASE: ${currentInvId}` : "ALL CASES"}</span>
        </button>
      </CardHeader>

      {/* Category Filter Selector Buttons */}
      <div className="p-3 bg-zinc-50 border-b-3 border-black flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs font-black">
        {(
          [
            "ALL",
            "INVESTIGATION",
            "ADAPTIVE",
            "EVIDENCE",
            "NETWORK",
            "MITRE",
            "PROVENANCE",
          ] as const
        ).map((cat) => {
          const isSelected = selectedCategory === cat
          const count =
            cat === "ALL"
              ? UNIFIED_EVENTS.length
              : UNIFIED_EVENTS.filter((e) => e.category === cat).length

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[10px] font-black uppercase border-2 border-black transition-all whitespace-nowrap ${
                isSelected
                  ? "bg-black text-amber-300 shadow-[2px_2px_0px_#000] -translate-y-0.5"
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              {cat} ({count})
            </button>
          )
        })}
      </div>

      {/* Events List */}
      <CardContent className="p-4 sm:p-5 space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 font-bold bg-zinc-50 border-2 border-black">
            No events match the selected category filter.
          </div>
        ) : (
          <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-black before:hidden sm:before:block">
            {filteredEvents.map((evt) => {
              const IconComp = getCategoryIcon(evt.category)
              return (
                <div
                  key={evt.id}
                  className="relative flex flex-col sm:flex-row items-start gap-3.5 p-3.5 border-3 border-black bg-white shadow-[3px_3px_0px_#000] hover:bg-zinc-50 transition-colors"
                >
                  {/* Icon Indicator */}
                  <div className="p-2 border-2 border-black bg-zinc-100 shrink-0 text-black shadow-[1px_1px_0px_#000] z-10">
                    <IconComp className="w-4 h-4" />
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant={evt.badgeVariant} className="text-[9px] py-0 px-1.5">
                          {evt.category}
                        </Badge>
                        <span className="text-xs font-black text-black">{evt.title}</span>
                      </div>

                      <span className="text-[10px] font-bold text-zinc-500 whitespace-nowrap">
                        {formatDate(evt.timestamp)}
                      </span>
                    </div>

                    <p className="text-[11px] font-medium text-zinc-800 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Metadata & Cryptographic Proof */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-200 text-[10px]">
                      <div className="flex flex-wrap items-center gap-2 text-zinc-600 font-bold">
                        <span>Case: {evt.investigationId}</span>
                        {evt.endpointName && (
                          <span>• Target: <span className="text-black">{evt.endpointName}</span></span>
                        )}
                        {evt.proofHash && (
                          <span className="font-mono text-[9px] bg-zinc-100 px-1.5 py-0.2 border border-zinc-400">
                            Proof: {evt.proofHash.slice(0, 16)}...
                          </span>
                        )}
                      </div>

                      <Link
                        href={evt.actionRoute}
                        className="px-2 py-0.5 border border-black bg-zinc-100 hover:bg-amber-300 text-black font-black uppercase text-[10px] flex items-center gap-1 shadow-[1px_1px_0px_#000] transition-colors"
                      >
                        <span>{evt.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
