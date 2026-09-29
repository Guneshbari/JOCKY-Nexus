export const BRANDING = {
  name: "JOCKY Nexus",
  code: "JOCKY-NEXUS",
  version: "0.1.0-PROTOTYPE",
  tagline: "One Investigation. Multiple Endpoints. Verifiable Evidence.",
  usp: "Forensic Intent → Adaptive Execution → Verifiable Evidence",
  auditEngine: "Nexus Verifiable Provenance Log (NVPL-v1)",
} as const

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string
  description: string
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    description: "System overview, active incidents, and telemetry",
  },
  {
    label: "Investigations",
    href: "/investigations",
    icon: "ShieldAlert",
    badge: "3 ACTIVE",
    description: "Multi-endpoint forensic investigation campaigns",
  },
  {
    label: "Live Investigation",
    href: "/live-investigation",
    icon: "Activity",
    badge: "LIVE",
    description: "Real-time adaptive forensic execution stream",
  },
  {
    label: "Endpoints",
    href: "/endpoints",
    icon: "Server",
    badge: "5 HOSTS",
    description: "Enterprise endpoint inventory and agent status",
  },
  {
    label: "Evidence Explorer",
    href: "/evidence",
    icon: "Database",
    description: "Verifiable artifact store with cryptographic integrity",
  },
  {
    label: "Network Analysis",
    href: "/network",
    icon: "Network",
    description: "Lateral movement and egress C2 connection topology",
  },
  {
    label: "MITRE ATT&CK",
    href: "/mitre",
    icon: "Crosshair",
    description: "Tactics, techniques, and adversary behavior matrix",
  },
  {
    label: "Provenance Audit",
    href: "/provenance",
    icon: "FileCheck",
    badge: "VERIFIED",
    description: "Cryptographic chain-of-custody and immutable audit trail",
  },
]

export const SEVERITY_CONFIG = {
  CRITICAL: {
    label: "CRITICAL",
    color: "bg-rose-500 text-white",
    borderColor: "border-rose-600",
  },
  HIGH: {
    label: "HIGH",
    color: "bg-orange-500 text-black",
    borderColor: "border-orange-600",
  },
  MEDIUM: {
    label: "MEDIUM",
    color: "bg-amber-300 text-black",
    borderColor: "border-amber-500",
  },
  LOW: {
    label: "LOW",
    color: "bg-cyan-300 text-black",
    borderColor: "border-cyan-500",
  },
  INFO: {
    label: "INFO",
    color: "bg-zinc-200 text-black",
    borderColor: "border-zinc-400",
  },
} as const

export const SIMULATION_MODE_CONFIG = {
  isSimulation: true,
  engineState: "ADAPTIVE_EXECUTION_ONLINE",
  integrityVerified: true,
  merkleTreeHeight: 16,
  hashAlgorithm: "SHA-256",
} as const
