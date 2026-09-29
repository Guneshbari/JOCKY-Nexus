import React from "react"
import { Metadata } from "next"
import {
  DashboardHeader,
  SystemOverviewCards,
  ActiveInvestigationsTable,
  AdaptiveExecutionStatus,
  EndpointHealthCard,
  EvidenceIntegrityCard,
  MitreCoverageCard,
  NetworkSnapshotCard,
  InvestigationActivityTimeline,
  NewInvestigationModal,
} from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Command Console | JOCKY Nexus",
  description: "Operational posture, active investigations, endpoint health, and adaptive forensic execution.",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Command Header with Operational Posture & Simulation Controls */}
      <DashboardHeader />

      {/* 2. System Overview: 6 Core Posture Metrics */}
      <SystemOverviewCards />

      {/* 3. Core USP Showcase: Adaptive Forensic Execution Pipeline */}
      <AdaptiveExecutionStatus />

      {/* 4. Active Investigations: Interactive Table */}
      <ActiveInvestigationsTable />

      {/* 5. 4-Card Analytical Grid: Endpoints, Evidence, MITRE, Network */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EndpointHealthCard />
        <EvidenceIntegrityCard />
        <MitreCoverageCard />
        <NetworkSnapshotCard />
      </div>

      {/* 6. Recent Investigation Activity: Forensic Timeline */}
      <InvestigationActivityTimeline />

      {/* 7. Interactive Modal: New Investigation Launcher */}
      <NewInvestigationModal />
    </div>
  )
}
