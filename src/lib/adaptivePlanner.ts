import { Investigation } from "@/types/investigation"
import { Endpoint } from "@/types/endpoint"
import {
  AdaptiveExecutionProfile,
  AdaptiveDecision,
  AdaptiveDecisionFactor,
  AdaptiveProfileId,
  EndpointPosture,
  CollectionStepPlan,
} from "@/types/execution"

export const ADAPTIVE_PROFILES_META: Record<
  AdaptiveProfileId,
  {
    id: AdaptiveProfileId
    name: string
    platform: "WINDOWS" | "UBUNTU" | "CROSS_PLATFORM" | "MACOS"
    focus: string[]
    impactPolicy: "MINIMAL" | "LOW" | "STANDARD"
    description: string
  }
> = {
  "PROFILE-A": {
    id: "PROFILE-A",
    name: "VOLATILE TRIAGE",
    platform: "WINDOWS",
    focus: ["process telemetry", "network metadata", "volatile indicators"],
    impactPolicy: "MINIMAL",
    description:
      "Rapid in-memory and volatile handle acquisition preserving ephemeral execution state before potential process termination.",
  },
  "PROFILE-B": {
    id: "PROFILE-B",
    name: "CONTAINMENT & FILESYSTEM",
    platform: "WINDOWS",
    focus: ["filesystem metadata", "persistence artifacts", "event telemetry"],
    impactPolicy: "LOW",
    description:
      "Deep forensic inspection of Registry Run keys, Scheduled Tasks, and NTFS metadata on contained or quarantined hosts.",
  },
  "PROFILE-C": {
    id: "PROFILE-C",
    name: "LINUX SYSTEM AUDIT",
    platform: "UBUNTU",
    focus: ["process telemetry", "network metadata", "system logs", "service inventory"],
    impactPolicy: "LOW",
    description:
      "Native eBPF tracepoints and auditd telemetry integration for high-fidelity POSIX process and socket provenance.",
  },
  "PROFILE-D": {
    id: "PROFILE-D",
    name: "NETWORK FORENSIC TRIAGE",
    platform: "CROSS_PLATFORM",
    focus: ["network connections", "DNS metadata", "protocol statistics"],
    impactPolicy: "MINIMAL",
    description:
      "Socket-level flow interrogation and DNS resolution audit across heterogeneous edge proxy or gateway nodes.",
  },
}

export function getEndpointPosture(endpoint: Endpoint): EndpointPosture {
  const isWindows = endpoint.platform === "windows"
  const isLinux = endpoint.platform === "linux"
  const isIsolated = endpoint.isolationStatus === "ISOLATED"

  let postureLevel: EndpointPosture["postureLevel"] = "STANDARD"
  if (isIsolated) postureLevel = "RESTRICTED"
  else if (endpoint.forensicReadinessScore > 90) postureLevel = "HARDENED"
  else if (endpoint.forensicReadinessScore < 70) postureLevel = "ELEVATED"

  const collectionRestrictions: string[] = []
  if (isIsolated) {
    collectionRestrictions.push("Direct internet egress blocked by host isolation policy")
    collectionRestrictions.push("Collection traffic routed strictly through encrypted Nexus Agent tunnel")
  }
  if (endpoint.telemetry.cpuUsage > 80) {
    collectionRestrictions.push("Throttled CPU quota (<3% agent impact) due to heavy host compute load")
  }
  if (collectionRestrictions.length === 0) {
    collectionRestrictions.push("Standard forensic capture envelope with no host restrictions")
  }

  const availableAdapters: string[] = isWindows
    ? ["ETW-Kernel-Provider", "NtQuerySystemInformation", "WinEvt-Channel", "USN-Journal-Reader"]
    : isLinux
    ? ["eBPF-Tracepoint-Ring", "auditd-Netlink", "procfs-Reader", "systemd-Journal-Stream"]
    : ["EndpointSecurity-Framework", "bsm-Audit-Trail", "lsof-Socket-Adapter"]

  const riskFlags: string[] = []
  if (isIsolated) riskFlags.push("ENDPOINT_QUARANTINED")
  if (endpoint.telemetry.cpuUsage > 75) riskFlags.push("HOST_HIGH_CPU_LOAD")
  if (endpoint.forensicReadinessScore < 80) riskFlags.push("SUBOPTIMAL_READINESS")
  if (riskFlags.length === 0) riskFlags.push("NOMINAL_OPERATIONAL_POSTURE")

  const policyConstraints: string[] = [
    `Impact Envelope: ${endpoint.telemetry.cpuUsage > 75 ? "ULTRA_LOW (<3% CPU)" : "STANDARD_MINIMAL (<5% CPU)"}`,
    "Integrity: SHA-256 Merkle Block Sealed",
    "Evidence Protocol: Non-Volatile Provenance Ledger (NVPL)",
  ]

  return {
    endpointId: endpoint.id,
    hostname: endpoint.hostname,
    platform: endpoint.platform,
    postureLevel,
    telemetryReadiness: endpoint.forensicReadinessScore,
    collectionRestrictions,
    availableAdapters,
    riskFlags,
    policyConstraints,
  }
}

export function deriveExecutionProfile(
  investigation: Investigation,
  endpoint: Endpoint,
  posture?: EndpointPosture
): { profile: AdaptiveExecutionProfile; decision: AdaptiveDecision } {
  const currentPosture = posture ?? getEndpointPosture(endpoint)
  const isWindows = endpoint.platform === "windows"
  const isLinux = endpoint.platform === "linux"
  const isIsolated = endpoint.isolationStatus === "ISOLATED"
  const category = investigation.category ?? "CUSTOM FORENSIC QUERY"
  const volatilePriority = investigation.constraints?.volatileEvidencePriority !== false

  let selectedProfileId: AdaptiveProfileId = "PROFILE-A"
  const factors: AdaptiveDecisionFactor[] = []

  // Factor 1: Operating System
  factors.push({
    id: "f-os",
    category: "OS_ARCHITECTURE",
    title: "Host Architecture Classification",
    observation: `Detected ${endpoint.platform.toUpperCase()} (${endpoint.osVersion}) host architecture.`,
    impactOnProfile: isWindows
      ? "Routes execution to Windows NT forensic primitives."
      : isLinux
      ? "Routes execution to POSIX/Linux eBPF kernel adapters."
      : "Routes execution to Cross-Platform socket adapters.",
  })

  // Factor 2: Telemetry Readiness & Posture
  factors.push({
    id: "f-readiness",
    category: "TELEMETRY_READINESS",
    title: "Endpoint Forensic Readiness",
    observation: `Host readiness score is ${endpoint.forensicReadinessScore}% with posture '${currentPosture.postureLevel}'.`,
    impactOnProfile:
      endpoint.forensicReadinessScore >= 85
        ? "Enables high-fidelity live telemetry collection."
        : "Constrains collection to minimal-impact metadata harvesting.",
  })

  // Factor 3: Investigation Category & Intent
  factors.push({
    id: "f-intent",
    category: "INTENT",
    title: "Forensic Intent Alignment",
    observation: `Campaign category is '${category}' with intent: "${investigation.intent}".`,
    impactOnProfile:
      category === "NETWORK ANOMALY"
        ? "Elevates socket flow and protocol metrics priority."
        : category === "PERSISTENCE ANALYSIS"
        ? "Elevates Registry Run keys and scheduled task dissection."
        : "Elevates process memory and handle table priority.",
  })

  // Factor 4: Safety & Host Isolation Constraints
  factors.push({
    id: "f-safety",
    category: "SAFETY_CONSTRAINT",
    title: "Safety & Isolation Boundary",
    observation: isIsolated
      ? "Host is currently ISOLATED from network; tunnel preservation required."
      : "Host is UNRESTRICTED; concurrent background activity active.",
    impactOnProfile: isIsolated
      ? "Prioritizes containment validation and offline persistence recovery."
      : "Applies non-disruptive live sampling.",
  })

  // Deterministic Decision Matrix
  if (isLinux) {
    selectedProfileId = "PROFILE-C"
  } else if (category === "NETWORK ANOMALY" || endpoint.platform === "macos") {
    selectedProfileId = "PROFILE-D"
  } else if (isIsolated || category === "PERSISTENCE ANALYSIS" || !volatilePriority) {
    selectedProfileId = "PROFILE-B"
  } else {
    selectedProfileId = "PROFILE-A"
  }

  const profileMeta = ADAPTIVE_PROFILES_META[selectedProfileId]

  // Construct collectors & sequence based on selected profile
  let collectors: string[] = []
  let collectionSequence: CollectionStepPlan[] = []
  let expectedEvidence: string[] = []

  switch (selectedProfileId) {
    case "PROFILE-A":
      collectors = [
        "etw_kernel_proc_trace",
        "volatile_handle_enumerator",
        "socket_pool_inspector",
        "code_signature_verifier",
      ]
      expectedEvidence = [
        "Process handle tables",
        "Active memory sections",
        "TCP/UDP connection states",
        "Loaded DLL signature status",
      ]
      collectionSequence = [
        {
          order: 1,
          action: "SAMPLE_VOLATILE_HANDLES",
          target: `${endpoint.hostname}:KernelHandleTable`,
          collector: "volatile_handle_enumerator",
          expectedArtifact: "handles.jsonl",
        },
        {
          order: 2,
          action: "TRACE_PROCESS_TREE",
          target: `${endpoint.hostname}:ETW_Microsoft-Windows-Kernel-Process`,
          collector: "etw_kernel_proc_trace",
          expectedArtifact: "proc_lineage.jsonl",
        },
        {
          order: 3,
          action: "MAP_ACTIVE_SOCKETS",
          target: `${endpoint.hostname}:NetStatSnapshot`,
          collector: "socket_pool_inspector",
          expectedArtifact: "socket_map.json",
        },
      ]
      break

    case "PROFILE-B":
      collectors = [
        "mft_usnjrnl_parser",
        "reg_hive_extractor",
        "winevt_security_stream",
        "task_scheduler_auditor",
      ]
      expectedEvidence = [
        "NTFS $MFT change journal",
        "Registry Run & Services keys",
        "Windows Security Event 4624/4688",
        "Scheduled Tasks XML definitions",
      ]
      collectionSequence = [
        {
          order: 1,
          action: "EXTRACT_PERSISTENCE_KEYS",
          target: `${endpoint.hostname}:HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`,
          collector: "reg_hive_extractor",
          expectedArtifact: "autoruns.json",
        },
        {
          order: 2,
          action: "PARSE_MFT_CHANGES",
          target: `${endpoint.hostname}:VolumeC:\\$UsnJrnl`,
          collector: "mft_usnjrnl_parser",
          expectedArtifact: "usn_journal.parquet",
        },
        {
          order: 3,
          action: "INGEST_SECURITY_LOGS",
          target: `${endpoint.hostname}:SecurityChannel`,
          collector: "winevt_security_stream",
          expectedArtifact: "winevt_4688.jsonl",
        },
      ]
      break

    case "PROFILE-C":
      collectors = [
        "ebpf_proc_monitor",
        "auditd_telemetry_stream",
        "netstat_socket_harvester",
        "systemd_unit_auditor",
      ]
      expectedEvidence = [
        "eBPF execve / fork tracepoints",
        "Auditd syscall records",
        "Listening AF_INET / AF_INET6 sockets",
        "Systemd transient timer units",
      ]
      collectionSequence = [
        {
          order: 1,
          action: "ATTACH_EBPF_EXECVE",
          target: `${endpoint.hostname}:tracepoint:syscalls:sys_enter_execve`,
          collector: "ebpf_proc_monitor",
          expectedArtifact: "ebpf_events.ringbuf",
        },
        {
          order: 2,
          action: "COLLECT_AUDITD_SYSCALLS",
          target: `${endpoint.hostname}:/var/log/audit/audit.log`,
          collector: "auditd_telemetry_stream",
          expectedArtifact: "auditd_events.jsonl",
        },
        {
          order: 3,
          action: "AUDIT_SYSTEMD_SERVICES",
          target: `${endpoint.hostname}:/etc/systemd/system`,
          collector: "systemd_unit_auditor",
          expectedArtifact: "services_inventory.json",
        },
      ]
      break

    case "PROFILE-D":
      collectors = [
        "pcap_flow_sampler",
        "dns_cache_inspector",
        "routing_table_dumper",
        "tls_sni_harvester",
      ]
      expectedEvidence = [
        "PCAP flow summaries",
        "Local DNS resolver cache",
        "Active IP route tables",
        "TLS Client Hello SNI metadata",
      ]
      collectionSequence = [
        {
          order: 1,
          action: "DUMP_DNS_RESOLVER_CACHE",
          target: `${endpoint.hostname}:DNSResolverCache`,
          collector: "dns_cache_inspector",
          expectedArtifact: "dns_cache.json",
        },
        {
          order: 2,
          action: "SAMPLE_PCAP_FLOWS",
          target: `${endpoint.hostname}:eth0`,
          collector: "pcap_flow_sampler",
          expectedArtifact: "network_flows.pcapng",
        },
      ]
      break
  }

  const rationale = `Selected ${profileMeta.id} (${profileMeta.name}) for ${endpoint.hostname} based on ${endpoint.platform.toUpperCase()} architecture, ${currentPosture.postureLevel} posture (${endpoint.forensicReadinessScore}% readiness), and '${category}' forensic requirements.`

  const profile: AdaptiveExecutionProfile = {
    id: selectedProfileId,
    name: profileMeta.name,
    platform: profileMeta.platform,
    focus: profileMeta.focus,
    impactPolicy: profileMeta.impactPolicy,
    targetEndpointId: endpoint.id,
    targetHostname: endpoint.hostname,
    collectors,
    collectionSequence,
    expectedEvidence,
    resourcePolicy: `Impact: ${profileMeta.impactPolicy} (<5% CPU, <100MB RAM, safe telemetry buffer)`,
    integrityPolicy: "SHA-256 + Merkle Tree cryptographic binding per collected artifact",
    provenancePolicy: "Non-Volatile Provenance Ledger (NVPL) chain-of-custody seal",
    readinessStatus: "READY",
  }

  const decision: AdaptiveDecision = {
    endpointId: endpoint.id,
    hostname: endpoint.hostname,
    selectedProfileId,
    profileName: profileMeta.name,
    rationale,
    factors,
    calculatedAt: new Date().toISOString(),
  }

  return { profile, decision }
}

export function deriveAllProfilesForInvestigation(
  investigation: Investigation,
  endpoints: Endpoint[]
): {
  profiles: Record<string, AdaptiveExecutionProfile>
  decisions: Record<string, AdaptiveDecision>
  postures: Record<string, EndpointPosture>
} {
  const profiles: Record<string, AdaptiveExecutionProfile> = {}
  const decisions: Record<string, AdaptiveDecision> = {}
  const postures: Record<string, EndpointPosture> = {}

  // Filter endpoints assigned to this investigation, or all available if none specified
  const targetEndpoints =
    investigation.targetEndpointIds.length > 0
      ? endpoints.filter((e) => investigation.targetEndpointIds.includes(e.id))
      : endpoints.slice(0, 3)

  for (const ep of targetEndpoints) {
    const posture = getEndpointPosture(ep)
    const { profile, decision } = deriveExecutionProfile(investigation, ep, posture)
    postures[ep.id] = posture
    profiles[ep.id] = profile
    decisions[ep.id] = decision
  }

  return { profiles, decisions, postures }
}
