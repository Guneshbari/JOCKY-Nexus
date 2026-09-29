import React from "react"
import Link from "next/link"
import { RoutePlaceholder } from "@/components/layout/RoutePlaceholder"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MOCK_INVESTIGATIONS } from "@/data/investigations"
import { formatDate } from "@/lib/formatters"
import { ArrowUpRight } from "lucide-react"

export default function InvestigationsPage() {
  return (
    <div className="space-y-6">
      <RoutePlaceholder
        title="Forensic Investigations Campaigns"
        route="/investigations"
        architectureRole="Page-level composition for managing and launching multi-endpoint forensic investigations driven by natural intent and adaptive execution rules."
        description="Coordinates live forensic campaigns across Windows, Linux, and macOS hosts with verifiable chain-of-custody tracking."
        connectedTypes={["investigation.ts", "endpoint.ts", "execution.ts"]}
        connectedData={["investigations.ts", "endpoints.ts", "execution.ts"]}
        badge="CAMPAIGNS"
      />

      {/* Campaign List Preview */}
      <div className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-wider text-black">
          Active Forensic Campaigns ({MOCK_INVESTIGATIONS.length})
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_INVESTIGATIONS.map((inv) => (
            <Card key={inv.id} className="border-3 border-black shadow-[4px_4px_0px_#000]">
              <CardHeader className="bg-amber-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={inv.severity === "CRITICAL" ? "danger" : "warning"}>
                      {inv.severity}
                    </Badge>
                    <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5">
                      {inv.id}
                    </span>
                    <Badge variant={inv.status === "COMPLETED" ? "success" : "default"}>
                      {inv.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{inv.title}</CardTitle>
                </div>

                <Link href={`/investigations/${inv.id}`}>
                  <Button variant="default" size="sm" className="gap-1">
                    Details & Audit <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                <p className="text-xs font-bold text-zinc-800">
                  <span className="text-zinc-500 font-mono">INTENT:</span> {inv.intent}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-zinc-600">
                  <span>Target Hosts: {inv.targetEndpointIds.length}</span>
                  <span>Artifacts: {inv.evidenceCount}</span>
                  <span>Initiated: {formatDate(inv.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
