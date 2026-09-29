"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  ArrowUpDown,
  Filter,
  RotateCcw,
  ArrowRight,
  FileCheck2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  NetworkConnection,
  NetworkProtocol,
  NetworkRiskLevel,
} from "@/types/network"
import { formatBytes, formatDate } from "@/lib/formatters"

interface ConnectionExplorerProps {
  connections: NetworkConnection[]
  selectedConnectionId: string | null
  onSelectConnection: (conn: NetworkConnection) => void
}

export function ConnectionExplorer({
  connections,
  selectedConnectionId,
  onSelectConnection,
}: ConnectionExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [protocolFilter, setProtocolFilter] = useState<NetworkProtocol | "ALL">("ALL")
  const [riskFilter, setRiskFilter] = useState<NetworkRiskLevel | "ALL">("ALL")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")

  // Filtered & sorted connections
  const filteredConnections = useMemo(() => {
    return connections
      .filter((c) => {
        if (protocolFilter !== "ALL" && c.protocol !== protocolFilter) return false
        if (riskFilter !== "ALL" && c.riskLevel !== riskFilter) return false

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchIp =
            c.sourceIp.toLowerCase().includes(q) ||
            c.targetIp.toLowerCase().includes(q) ||
            (c.targetHostname?.toLowerCase().includes(q) ?? false) ||
            c.sourceEndpointHostname.toLowerCase().includes(q)
          const matchProto = c.protocol.toLowerCase().includes(q)
          const matchEvidence = c.evidenceId?.toLowerCase().includes(q) ?? false
          const matchMitre =
            c.mitreTechniques?.some((t) => t.toLowerCase().includes(q)) ?? false

          return matchIp || matchProto || matchEvidence || matchMitre
        }

        return true
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime()
        const timeB = new Date(b.timestamp).getTime()
        return sortOrder === "desc" ? timeB - timeA : timeA - timeB
      })
  }, [connections, protocolFilter, riskFilter, searchQuery, sortOrder])

  const handleResetFilters = () => {
    setSearchQuery("")
    setProtocolFilter("ALL")
    setRiskFilter("ALL")
  }

  const getRiskBadge = (risk: NetworkRiskLevel, status: string) => {
    if (status === "FLAGGED" || risk === "HIGH") {
      return <Badge variant="danger">FLAGGED (HIGH)</Badge>
    }
    if (risk === "MEDIUM") {
      return <Badge variant="warning">SUSPICIOUS (MED)</Badge>
    }
    if (risk === "LOW") {
      return <Badge variant="neutral">ELEVATED</Badge>
    }
    return <Badge variant="success">BENIGN (INFO)</Badge>
  }

  return (
    <div className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono space-y-3 p-4">
      {/* Header and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
        <div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-black" />
            <h3 className="text-sm font-black uppercase text-black">
              Forensic Connection Explorer
            </h3>
            <span className="text-xs bg-amber-300 px-2 py-0.5 border border-black font-black">
              {filteredConnections.length} / {connections.length} FLOWS
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-600">
            Search, filter, and inspect detailed transport sessions correlated with Phase 5 evidence.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(searchQuery || protocolFilter !== "ALL" || riskFilter !== "ALL") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2 py-1 border border-black bg-rose-100 hover:bg-rose-200 text-xs font-black cursor-pointer text-rose-900"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-black bg-zinc-100 hover:bg-zinc-200 text-xs font-black cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>SORT: {sortOrder === "desc" ? "NEWEST" : "OLDEST"}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search IP, host, protocol, evidence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 border-2 border-black bg-zinc-50 text-xs font-bold focus:outline-none focus:bg-white"
          />
        </div>

        {/* Protocol Filter */}
        <select
          value={protocolFilter}
          onChange={(e) => setProtocolFilter(e.target.value as NetworkProtocol | "ALL")}
          className="p-1.5 border-2 border-black bg-zinc-50 text-xs font-bold text-black focus:outline-none"
        >
          <option value="ALL">ALL PROTOCOLS</option>
          <option value="HTTPS">HTTPS (443)</option>
          <option value="TCP">TCP (88/389)</option>
          <option value="SMB">SMB (445)</option>
          <option value="DNS">DNS (53)</option>
        </select>

        {/* Risk Filter */}
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value as NetworkRiskLevel | "ALL")}
          className="p-1.5 border-2 border-black bg-zinc-50 text-xs font-bold text-black focus:outline-none"
        >
          <option value="ALL">ALL RISK LEVELS</option>
          <option value="HIGH">HIGH (FLAGGED / C2)</option>
          <option value="MEDIUM">MEDIUM (LATERAL / SUSPICIOUS)</option>
          <option value="LOW">LOW</option>
          <option value="INFO">INFO (BENIGN)</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border-2 border-black w-full min-w-0">
        <table className="w-full min-w-[850px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-zinc-100 text-[10px] font-black uppercase text-zinc-700">
              <th className="p-2.5 border-r border-black">Timestamp</th>
              <th className="p-2.5 border-r border-black">Source Host:Port</th>
              <th className="p-2.5 border-r border-black">Dir</th>
              <th className="p-2.5 border-r border-black">Destination</th>
              <th className="p-2.5 border-r border-black">Proto</th>
              <th className="p-2.5 border-r border-black">Volume</th>
              <th className="p-2.5 border-r border-black">Profile</th>
              <th className="p-2.5 border-r border-black">Risk Assessment</th>
              <th className="p-2.5 text-right">Evidence Link</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {filteredConnections.map((conn) => {
              const isSelected = conn.id === selectedConnectionId

              return (
                <tr
                  key={conn.id}
                  onClick={() => onSelectConnection(conn)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-amber-100 font-bold" : "hover:bg-amber-50"
                  }`}
                >
                  <td className="p-2.5 border-r border-black font-mono text-[11px] whitespace-nowrap">
                    {formatDate(conn.timestamp)}
                  </td>
                  <td className="p-2.5 border-r border-black">
                    <span className="font-bold text-black block">
                      {conn.sourceEndpointHostname}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {conn.sourceIp}:{conn.sourcePort}
                    </span>
                  </td>
                  <td className="p-2.5 border-r border-black text-center text-zinc-400">
                    <ArrowRight className="w-3.5 h-3.5 mx-auto" />
                  </td>
                  <td className="p-2.5 border-r border-black">
                    <span className="font-bold text-black block truncate max-w-[180px]">
                      {conn.targetHostname || conn.targetIp}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Port: {conn.targetPort}
                    </span>
                  </td>
                  <td className="p-2.5 border-r border-black">
                    <span className="bg-zinc-200 px-1.5 py-0.5 border border-black font-black text-[10px]">
                      {conn.protocol}
                    </span>
                  </td>
                  <td className="p-2.5 border-r border-black font-mono text-zinc-700">
                    {formatBytes(conn.bytesTransferred)}
                  </td>
                  <td className="p-2.5 border-r border-black">
                    <Badge variant="purple" className="text-[10px]">
                      {conn.executionProfileId ?? "PROFILE-A"}
                    </Badge>
                  </td>
                  <td className="p-2.5 border-r border-black">
                    {getRiskBadge(conn.riskLevel, conn.status)}
                  </td>
                  <td className="p-2.5 text-right">
                    {conn.evidenceId ? (
                      <Link
                        href={`/evidence?id=${conn.investigationId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] font-black text-blue-700 hover:underline"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>{conn.evidenceId}</span>
                      </Link>
                    ) : (
                      <span className="text-zinc-400 text-[10px]">N/A</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
