"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldAlert, Search, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInvestigationStore } from "@/store/investigationStore"
import { formatDate } from "@/lib/formatters"
import { InvestigationStatus } from "@/types/investigation"

export function ActiveInvestigationsTable() {
  const router = useRouter()
  const investigations = useInvestigationStore((state) => state.investigations)
  const selectInvestigation = useInvestigationStore((state) => state.selectInvestigation)

  const [filterStatus, setFilterStatus] = useState<InvestigationStatus | "ALL">("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = investigations.filter((inv) => {
    const matchesStatus = filterStatus === "ALL" || inv.status === filterStatus
    const matchesSearch =
      searchTerm === "" ||
      inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.caseName && inv.caseName.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesSearch
  })

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

  return (
    <Card className="border-4 border-black shadow-[6px_6px_0px_#000]">
      <CardHeader className="bg-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-black" />
          <CardTitle>Active Multi-Endpoint Investigations</CardTitle>
          <Badge variant="dark" className="ml-2">
            {filtered.length} CASES
          </Badge>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search case or host..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 font-mono text-xs font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-1">
            {(["ALL", "IN_PROGRESS", "COMPLETED"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-1 font-mono text-[10px] font-bold border-2 border-black transition-all ${
                  filterStatus === st
                    ? "bg-black text-amber-300 shadow-[2px_2px_0px_#000]"
                    : "bg-white text-black hover:bg-zinc-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b-3 border-black bg-zinc-100 font-black uppercase text-zinc-800">
              <th className="p-3.5">Investigation ID</th>
              <th className="p-3.5">Case & Intent</th>
              <th className="p-3.5">Targets</th>
              <th className="p-3.5 min-w-[130px]">Progress</th>
              <th className="p-3.5">Evidence</th>
              <th className="p-3.5">Adaptive Profile</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Last Activity</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {filtered.map((inv) => (
              <tr
                key={inv.id}
                tabIndex={0}
                role="button"
                aria-label={`Open investigation ${inv.id}: ${inv.title}`}
                onClick={() => handleRowClick(inv.id)}
                onKeyDown={(e) => handleKeyDown(e, inv.id)}
                className="hover:bg-amber-50 cursor-pointer transition-colors focus:bg-amber-100 focus:outline-none group"
              >
                {/* ID & Severity */}
                <td className="p-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-black bg-zinc-100 px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                      {inv.id}
                    </span>
                    <Badge
                      variant={inv.severity === "CRITICAL" ? "danger" : inv.severity === "HIGH" ? "warning" : "default"}
                      className="text-[9px] py-0 px-1"
                    >
                      {inv.severity}
                    </Badge>
                  </div>
                </td>

                {/* Case & Title */}
                <td className="p-3.5 max-w-xs">
                  <div className="font-bold text-black group-hover:text-amber-900 truncate">
                    {inv.title}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono truncate">
                    {inv.caseName ?? "CASE-2026-UNASSIGNED"} • {inv.intent}
                  </div>
                </td>

                {/* Targets */}
                <td className="p-3.5 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {inv.targetEndpointIds.map((target) => (
                      <span
                        key={target}
                        className="px-1.5 py-0.5 border border-black bg-zinc-50 text-[10px] font-bold text-zinc-800"
                      >
                        {target}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Progress Bar */}
                <td className="p-3.5">
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
                <td className="p-3.5 whitespace-nowrap">
                  <span className="font-mono font-black text-black bg-cyan-100 border border-black px-2 py-0.5 shadow-[1px_1px_0px_#000]">
                    {inv.evidenceCount} Sealed
                  </span>
                </td>

                {/* Adaptive Profile */}
                <td className="p-3.5 whitespace-nowrap">
                  <span className="font-mono text-[10px] font-black bg-zinc-100 border border-black px-2 py-0.5 text-zinc-800">
                    {inv.adaptiveProfile ?? "PROFILE-A (STANDARD)"}
                  </span>
                </td>

                {/* Status */}
                <td className="p-3.5 whitespace-nowrap">
                  <Badge variant={inv.status === "COMPLETED" ? "success" : "default"}>
                    {inv.status}
                  </Badge>
                </td>

                {/* Last Activity */}
                <td className="p-3.5 whitespace-nowrap text-zinc-600 font-bold">
                  {formatDate(inv.updatedAt)}
                </td>

                {/* Row Action */}
                <td className="p-3.5 text-right whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 font-bold text-black group-hover:translate-x-1 transition-transform">
                    <span>INSPECT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
