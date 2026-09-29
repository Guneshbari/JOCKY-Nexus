"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Network,
  Activity,
  Radio,
  Globe,
  Database,
  ChevronDown,
  Layers,
  Target,
} from "lucide-react"
import { useInvestigationStore } from "@/store/investigationStore"
import { Badge } from "@/components/ui/badge"
import { NetworkConnection } from "@/types/network"
import {
  MOCK_NETWORK_GRAPH_NODES,
  MOCK_NETWORK_GRAPH_EDGES,
} from "@/data/network"

import { NetworkMetrics } from "./NetworkMetrics"
import { NetworkConnectionGraph } from "./NetworkConnectionGraph"
import { ConnectionExplorer } from "./ConnectionExplorer"
import { ProtocolDistributionChart } from "./ProtocolDistributionChart"
import { DestinationIntelligence } from "./DestinationIntelligence"
import { NetworkTimeline } from "./NetworkTimeline"
import { NetworkFindingDrawer } from "./NetworkFindingDrawer"

export function NetworkIntelligenceWorkspace() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryInvestigationId = searchParams.get("id")
  const queryConnId = searchParams.get("conn")

  const {
    investigations,
    activeInvestigation,
    selectInvestigation,
    networkConnections,
    networkFindings,
  } = useInvestigationStore()

  // Selected connection for drawer (derived or user-selected)
  const [userSelectedConnection, setUserSelectedConnection] = useState<NetworkConnection | null>(null)
  const [activeTab, setActiveTab] = useState<"graph" | "explorer" | "destinations" | "timeline">("graph")

  const selectedConnection = useMemo(() => {
    if (userSelectedConnection) return userSelectedConnection
    if (queryConnId) {
      return networkConnections.find((c) => c.id === queryConnId) ?? null
    }
    return null
  }, [userSelectedConnection, queryConnId, networkConnections])

  // Sync investigation from query parameter if provided
  useEffect(() => {
    if (queryInvestigationId && (!activeInvestigation || activeInvestigation.id !== queryInvestigationId)) {
      const match = investigations.find((inv) => inv.id === queryInvestigationId)
      if (match) {
        selectInvestigation(match.id)
      }
    }
  }, [queryInvestigationId, activeInvestigation, investigations, selectInvestigation])

  // Filter connections by currently selected investigation if desired
  const activeConnections = useMemo(() => {
    if (!activeInvestigation) return networkConnections
    const forCase = networkConnections.filter(
      (c) => c.investigationId === activeInvestigation.id
    )
    return forCase.length > 0 ? forCase : networkConnections
  }, [networkConnections, activeInvestigation])

  const handleInvestigationSelect = (id: string) => {
    selectInvestigation(id)
    router.push(`/network?id=${id}`)
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Workspace Header */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_#000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyber" className="text-xs px-2 py-0.5 font-black uppercase tracking-wider">
                NETWORK FORENSICS
              </Badge>
              <Badge variant="success" className="text-xs">
                STATUS: NETWORK INTELLIGENCE: ONLINE
              </Badge>
              <span className="text-xs text-zinc-500 font-bold">
                HERO: OBSERVE → TRACE → CORRELATE → INVESTIGATE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black flex items-center gap-3">
              <Network className="w-7 h-7 text-blue-600 shrink-0" />
              Network Forensics & Threat Flow Topology
            </h1>
            <p className="text-xs sm:text-sm font-bold text-zinc-600 max-w-3xl">
              Trace simulated network observations across endpoints, protocols, destinations, and
              investigation evidence with unified cross-platform telemetry.
            </p>
          </div>

          {/* Action Toolbar & Case Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Case Switcher */}
            <div className="relative inline-block">
              <select
                aria-label="Select Target Investigation Case"
                value={activeInvestigation?.id ?? ""}
                onChange={(e) => handleInvestigationSelect(e.target.value)}
                className="appearance-none bg-zinc-100 hover:bg-zinc-200 border-2 border-black px-3 py-2 pr-8 text-xs font-black uppercase cursor-pointer shadow-[2px_2px_0px_#000] focus:outline-none"
              >
                {investigations.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id} - {inv.title.slice(0, 22)}...
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-black absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Link to Evidence Vault */}
            <Link
              href={`/evidence${activeInvestigation ? `?id=${activeInvestigation.id}` : ""}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 border-2 border-black bg-cyan-300 hover:bg-cyan-400 text-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <Database className="w-3.5 h-3.5" />
              Evidence Vault
            </Link>

            {/* Link to MITRE Intelligence */}
            <Link
              href="/mitre"
              className="inline-flex items-center gap-1.5 px-3 py-2 border-2 border-black bg-orange-300 hover:bg-orange-400 text-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <Target className="w-3.5 h-3.5" />
              MITRE ATT&CK
            </Link>
          </div>
        </div>
      </div>

      {/* Network Overview Metrics Strip */}
      <NetworkMetrics
        connections={activeConnections}
        findings={networkFindings}
      />

      {/* View Switcher Tabs */}
      <div className="border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap border-b-2 border-black bg-zinc-100 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("graph")}
            className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "graph"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Interactive Flow Graph (React Flow)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("explorer")}
            className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "explorer"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Connection Explorer ({activeConnections.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("destinations")}
            className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "destinations"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Destination Intelligence
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "timeline"
                ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                : "bg-white text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Network Timeline Stream
          </button>
        </div>

        {/* Tab Content Rendering */}
        <div className="p-4 space-y-4">
          {activeTab === "graph" && (
            <div className="space-y-4">
              <NetworkConnectionGraph
                nodesData={MOCK_NETWORK_GRAPH_NODES}
                edgesData={MOCK_NETWORK_GRAPH_EDGES}
                connections={activeConnections}
                onSelectConnection={(conn) => setUserSelectedConnection(conn)}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ProtocolDistributionChart />
                <DestinationIntelligence />
              </div>
            </div>
          )}

          {activeTab === "explorer" && (
            <div className="space-y-4">
              <ConnectionExplorer
                connections={activeConnections}
                selectedConnectionId={selectedConnection?.id ?? null}
                onSelectConnection={(conn) => setUserSelectedConnection(conn)}
              />

              <ProtocolDistributionChart />
            </div>
          )}

          {activeTab === "destinations" && (
            <div className="space-y-4">
              <DestinationIntelligence />
              <ProtocolDistributionChart />
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4">
              <NetworkTimeline
                connections={activeConnections}
                onSelectConnection={(conn) => setUserSelectedConnection(conn)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Network Finding Drawer */}
      <NetworkFindingDrawer
        connection={selectedConnection}
        onClose={() => setUserSelectedConnection(null)}
      />
    </div>
  )
}
