"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  Server,
  Search,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Cpu,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusPill } from "@/components/status/StatusPill"
import { useEndpointStore } from "@/store/endpointStore"
import { useInvestigationStore } from "@/store/investigationStore"
import { EndpointPlatform } from "@/types/endpoint"

export function EndpointsWorkspace() {
  const { endpoints, toggleIsolation } = useEndpointStore()
  const activeInvestigation = useInvestigationStore((state) => state.activeInvestigation)
  const currentInvId = activeInvestigation?.id ?? "inv-2026-001"

  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState<EndpointPlatform | "ALL">("ALL")
  const [isolationFilter, setIsolationFilter] = useState<"ALL" | "ISOLATED" | "UNRESTRICTED">("ALL")

  const filteredEndpoints = useMemo(() => {
    return endpoints.filter((ep) => {
      const matchPlatform =
        platformFilter === "ALL" || ep.platform.toUpperCase() === platformFilter.toUpperCase()
      const matchIsolation =
        isolationFilter === "ALL" || ep.isolationStatus === isolationFilter

      const q = searchTerm.toLowerCase().trim()
      const matchSearch =
        !q ||
        ep.hostname.toLowerCase().includes(q) ||
        ep.ipAddress.toLowerCase().includes(q) ||
        ep.osVersion.toLowerCase().includes(q) ||
        ep.tags.some((t) => t.toLowerCase().includes(q))

      return matchPlatform && matchIsolation && matchSearch
    })
  }, [endpoints, platformFilter, isolationFilter, searchTerm])

  const onlineCount = endpoints.filter((e) => e.agentStatus === "ONLINE").length
  const isolatedCount = endpoints.filter((e) => e.isolationStatus === "ISOLATED").length
  const busyCount = endpoints.filter((e) => e.agentStatus === "BUSY").length

  const resetFilters = () => {
    setSearchTerm("")
    setPlatformFilter("ALL")
    setIsolationFilter("ALL")
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
            FLEET ASSETS // V2.4
          </span>
          <span className="text-xs font-bold text-zinc-600">
            Cross-Platform Endpoint Inventory & Network Isolation Policy
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill label="5 AGENTS MANAGED" status="verified" />
        </div>
      </div>

      {/* Main Page Title Header */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Server className="w-6 h-6 text-black" />
            <h1 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight">
              HOST FLEET & ENDPOINT INVENTORY
            </h1>
          </div>
          <p className="text-xs font-bold text-zinc-600 max-w-3xl">
            Inspect monitored cross-platform nodes (Windows Server, Windows 11 Enterprise, Ubuntu 24.04, Debian DMZ Proxy, macOS). Manage forensic containment via host loopback policy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Badge variant="success">ONLINE: {onlineCount}</Badge>
          <Badge variant="warning">BUSY: {busyCount}</Badge>
          <Badge variant="danger">ISOLATED: {isolatedCount}</Badge>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3 sm:p-3.5 bg-zinc-100 border-3 border-black flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 shadow-[3px_3px_0px_#000] min-w-0">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-1 min-w-[180px] xs:min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              aria-label="Filter endpoints by hostname, IP, or tag"
              placeholder="Search hostname, IP, OS, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 font-mono text-xs font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Platform selector */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-zinc-500 hidden sm:inline">OS:</span>
            {(["ALL", "windows", "linux", "macos"] as const).map((plat) => (
              <button
                key={plat}
                type="button"
                onClick={() => setPlatformFilter(plat as EndpointPlatform | "ALL")}
                className={`px-2 py-1 text-[10px] font-black uppercase border-2 border-black transition-all ${
                  platformFilter.toLowerCase() === plat.toLowerCase()
                    ? "bg-black text-amber-300 shadow-[2px_2px_0px_#000]"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {plat}
              </button>
            ))}
          </div>

          {/* Isolation status selector */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-zinc-500 hidden md:inline">STATE:</span>
            {(["ALL", "ISOLATED", "UNRESTRICTED"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setIsolationFilter(st)}
                className={`px-1.5 py-1 text-[10px] font-black border-2 border-black transition-all ${
                  isolationFilter === st
                    ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {(searchTerm || platformFilter !== "ALL" || isolationFilter !== "ALL") && (
          <button
            type="button"
            onClick={resetFilters}
            className="px-2 py-1 text-[10px] font-black border-2 border-black bg-zinc-200 hover:bg-zinc-300 text-black flex items-center gap-1 shadow-[1px_1px_0px_#000]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        )}
      </div>

      {/* Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEndpoints.length === 0 ? (
          <div className="col-span-full p-8 text-center text-zinc-500 font-bold bg-white border-3 border-black shadow-[3px_3px_0px_#000]">
            No endpoints match your active filter criteria.
          </div>
        ) : (
          filteredEndpoints.map((ep) => (
            <Card
              key={ep.id}
              className="border-3 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between"
            >
              <div>
                <CardHeader
                  className={
                    ep.isolationStatus === "ISOLATED"
                      ? "bg-rose-100 border-b-2 border-black"
                      : "bg-zinc-100 border-b-2 border-black"
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black bg-black text-cyan-400 px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                      {ep.ipAddress}
                    </span>
                    <StatusPill
                      label={ep.isolationStatus === "ISOLATED" ? "ISOLATED" : ep.agentStatus}
                      status={ep.isolationStatus === "ISOLATED" ? "isolated" : "online"}
                    />
                  </div>
                  <CardTitle className="mt-2 text-base font-black uppercase text-black">
                    {ep.hostname}
                  </CardTitle>
                  <p className="text-xs font-mono font-bold text-zinc-600 truncate">
                    {ep.osVersion}
                  </p>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {ep.tags.map((tag) => (
                      <Badge key={tag} variant="neutral" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="p-3 border-2 border-black bg-white space-y-1.5 font-mono text-xs font-bold shadow-[2px_2px_0px_#000]">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Forensic Readiness:</span>
                      <span className="text-emerald-700 flex items-center gap-1 font-black">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{ep.forensicReadinessScore}%</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Active Processes:</span>
                      <span className="text-black font-black">{ep.telemetry.activeProcesses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">RAM Utilization:</span>
                      <span className="text-black font-black">{ep.telemetry.memoryUsage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Network Sockets:</span>
                      <span className="text-black font-black">{ep.telemetry.networkConnections}</span>
                    </div>
                  </div>

                  {/* Active Investigation Tag */}
                  {ep.activeInvestigations.length > 0 && (
                    <div className="p-2 border border-black bg-amber-50 text-[10px] font-bold flex items-center justify-between">
                      <span className="text-amber-900 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                        <span>Targeted by: {ep.activeInvestigations.join(", ")}</span>
                      </span>
                      <Link
                        href={`/live-investigation?id=${ep.activeInvestigations[0]}`}
                        className="text-black underline font-black flex items-center gap-0.5 hover:text-amber-700"
                      >
                        <span>ADAPT</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </CardContent>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
                <Button
                  type="button"
                  variant={ep.isolationStatus === "ISOLATED" ? "danger" : "outline"}
                  size="sm"
                  onClick={() => toggleIsolation(ep.id)}
                  className="w-full text-xs font-black uppercase shadow-[2px_2px_0px_#000]"
                >
                  {ep.isolationStatus === "ISOLATED"
                    ? "REVERT ISOLATION (UNBLOCK)"
                    : "QUARANTINE HOST (ISOLATE)"}
                </Button>

                <Link
                  href={`/live-investigation?id=${currentInvId}`}
                  className="block text-center p-1.5 border border-black bg-zinc-100 hover:bg-amber-300 text-black text-[10px] font-black uppercase transition-colors"
                >
                  <span className="flex items-center justify-center gap-1">
                    <Cpu className="w-3 h-3" />
                    <span>Engage in Adaptive Pipeline</span>
                  </span>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
