"use client"

import React, { useState, useMemo, useCallback } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  GitBranch,
  Info,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Investigation } from "@/types/investigation"
import { Endpoint } from "@/types/endpoint"
import {
  AdaptiveExecutionProfile,
  EndpointPosture,
  AdaptiveSimulationStage,
} from "@/types/execution"

interface AdaptiveExecutionGraphProps {
  investigation: Investigation
  endpoints: Endpoint[]
  profiles: Record<string, AdaptiveExecutionProfile>
  postures: Record<string, EndpointPosture>
  currentStage: AdaptiveSimulationStage
}

interface InspectedNodeData {
  title: string
  category: string
  details: Record<string, string | number | undefined>
  description: string
}

export function AdaptiveExecutionGraph({
  investigation,
  endpoints,
  profiles,
  postures,
  currentStage,
}: AdaptiveExecutionGraphProps) {
  const [inspectedNode, setInspectedNode] = useState<InspectedNodeData | null>(null)

  // Build nodes dynamically
  const initialNodes: Node[] = useMemo(() => {
    const list: Node[] = []

    // 1. Intent Node
    list.push({
      id: "node-intent",
      type: "default",
      position: { x: 30, y: 140 },
      data: {
        label: (
          <div className="p-1 font-mono text-left">
            <div className="text-[9px] font-black uppercase text-zinc-500">STAGE 01 // INTENT</div>
            <div className="text-xs font-black text-black truncate max-w-[150px]">
              {investigation.id}
            </div>
            <div className="text-[10px] text-zinc-700 font-bold truncate max-w-[150px]">
              {investigation.category}
            </div>
          </div>
        ),
        inspected: {
          title: `FORENSIC INTENT: ${investigation.id}`,
          category: "FORENSIC INTENT SPECIFICATION",
          details: {
            "Case ID": investigation.id,
            Title: investigation.title,
            Category: investigation.category,
            Priority: investigation.severity,
            Targets: investigation.targetEndpointIds.join(", "),
          },
          description: investigation.intent,
        },
      },
      style: {
        border: "3px solid #000",
        borderRadius: "0px",
        background: currentStage === 1 ? "#fbbf24" : "#ffffff",
        boxShadow: "3px 3px 0px #000",
        width: 170,
      },
    })

    // 2. JOCKY IR Node
    list.push({
      id: "node-ir",
      type: "default",
      position: { x: 250, y: 140 },
      data: {
        label: (
          <div className="p-1 font-mono text-left">
            <div className="text-[9px] font-black uppercase text-zinc-500">STAGE 02 // IR</div>
            <div className="text-xs font-black text-black">JOCKY IR (AST)</div>
            <div className="text-[10px] text-purple-900 font-bold">PLATFORM AGNOSTIC</div>
          </div>
        ),
        inspected: {
          title: "COMPILED JOCKY INTERMEDIATE REPRESENTATION",
          category: "INTERMEDIATE REPRESENTATION (IR)",
          details: {
            Schema: "v1.0.0-jocky-ir",
            "Plan Graph Nodes": investigation.steps.length,
            "Target Endpoints": endpoints.length,
            "Adaptive Routing": "ENABLED",
          },
          description:
            "Platform-independent execution plan compiled from human forensic intent, ready for multi-host adaptive translation.",
        },
      },
      style: {
        border: "3px solid #000",
        borderRadius: "0px",
        background: currentStage === 2 ? "#fbbf24" : "#f3e8ff",
        boxShadow: "3px 3px 0px #000",
        width: 170,
      },
    })

    // 3. Adaptive Planner Node
    list.push({
      id: "node-planner",
      type: "default",
      position: { x: 470, y: 140 },
      data: {
        label: (
          <div className="p-1 font-mono text-left">
            <div className="text-[9px] font-black uppercase text-amber-900">STAGE 05 // PLANNER</div>
            <div className="text-xs font-black text-black">ADAPTIVE ENGINE</div>
            <div className="text-[10px] text-zinc-700 font-bold">DETERMINISTIC ROUTING</div>
          </div>
        ),
        inspected: {
          title: "ADAPTIVE EXECUTION INTELLIGENCE PLANNER",
          category: "CORE ADAPTIVE ENGINE",
          details: {
            Engine: "Nexus-Adaptive-v2.4",
            Mode: "Deterministic Simulated Reasoning",
            Inputs: "Intent + IR + Endpoint Posture + Constraints",
            Output: "Host-Specific Execution Profiles",
          },
          description:
            "Evaluates OS kernel architecture, telemetry readiness, isolation state, and impact constraints to branch into optimal collection profiles.",
        },
      },
      style: {
        border: "3px solid #000",
        borderRadius: "0px",
        background: currentStage === 5 ? "#fbbf24" : "#fef3c7",
        boxShadow: "3px 3px 0px #000",
        width: 180,
      },
    })

    // 4. Branching for Endpoints
    const ySpacing = 95
    const startY = 140 - ((endpoints.length - 1) * ySpacing) / 2

    endpoints.forEach((ep, idx) => {
      const branchY = startY + idx * ySpacing
      const profile = profiles[ep.id]
      const posture = postures[ep.id]

      // Host Node
      list.push({
        id: `node-ep-${ep.id}`,
        type: "default",
        position: { x: 710, y: branchY },
        data: {
          label: (
            <div className="p-1 font-mono text-left">
              <div className="text-[9px] font-black uppercase text-zinc-500">STAGE 03 // HOST</div>
              <div className="text-[11px] font-black text-black truncate max-w-[130px]">
                {ep.hostname}
              </div>
              <div className="text-[9px] text-zinc-600 font-bold uppercase">
                {`${ep.platform} // ${ep.forensicReadinessScore}%`}
              </div>
            </div>
          ),
          inspected: {
            title: `TARGET ENDPOINT: ${ep.hostname}`,
            category: "ENDPOINT TELEMETRY PROFILE",
            details: {
              ID: ep.id,
              Platform: ep.platform.toUpperCase(),
              "OS Version": ep.osVersion,
              "IP Address": ep.ipAddress,
              "Readiness Score": `${ep.forensicReadinessScore}%`,
              Isolation: ep.isolationStatus,
              Posture: posture?.postureLevel ?? "STANDARD",
            },
            description: `Assigned host target evaluated for ${ep.platform} forensic telemetry collection and agent readiness.`,
          },
        },
        style: {
          border: "2px solid #000",
          borderRadius: "0px",
          background: currentStage === 3 ? "#fbbf24" : "#ffffff",
          boxShadow: "2px 2px 0px #000",
          width: 150,
        },
      })

      // Profile Node
      list.push({
        id: `node-prof-${ep.id}`,
        type: "default",
        position: { x: 920, y: branchY },
        data: {
          label: (
            <div className="p-1 font-mono text-left">
              <div className="text-[9px] font-black uppercase text-zinc-500">STAGE 06 // PROFILE</div>
              <div className="text-[11px] font-black text-black truncate max-w-[140px]">
                {profile ? profile.id : "PROFILING..."}
              </div>
              <div className="text-[9px] text-emerald-800 font-bold truncate max-w-[140px]">
                {profile ? profile.name : "Evaluating"}
              </div>
            </div>
          ),
          inspected: {
            title: `EXECUTION PROFILE: ${profile?.id ?? "EVALUATING"}`,
            category: "ADAPTIVE EXECUTION PROFILE",
            details: {
              Profile: profile?.id,
              Name: profile?.name,
              Platform: profile?.platform,
              "Impact Policy": profile?.impactPolicy,
              "Collectors Count": profile?.collectors.length,
              "Sequence Steps": profile?.collectionSequence.length,
            },
            description: `Tailored safe forensic execution profile bound to ${ep.hostname} with ${profile?.collectors.length ?? 0} specialized collectors.`,
          },
        },
        style: {
          border: "2px solid #000",
          borderRadius: "0px",
          background:
            currentStage === 6
              ? "#fbbf24"
              : profile?.id === "PROFILE-A"
              ? "#fef08a"
              : profile?.id === "PROFILE-B"
              ? "#e0e7ff"
              : profile?.id === "PROFILE-C"
              ? "#dcfce7"
              : "#fed7aa",
          boxShadow: "2px 2px 0px #000",
          width: 160,
        },
      })
    })

    // 5. Evidence Pipeline Node
    list.push({
      id: "node-evidence",
      type: "default",
      position: { x: 1140, y: 140 },
      data: {
        label: (
          <div className="p-1 font-mono text-left">
            <div className="text-[9px] font-black uppercase text-emerald-900">STAGE 07 // EVIDENCE</div>
            <div className="text-xs font-black text-black">EVIDENCE PIPELINE</div>
            <div className="text-[10px] text-emerald-800 font-bold">NVPL MERKLE SEAL</div>
          </div>
        ),
        inspected: {
          title: "EVIDENCE COLLECTION & PROVENANCE PIPELINE",
          category: "VERIFIABLE EVIDENCE LEDGER",
          details: {
            Integrity: "SHA-256 Merkle Block",
            Provenance: "Non-Volatile Provenance Ledger (NVPL)",
            "Target Nodes Ready": endpoints.length,
            Status: currentStage === 7 ? "COLLECTION_READY" : "AWAITING_PROFILES",
          },
          description:
            "Central evidence ingestion target preserving cryptographic chain-of-custody for all collected forensic artifacts.",
        },
      },
      style: {
        border: "3px solid #000",
        borderRadius: "0px",
        background: currentStage === 7 ? "#86efac" : "#dcfce7",
        boxShadow: "3px 3px 0px #000",
        width: 180,
      },
    })

    return list
  }, [investigation, endpoints, profiles, postures, currentStage])

  // Build edges dynamically
  const initialEdges: Edge[] = useMemo(() => {
    const list: Edge[] = []

    // Intent -> IR
    list.push({
      id: "e-intent-ir",
      source: "node-intent",
      target: "node-ir",
      animated: currentStage >= 2,
      style: { stroke: "#000", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#000" },
    })

    // IR -> Planner
    list.push({
      id: "e-ir-planner",
      source: "node-ir",
      target: "node-planner",
      animated: currentStage >= 5,
      style: { stroke: "#000", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#000" },
    })

    // Planner -> Each Endpoint Host
    endpoints.forEach((ep) => {
      list.push({
        id: `e-planner-ep-${ep.id}`,
        source: "node-planner",
        target: `node-ep-${ep.id}`,
        animated: currentStage >= 3,
        style: { stroke: "#000", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#000" },
      })

      // Endpoint Host -> Profile
      list.push({
        id: `e-ep-prof-${ep.id}`,
        source: `node-ep-${ep.id}`,
        target: `node-prof-${ep.id}`,
        animated: currentStage >= 6,
        style: { stroke: "#000", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#000" },
      })

      // Profile -> Evidence Pipeline
      list.push({
        id: `e-prof-ev-${ep.id}`,
        source: `node-prof-${ep.id}`,
        target: "node-evidence",
        animated: currentStage === 7,
        style: { stroke: "#000", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#000" },
      })
    })

    return list
  }, [endpoints, currentStage])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  // Node Click Inspector
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const inspected = (node.data as { inspected?: InspectedNodeData })?.inspected
    if (inspected) {
      setInspectedNode(inspected)
    }
  }, [])

  return (
    <div className="border-3 border-black bg-white shadow-[4px_4px_0px_#000] font-mono space-y-3 p-3 sm:p-4 min-w-0 w-full overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2 min-w-0">
          <GitBranch className="w-4 h-4 text-black shrink-0" />
          <span className="text-xs font-black uppercase text-black truncate">
            ADAPTIVE EXECUTION DECISION GRAPH
          </span>
          <Badge variant="cyber" className="shrink-0">REACT FLOW</Badge>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold">
          <span>Click any node to inspect execution metadata</span>
        </div>
      </div>

      {/* React Flow Container */}
      <div className="h-[320px] sm:h-[360px] w-full min-w-0 border-2 border-black bg-zinc-50 relative overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#999" />
          <Controls showInteractive={false} className="border-2 border-black bg-white" />
        </ReactFlow>
      </div>

      {/* Node Inspector Drawer */}
      {inspectedNode ? (
        <div className="p-3 border-2 border-black bg-amber-50 space-y-2 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-black pb-1">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-black" />
              <span className="font-black text-black uppercase">
                {inspectedNode.title}
              </span>
            </div>
            <span className="text-[10px] font-bold text-zinc-600 bg-white px-2 py-0.5 border border-black">
              {inspectedNode.category}
            </span>
          </div>

          <p className="text-zinc-800 font-bold text-[11px] leading-relaxed">
            {inspectedNode.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-amber-200 text-[10px]">
            {Object.entries(inspectedNode.details).map(([key, value]) => (
              <div key={key} className="p-1.5 border border-black bg-white">
                <span className="text-zinc-500 block uppercase font-bold">{key}</span>
                <span className="text-black font-mono font-bold truncate block">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-2 border border-zinc-200 bg-zinc-50 text-[10px] text-zinc-500 font-bold flex items-center justify-between">
          <span>Tip: Click on Intent, JOCKY IR, Host, Profile, or Evidence nodes to inspect exact parameters.</span>
          <span className="text-black font-black">GRAPH ACTIVE</span>
        </div>
      )}
    </div>
  )
}
