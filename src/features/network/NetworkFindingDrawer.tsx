"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  X,
  Copy,
  Check,
  Server,
  FileCheck2,
  Target,
  GitBranch,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { NetworkConnection } from "@/types/network"
import { formatBytes, formatDate } from "@/lib/formatters"

interface NetworkFindingDrawerProps {
  connection: NetworkConnection | null
  onClose: () => void
}

export function NetworkFindingDrawer({
  connection,
  onClose,
}: NetworkFindingDrawerProps) {
  const [copied, setCopied] = useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!connection) return null

  const handleCopyIp = () => {
    navigator.clipboard.writeText(connection.targetIp)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isFlagged = connection.status === "FLAGGED"

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Network Forensic Finding Details"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs font-mono"
      onClick={onClose}
    >
      <div
        className="w-full max-w-full sm:max-w-xl h-full bg-white border-l-0 sm:border-l-4 border-black p-4 sm:p-5 shadow-none sm:shadow-[-8px_0px_0px_#000] overflow-y-auto space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-start justify-between pb-3 border-b-3 border-black">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5">
                NETWORK FORENSIC FINDING
              </span>
              <Badge variant={isFlagged ? "danger" : "success"} className="text-[10px]">
                {connection.status}
              </Badge>
            </div>
            <h2 className="text-xl font-black text-black break-all">
              {connection.id}
            </h2>
            <div className="text-xs text-zinc-600 font-bold">
              {`${connection.protocol} // ${connection.sourceEndpointHostname} → ${connection.targetHostname || connection.targetIp}`}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close detail drawer"
            className="p-1 border-2 border-black bg-zinc-100 hover:bg-zinc-200 cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Section 1: Endpoint & Destination Topology */}
        <div className="p-3 border-2 border-black bg-zinc-50 space-y-2">
          <div className="text-xs font-black uppercase text-zinc-700">
            Source & Destination Pairing
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Source */}
            <div className="p-2 bg-white border border-black space-y-0.5">
              <span className="text-[10px] text-zinc-500 font-bold block uppercase">
                Source Host
              </span>
              <span className="font-black text-black block truncate">
                {connection.sourceEndpointHostname}
              </span>
              <span className="text-[11px] text-zinc-600 font-mono block">
                {connection.sourceIp}:{connection.sourcePort}
              </span>
            </div>

            {/* Destination */}
            <div className="p-2 bg-white border border-black space-y-0.5">
              <span className="text-[10px] text-zinc-500 font-bold block uppercase">
                Target Destination
              </span>
              <div className="flex items-center justify-between">
                <span className="font-black text-black truncate">
                  {connection.targetHostname || connection.targetIp}
                </span>
                <button
                  type="button"
                  onClick={handleCopyIp}
                  className="p-1 hover:bg-zinc-100 cursor-pointer ml-1"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-zinc-500" />
                  )}
                </button>
              </div>
              <span className="text-[11px] text-zinc-600 font-mono block">
                {connection.targetIp}:{connection.targetPort} {connection.country ? `(${connection.country})` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Protocol & Volume Telemetry */}
        <div className="p-3 border-2 border-black bg-zinc-50 space-y-2">
          <div className="text-xs font-black uppercase text-zinc-700">
            Transport & Protocol Telemetry
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2 bg-white border border-black">
              <span className="text-[9px] text-zinc-500 font-bold block uppercase">
                Protocol
              </span>
              <span className="font-black text-black">{connection.protocol}</span>
            </div>

            <div className="p-2 bg-white border border-black">
              <span className="text-[9px] text-zinc-500 font-bold block uppercase">
                Volume Transferred
              </span>
              <span className="font-black text-black">
                {formatBytes(connection.bytesTransferred)}
              </span>
            </div>

            <div className="p-2 bg-white border border-black">
              <span className="text-[9px] text-zinc-500 font-bold block uppercase">
                Packets
              </span>
              <span className="font-black text-black">
                {connection.packetsTransferred}
              </span>
            </div>

            <div className="p-2 bg-white border border-black">
              <span className="text-[9px] text-zinc-500 font-bold block uppercase">
                Threat Score
              </span>
              <span className={`font-black ${connection.threatScore > 75 ? "text-rose-600" : "text-emerald-600"}`}>
                {connection.threatScore} / 100
              </span>
            </div>

            <div className="p-2 bg-white border border-black">
              <span className="text-[9px] text-zinc-500 font-bold block uppercase">
                Lateral Hop
              </span>
              <span className="font-black text-black">
                {connection.isLateralMovement ? "CONFIRMED" : "NO"}
              </span>
            </div>

            <div className="p-2 bg-white border border-black">
              <span className="text-[9px] text-zinc-500 font-bold block uppercase">
                Adaptive Profile
              </span>
              <span className="font-black text-purple-700">
                {connection.executionProfileId ?? "PROFILE-A"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Timeline & Timestamps */}
        <div className="p-3 border-2 border-black bg-zinc-50 space-y-1 text-xs">
          <div className="text-xs font-black uppercase text-zinc-700 pb-1">
            Observed Session Timeline
          </div>
          <div className="flex justify-between text-zinc-700">
            <span>First Observed:</span>
            <span className="font-bold">{formatDate(connection.firstSeen)}</span>
          </div>
          <div className="flex justify-between text-zinc-700">
            <span>Last Observed:</span>
            <span className="font-bold">{formatDate(connection.lastSeen)}</span>
          </div>
        </div>

        {/* Section 4: Supporting Evidence & Cross Links */}
        <div className="p-3 border-2 border-black bg-blue-50 space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-blue-950 uppercase">
            <span>Linked Forensic Evidence Artifact</span>
            {connection.evidenceId && (
              <span className="bg-black text-white px-1.5 py-0.5 text-[10px]">
                {connection.evidenceId}
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-zinc-800">
            {connection.supportingEvidence ?? "Simulated raw network socket evidence capture."}
          </p>
        </div>

        {/* Section 5: MITRE ATT&CK Mapping */}
        {connection.mitreTechniques && connection.mitreTechniques.length > 0 && (
          <div className="p-3 border-2 border-black bg-amber-50 space-y-2">
            <div className="text-xs font-black text-amber-950 uppercase">
              Correlated MITRE ATT&CK Techniques
            </div>
            <div className="flex flex-wrap gap-1.5">
              {connection.mitreTechniques.map((tech) => (
                <Link
                  key={tech}
                  href={`/mitre?technique=${tech}`}
                  className="inline-flex items-center gap-1 text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black hover:bg-zinc-800"
                >
                  <Target className="w-3 h-3" />
                  <span>{tech}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div className="pt-2 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <Link
              href={`/evidence?id=${connection.investigationId}`}
              className="p-2 border-2 border-black bg-cyan-300 hover:bg-cyan-400 text-black font-black uppercase text-center flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000]"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Inspect Evidence Vault</span>
            </Link>

            <Link
              href={`/mitre?technique=${connection.mitreTechniques?.[0] ?? "T1071.001"}`}
              className="p-2 border-2 border-black bg-amber-400 hover:bg-amber-500 text-black font-black uppercase text-center flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000]"
            >
              <Target className="w-3.5 h-3.5" />
              <span>View MITRE Mapping</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <Link
              href={`/investigations/${connection.investigationId}`}
              className="p-2 border-2 border-black bg-white hover:bg-zinc-100 text-black font-black uppercase text-center flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000]"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>View Investigation</span>
            </Link>

            <Link
              href="/endpoints"
              className="p-2 border-2 border-black bg-white hover:bg-zinc-100 text-black font-black uppercase text-center flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000]"
            >
              <Server className="w-3.5 h-3.5" />
              <span>View Host Endpoints</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
