export type EndpointAgentStatus = "ONLINE" | "OFFLINE" | "DEGRADED" | "BUSY"

export type EndpointIsolationStatus = "UNRESTRICTED" | "ISOLATED" | "QUARANTINED"

export type EndpointPlatform = "linux" | "windows" | "macos"

export interface EndpointTelemetry {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  activeProcesses: number
  networkConnections: number
}

export interface Endpoint {
  id: string
  hostname: string
  ipAddress: string
  macAddress: string
  platform: EndpointPlatform
  osVersion: string
  agentVersion: string
  agentStatus: EndpointAgentStatus
  isolationStatus: EndpointIsolationStatus
  forensicReadinessScore: number
  tags: string[]
  environment: "PRODUCTION" | "STAGING" | "DEVELOPMENT" | "DMZ"
  lastSeen: string
  telemetry: EndpointTelemetry
  activeInvestigations: string[]
}
