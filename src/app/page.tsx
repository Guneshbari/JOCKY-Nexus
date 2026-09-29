import Link from "next/link"
import {
  ShieldAlert,
  Server,
  Database,
  Activity,
  Network,
  Crosshair,
  FileCheck,
  ArrowRight,
  Cpu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { StatusPill } from "@/components/status/StatusPill"
import { BRANDING } from "@/lib/constants"
import { MOCK_DASHBOARD_STATS } from "@/data/dashboard"

const modules = [
  {
    title: "Command Dashboard",
    href: "/dashboard",
    icon: Activity,
    color: "bg-amber-300",
    description: "Operational overview, active incidents, telemetry status, and quick response triggers.",
    badge: "CORE",
  },
  {
    title: "Investigation Campaigns",
    href: "/investigations",
    icon: ShieldAlert,
    color: "bg-rose-300",
    description: "Orchestrate multi-endpoint forensic investigations driven by natural forensic intent.",
    badge: "3 ACTIVE",
  },
  {
    title: "Live Execution Engine",
    href: "/live-investigation",
    icon: Cpu,
    color: "bg-cyan-300",
    description: "Real-time adaptive branching, live command stream, and automatic forensic adjustments.",
    badge: "ADAPTIVE",
  },
  {
    title: "Endpoint Fleet Inventory",
    href: "/endpoints",
    icon: Server,
    color: "bg-emerald-300",
    description: "Cross-platform endpoint management, instant host isolation, and forensic readiness scores.",
    badge: "12 HOSTS",
  },
  {
    title: "Evidence Vault",
    href: "/evidence",
    icon: Database,
    color: "bg-purple-300",
    description: "Cryptographically hashed forensic artifacts, SHA-256 validation, and chain-of-custody records.",
    badge: "VERIFIED",
  },
  {
    title: "Network Topology & Flows",
    href: "/network",
    icon: Network,
    color: "bg-blue-300",
    description: "Lateral movement tracking, egress C2 detection, and interactive connection graph.",
    badge: "GRAPH",
  },
  {
    title: "MITRE ATT&CK Matrix",
    href: "/mitre",
    icon: Crosshair,
    color: "bg-orange-300",
    description: "Adversary tactic & technique mappings with automatic severity categorization.",
    badge: "74% COVERAGE",
  },
  {
    title: "Provenance Audit Ledger",
    href: "/provenance",
    icon: FileCheck,
    color: "bg-lime-300",
    description: "Immutable Merkle tree proofs, tamper-evident cryptographic block trail, and witness signatures.",
    badge: "IMMUTABLE",
  },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Neo-Brutalist Banner */}
      <section className="border-4 border-black bg-white p-6 md:p-10 shadow-[8px_8px_0px_#000] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300 border-l-4 border-b-4 border-black -mr-16 -mt-16 rotate-45 pointer-events-none" />

        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-black bg-black text-amber-400 px-3 py-1 shadow-[2px_2px_0px_#FACC15]">
              {BRANDING.version}
            </span>
            <Badge variant="cyber">FRONTEND-ONLY PROTOTYPE</Badge>
            <StatusPill label="AUDIT CHAIN: SEALED" status="verified" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-black leading-none">
            {BRANDING.name}
          </h1>

          <p className="text-lg md:text-xl font-bold font-mono text-zinc-800">
            {BRANDING.tagline}
          </p>

          <div className="p-3 border-2 border-black bg-amber-100 font-mono text-xs font-bold inline-block shadow-[3px_3px_0px_#000]">
            ⚡ USP: {BRANDING.usp}
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button size="lg" variant="default" className="gap-2">
                Launch Command Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/live-investigation">
              <Button size="lg" variant="cyber" className="gap-2">
                View Live Adaptive Execution
              </Button>
            </Link>
            <Link href="/provenance">
              <Button size="lg" variant="outline" className="gap-2">
                Inspect Provenance Ledger
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
          <span className="text-xs font-mono font-bold text-zinc-500 uppercase">Active Incidents</span>
          <div className="text-3xl font-black text-rose-600 mt-1">
            {MOCK_DASHBOARD_STATS.activeIncidents}
          </div>
          <span className="text-[11px] font-mono text-zinc-700">Across 3 host environments</span>
        </div>

        <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
          <span className="text-xs font-mono font-bold text-zinc-500 uppercase">Monitored Hosts</span>
          <div className="text-3xl font-black text-black mt-1">
            {MOCK_DASHBOARD_STATS.compromisedEndpoints + 10}
          </div>
          <span className="text-[11px] font-mono text-zinc-700">Windows, Linux, macOS</span>
        </div>

        <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
          <span className="text-xs font-mono font-bold text-zinc-500 uppercase">Sealed Artifacts</span>
          <div className="text-3xl font-black text-cyan-600 mt-1">
            {MOCK_DASHBOARD_STATS.evidenceArtifactsCollected}
          </div>
          <span className="text-[11px] font-mono text-zinc-700">SHA-256 cryptographically signed</span>
        </div>

        <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
          <span className="text-xs font-mono font-bold text-zinc-500 uppercase">Merkle Proof Blocks</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {MOCK_DASHBOARD_STATS.cryptographicProofsVerified}
          </div>
          <span className="text-[11px] font-mono text-zinc-700">NVPL-v1 verifiable ledger</span>
        </div>
      </div>

      {/* Modules Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            Operational Architecture Modules
          </h2>
          <span className="text-xs font-mono font-bold text-zinc-500">
            8 MODULAR ROUTE DOMAINS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon
            return (
              <Link key={mod.href} href={mod.href} className="group">
                <Card className="h-full border-3 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all flex flex-col justify-between">
                  <div>
                    <CardHeader className={mod.color}>
                      <div className="flex items-center justify-between">
                        <Icon className="w-6 h-6 text-black" />
                        <Badge variant="dark" className="text-[10px]">
                          {mod.badge}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2 text-base">{mod.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs font-bold text-zinc-700 leading-relaxed">
                      {mod.description}
                    </CardContent>
                  </div>
                  <div className="p-5 pt-0 flex items-center justify-end">
                    <span className="text-xs font-mono font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      OPEN <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
