import type { ReactNode } from "react"

interface DashboardHeaderProps {
  children?: ReactNode
}

export function DashboardHeader({ children }: DashboardHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">H</span>
          </div>
          <span className="text-xl font-semibold">Habit Tracker</span>
        </div>
        {children}
      </div>
    </header>
  )
}
