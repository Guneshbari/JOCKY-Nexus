import { Investigation } from "@/types/investigation"
import { Endpoint } from "@/types/endpoint"
import { AdaptiveExecutionProfile } from "@/types/execution"
import { EvidenceArtifact, EvidenceClass, EvidenceType } from "@/types/evidence"
import { MOCK_EVIDENCE } from "@/data/evidence"

export function generateSimulatedEvidenceForInvestigation(
  investigation: Investigation,
  profiles: Record<string, AdaptiveExecutionProfile>,
  endpoints: Endpoint[]
): EvidenceArtifact[] {
  // If baseline investigation with predefined evidence exists, return baseline + any generated items
  const baseline = MOCK_EVIDENCE.filter((e) => e.investigationId === investigation.id)
  if (baseline.length > 0) {
    return baseline
  }

  // Generate deterministic artifacts for new or custom investigations
  const targetEndpoints =
    investigation.targetEndpointIds.length > 0
      ? endpoints.filter((e) => investigation.targetEndpointIds.includes(e.id))
      : endpoints.slice(0, 2)

  const artifacts: EvidenceArtifact[] = []
  let leafIndex = 1
  let prevHash = "0000000000000000000000000000000000000000000000000000000000000000"

  targetEndpoints.forEach((ep, epIdx) => {
    const profile = profiles[ep.id]
    const profileId = profile?.id ?? "PROFILE-A"
    const profileName = profile?.name ?? "VOLATILE TRIAGE"

    // Artifact 1: Process / Memory Indicator
    const artId1 = `art-${investigation.id.replace("inv-", "")}-0${epIdx * 2 + 1}`
    const sha1 = Array.from({ length: 64 }, (_, i) =>
      ((i * 13 + epIdx * 7 + 1) % 16).toString(16)
    ).join("")
    const chain1 = Array.from({ length: 64 }, (_, i) =>
      ((i * 17 + epIdx * 5 + 3) % 16).toString(16)
    ).join("")

    const art1: EvidenceArtifact = {
      id: artId1,
      investigationId: investigation.id,
      endpointId: ep.id,
      endpointHostname: ep.hostname,
      name: `${ep.hostname.toLowerCase()}_process_lineage.jsonl`,
      type: "PROCESS_DUMP",
      evidenceClass: "PROCESS",
      executionProfileId: profileId,
      executionProfileName: profileName,
      collector: profile?.collectors[0] ?? "volatile_handle_enumerator",
      sizeBytes: 148200 + epIdx * 25400,
      sha256: sha1,
      collectedAt: new Date(Date.now() - 3600000 + epIdx * 600000).toISOString(),
      sourcePath: `${ep.platform === "windows" ? "C:\\Windows\\System32" : "/usr/bin"}\\process_tree`,
      chainHash: chain1,
      previousChainHash: prevHash,
      merkleLeafIndex: leafIndex++,
      integrityVerified: true,
      integrityStatus: "VERIFIED",
      provenanceStatus: "SEALED",
      normalizedType: "PROCESS_LINEAGE_STREAM",
      schemaStatus: "NORMALIZED",
      mitreTechniqueId: "T1059.001",
      mitreTechniqueName: "Command and Scripting Interpreter",
      mitreTactic: "Execution",
      mitreConfidence: "HIGH",
      mitreObservation: `Corroborated execution lineage spawned on ${ep.hostname} matching forensic intent: "${investigation.intent.slice(0, 60)}..."`,
      tags: ["Process", "Execution", "Lineage"],
      metadata: {
        hostPlatform: ep.platform,
        collectorEngine: profile?.collectors[0] ?? "nexus-native-collector",
        compression: "zstd-v1.5",
      },
      custodyChain: [
        {
          timestamp: new Date(Date.now() - 3600000 + epIdx * 600000).toISOString(),
          action: "COLLECTED",
          operator: `agent:nexus-${ep.id}`,
          nodeId: ep.id,
          signature: "3045022100aa88...",
        },
        {
          timestamp: new Date(Date.now() - 3590000 + epIdx * 600000).toISOString(),
          action: "SEALED",
          operator: "provenance:merkle-tree-writer",
          nodeId: "nexus-ledger-01",
          signature: "3046022100bb99...",
        },
      ],
    }
    prevHash = chain1
    artifacts.push(art1)

    // Artifact 2: Network / Filesystem depending on platform
    const artId2 = `art-${investigation.id.replace("inv-", "")}-0${epIdx * 2 + 2}`
    const sha2 = Array.from({ length: 64 }, (_, i) =>
      ((i * 19 + epIdx * 11 + 7) % 16).toString(16)
    ).join("")
    const chain2 = Array.from({ length: 64 }, (_, i) =>
      ((i * 23 + epIdx * 3 + 9) % 16).toString(16)
    ).join("")

    const isNetwork = epIdx % 2 === 0
    const evClass: EvidenceClass = isNetwork ? "NETWORK" : "FILESYSTEM"
    const evType: EvidenceType = isNetwork ? "PCAP_NETWORK" : "FILE_ARTIFACT"

    const art2: EvidenceArtifact = {
      id: artId2,
      investigationId: investigation.id,
      endpointId: ep.id,
      endpointHostname: ep.hostname,
      name: isNetwork
        ? `${ep.hostname.toLowerCase()}_socket_flows.pcap`
        : `${ep.hostname.toLowerCase()}_filesystem_journal.csv`,
      type: evType,
      evidenceClass: evClass,
      executionProfileId: profileId,
      executionProfileName: profileName,
      collector: profile?.collectors[1] ?? (isNetwork ? "socket_pool_inspector" : "mft_usnjrnl_parser"),
      sizeBytes: 2548900 + epIdx * 82000,
      sha256: sha2,
      collectedAt: new Date(Date.now() - 3540000 + epIdx * 600000).toISOString(),
      sourcePath: isNetwork ? "eth0:LivePacketSocket" : "C:\\$Extend\\$UsnJrnl",
      chainHash: chain2,
      previousChainHash: prevHash,
      merkleLeafIndex: leafIndex++,
      integrityVerified: true,
      integrityStatus: "VERIFIED",
      provenanceStatus: "SEALED",
      normalizedType: isNetwork ? "NETWORK_SOCKET_METRIC" : "FILESYSTEM_AUDIT_LOG",
      schemaStatus: "NORMALIZED",
      mitreTechniqueId: isNetwork ? "T1071.001" : "T1490",
      mitreTechniqueName: isNetwork
        ? "Application Layer Protocol: Web Protocols"
        : "Inhibit System Recovery",
      mitreTactic: isNetwork ? "Command and Control" : "Impact",
      mitreConfidence: "MEDIUM",
      mitreObservation: isNetwork
        ? `Observed persistent socket handshakes from ${ep.ipAddress} over secure telemetry channel.`
        : `Identified filesystem attribute changes correlated with case intent.`,
      tags: isNetwork ? ["PCAP", "Network", "Sockets"] : ["MFT", "Filesystem", "Journal"],
      metadata: {
        flowPackets: 4820,
        integritySeal: "SHA-256",
      },
      custodyChain: [
        {
          timestamp: new Date(Date.now() - 3540000 + epIdx * 600000).toISOString(),
          action: "COLLECTED",
          operator: `agent:nexus-${ep.id}`,
          nodeId: ep.id,
          signature: "3045022100cc11...",
        },
        {
          timestamp: new Date(Date.now() - 3530000 + epIdx * 600000).toISOString(),
          action: "SEALED",
          operator: "provenance:merkle-tree-writer",
          nodeId: "nexus-ledger-01",
          signature: "3046022100dd22...",
        },
      ],
    }
    prevHash = chain2
    artifacts.push(art2)
  })

  return artifacts
}
