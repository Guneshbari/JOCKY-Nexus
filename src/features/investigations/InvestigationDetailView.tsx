"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Play,
  Copy,
  Check,
  FileCode2,
  ShieldAlert,
  CheckCircle2,
  Pause,
  Terminal,
  Lock,
  Unlock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { StatusPill } from "@/components/status/StatusPill"
import { Investigation, InvestigationStatus, InvestigationSeverity } from "@/types/investigation"
import { useInvestigationStore } from "@/store/investigationStore"
import { useEndpointStore } from "@/store/endpointStore"
import { formatDate } from "@/lib/formatters"
import { generateJockyCommand } from "@/lib/jockyGenerator"

interface InvestigationDetailViewProps {
  investigation: Investigation
}

type ActiveTab = "OVERVIEW" | "JOCKY_DSL" | "ENDPOINTS" | "PIPELINE" | "FINDINGS"

export function InvestigationDetailView({ investigation }: InvestigationDetailViewProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ActiveTab>("OVERVIEW")
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedHash, setCopiedHash] = useState(false)

  const updateInvestigationStatus = useInvestigationStore((state) => state.setInvestigationStatus)
  const duplicateInvestigation = useInvestigationStore((state) => state.duplicateInvestigation)
  const launchAdaptiveAnalysis = useInvestigationStore((state) => state.launchAdaptiveAnalysis)

  const allEndpoints = useEndpointStore((state) => state.endpoints)
  const toggleIsolation = useEndpointStore((state) => state.toggleIsolation)

  // Resolve target endpoints
  const targetEndpoints = allEndpoints.filter((ep) =>
    investigation.targetEndpointIds.includes(ep.id)
  )

  const rawJockyCommand =
    investigation.jockySpec?.rawCommand ??
    generateJockyCommand({
      name: investigation.title,
      caseName: investigation.caseName ?? investigation.id,
      intent: investigation.intent,
      description: investigation.description,
      priority: investigation.severity,
      category: investigation.category ?? "CUSTOM FORENSIC QUERY",
      evidenceRequirements: investigation.evidenceRequirements ?? [
        "Process activity",
        "Network connections",
      ],
      targetEndpoints: investigation.targetEndpointIds,
      constraints: investigation.constraints ?? {
        volatileEvidencePriority: true,
        minimalEndpointImpact: true,
        evidenceIntegrityRequired: true,
        networkCollectionEnabled: true,
        memoryAnalysisRequired: true,
        restrictedEndpointHandling: "ALLOW_AGENT_TUNNEL",
        maxInvestigationDuration: "30m",
        collectionPriority: "BALANCED",
      },
      adaptiveProfile: investigation.adaptiveProfile ?? "PROFILE-A (VOLATILE TRIAGE)",
    })

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rawJockyCommand)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopyHash = () => {
    navigator.clipboard.writeText(investigation.provenanceRootHash)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const handleLaunch = () => {
    launchAdaptiveAnalysis(investigation.id)
    router.push(`/live-investigation?id=${investigation.id}`)
  }

  const handleTogglePause = () => {
    const nextStatus: InvestigationStatus =
      investigation.status === "IN_PROGRESS" ? "PAUSED" : "IN_PROGRESS"
    updateInvestigationStatus(investigation.id, nextStatus)
  }

  const handleDuplicate = () => {
    const duplicated = duplicateInvestigation(investigation.id)
    router.push(`/investigations/${duplicated.id}`)
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
      {/* Top Navigation & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/investigations">
          <Button variant="outline" size="sm" className="gap-2 text-xs font-bold">
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO CAMPAIGNS</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <StatusPill
            label={`CAMPAIGN ${investigation.id}`}
            status={investigation.status === "COMPLETED" ? "verified" : "warning"}
          />
        </div>
      </div>

      {/* Main Campaign Header Banner */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_#000] space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5 border border-black">
                {investigation.id}
              </span>
              <Badge variant={getSeverityBadgeVariant(investigation.severity)}>
                {investigation.severity}
              </Badge>
              <Badge variant={getStatusBadgeVariant(investigation.status)}>
                {investigation.status}
              </Badge>
              {investigation.category && (
                <span className="font-mono text-[11px] font-black uppercase bg-amber-200 border border-black px-2 py-0.5">
                  {investigation.category}
                </span>
              )}
              {investigation.caseName && (
                <span className="font-mono text-xs font-black text-zinc-700 bg-zinc-100 border border-black px-2 py-0.5">
                  {investigation.caseName}
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black">
              {investigation.title}
            </h1>

            <p className="text-xs font-bold text-zinc-600 max-w-3xl">
              {investigation.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {investigation.status !== "COMPLETED" && (
              <Button
                variant="cyber"
                size="sm"
                onClick={handleLaunch}
                className="gap-1.5 text-xs font-black"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>LAUNCH ADAPTIVE EXECUTION</span>
              </Button>
            )}

            {investigation.status === "IN_PROGRESS" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePause}
                className="gap-1.5 text-xs font-bold"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE</span>
              </Button>
            )}

            {investigation.status === "PAUSED" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleTogglePause}
                className="gap-1.5 text-xs font-bold"
              >
                <Play className="w-3.5 h-3.5" />
                <span>RESUME</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              className="gap-1.5 text-xs font-bold"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>DUPLICATE</span>
            </Button>
          </div>
        </div>

        {/* Cryptographic Hash Bar */}
        <div className="p-3 border-2 border-black bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-black text-zinc-500 uppercase text-[10px]">
              MERKLE PROVENANCE ROOT HASH:
            </span>
            <span className="font-mono text-black font-bold break-all">
              {investigation.provenanceRootHash}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyHash}
            className="flex items-center gap-1 text-[11px] font-bold text-zinc-700 hover:text-black shrink-0 px-2 py-1 border border-black bg-white hover:bg-zinc-100"
          >
            {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copiedHash ? "COPIED" : "COPY HASH"}</span>
          </button>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1">
          <div className="p-2.5 border-2 border-black bg-amber-50">
            <span className="text-[10px] font-black uppercase text-zinc-500 block">TARGET HOSTS</span>
            <span className="text-lg font-black text-black">{investigation.targetEndpointIds.length}</span>
          </div>

          <div className="p-2.5 border-2 border-black bg-amber-50">
            <span className="text-[10px] font-black uppercase text-zinc-500 block">ARTIFACT COUNT</span>
            <span className="text-lg font-black text-black">{investigation.evidenceCount}</span>
          </div>

          <div className="p-2.5 border-2 border-black bg-amber-50">
            <span className="text-[10px] font-black uppercase text-zinc-500 block">PIPELINE STAGES</span>
            <span className="text-lg font-black text-black">{investigation.steps.length}</span>
          </div>

          <div className="p-2.5 border-2 border-black bg-amber-50">
            <span className="text-[10px] font-black uppercase text-zinc-500 block">PROGRESS</span>
            <span className="text-lg font-black text-black">{investigation.progressPercentage}%</span>
          </div>

          <div className="p-2.5 border-2 border-black bg-amber-50 col-span-2 md:col-span-1">
            <span className="text-[10px] font-black uppercase text-zinc-500 block">INITIATOR</span>
            <span className="text-xs font-black text-black truncate block">{investigation.initiatedBy}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b-3 border-black overflow-x-auto pb-1 min-w-0 max-w-full">
        {(
          [
            { id: "OVERVIEW", label: "OVERVIEW & INTENT" },
            { id: "JOCKY_DSL", label: "JOCKY DSL & IR" },
            { id: "ENDPOINTS", label: `TARGET HOSTS (${investigation.targetEndpointIds.length})` },
            { id: "PIPELINE", label: `PIPELINE (${investigation.steps.length})` },
            { id: "FINDINGS", label: `FINDINGS (${investigation.findings.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-black text-xs uppercase border-t-2 border-x-2 border-black transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-amber-300 text-black shadow-[2px_-2px_0px_#000] translate-y-0.5"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content 1: OVERVIEW */}
      {activeTab === "OVERVIEW" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Forensic Intent Specification */}
            <Card className="border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
              <CardHeader className="bg-zinc-100 border-b-2 border-black py-3">
                <CardTitle className="text-sm font-black uppercase text-black">
                  Forensic Intent Specification
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs font-bold">
                <div className="p-3 border-2 border-black bg-zinc-50">
                  <span className="text-[10px] font-black uppercase text-zinc-500 block mb-1">
                    PRIMARY INTENT
                  </span>
                  <p className="text-black font-mono leading-relaxed text-sm">
                    &quot;{investigation.intent}&quot;
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 border-2 border-black bg-white">
                    <span className="text-[10px] font-black text-zinc-500 block uppercase">
                      Category
                    </span>
                    <span className="text-black font-black">
                      {investigation.category ?? "CUSTOM FORENSIC QUERY"}
                    </span>
                  </div>

                  <div className="p-3 border-2 border-black bg-white">
                    <span className="text-[10px] font-black text-zinc-500 block uppercase">
                      Adaptive Profile
                    </span>
                    <span className="text-black font-black">
                      {investigation.adaptiveProfile ?? "PROFILE-A (VOLATILE TRIAGE)"}
                    </span>
                  </div>

                  <div className="p-3 border-2 border-black bg-white">
                    <span className="text-[10px] font-black text-zinc-500 block uppercase">
                      Created Timestamp
                    </span>
                    <span className="text-black font-mono">
                      {formatDate(investigation.createdAt)}
                    </span>
                  </div>

                  <div className="p-3 border-2 border-black bg-white">
                    <span className="text-[10px] font-black text-zinc-500 block uppercase">
                      Last Updated
                    </span>
                    <span className="text-black font-mono">
                      {formatDate(investigation.updatedAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evidence Requirements */}
            <Card className="border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
              <CardHeader className="bg-zinc-100 border-b-2 border-black py-3">
                <CardTitle className="text-sm font-black uppercase text-black">
                  Evidence Acquisition Requirements ({investigation.evidenceRequirements?.length ?? 4})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
                  {(
                    investigation.evidenceRequirements ?? [
                      "Process activity",
                      "Network connections",
                      "Authentication events",
                      "Memory indicators",
                    ]
                  ).map((req, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 border-2 border-black bg-zinc-50 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-black font-mono">{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Execution Constraints & Safety */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
              <CardHeader className="bg-amber-100 border-b-2 border-black py-3">
                <CardTitle className="text-sm font-black uppercase text-black">
                  Safety & Execution Constraints
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs font-bold">
                <div className="p-2 border border-black bg-zinc-50 flex items-center justify-between">
                  <span className="text-zinc-600">Volatile Priority:</span>
                  <Badge variant={investigation.constraints?.volatileEvidencePriority !== false ? "success" : "neutral"}>
                    {investigation.constraints?.volatileEvidencePriority !== false ? "ENABLED" : "DISABLED"}
                  </Badge>
                </div>

                <div className="p-2 border border-black bg-zinc-50 flex items-center justify-between">
                  <span className="text-zinc-600">Minimal Impact:</span>
                  <Badge variant={investigation.constraints?.minimalEndpointImpact !== false ? "success" : "neutral"}>
                    {investigation.constraints?.minimalEndpointImpact !== false ? "<5% CPU" : "STANDARD"}
                  </Badge>
                </div>

                <div className="p-2 border border-black bg-zinc-50 flex items-center justify-between">
                  <span className="text-zinc-600">Network PCAP:</span>
                  <Badge variant={investigation.constraints?.networkCollectionEnabled !== false ? "cyber" : "neutral"}>
                    {investigation.constraints?.networkCollectionEnabled !== false ? "CAPTURING" : "OFF"}
                  </Badge>
                </div>

                <div className="p-2 border border-black bg-zinc-50 flex items-center justify-between">
                  <span className="text-zinc-600">Max Duration:</span>
                  <span className="font-mono text-black font-black">
                    {investigation.constraints?.maxInvestigationDuration ?? "30m"}
                  </span>
                </div>

                <div className="p-2 border border-black bg-zinc-50 flex items-center justify-between">
                  <span className="text-zinc-600">Quarantine Handling:</span>
                  <span className="font-mono text-[10px] text-black font-black">
                    {investigation.constraints?.restrictedEndpointHandling ?? "ALLOW_AGENT_TUNNEL"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Action Prompt */}
            <div className="p-4 border-3 border-black bg-black text-amber-300 space-y-3 shadow-[4px_4px_0px_#000]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="font-black text-xs uppercase">Adaptive Engine Status</span>
              </div>
              <p className="text-[11px] font-bold text-zinc-300 leading-relaxed">
                Platform-independent IR is compiled and ready for runtime distribution across targeted Windows, Linux, and macOS hosts.
              </p>
              <button
                type="button"
                onClick={handleLaunch}
                className="w-full py-2.5 px-4 border-2 border-black bg-amber-400 text-black font-black uppercase text-xs hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>EXECUTE CAMPAIGN NOW</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: JOCKY DSL & IR */}
      {activeTab === "JOCKY_DSL" && (
        <div className="space-y-6">
          {/* DSL Command Block */}
          <div className="border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
            <div className="p-3 bg-zinc-900 text-white border-b-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="font-black text-xs uppercase tracking-wide">
                  JOCKY FORENSIC COMMAND SPECIFICATION (.JOCKY)
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-black font-black text-xs hover:bg-amber-300 active:scale-95 transition-all border border-black"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "COPIED" : "COPY DSL"}</span>
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed selection:bg-amber-400 selection:text-black">
              <code>{rawJockyCommand}</code>
            </pre>
          </div>

          {/* Platform-Independent IR Preview */}
          <div className="border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
            <div className="p-3 bg-zinc-100 border-b-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-black" />
                <span className="font-black text-xs uppercase text-black">
                  COMPILED JOCKY INTERMEDIATE REPRESENTATION (IR AST)
                </span>
              </div>
              <Badge variant="cyber">PLATFORM INDEPENDENT</Badge>
            </div>
            <div className="p-4 bg-zinc-50 overflow-x-auto">
              <pre className="font-mono text-xs text-zinc-900 leading-relaxed">
                <code>
                  {JSON.stringify(
                    investigation.jockyIR ?? {
                      ir_version: "2.0-SIM",
                      campaign_id: investigation.id,
                      case_name: investigation.caseName ?? investigation.id,
                      schema_version: "jocky.ir.v2",
                      execution_scope: {
                        targets: investigation.targetEndpointIds,
                        profile: investigation.adaptiveProfile ?? "PROFILE-A (VOLATILE TRIAGE)",
                        constraints: investigation.constraints ?? {
                          volatile_first: true,
                          max_duration: "30m",
                          network_capture: true,
                        },
                      },
                      plan_graph: (investigation.steps || []).map((s) => ({
                        node_id: s.id,
                        order: s.order,
                        action: s.actionType,
                        description: s.title,
                        status: s.status,
                      })),
                      provenance: {
                        root_hash: investigation.provenanceRootHash,
                        integrity_guarantee: "SHA256_HASH_CHAIN",
                      },
                    },
                    null,
                    2
                  )}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: TARGET ENDPOINTS */}
      {activeTab === "ENDPOINTS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-zinc-600">
              Assigned Host Nodes ({targetEndpoints.length})
            </span>
            <span className="text-xs font-bold text-zinc-500">
              Adaptive translations generated per OS kernel architecture
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targetEndpoints.map((ep) => (
              <div
                key={ep.id}
                className="p-4 border-3 border-black bg-white shadow-[4px_4px_0px_#000] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5">
                      {ep.id}
                    </span>
                    <span className="font-mono text-sm font-black text-black">
                      {ep.hostname}
                    </span>
                  </div>
                  <Badge variant={ep.isolationStatus === "ISOLATED" ? "danger" : "neutral"}>
                    {ep.isolationStatus}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <div className="p-2 border border-black bg-zinc-50">
                    <span className="text-[10px] text-zinc-500 block uppercase">OS Platform</span>
                    <span className="text-black uppercase">{ep.platform}</span>
                  </div>

                  <div className="p-2 border border-black bg-zinc-50">
                    <span className="text-[10px] text-zinc-500 block uppercase">IP Address</span>
                    <span className="text-black font-mono">{ep.ipAddress}</span>
                  </div>

                  <div className="p-2 border border-black bg-zinc-50">
                    <span className="text-[10px] text-zinc-500 block uppercase">Agent Status</span>
                    <span className="text-black">{ep.agentStatus}</span>
                  </div>

                  <div className="p-2 border border-black bg-zinc-50">
                    <span className="text-[10px] text-zinc-500 block uppercase">Readiness</span>
                    <span className="text-emerald-600 font-mono">{ep.forensicReadinessScore}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-200">
                  <span className="text-[10px] font-bold text-zinc-500 truncate">
                    {ep.osVersion}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleIsolation(ep.id)}
                    className="flex items-center gap-1 text-[11px] font-black px-2 py-1 border border-black bg-zinc-100 hover:bg-zinc-200"
                  >
                    {ep.isolationStatus === "ISOLATED" ? (
                      <>
                        <Unlock className="w-3 h-3 text-emerald-600" />
                        <span>RECONNECT</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-rose-600" />
                        <span>ISOLATE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 4: PIPELINE */}
      {activeTab === "PIPELINE" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-zinc-600">
              Adaptive Execution Pipeline Stages ({investigation.steps.length})
            </span>
            <Badge variant="cyber">{investigation.progressPercentage}% COMPLETED</Badge>
          </div>

          <div className="space-y-3">
            {investigation.steps.map((step) => (
              <div
                key={step.id}
                className="p-4 border-3 border-black bg-white shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="w-8 h-8 border-2 border-black bg-black text-amber-300 flex items-center justify-center font-black text-xs shrink-0">
                    {step.order}
                  </span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-black">{step.title}</span>
                      <span className="font-mono text-[10px] font-black bg-zinc-200 px-2 py-0.5 border border-black">
                        {step.actionType}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-zinc-600">{step.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 sm:justify-end">
                  {step.completedAt && (
                    <span className="text-[11px] font-mono text-zinc-500 font-bold">
                      {formatDate(step.completedAt)}
                    </span>
                  )}
                  <Badge
                    variant={
                      step.status === "COMPLETED"
                        ? "success"
                        : step.status === "RUNNING"
                        ? "cyber"
                        : "neutral"
                    }
                  >
                    {step.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 5: FINDINGS */}
      {activeTab === "FINDINGS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-zinc-600">
              Corroborated Forensic Findings ({investigation.findings.length})
            </span>
          </div>

          {investigation.findings.length === 0 ? (
            <div className="p-8 border-3 border-black bg-white text-center shadow-[4px_4px_0px_#000] space-y-2">
              <ShieldAlert className="w-8 h-8 text-zinc-400 mx-auto" />
              <div className="text-sm font-black uppercase text-black">
                No Findings Recorded Yet
              </div>
              <p className="text-xs font-bold text-zinc-600">
                Findings are generated automatically as the adaptive execution pipeline collects artifacts.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {investigation.findings.map((f) => (
                <div
                  key={f.id}
                  className="p-4 border-3 border-black bg-white shadow-[4px_4px_0px_#000] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black bg-black text-amber-300 px-2 py-0.5">
                        {f.id}
                      </span>
                      <Badge variant={getSeverityBadgeVariant(f.severity)}>
                        {f.severity}
                      </Badge>
                      {f.mitreTechniqueId && (
                        <span className="font-mono text-[10px] font-black bg-amber-200 border border-black px-2 py-0.5">
                          {f.mitreTechniqueId}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-zinc-500">
                      Confidence: {(f.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="text-sm font-black text-black">{f.title}</div>
                  <p className="text-xs font-bold text-zinc-700">{f.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-[11px] font-bold text-zinc-500 font-mono">
                    <span>Host: {f.endpointId}</span>
                    <span>Detected: {formatDate(f.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
