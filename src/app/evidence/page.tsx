import React from "react"
import { RoutePlaceholder } from "@/components/layout/RoutePlaceholder"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/status/StatusPill"
import { MOCK_EVIDENCE } from "@/data/evidence"
import { formatBytes, truncateHash } from "@/lib/formatters"
import { Database, FileCheck } from "lucide-react"

export default function EvidencePage() {
  return (
    <div className="space-y-6">
      <RoutePlaceholder
        title="Evidence Explorer & Cryptographic Vault"
        route="/evidence"
        architectureRole="Page-level composition for cataloging, searching, and validating forensic artifacts (memory dumps, PCAPs, process snapshots, MFT journals) with verifiable SHA-256 signatures."
        description="Every collected piece of evidence is hashed upon acquisition and sealed into the Merkle tree with complete chain-of-custody tracking."
        connectedTypes={["evidence.ts", "provenance.ts"]}
        connectedData={["evidence.ts", "provenance.ts"]}
        badge="EVIDENCE VAULT"
      />

      {/* Artifacts Table */}
      <Card className="border-4 border-black shadow-[6px_6px_0px_#000]">
        <CardHeader className="bg-purple-300 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-black" />
            <CardTitle>Forensic Artifact Registry ({MOCK_EVIDENCE.length})</CardTitle>
          </div>
          <StatusPill label="CHAIN INTEGRITY: VERIFIED" status="verified" />
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-black bg-zinc-100 font-black uppercase text-zinc-700">
                <th className="p-3">Artifact Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Source Host</th>
                <th className="p-3">Size</th>
                <th className="p-3">SHA-256 Hash</th>
                <th className="p-3">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {MOCK_EVIDENCE.map((art) => (
                <tr key={art.id} className="hover:bg-amber-50">
                  <td className="p-3 font-bold text-black flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{art.name}</span>
                  </td>
                  <td className="p-3">
                    <Badge variant="purple" className="text-[10px]">
                      {art.type}
                    </Badge>
                  </td>
                  <td className="p-3 font-bold">{art.endpointHostname}</td>
                  <td className="p-3 text-zinc-600">{formatBytes(art.sizeBytes)}</td>
                  <td className="p-3 font-mono text-[11px] text-zinc-900 bg-zinc-50 px-2">
                    {truncateHash(art.sha256, 10, 10)}
                  </td>
                  <td className="p-3">
                    <Badge variant="success">SEALED</Badge>
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
