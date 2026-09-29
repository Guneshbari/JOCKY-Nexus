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
  Server,
  Radio,
  RotateCcw,
  Info,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  NetworkConnection,
  NetworkGraphNode,
  NetworkGraphEdge,
  NetworkProtocol,
} from "@/types/network"

interface NetworkConnectionGraphProps {
  nodesData: NetworkGraphNode[]
  edgesData: NetworkGraphEdge[]
  connections: NetworkConnection[]
  onSelectConnection?: (conn: NetworkConnection) => void
}

interface InspectedEntity {
  type: "NODE" | "EDGE"
  title: string
  subtitle: string
  status?: string
  riskLevel?: string
  protocol?: string
  ip?: string
  port?: number
  isCompromised?: boolean
  connectionId?: string
  details: Record<string, string | number | undefined>
}

// Preset layout positions
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  "node-ws44": { x: 80, y: 180 },
  "node-dc": { x: 380, y: 60 },
  "node-proxy": { x: 380, y: 280 },
  "node-dns": { x: 80, y: 360 },
  "node-c2": { x: 680, y: 280 },
  "node-app09": { x: 80, y: 40 },
  "node-fs02": { x: 680, y: 60 },
}

export function NetworkConnectionGraph({
  nodesData,
  edgesData,
  connections,
  onSelectConnection,
}: NetworkConnectionGraphProps) {
  const [selectedProtocol, setSelectedProtocol] = useState<NetworkProtocol | "ALL">("ALL")
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("ALL")
  const [selectedEntity, setSelectedEntity] = useState<InspectedEntity | null>(null)

  // Filter edges based on protocol
  const filteredEdgesData = useMemo(() => {
    return edgesData.filter((edge) => {
      const matchProto = selectedProtocol === "ALL" || edge.protocol === selectedProtocol
      const matchEp =
        selectedEndpoint === "ALL" ||
        edge.source.includes(selectedEndpoint.toLowerCase()) ||
        edge.target.includes(selectedEndpoint.toLowerCase())
      return matchProto && matchEp
    })
  }, [edgesData, selectedProtocol, selectedEndpoint])

  // Convert to React Flow Nodes
  const initialNodes: Node[] = useMemo(() => {
    return nodesData.map((node) => {
      const pos = NODE_POSITIONS[node.id] ?? { x: 200, y: 150 }
      const isCompromised = node.isCompromised
      const isExternal = node.type === "C2_SUSPECT" || node.type === "EXTERNAL_IP"
      const isGateway = node.type === "GATEWAY"
      const isDNS = node.type === "DNS_RESOLVER"

      return {
        id: node.id,
        position: pos,
        data: {
          label: (
            <div className="font-mono text-left select-none">
              <div className="flex items-center justify-between gap-1 pb-1 border-b border-black">
                <span className="text-[9px] font-black uppercase text-zinc-600">
                  {node.type.replace("_", " ")}
                </span>
                {isCompromised ? (
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </div>
              <div className="pt-1">
                <div className="text-xs font-black text-black truncate max-w-[150px]">
                  {node.label}
                </div>
                <div className="text-[10px] text-zinc-600 font-bold">{node.ip}</div>
              </div>
            </div>
          ),
          rawNode: node,
        },
        style: {
          border: isCompromised ? "3px solid #e11d48" : "3px solid #000",
          backgroundColor: isCompromised
            ? "#ffe4e6"
            : isExternal
            ? "#ffedd5"
            : isGateway
            ? "#e0e7ff"
            : isDNS
            ? "#ecfdf5"
            : "#ffffff",
          boxShadow: isCompromised ? "4px 4px 0px #e11d48" : "4px 4px 0px #000",
          padding: "8px",
          width: 175,
          borderRadius: "0px",
          cursor: "pointer",
        },
      }
    })
  }, [nodesData])

  // Convert to React Flow Edges
  const initialEdges: Edge[] = useMemo(() => {
    return filteredEdgesData.map((edge) => {
      const isMalicious = edge.isMalicious
      const strokeColor = isMalicious
        ? "#e11d48"
        : edge.protocol === "HTTPS"
        ? "#0284c7"
        : edge.protocol === "SMB"
        ? "#b45309"
        : edge.protocol === "DNS"
        ? "#059669"
        : "#000000"

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: isMalicious || edge.protocol === "HTTPS",
        style: {
          stroke: strokeColor,
          strokeWidth: isMalicious ? 3 : 2,
        },
        labelStyle: {
          fill: isMalicious ? "#9f1239" : "#000000",
          fontWeight: 800,
          fontFamily: "monospace",
          fontSize: 10,
        },
        labelBgStyle: {
          fill: isMalicious ? "#ffe4e6" : "#ffffff",
          stroke: isMalicious ? "#e11d48" : "#000000",
          strokeWidth: 1.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 14,
          height: 14,
        },
        data: { rawEdge: edge },
      }
    })
  }, [filteredEdgesData])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  // Handle Node click
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const raw = (node.data as { rawNode?: NetworkGraphNode }).rawNode
    if (!raw) return

    setSelectedEntity({
      type: "NODE",
      title: raw.label,
      subtitle: `${raw.type} // IP: ${raw.ip}`,
      ip: raw.ip,
      isCompromised: raw.isCompromised,
      details: {
        "Node Type": raw.type,
        "IP Address": raw.ip,
        OperatingSystem: raw.os ?? "Embedded Appliance",
        Compromised: raw.isCompromised ? "CONFIRMED SUSPICIOUS" : "NORMAL",
        EndpointId: raw.endpointId ?? "N/A",
      },
    })
  }, [])

  // Handle Edge click
  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const raw = (edge.data as { rawEdge?: NetworkGraphEdge }).rawEdge
      if (!raw) return

      const matchedConn = connections.find((c) => c.id === raw.connectionId)

      setSelectedEntity({
        type: "EDGE",
        title: edge.label ? String(edge.label) : `${raw.protocol} Session`,
        subtitle: `Flow: ${raw.source} → ${raw.target}`,
        protocol: raw.protocol,
        port: raw.port,
        connectionId: raw.connectionId,
        riskLevel: raw.isMalicious ? "HIGH" : "INFO",
        details: {
          Protocol: raw.protocol,
          Port: raw.port ?? "Dynamic",
          ConnectionId: raw.connectionId ?? "SYNTH-FLOW",
          ThreatStatus: raw.isMalicious ? "FLAGGED SUSPICIOUS" : "OBSERVED BENIGN",
          Bytes: matchedConn ? `${matchedConn.bytesTransferred} bytes` : "Calculated",
          SourceNode: raw.source,
          TargetNode: raw.target,
        },
      })

      if (matchedConn && onSelectConnection) {
        onSelectConnection(matchedConn)
      }
    },
    [connections, onSelectConnection]
  )

  const handleResetFilters = () => {
    setSelectedProtocol("ALL")
    setSelectedEndpoint("ALL")
    setSelectedEntity(null)
  }

  return (
    <div className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono space-y-3 p-4">
      {/* Topology Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b-2 border-black">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-black uppercase text-black">
              Interactive Network Connection Graph
            </h3>
            <Badge variant="cyber" className="text-[10px]">
              REACT FLOW
            </Badge>
          </div>
          <p className="text-xs font-bold text-zinc-600">
            Real-time visual relationship graph between investigation endpoints, gateways, and destinations.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Protocol filter */}
          <select
            value={selectedProtocol}
            onChange={(e) => setSelectedProtocol(e.target.value as NetworkProtocol | "ALL")}
            className="p-1.5 border-2 border-black bg-zinc-50 text-xs font-bold focus:outline-none"
          >
            <option value="ALL">ALL PROTOCOLS</option>
            <option value="HTTPS">HTTPS (443)</option>
            <option value="TCP">TCP (88/389)</option>
            <option value="SMB">SMB (445)</option>
            <option value="DNS">DNS (53)</option>
          </select>

          {/* Reset Filters */}
          {(selectedProtocol !== "ALL" || selectedEndpoint !== "ALL") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 border-2 border-black bg-rose-100 hover:bg-rose-200 text-xs font-black cursor-pointer text-rose-900"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          )}
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center gap-3 p-2 bg-zinc-50 border-2 border-black text-[11px] font-bold">
        <span className="text-zinc-600 uppercase">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 border border-black bg-white" />
          <span>Endpoint</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 border border-rose-600 bg-rose-100" />
          <span>Compromised Host</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 border border-orange-500 bg-orange-100" />
          <span>C2 External</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 border border-indigo-500 bg-indigo-100" />
          <span>Gateway / Proxy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-rose-600 inline-block" />
          <span className="text-rose-700">Flagged Flow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-sky-600 inline-block" />
          <span className="text-sky-700">HTTPS Flow</span>
        </div>
      </div>

      {/* React Flow Container */}
      <div className="h-[360px] sm:h-[440px] w-full min-w-0 border-3 border-black bg-zinc-100 relative overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color="#000000" gap={16} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="border-2 border-black bg-white shadow-[2px_2px_0px_#000] !m-2" />
        </ReactFlow>
      </div>

      {/* Inspected Entity Details Drawer / Strip */}
      {selectedEntity ? (
        <div className="p-3 border-2 border-black bg-amber-50 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black pb-2">
            <div className="flex items-center gap-2">
              {selectedEntity.type === "NODE" ? (
                <Server className="w-4 h-4 text-black" />
              ) : (
                <Radio className="w-4 h-4 text-blue-600" />
              )}
              <span className="text-xs font-black uppercase text-black">
                {selectedEntity.title}
              </span>
              <span className="text-[11px] text-zinc-600 font-bold">
                ({selectedEntity.subtitle})
              </span>
            </div>
            <div className="flex items-center gap-2">
              {selectedEntity.isCompromised && (
                <Badge variant="danger">COMPROMISED HOST</Badge>
              )}
              {selectedEntity.riskLevel === "HIGH" && (
                <Badge variant="danger">HIGH THREAT SCORE</Badge>
              )}
              <button
                type="button"
                onClick={() => setSelectedEntity(null)}
                className="text-xs font-black px-2 py-0.5 border border-black bg-white hover:bg-zinc-100 cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {Object.entries(selectedEntity.details).map(([key, value]) => (
              <div key={key} className="p-1.5 bg-white border border-black">
                <span className="text-[10px] text-zinc-500 font-bold block uppercase">
                  {key}
                </span>
                <span className="text-xs font-black text-black truncate block">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-2.5 bg-zinc-50 border-2 border-black text-xs font-bold text-zinc-600 flex items-center gap-2">
          <Info className="w-4 h-4 text-zinc-500 shrink-0" />
          <span>
            Click any node to inspect host details or click any connection edge to inspect the underlying flow.
          </span>
        </div>
      )}
    </div>
  )
}
