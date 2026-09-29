"use client"

import React from "react"
import { Sidebar } from "@/components/navigation/Sidebar"
import { Header } from "@/components/navigation/Header"
import { JudgeDemoController } from "@/features/dashboard/JudgeDemoController"
import { useUIStore } from "@/store/uiStore"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { isJudgeDemoActive } = useUIStore()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-100 font-sans text-black">
      {/* Neo-Brutalist Sidebar */}
      <Sidebar />

      {/* Main Body */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable Page Canvas */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 xs:p-4 sm:p-6 md:p-8 bg-[#F4F4F0] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 min-w-0 w-full">
            {isJudgeDemoActive && <JudgeDemoController />}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
