"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Habit, HabitLog } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { LogOut, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { KPICards } from "@/components/kpi-cards"
import { ProgressCharts } from "@/components/progress-charts"
import { HabitList } from "@/components/habit-list"
import { AddHabitDialog } from "@/components/add-habit-dialog"

interface DashboardContentProps {
  user: User
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)

    const { data: habitsData } = await supabase.from("habits").select("*").order("created_at", { ascending: false })

    const { data: logsData } = await supabase.from("habit_logs").select("*").order("date", { ascending: false })

    setHabits(habitsData || [])
    setLogs(logsData || [])
    setIsLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handleAddHabit = async (habit: Omit<Habit, "id" | "user_id" | "created_at">) => {
    const { error } = await supabase.from("habits").insert({
      ...habit,
      user_id: user.id,
    })

    if (!error) {
      loadData()
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteHabit = async (habitId: string) => {
    const { error } = await supabase.from("habits").delete().eq("id", habitId)

    if (!error) {
      loadData()
    }
  }

  const handleLogStatus = async (habitId: string, date: string, status: "completed" | "missed" | "skipped") => {
    const { error } = await supabase.from("habit_logs").upsert(
      {
        habit_id: habitId,
        user_id: user.id,
        date,
        status,
      },
      { onConflict: "habit_id,date" },
    )

    if (!error) {
      loadData()
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="size-5" />
        </Button>
      </DashboardHeader>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Habits</h1>
            <p className="text-muted-foreground">Track your daily progress and build consistency</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            Add Habit
          </Button>
        </div>

        <KPICards habits={habits} logs={logs} />

        <div className="mt-8">
          <ProgressCharts habits={habits} logs={logs} />
        </div>

        <div className="mt-8">
          <HabitList habits={habits} logs={logs} onLogStatus={handleLogStatus} onDeleteHabit={handleDeleteHabit} />
        </div>
      </main>

      <AddHabitDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddHabit={handleAddHabit} />
    </div>
  )
}
