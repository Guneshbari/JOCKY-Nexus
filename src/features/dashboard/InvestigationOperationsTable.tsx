"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Cpu,
  Layers,
  Network,
  RotateCcw,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInvestigationStore } from "@/store/investigationStore"
import { formatDate } from "@/lib/formatters"
import { InvestigationStatus, InvestigationSeverity } from "@/types/investigation"

type SeverityFilter = "ALL" | InvestigationSeverity
type StatusFilter = "ALL" | InvestigationStatus

export function InvestigationOperationsTable() {
  const router = useRouter()
  const investigations = useInvestigationStore((state) => state.investigations)
  const activeInvestigation = useInvestigationStore((state) => state.activeInvestigation)
  const selectInvestigation = useInvestigationStore((state) => state.selectInvestigation)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL")
  const [profileFilter, setProfileFilter] = useState<string>("ALL")
  const [sortField, setSortField] = useState<"updatedAt" | "progressPercentage" | "evidenceCount">("updatedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filtered & sorted investigations
  const filtered = useMemo(() => {
    return investigations
      .filter((inv) => {
        const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter
        const matchesSeverity = severityFilter === "ALL" || inv.severity === severityFilter
        const matchesProfile =
          profileFilter === "ALL" ||
          (inv.adaptiveProfile && inv.adaptiveProfile.toLowerCase().includes(profileFilter.toLowerCase()))

        const matchesSearch =
          searchTerm === "" ||
          inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (inv.caseName && inv.caseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (inv.intent && inv.intent.toLowerCase().includes(searchTerm.toLowerCase())) ||
          inv.targetEndpointIds.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))

        return matchesStatus && matchesSeverity && matchesProfile && matchesSearch
      })
      .sort((a, b) => {
        let comparison = 0
        if (sortField === "progressPercentage") {
          comparison = a.progressPercentage - b.progressPercentage
        } else if (sortField === "evidenceCount") {
          comparison = a.evidenceCount - b.evidenceCount
        } else {
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        }
        return sortDirection === "desc" ? -comparison : comparison
      })
  }, [investigations, statusFilter, severityFilter, profileFilter, searchTerm, sortField, sortDirection])

  // Count summaries
  const totalCount = investigations.length
  const activeCount = investigations.filter((i) => i.status === "IN_PROGRESS").length
  const completedCount = investigations.filter((i) => i.status === "COMPLETED").length
  const criticalCount = investigations.filter((i) => i.severity === "CRITICAL").length

  const handleRowClick = (id: string) => {
    selectInvestigation(id)
    router.push(`/investigations/${id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleRowClick(id)
    }
  }

  const toggleSort = (field: "updatedAt" | "progressPercentage" | "evidenceCount") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("ALL")
    setSeverityFilter("ALL")
    setProfileFilter("ALL")
    setSortField("updatedAt")
    setSortDirection("desc")
  }

  return (
    <Card className="border-4 border-black shadow-[6px_6px_0px_#000] font-mono">
      {/* Header with Title and Operational Status */}
      <CardHeader className="bg-amber-300 border-b-4 border-black p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-black text-amber-300 border border-black shadow-[2px_2px_0px_#000]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-black uppercase tracking-tight text-black">
                INVESTIGATION OPERATIONS FLEET
              </CardTitle>
              <Badge variant="dark" className="text-[10px]">
                {filtered.length} / {totalCount} ACTIVE
              </Badge>
            </div>
            <p className="text-[11px] font-bold text-zinc-800">
              Cross-endpoint orchestration, adaptive execution profile distribution, and evidence seals
            </p>
          </div>
        </div>

        {/* Aggregate KPI Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-2 py-1 bg-white border-2 border-black font-black flex items-center gap-1 shadow-[2px_2px_0px_#000]">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>IN PROGRESS: {activeCount}</span>
          </div>
          <div className="px-2 py-1 bg-white border-2 border-black font-black flex items-center gap-1 shadow-[2px_2px_0px_#000]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>COMPLETED: {completedCount}</span>
          </div>
          <div className="px-2 py-1 bg-rose-100 border-2 border-black text-rose-900 font-black flex items-center gap-1 shadow-[2px_2px_0px_#000]">
            <span>CRITICAL: {criticalCount}</span>
          </div>
        </div>
      </CardHeader>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-zinc-100 border-b-3 border-black flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 min-w-0">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-1 min-w-[180px] xs:min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              aria-label="Filter investigations by query"
              placeholder="Search case, host, or intent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 font-mono text-xs font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1 shrink-0">
            {(["ALL", "IN_PROGRESS", "COMPLETED"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-1.5 sm:px-2 py-1 text-[10px] font-black border-2 border-black transition-all ${
                  statusFilter === st
                    ? "bg-black text-amber-300 shadow-[2px_2px_0px_#000]"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {st === "IN_PROGRESS" ? "PROGRESS" : st}
              </button>
            ))}
          </div>

          {/* Severity selector */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-bold text-zinc-500 hidden sm:inline">SEV:</span>
            {(["ALL", "CRITICAL", "HIGH", "MEDIUM"] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className={`px-1.5 py-1 text-[10px] font-black border-2 border-black transition-all ${
                  severityFilter === sev
                    ? "bg-black text-white shadow-[2px_2px_0px_#000]"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Profile filter */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-bold text-zinc-500 hidden md:inline">PROFILE:</span>
            {(["ALL", "PROFILE-A", "PROFILE-B", "PROFILE-C"] as const).map((prof) => (
              <button
                key={prof}
                type="button"
                onClick={() => setProfileFilter(prof)}
                className={`px-1.5 py-1 text-[10px] font-black border-2 border-black transition-all ${
                  profileFilter === prof
                    ? "bg-amber-400 text-black shadow-[2px_2px_0px_#000]"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {prof === "ALL" ? "ALL" : prof.replace("PROFILE-", "P-")}
              </button>
            ))}
          </div>
        </div>

        {/* Reset filters button */}
        {(searchTerm || statusFilter !== "ALL" || severityFilter !== "ALL" || profileFilter !== "ALL") && (
          <button
            type="button"
            onClick={resetFilters}
            className="px-2 py-1 text-[10px] font-black border-2 border-black bg-zinc-200 hover:bg-zinc-300 text-black flex items-center gap-1 shadow-[1px_1px_0px_#000] shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        )}
      </div>

      {/* Table Content */}
      <CardContent className="p-0 overflow-x-auto w-full min-w-0">
        <table className="w-full min-w-[850px] text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b-3 border-black bg-zinc-200 font-black uppercase text-zinc-800">
              <th className="p-3">Investigation ID</th>
              <th className="p-3">Case Intent & Targets</th>
              <th
                className="p-3 cursor-pointer select-none hover:bg-zinc-300"
                onClick={() => toggleSort("progressPercentage")}
              >
                <div className="flex items-center gap-1">
                  <span>Progress</span>
                  {sortField === "progressPercentage" && (
                    <span className="text-[10px]">{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th
                className="p-3 cursor-pointer select-none hover:bg-zinc-300"
                onClick={() => toggleSort("evidenceCount")}
              >
                <div className="flex items-center gap-1">
                  <span>Evidence</span>
                  {sortField === "evidenceCount" && (
                    <span className="text-[10px]">{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th className="p-3">Adaptive Profile</th>
              <th className="p-3">Status</th>
              <th
                className="p-3 cursor-pointer select-none hover:bg-zinc-300"
                onClick={() => toggleSort("updatedAt")}
              >
                <div className="flex items-center gap-1">
                  <span>Last Activity</span>
                  {sortField === "updatedAt" && (
                    <span className="text-[10px]">{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y-2 divide-black">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-zinc-500 font-bold bg-white">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-6 h-6 text-zinc-400" />
                    <span>No investigations match your active filter criteria.</span>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-2 px-3 py-1 border-2 border-black bg-amber-300 text-black text-xs font-black shadow-[2px_2px_0px_#000]"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((inv) => {
                const isCurrentActive = activeInvestigation?.id === inv.id
                return (
                  <tr
                    key={inv.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open investigation ${inv.id}: ${inv.title}`}
                    onClick={() => handleRowClick(inv.id)}
                    onKeyDown={(e) => handleKeyDown(e, inv.id)}
                    className={`hover:bg-amber-50 cursor-pointer transition-colors focus:bg-amber-100 focus:outline-none group ${
                      isCurrentActive ? "bg-amber-50/80 font-bold" : "bg-white"
                    }`}
                  >
                    {/* ID & Severity */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {isCurrentActive && (
                          <span
                            className="w-2 h-2 rounded-full bg-amber-500 animate-ping"
                            title="Active Case"
                          />
                        )}
                        <span className="font-mono font-black text-black bg-zinc-100 px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                          {inv.id}
                        </span>
                        <Badge
                          variant={
                            inv.severity === "CRITICAL"
                              ? "danger"
                              : inv.severity === "HIGH"
                              ? "warning"
                              : "default"
                          }
                          className="text-[9px] py-0 px-1"
                        >
                          {inv.severity}
                        </Badge>
                      </div>
                    </td>

                    {/* Case Title & Targets */}
                    <td className="p-3 max-w-sm">
                      <div className="font-black text-black group-hover:text-amber-900 truncate">
                        {inv.title}
                      </div>
                      <div className="text-[11px] text-zinc-600 font-mono truncate mb-1">
                        {inv.caseName ?? "CASE-2026-UNASSIGNED"} • {inv.intent}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {inv.targetEndpointIds.map((target) => (
                          <span
                            key={target}
                            className="px-1.5 py-0.2 border border-black bg-zinc-100 text-[9px] font-bold text-zinc-800"
                          >
                            {target}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Progress Bar */}
                    <td className="p-3 min-w-[130px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{inv.progressPercentage}%</span>
                          <span className="text-zinc-500">{inv.steps.length} stages</span>
                        </div>
                        <div className="w-full h-3 border-2 border-black bg-zinc-200 overflow-hidden">
                          <div
                            className={`h-full border-r-2 border-black transition-all ${
                              inv.status === "COMPLETED"
                                ? "bg-emerald-400"
                                : inv.severity === "CRITICAL"
                                ? "bg-rose-500"
                                : "bg-amber-400"
                            }`}
                            style={{ width: `${inv.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Evidence count */}
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-mono font-black text-black bg-cyan-100 border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000]">
                        {inv.evidenceCount} Sealed
                      </span>
                    </td>

                    {/* Adaptive Profile */}
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-mono text-[10px] font-black bg-zinc-100 border border-black px-2 py-0.5 text-zinc-800">
                        {inv.adaptiveProfile ?? "PROFILE-A (STANDARD)"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3 whitespace-nowrap">
                      <Badge variant={inv.status === "COMPLETED" ? "success" : "default"}>
                        {inv.status}
                      </Badge>
                    </td>

                    {/* Last Activity */}
                    <td className="p-3 whitespace-nowrap text-zinc-600 font-bold text-[11px]">
                      {formatDate(inv.updatedAt)}
                    </td>

                    {/* Quick Cross-Workspace Actions */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/live-investigation?id=${inv.id}`}
                          title="Open Adaptive Execution"
                          className="p-1 border border-black bg-amber-100 hover:bg-amber-300 text-black shadow-[1px_1px_0px_#000]"
                        >
                          <Cpu className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/evidence?id=${inv.id}`}
                          title="Open Evidence Intelligence"
                          className="p-1 border border-black bg-cyan-100 hover:bg-cyan-300 text-black shadow-[1px_1px_0px_#000]"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/network?id=${inv.id}`}
                          title="Open Network Forensics"
                          className="p-1 border border-black bg-purple-100 hover:bg-purple-300 text-black shadow-[1px_1px_0px_#000]"
                        >
                          <Network className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRowClick(inv.id)}
                          className="px-2 py-1 border-2 border-black bg-black text-amber-300 hover:bg-zinc-800 text-[10px] font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_#000]"
                        >
                          <span>OPEN</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
