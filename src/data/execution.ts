import { ExecutionPlan } from "@/types/execution"

export const MOCK_EXECUTION_PLANS: Record<string, ExecutionPlan> = {
  "inv-2026-001": {
    id: "exec-plan-001",
    investigationId: "inv-2026-001",
    title: "Adaptive Lateral Intrusion Quarantine & Acquisition",
    currentState: "EXECUTING",
    startedAt: "2026-09-29T14:20:00Z",
    commands: [
      {
        id: "cmd-101",
        commandText: "nexus-agent query --action=acquire_process_handles --pid=684 --output=secure://vault/art-001",
        targetEndpoint: "DC-PROD-PRIMARY (10.0.1.10)",
        status: "VERIFIED",
        exitCode: 0,
        executedAt: "2026-09-29T14:28:12Z",
        stdoutExcerpt: "Handle table enumerated. Total handles: 1,842. Volatile section memory dumped to sealed stream.",
      },
      {
        id: "cmd-102",
        commandText: "nexus-agent isolate-host --preserve-nexus-tunnel=true --reason='Kerberos credential exfiltration detected'",
        targetEndpoint: "FIN-WS-44 (10.0.4.44)",
        status: "VERIFIED",
        exitCode: 0,
        executedAt: "2026-09-29T14:48:00Z",
        stdoutExcerpt: "Host network filtering applied: default DENY all, allow TCP:8443 (Nexus Agent C2).",
      },
      {
        id: "cmd-103",
        commandText: "nexus-agent memory-scan --yara-rule='CobaltStrike_Beacon_x64' --kill-on-match=false",
        targetEndpoint: "FIN-WS-44 (10.0.4.44)",
        status: "EXECUTED",
        exitCode: 0,
        executedAt: "2026-09-29T15:05:22Z",
        stdoutExcerpt: "MATCH: Rule 'CobaltStrike_Beacon_x64' hit in PID 4812 at base address 0x7FFE00100000.",
      },
      {
        id: "cmd-104",
        commandText: "nexus-agent pcap-stream --interface=eth0 --filter='host 185.220.101.5 and port 443' --duration=300",
        targetEndpoint: "SEC-EGRESS-PROXY-01 (10.0.99.5)",
        status: "SENT",
      },
    ],
    adaptiveBranches: [
      {
        condition: "IF YARA rule 'CobaltStrike_Beacon_x64' matches on any workstation",
        triggeredAt: "2026-09-29T15:05:22Z",
        decisionRationale: "Identified active C2 beacon in explorer.exe memory space. Diverting investigation from passive log collection to real-time memory dissection and network perimeter capture.",
        divertedToStep: "step-2 (Adaptive Dissection)",
      },
    ],
    logs: [
      {
        id: "log-1",
        timestamp: "2026-09-29T14:20:00Z",
        level: "INFO",
        message: "Forensic Intent mapped to 4 adaptive stages across 3 target nodes.",
        rawProofHash: "9a8b7c6d5e...",
      },
      {
        id: "log-2",
        timestamp: "2026-09-29T14:48:01Z",
        level: "SECURITY",
        endpointId: "ep-ws-44",
        message: "Endpoint FIN-WS-44 entered ISOLATION state. Outbound lateral traffic blocked.",
        rawProofHash: "b1c2d3e4f5...",
      },
      {
        id: "log-3",
        timestamp: "2026-09-29T15:05:25Z",
        level: "WARN",
        endpointId: "ep-ws-44",
        message: "Adaptive Trigger fired: CobaltStrike C2 detected. Branching execution path.",
        rawProofHash: "c3d4e5f6a1...",
      },
    ],
  },
}
