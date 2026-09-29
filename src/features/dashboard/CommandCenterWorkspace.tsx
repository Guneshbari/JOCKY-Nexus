"use client"

import React, { useState } from "react"
import {
  CommandCenterHeader,
  JudgeDemoController,
  GlobalInvestigationContext,
  CommandMetricStrip,
  AdaptiveExecutionAnalytics,
  InvestigationOperationsTable,
  EndpointFleetAnalytics,
  EvidenceIntegrityAnalytics,
  ProvenanceHealthCard,
  NetworkIntelligenceSummary,
  MitreIntelligenceSummary,
  UnifiedActivityTimeline,
  NewInvestigationModal,
} from "@/features/dashboard"

export function CommandCenterWorkspace() {
  const [isJudgeDemoActive, setIsJudgeDemoActive] = useState<boolean>(false)

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* 1. Definitive Command Center Header */}
      <CommandCenterHeader
        isJudgeDemoActive={isJudgeDemoActive}
        onToggleJudgeDemo={() => setIsJudgeDemoActive((prev) => !prev)}
      />

      {/* 2. Interactive Judge Demo 8-Step Walkthrough Stepper */}
      {isJudgeDemoActive && (
        <JudgeDemoController
          isOpen={isJudgeDemoActive}
          onClose={() => setIsJudgeDemoActive(false)}
        />
      )}

      {/* 3. Active Case Operational Context Banner with Switcher */}
      <GlobalInvestigationContext />

      {/* 4. Global 8-Card Metric Strip (Cases, Endpoints, Evidence, Integrity, TTPs, Flows, Provenance) */}
      <CommandMetricStrip />

      {/* 5. Core USP Showcase: Adaptive Execution Intelligence & Profile Distribution */}
      <AdaptiveExecutionAnalytics />

      {/* 6. Investigation Operations Fleet: Interactive Filterable Table */}
      <InvestigationOperationsTable />

      {/* 7. 4-Card Cross-Phase Intelligence Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EndpointFleetAnalytics />
        <EvidenceIntegrityAnalytics />
        <NetworkIntelligenceSummary />
        <MitreIntelligenceSummary />
      </div>

      {/* 8. Tamper-Evident Provenance Health Card */}
      <ProvenanceHealthCard />

      {/* 9. Unified Investigation Activity Timeline Across All 6 Phases */}
      <UnifiedActivityTimeline />

      {/* 10. Interactive Modal: New Investigation Launcher */}
      <NewInvestigationModal />
    </div>
  )
}
