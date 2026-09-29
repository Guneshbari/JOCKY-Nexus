import React from "react"
import { RoutePlaceholder } from "@/components/layout/RoutePlaceholder"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusPill } from "@/components/status/StatusPill"
import { MOCK_PROVENANCE_LOGS } from "@/data/provenance"
import { truncateHash } from "@/lib/formatters"
import { Lock } from "lucide-react"

export default function ProvenancePage() {
  return (
    <div className="space-y-6">
      <RoutePlaceholder
        title="Verifiable Cryptographic Provenance Ledger"
        route="/provenance"
        architectureRole="Page-level composition for cryptographic chain-of-custody verification, Merkle proof inspection, block trail audits, and court-admissible forensic export."
        description="Every investigative action, evidence acquisition, and adaptive branch generates an immutable signed record anchored in an append-only verifiable cryptographic ledger."
        connectedTypes={["provenance.ts", "evidence.ts"]}
        connectedData={["provenance.ts", "evidence.ts"]}
        badge="CRYPTOGRAPHIC AUDIT"
      />

      {/* Ledger Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
          <span className="font-mono text-xs font-bold text-zinc-600 uppercase">Ledger Height</span>
          <div className="text-3xl font-black text-black mt-1">#1045</div>
          <span className="text-xs font-mono font-bold text-zinc-700">Contiguous tamper-evident blocks</span>
        </div>

        <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
          <span className="font-mono text-xs font-bold text-zinc-600 uppercase">Verification Engine</span>
          <div className="text-xl font-black text-emerald-600 mt-2">NVPL-v1 / ECDSA-SHA256</div>
          <span className="text-xs font-mono font-bold text-zinc-700">Zero chain deviations detected</span>
        </div>

        <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
          <span className="font-mono text-xs font-bold text-zinc-600 uppercase">Audit Witnesses</span>
          <div className="text-3xl font-black text-cyan-600 mt-1">3 INDEPENDENT</div>
          <span className="text-xs font-mono font-bold text-zinc-700">Multi-party cryptographic quorum</span>
        </div>
      </div>

      {/* Blocks Trail Card */}
      <Card className="border-4 border-black shadow-[6px_6px_0px_#000]">
        <CardHeader className="bg-lime-300 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-black" />
            <CardTitle>Immutable Provenance Block Trail ({MOCK_PROVENANCE_LOGS.length} Recent)</CardTitle>
          </div>
          <StatusPill label="CHAIN OF CUSTODY: LOCKED" status="verified" />
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-black bg-zinc-100 font-black uppercase text-zinc-700">
                <th className="p-3">Block #</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Actor / Agent</th>
                <th className="p-3">Current Block Hash</th>
                <th className="p-3">Merkle Root</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {MOCK_PROVENANCE_LOGS.map((block) => (
                <tr key={block.recordId} className="hover:bg-amber-50">
                  <td className="p-3 font-mono font-black text-black bg-zinc-50">
                    #{block.blockHeight}
                  </td>
                  <td className="p-3">
                    <Badge variant="neutral">{block.action}</Badge>
                  </td>
                  <td className="p-3 font-bold text-zinc-800">{block.actorId}</td>
                  <td className="p-3 font-mono text-[11px] text-zinc-900 bg-zinc-50 px-2">
                    {truncateHash(block.currentBlockHash, 8, 8)}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-zinc-900 bg-zinc-50 px-2">
                    {truncateHash(block.merkleRoot, 8, 8)}
                  </td>
                  <td className="p-3">
                    <Badge variant="success">VERIFIED</Badge>
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
