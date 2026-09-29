import React from "react"
import { RoutePlaceholder } from "@/components/layout/RoutePlaceholder"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/status/StatusPill"
import { MOCK_NETWORK_CONNECTIONS } from "@/data/network"
import { formatBytes } from "@/lib/formatters"
import { Network, ArrowRight } from "lucide-react"

export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <RoutePlaceholder
        title="Network Analysis & Lateral Movement Topology"
        route="/network"
        architectureRole="Page-level composition for interactive flow graphs (React Flow), C2 telemetry, lateral movement tracing, and egress exfiltration analysis."
        description="Maps anomalous inter-host sessions and flags suspicious external beacons across the enterprise perimeter."
        connectedTypes={["network.ts", "endpoint.ts"]}
        connectedData={["network.ts", "endpoints.ts"]}
        badge="TOPOLOGY & FLOWS"
      />

      {/* Network Connections Table */}
      <Card className="border-4 border-black shadow-[6px_6px_0px_#000]">
        <CardHeader className="bg-blue-300 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-black" />
            <CardTitle>Monitored Network Flows & C2 Telemetry ({MOCK_NETWORK_CONNECTIONS.length})</CardTitle>
          </div>
          <StatusPill label="ANOMALY DETECTION: ACTIVE" status="warning" />
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-black bg-zinc-100 font-black uppercase text-zinc-700">
                <th className="p-3">Source Host:Port</th>
                <th className="p-3">Direction</th>
                <th className="p-3">Destination Host:Port</th>
                <th className="p-3">Protocol</th>
                <th className="p-3">Volume</th>
                <th className="p-3">Threat Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {MOCK_NETWORK_CONNECTIONS.map((conn) => (
                <tr key={conn.id} className="hover:bg-amber-50">
                  <td className="p-3 font-bold text-black">
                    {conn.sourceIp}:{conn.sourcePort}
                  </td>
                  <td className="p-3 text-center">
                    <ArrowRight className="w-4 h-4 mx-auto text-zinc-500" />
                  </td>
                  <td className="p-3 font-bold text-black">
                    {conn.targetHostname || conn.targetIp}:{conn.targetPort}
                  </td>
                  <td className="p-3">
                    <Badge variant="neutral">{conn.protocol}</Badge>
                  </td>
                  <td className="p-3 text-zinc-700">{formatBytes(conn.bytesTransferred)}</td>
                  <td className="p-3">
                    {conn.isSuspiciousEgress ? (
                      <Badge variant="danger">SUSPICIOUS EGRESS (C2)</Badge>
                    ) : conn.isLateralMovement ? (
                      <Badge variant="warning">LATERAL SPREAD</Badge>
                    ) : (
                      <Badge variant="success">BENIGN</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
