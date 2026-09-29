import React from "react"
import Link from "next/link"
import { RoutePlaceholder } from "@/components/layout/RoutePlaceholder"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusPill } from "@/components/status/StatusPill"
import { MOCK_INVESTIGATIONS } from "@/data/investigations"
import { formatDate, truncateHash } from "@/lib/formatters"
import { ArrowLeft } from "lucide-react"

export default async function InvestigationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const investigation = MOCK_INVESTIGATIONS.find((inv) => inv.id === id) ?? MOCK_INVESTIGATIONS[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/investigations">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Campaigns
          </Button>
        </Link>
        <StatusPill label={`CAMPAIGN: ${investigation.id}`} status="verified" />
      </div>

      <RoutePlaceholder
        title={investigation.title}
        route={`/investigations/${id}`}
        architectureRole="Dynamic page-level composition for deep-dive investigation inspection, adaptive execution audit logs, targeted endpoints breakdown, and cryptographic evidence linkage."
        description={`Displaying investigation parameters for ${investigation.id} with ${investigation.steps.length} sequential execution stages and Merkle proof integration.`}
        connectedTypes={["investigation.ts", "evidence.ts", "provenance.ts"]}
        connectedData={["investigations.ts", "evidence.ts", "provenance.ts"]}
        badge="CAMPAIGN DETAIL"
      />

      {/* Investigation Details Card */}
      <Card className="border-4 border-black shadow-[6px_6px_0px_#000]">
        <CardHeader className="bg-amber-300">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Investigation Specifications</CardTitle>
            <div className="flex gap-2">
              <Badge variant="danger">{investigation.severity}</Badge>
              <Badge variant="success">{investigation.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="p-3 border-2 border-black bg-zinc-50 font-mono text-xs font-bold text-zinc-900">
            <span className="text-zinc-500 block mb-1">INTENT SPECIFICATION:</span>
            {investigation.intent}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono font-bold">
            <div className="p-3 border-2 border-black bg-white">
              <span className="text-zinc-500 block">MERKLE ROOT HASH</span>
              <span className="text-black font-mono break-all">{truncateHash(investigation.provenanceRootHash, 12, 12)}</span>
            </div>
            <div className="p-3 border-2 border-black bg-white">
              <span className="text-zinc-500 block">INITIATED BY</span>
              <span className="text-black font-mono">{investigation.initiatedBy}</span>
            </div>
            <div className="p-3 border-2 border-black bg-white">
              <span className="text-zinc-500 block">TIMESTAMP</span>
              <span className="text-black font-mono">{formatDate(investigation.createdAt)}</span>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-black uppercase tracking-wider text-zinc-600">
              Adaptive Execution Pipeline Stages ({investigation.steps.length})
            </h3>
            <div className="space-y-2">
              {investigation.steps.map((step) => (
                <div key={step.id} className="p-3 border-2 border-black bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 border border-black bg-black text-amber-300 flex items-center justify-center font-mono font-bold text-xs">
                      {step.order}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-black">{step.title}</div>
                      <div className="text-xs font-mono text-zinc-600">{step.description}</div>
                    </div>
                  </div>
                  <Badge variant={step.status === "COMPLETED" ? "success" : step.status === "RUNNING" ? "cyber" : "neutral"}>
                    {step.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
