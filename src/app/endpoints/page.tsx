import React from "react"
import { RoutePlaceholder } from "@/components/layout/RoutePlaceholder"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusPill } from "@/components/status/StatusPill"
import { MOCK_ENDPOINTS } from "@/data/endpoints"


export default function EndpointsPage() {
  return (
    <div className="space-y-6">
      <RoutePlaceholder
        title="Host Fleet & Endpoint Inventory"
        route="/endpoints"
        architectureRole="Page-level composition for managing monitored cross-platform hosts (Windows, Linux, macOS), toggling network isolation, and observing live host resource utilization."
        description="Monitors forensic readiness across production tiers and maintains cryptographically verified command channels."
        connectedTypes={["endpoint.ts"]}
        connectedData={["endpoints.ts"]}
        badge="FLEET ASSETS"
      />

      {/* Endpoints Table / Grid Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            Monitored Host Nodes ({MOCK_ENDPOINTS.length})
          </h2>
          <div className="flex gap-2">
            <Badge variant="success">ONLINE: 4</Badge>
            <Badge variant="danger">ISOLATED: 1</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_ENDPOINTS.map((ep) => (
            <Card key={ep.id} className="border-3 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between">
              <div>
                <CardHeader className={ep.isolationStatus === "ISOLATED" ? "bg-rose-100" : "bg-zinc-100"}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black bg-black text-cyan-400 px-2 py-0.5">
                      {ep.ipAddress}
                    </span>
                    <StatusPill
                      label={ep.isolationStatus === "ISOLATED" ? "ISOLATED" : ep.agentStatus}
                      status={ep.isolationStatus === "ISOLATED" ? "isolated" : "online"}
                    />
                  </div>
                  <CardTitle className="mt-2 text-base">{ep.hostname}</CardTitle>
                  <p className="text-xs font-mono font-bold text-zinc-600 truncate">{ep.osVersion}</p>
                </CardHeader>

                <CardContent className="pt-4 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {ep.tags.map((tag) => (
                      <Badge key={tag} variant="neutral" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="p-3 border-2 border-black bg-white space-y-1 font-mono text-xs font-bold">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Readiness Score:</span>
                      <span className="text-emerald-700">{ep.forensicReadinessScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Active Procs:</span>
                      <span>{ep.telemetry.activeProcesses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Memory:</span>
                      <span>{ep.telemetry.memoryUsage}%</span>
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="p-4 pt-0">
                <Button
                  variant={ep.isolationStatus === "ISOLATED" ? "danger" : "outline"}
                  size="sm"
                  className="w-full text-xs"
                >
                  {ep.isolationStatus === "ISOLATED" ? "REVERT ISOLATION" : "QUARANTINE HOST"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
