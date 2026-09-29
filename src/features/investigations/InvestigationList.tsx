"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  Play,
  Copy,
  Plus,
  Server,
  Layers,
  CheckCircle2,
  Clock,
  SearchX,
  FileCode2,
  Check,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { InvestigationFilters } from "./InvestigationFilters"
import { useInvestigationStore } from "@/store/investigationStore"
import {
  Investigation,
  InvestigationStatus,
  InvestigationSeverity,
  InvestigationCategory,
} from "@/types/investigation"
import { formatDate, truncateHash } from "@/lib/formatters"

interface InvestigationListProps {
  onOpenBuilder?: () => void
}

export function InvestigationList({ onOpenBuilder }: InvestigationListProps) {
  const router = useRouter()
  const investigations = useInvestigationStore((state) => state.investigations)
  const duplicateInvestigation = useInvestigationStore((state) => state.duplicateInvestigation)
  const launchAdaptiveAnalysis = useInvestigationStore((state) => state.launchAdaptiveAnalysis)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<InvestigationStatus | "ALL">("ALL")
  const [severityFilter, setSeverityFilter] = useState<InvestigationSeverity | "ALL">("ALL")
  const [categoryFilter, setCategoryFilter] = useState<InvestigationCategory | "ALL">("ALL")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleResetFilters = () => {
    setSearchQuery("")
    setStatusFilter("ALL")
    setSeverityFilter("ALL")
    setCategoryFilter("ALL")
  }

  const filteredInvestigations = useMemo(() => {
    return investigations.filter((inv) => {
      // Status filter
      if (statusFilter !== "ALL" && inv.status !== statusFilter) return false
      // Severity filter
      if (severityFilter !== "ALL" && inv.severity !== severityFilter) return false
      // Category filter
      if (categoryFilter !== "ALL" && inv.category !== categoryFilter) return false
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesId = inv.id.toLowerCase().includes(query)
        const matchesTitle = inv.title.toLowerCase().includes(query)
        const matchesIntent = inv.intent.toLowerCase().includes(query)
        const matchesCase = inv.caseName?.toLowerCase().includes(query) ?? false
        const matchesEndpoint = inv.targetEndpointIds.some((ep) =>
          ep.toLowerCase().includes(query)
        )
        if (!matchesId && !matchesTitle && !matchesIntent && !matchesCase && !matchesEndpoint) {
          return false
        }
      }
      return true
    })
  }, [investigations, statusFilter, severityFilter, categoryFilter, searchQuery])

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const duplicated = duplicateInvestigation(id)
    setCopiedId(duplicated.id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  const handleLaunch = (inv: Investigation, e: React.MouseEvent) => {
    e.stopPropagation()
    launchAdaptiveAnalysis(inv.id)
    router.push(`/live-investigation?id=${inv.id}`)
  }

  const getStatusBadgeVariant = (status: InvestigationStatus) => {
    switch (status) {
      case "IN_PROGRESS":
        return "cyber"
      case "READY":
        return "warning"
      case "COMPLETED":
        return "success"
      case "PAUSED":
        return "warning"
      case "DRAFT":
      default:
        return "neutral"
    }
  }

  const getSeverityBadgeVariant = (sev: InvestigationSeverity) => {
    switch (sev) {
      case "CRITICAL":
        return "danger"
      case "HIGH":
        return "warning"
      case "MEDIUM":
        return "default"
      case "LOW":
      default:
        return "neutral"
    }
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black uppercase text-black">
            Active Forensic Campaigns
          </span>
          <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5">
            {filteredInvestigations.length} / {investigations.length}
          </span>
        </div>

        {onOpenBuilder && (
          <Button
            type="button"
            onClick={onOpenBuilder}
            className="flex items-center gap-2 px-4 py-2 border-3 border-black bg-amber-400 text-black font-black uppercase shadow-[4px_4px_0px_#000] hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>NEW INVESTIGATION</span>
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <InvestigationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onReset={handleResetFilters}
      />

      {/* Empty State */}
      {filteredInvestigations.length === 0 && (
        <div className="border-4 border-black bg-white p-8 text-center shadow-[6px_6px_0px_#000] space-y-4">
          <div className="flex justify-center">
            <SearchX className="w-12 h-12 text-zinc-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase text-black">
              No Investigations Match Filters
            </h3>
            <p className="text-xs text-zinc-600 font-bold max-w-md mx-auto">
              No campaign matched your search query or selected category/status filter criteria.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 border-2 border-black bg-zinc-100 text-xs font-black uppercase hover:bg-zinc-200"
            >
              Reset Filters
            </button>
            {onOpenBuilder && (
              <button
                type="button"
                onClick={onOpenBuilder}
                className="px-4 py-2 border-2 border-black bg-amber-400 text-xs font-black uppercase hover:bg-amber-300"
              >
                Create New Investigation
              </button>
            )}
          </div>
        </div>
      )}

      {/* Investigation Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredInvestigations.map((inv) => (
          <Card
            key={inv.id}
            className="border-3 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-all bg-white"
          >
            <CardHeader className="bg-amber-100/70 border-b-2 border-black pb-3 pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
                    {inv.id}
                  </span>
                  <Badge variant={getSeverityBadgeVariant(inv.severity)}>
                    {inv.severity}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(inv.status)}>
                    {inv.status}
                  </Badge>
                  {inv.category && (
                    <span className="font-mono text-[10px] font-black uppercase bg-white border border-black px-2 py-0.5">
                      {inv.category}
                    </span>
                  )}
                  {inv.caseName && (
                    <span className="font-mono text-[10px] font-bold text-zinc-600">
                      [{inv.caseName}]
                    </span>
                  )}
                </div>

                <CardTitle className="text-base md:text-lg font-black tracking-tight text-black pt-1">
                  {inv.title}
                </CardTitle>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {inv.status !== "COMPLETED" && (
                  <Button
                    size="sm"
                    variant="cyber"
                    onClick={(e) => handleLaunch(inv, e)}
                    className="gap-1.5 text-xs font-black"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>LAUNCH</span>
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleDuplicate(inv.id, e)}
                  className="gap-1 text-xs"
                  title="Duplicate Investigation"
                >
                  {copiedId === inv.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline text-emerald-600">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">DUPLICATE</span>
                    </>
                  )}
                </Button>

                <Link href={`/investigations/${inv.id}`}>
                  <Button size="sm" variant="default" className="gap-1.5 text-xs">
                    <span>DETAILS & AUDIT</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="pt-3 pb-4 space-y-3">
              {/* Intent statement */}
              <div className="p-2.5 border-2 border-black bg-zinc-50 text-xs">
                <span className="text-zinc-500 font-black block text-[10px] uppercase mb-0.5">
                  FORENSIC INTENT
                </span>
                <p className="font-bold text-zinc-900 leading-relaxed">
                  {inv.intent}
                </p>
              </div>

              {/* Progress Bar for Active / Completed */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-zinc-600 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    EXECUTION PIPELINE PROGRESS
                  </span>
                  <span className="font-mono text-black font-black">
                    {inv.progressPercentage}%
                  </span>
                </div>
                <div className="w-full h-2.5 border-2 border-black bg-zinc-200 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      inv.status === "COMPLETED"
                        ? "bg-emerald-500"
                        : inv.status === "IN_PROGRESS"
                        ? "bg-amber-400 animate-pulse"
                        : "bg-zinc-400"
                    }`}
                    style={{ width: `${Math.max(5, inv.progressPercentage)}%` }}
                  />
                </div>
              </div>

              {/* Metadata strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t-2 border-zinc-100 text-xs font-bold text-zinc-700">
                <div className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">
                    Hosts: <span className="font-mono text-black">{inv.targetEndpointIds.length}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">
                    Artifacts: <span className="font-mono text-black">{inv.evidenceCount}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">
                    Stages: <span className="font-mono text-black">{inv.steps.length}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-mono text-[11px] truncate" title={inv.provenanceRootHash}>
                    Merkle: {truncateHash(inv.provenanceRootHash, 4, 4)}
                  </span>
                </div>
              </div>

              {/* Target Endpoints Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-black uppercase text-zinc-500 mr-1">
                  Targets:
                </span>
                {inv.targetEndpointIds.map((epId) => (
                  <span
                    key={epId}
                    className="px-2 py-0.5 border border-black bg-zinc-100 text-[10px] font-mono font-bold text-black"
                  >
                    {epId}
                  </span>
                ))}
                <span className="text-[10px] font-bold text-zinc-500 ml-auto">
                  Created {formatDate(inv.createdAt)} by {inv.initiatedBy}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
