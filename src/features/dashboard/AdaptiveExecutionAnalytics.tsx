"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Cpu,
  ArrowRight,
  Shield,
  Layers,
  Terminal,
  Activity,
  Zap,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useIsMounted } from "@/hooks/useIsMounted"
import { useInvestigationStore } from "@/store/investigationStore"

interface ProfileSpec {
  id: "PROFILE-A" | "PROFILE-B" | "PROFILE-C" | "PROFILE-D"
  name: string
  platform: string
  targetNode: string
  color: string
  accentColor: string
  fillHex: string
  impact: "MINIMAL" | "LOW" | "STANDARD"
  collectors: string[]
  evidenceOutput: string[]
  rationale: string
}

const PROFILES: Record<string, ProfileSpec> = {
  "PROFILE-A": {
    id: "PROFILE-A",
    name: "VOLATILE TRIAGE",
    platform: "WINDOWS SERVER",
    targetNode: "DC-PROD-PRIMARY",
    color: "bg-amber-100 border-amber-500 text-amber-900",
    accentColor: "bg-amber-400",
    fillHex: "#F59E0B",
    impact: "MINIMAL",
    collectors: ["nexus-agent mem-acquire", "process-handles-enum", "tcp-socket-snapshot"],
    evidenceOutput: ["EVID-2026-001 (lsass.exe handle dump)", "EVID-2026-005 (Memory Volatile State)"],
    rationale: "Rapid acquisition preserving volatile process handles and ephemeral network state prior to potential process kill.",
  },
  "PROFILE-B": {
    id: "PROFILE-B",
    name: "CONTAINMENT & FILESYSTEM",
    platform: "WINDOWS WORKSTATION (ISOLATED)",
    targetNode: "FIN-WS-44",
    color: "bg-rose-100 border-rose-500 text-rose-900",
    accentColor: "bg-rose-400",
    fillHex: "#F43F5E",
    impact: "LOW",
    collectors: ["ntfs-mft-parser", "registry-runkeys-audit", "shadow-copy-carver"],
    evidenceOutput: ["EVID-2026-002 ($MFT Master File Table)", "EVID-2026-006 (HKLM RunPersistence Keys)"],
    rationale: "Deep NTFS metadata recovery and scheduled task extraction on isolated endpoint with lateral movement containment.",
  },
  "PROFILE-C": {
    id: "PROFILE-C",
    name: "LINUX SYSTEM & eBPF AUDIT",
    platform: "UBUNTU LINUX (KERNEL 6.8)",
    targetNode: "CORE-APP-NODE-09",
    color: "bg-cyan-100 border-cyan-500 text-cyan-900",
    accentColor: "bg-cyan-400",
    fillHex: "#06B6D4",
    impact: "LOW",
    collectors: ["ebpf-trace-execve", "auditd-syscall-stream", "procfs-fd-mapper"],
    evidenceOutput: ["EVID-2026-003 (eBPF Socket Provenance)", "EVID-2026-007 (Auditd Syscall Stream)"],
    rationale: "Kernel-level execution tracing and POSIX socket provenance without installing invasive kernel modules.",
  },
  "PROFILE-D": {
    id: "PROFILE-D",
    name: "NETWORK FORENSIC TRIAGE",
    platform: "DEBIAN PROXY GATEWAY",
    targetNode: "SEC-EGRESS-PROXY-01",
    color: "bg-purple-100 border-purple-500 text-purple-900",
    accentColor: "bg-purple-400",
    fillHex: "#A855F7",
    impact: "MINIMAL",
    collectors: ["pcap-ringbuffer-stream", "dns-query-parser", "tls-sni-analyzer"],
    evidenceOutput: ["EVID-2026-004 (Edge PCAP C2 Traffic)", "EVID-2026-008 (DNS Tunnel Ingress Log)"],
    rationale: "Real-time edge proxy packet buffer interrogation capturing Beacon C2 egress flows and TLS SNI headers.",
  },
}

const PROFILE_DISTRIBUTION_DATA = [
  { name: "PROFILE-A (Volatile)", count: 2, fill: "#F59E0B", platform: "Win Server" },
  { name: "PROFILE-B (Containment)", count: 2, fill: "#F43F5E", platform: "Win Workstation" },
  { name: "PROFILE-C (Linux Audit)", count: 2, fill: "#06B6D4", platform: "Ubuntu 24" },
  { name: "PROFILE-D (Net Forensic)", count: 2, fill: "#A855F7", platform: "Debian Proxy" },
]

export function AdaptiveExecutionAnalytics() {
  const mounted = useIsMounted()
  const [selectedProfileId, setSelectedProfileId] = useState<string>("PROFILE-A")
  const activeInvestigation = useInvestigationStore((state) => state.activeInvestigation)
  const currentInvId = activeInvestigation?.id ?? "inv-2026-001"

  const activeSpec = PROFILES[selectedProfileId] || PROFILES["PROFILE-A"]

  return (
    <Card className="border-4 border-black shadow-[6px_6px_0px_#000] font-mono overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-cyan-300 border-b-4 border-black p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-black text-cyan-300 border border-black shadow-[2px_2px_0px_#000]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-black uppercase tracking-tight text-black">
                ADAPTIVE EXECUTION INTELLIGENCE (CORE USP)
              </CardTitle>
              <Badge variant="dark" className="text-[10px]">
                ZERO AGENT RECOMPILATION
              </Badge>
            </div>
            <p className="text-[11px] font-bold text-zinc-800">
              One Forensic Intent dynamically dispatches tailored execution profiles per endpoint architecture
            </p>
          </div>
        </div>

        <Link href={`/live-investigation?id=${currentInvId}`}>
          <Button variant="default" size="sm" className="font-mono text-xs font-black uppercase shadow-[2px_2px_0px_#000]">
            <span>OPEN LIVE WORKFLOW</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-5">
        {/* Core USP Paradigm Banner */}
        <div className="p-3 border-2 border-black bg-zinc-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span className="text-xs font-black tracking-wide uppercase text-amber-300">
              CORE PARADIGM:
            </span>
            <span className="text-xs font-bold text-zinc-200">
              HUMAN FORENSIC INTENT → JOCKY IR → 4 ADAPTIVE PROFILES → UNIFIED EVIDENCE CHAIN
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] shrink-0 font-bold">
            <span className="text-emerald-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> 100% Policy Compliant
            </span>
            <span className="text-cyan-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Heuristic Synthesizer Active
            </span>
          </div>
        </div>

        {/* 2-Column Analytics Grid: Left: Recharts Profile Distribution & Heuristics; Right: Interactive Profile Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Recharts Chart & KPI Tiles (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* 4 Execution KPI Metric Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 border-2 border-black bg-zinc-50 shadow-[2px_2px_0px_#000]">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">HEURISTIC MATCH</div>
                <div className="text-lg font-black text-emerald-600">100%</div>
                <div className="text-[9px] text-zinc-600 font-bold">4/4 Nodes Profiled</div>
              </div>

              <div className="p-2.5 border-2 border-black bg-zinc-50 shadow-[2px_2px_0px_#000]">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">SYNTHESIS TIME</div>
                <div className="text-lg font-black text-black">420 ms</div>
                <div className="text-[9px] text-zinc-600 font-bold">JOCKY IR Dispatch</div>
              </div>

              <div className="p-2.5 border-2 border-black bg-zinc-50 shadow-[2px_2px_0px_#000]">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">PROFILES ACTIVE</div>
                <div className="text-lg font-black text-cyan-600">4 / 4</div>
                <div className="text-[9px] text-zinc-600 font-bold">A, B, C & D Online</div>
              </div>

              <div className="p-2.5 border-2 border-black bg-zinc-50 shadow-[2px_2px_0px_#000]">
                <div className="text-[10px] font-bold text-zinc-500 uppercase">SAFETY BREACHES</div>
                <div className="text-lg font-black text-emerald-600">0</div>
                <div className="text-[9px] text-zinc-600 font-bold">Read-Only Safe</div>
              </div>
            </div>

            {/* Profile Distribution Bar Chart */}
            <div className="border-2 border-black p-3 bg-white shadow-[3px_3px_0px_#000] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-black">
                  PROFILE ALLOCATION ACROSS ACTIVE CASES
                </span>
                <span className="text-[10px] font-bold text-zinc-500">8 Simulated Targets</span>
              </div>

              <div className="h-44 w-full">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={PROFILE_DISTRIBUTION_DATA}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 10, fill: "#000" }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={140}
                        tick={{ fontSize: 10, fill: "#000", fontWeight: "bold" }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="border-2 border-black bg-white p-2 text-xs font-mono shadow-[2px_2px_0px_#000]">
                                <div className="font-black">{data.name}</div>
                                <div className="text-zinc-600">Platform: {data.platform}</div>
                                <div className="text-emerald-600 font-bold">Allocated Nodes: {data.count}</div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 0, 0, 0]}>
                        {PROFILE_DISTRIBUTION_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} stroke="#000" strokeWidth={2} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-500 font-bold">
                    Initializing chart telemetry...
                  </div>
                )}
              </div>
            </div>

            {/* Endpoint Dispatch Routing Visualizer */}
            <div className="border-2 border-black p-3 bg-zinc-50 shadow-[2px_2px_0px_#000] space-y-2">
              <div className="text-xs font-black uppercase text-black flex items-center justify-between">
                <span>SIMULATED ADAPTIVE ROUTING RESOLVER</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 border border-emerald-400">
                  AUTO-RESOLVED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 border border-black bg-white space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-black">DC-PROD-PRIMARY</span>
                    <Badge variant="warning" className="text-[9px]">PROFILE-A</Badge>
                  </div>
                  <div className="text-[10px] text-zinc-600">Windows Server 2022 • Tier-0 DC</div>
                </div>

                <div className="p-2 border border-black bg-white space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-black">FIN-WS-44</span>
                    <Badge variant="danger" className="text-[9px]">PROFILE-B</Badge>
                  </div>
                  <div className="text-[10px] text-zinc-600">Windows 11 Enterprise • ISOLATED</div>
                </div>

                <div className="p-2 border border-black bg-white space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-black">CORE-APP-NODE-09</span>
                    <Badge variant="cyber" className="text-[9px]">PROFILE-C</Badge>
                  </div>
                  <div className="text-[10px] text-zinc-600">Ubuntu 24.04 LTS • eBPF Active</div>
                </div>

                <div className="p-2 border border-black bg-white space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-black">SEC-EGRESS-PROXY-01</span>
                    <Badge variant="purple" className="text-[9px]">PROFILE-D</Badge>
                  </div>
                  <div className="text-[10px] text-zinc-600">Debian 12 • Egress DMZ Proxy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Profile Inspector (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="text-xs font-black uppercase text-black flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-black" />
              <span>INSPECT ADAPTIVE EXECUTION PROFILE</span>
            </div>

            {/* Profile Tab Switcher */}
            <div className="grid grid-cols-4 gap-1">
              {(["PROFILE-A", "PROFILE-B", "PROFILE-C", "PROFILE-D"] as const).map((id) => {
                const isSelected = selectedProfileId === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedProfileId(id)}
                    className={`py-1.5 px-1 text-center font-mono text-[11px] font-black border-2 border-black transition-all ${
                      isSelected
                        ? `${PROFILES[id].accentColor} text-black shadow-[2px_2px_0px_#000] -translate-y-0.5`
                        : "bg-white text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {id}
                  </button>
                )
              })}
            </div>

            {/* Selected Profile Detail Box */}
            <div className={`p-4 border-3 border-black ${activeSpec.color} shadow-[4px_4px_0px_#000] flex-1 flex flex-col justify-between space-y-3`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-600 block">
                      PROFILE ID: {activeSpec.id}
                    </span>
                    <h4 className="text-sm font-black uppercase text-black">{activeSpec.name}</h4>
                  </div>
                  <Badge variant="dark" className="text-[10px]">
                    IMPACT: {activeSpec.impact}
                  </Badge>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-700 block mb-0.5">
                    Target Node & Platform:
                  </span>
                  <div className="text-xs font-bold text-black bg-white/70 p-1.5 border border-black">
                    {activeSpec.targetNode} ({activeSpec.platform})
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-700 block mb-0.5">
                    Adaptive Decision Rationale:
                  </span>
                  <p className="text-[11px] font-medium text-black leading-tight bg-white/60 p-2 border border-black">
                    {activeSpec.rationale}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-700 block mb-1">
                    Specialized Collectors Engaged:
                  </span>
                  <div className="space-y-1">
                    {activeSpec.collectors.map((c) => (
                      <div
                        key={c}
                        className="text-[10px] font-mono font-bold bg-black text-amber-300 px-2 py-0.5 border border-black flex items-center gap-1.5"
                      >
                        <span className="text-emerald-400">▶</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-700 block mb-1">
                    Verifiable Evidence Yield:
                  </span>
                  <div className="space-y-1">
                    {activeSpec.evidenceOutput.map((e) => (
                      <div
                        key={e}
                        className="text-[10px] font-bold bg-white text-black px-2 py-0.5 border border-black flex items-center gap-1"
                      >
                        <Layers className="w-3 h-3 text-cyan-600" />
                        <span>{e}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t-2 border-black flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-800">
                  Ready for collection dispatch
                </span>
                <Link
                  href={`/live-investigation?id=${currentInvId}`}
                  className="text-xs font-black underline uppercase text-black hover:text-amber-800 flex items-center gap-1"
                >
                  <span>Open Live Graph</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
