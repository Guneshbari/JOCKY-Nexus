import React from "react"
import { RoutePlaceholder } from "@/components/layout/RoutePlaceholder"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/status/StatusPill"
import { MOCK_MITRE_TECHNIQUES, MOCK_MITRE_SUMMARY } from "@/data/mitre"
import { Crosshair } from "lucide-react"

export default function MitrePage() {
  return (
    <div className="space-y-6">
      <RoutePlaceholder
        title="MITRE ATT&CK Matrix & Threat Alignment"
        route="/mitre"
        architectureRole="Page-level composition for visualizing adversarial tactics, techniques, and procedures (TTPs), mapping active detections directly to MITRE ATT&CK framework IDs."
        description="Correlates multi-endpoint signals into structured adversarial tradecraft patterns for forensic reporting."
        connectedTypes={["mitre.ts", "investigation.ts"]}
        connectedData={["mitre.ts", "investigations.ts"]}
        badge="MITRE FRAMEWORK"
      />

      {/* MITRE Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
          <span className="font-mono text-xs font-bold text-zinc-600 uppercase">Techniques Detected</span>
          <div className="text-3xl font-black text-rose-600 mt-1">
            {MOCK_MITRE_SUMMARY.totalTechniquesDetected}
          </div>
          <span className="text-xs font-mono font-bold text-zinc-700">Across 5 tactical categories</span>
        </div>

        <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
          <span className="font-mono text-xs font-bold text-zinc-600 uppercase">Detection Coverage</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {MOCK_MITRE_SUMMARY.coveragePercentage}%
          </div>
          <span className="text-xs font-mono font-bold text-zinc-700">Adaptive rule coverage rate</span>
        </div>

        <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
          <span className="font-mono text-xs font-bold text-zinc-600 uppercase">Primary Vector</span>
          <div className="text-sm font-black text-black mt-2 truncate">
            {MOCK_MITRE_SUMMARY.topThreatVector}
          </div>
          <span className="text-xs font-mono font-bold text-zinc-700">Kerberoasting + Reflective DLL</span>
        </div>
      </div>

      {/* Techniques Table */}
      <Card className="border-4 border-black shadow-[6px_6px_0px_#000]">
        <CardHeader className="bg-orange-300 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-black" />
            <CardTitle>Identified Adversary Techniques ({MOCK_MITRE_TECHNIQUES.length})</CardTitle>
          </div>
          <StatusPill label="ATT&CK v15 MAPPED" status="verified" />
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-black bg-zinc-100 font-black uppercase text-zinc-700">
                <th className="p-3">Technique ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Tactic</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Detections</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {MOCK_MITRE_TECHNIQUES.map((tech) => (
                <tr key={tech.id} className="hover:bg-amber-50">
                  <td className="p-3 font-mono font-black text-black bg-zinc-50">
                    {tech.id}
                  </td>
                  <td className="p-3 font-bold text-black">{tech.name}</td>
                  <td className="p-3">
                    <Badge variant="neutral">{tech.tactic}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant={tech.severity === "CRITICAL" ? "danger" : "warning"}>
                      {tech.severity}
                    </Badge>
                  </td>
                  <td className="p-3 font-black text-zinc-900">{tech.detectionCount} hits</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
