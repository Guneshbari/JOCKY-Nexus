import React from "react"
import { RoutePlaceholder } from "@/components/layout/RoutePlaceholder"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/status/StatusPill"
import { MOCK_EXECUTION_PLANS } from "@/data/execution"
import { GitBranch } from "lucide-react"

export default function LiveInvestigationPage() {
  const plan = MOCK_EXECUTION_PLANS["inv-2026-001"]

  return (
    <div className="space-y-6">
      <RoutePlaceholder
        title="Live Adaptive Investigation Stream"
        route="/live-investigation"
        architectureRole="Page-level composition for observing real-time adaptive forensic execution, conditional rule branching, live agent command dispatch, and interactive forensic interventions."
        description="Core differentiator showcase: Translates forensic intent into dynamic real-time agent commands, automatically pivoting when adversarial artifacts are discovered."
        connectedTypes={["execution.ts", "investigation.ts", "endpoint.ts"]}
        connectedData={["execution.ts", "investigations.ts"]}
        badge="REAL-TIME EXECUTION"
      />

      {/* Adaptive Pivot Showcase Card */}
      <Card className="border-4 border-black shadow-[6px_6px_0px_#000]">
        <CardHeader className="bg-cyan-300 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-black" />
            <CardTitle>Adaptive Decision Engine</CardTitle>
          </div>
          <StatusPill label="STATE: EXECUTING & ADAPTING" status="busy" />
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="p-4 border-3 border-black bg-amber-50 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="warning">ADAPTIVE TRIGGER FIRED</Badge>
              <span className="font-mono text-xs font-bold text-zinc-700">Condition:</span>
            </div>
            <p className="font-mono text-xs font-bold text-black bg-white p-2 border-2 border-black">
              {plan.adaptiveBranches[0]?.condition}
            </p>
            <p className="text-xs font-bold text-zinc-800">
              <span className="text-zinc-500 font-mono">RATIONALE:</span>{" "}
              {plan.adaptiveBranches[0]?.decisionRationale}
            </p>
          </div>

          {/* Real-time Command Pipeline Preview */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs font-black uppercase text-zinc-600">
              Dispatched Adaptive Agent Commands ({plan.commands.length})
            </h3>
            <div className="space-y-2 font-mono text-xs">
              {plan.commands.map((cmd) => (
                <div key={cmd.id} className="p-3 border-2 border-black bg-zinc-900 text-white space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-amber-400 font-bold">{cmd.targetEndpoint}</span>
                    <Badge variant={cmd.status === "VERIFIED" ? "success" : "cyber"}>
                      {cmd.status}
                    </Badge>
                  </div>
                  <div className="text-emerald-400 font-bold">$ {cmd.commandText}</div>
                  {cmd.stdoutExcerpt && (
                    <div className="text-[11px] text-zinc-300 bg-zinc-800 p-2 border border-zinc-700 mt-1">
                      {cmd.stdoutExcerpt}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
