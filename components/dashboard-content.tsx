"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Habit, HabitLog, Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { LogOut, Plus, Calendar, Award, BarChart3, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { KPICards } from "@/components/kpi-cards"
import { ProgressCharts } from "@/components/progress-charts"
import { HabitList } from "@/components/habit-list"
import { AddHabitDialog } from "@/components/add-habit-dialog"
import { DailyFocusView } from "@/components/daily-focus-view"
import { WeeklyView } from "@/components/weekly-view"
import  BadgesView  from "@/components/badges-view"


interface DashboardContentProps {
  user: User
}

type ViewType = "overview" | "daily" | "weekly" | "badges"

export function DashboardContent({ user }: DashboardContentProps) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>("overview")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)

    const { data: habitsData } = await supabase.from("habits").select("*").order("created_at", { ascending: false })

    const { data: logsData } = await supabase.from("habit_logs").select("*").order("date", { ascending: false })

    const { data: tasksData } = await supabase.from("tasks").select("*").order("date", { ascending: false })

    setHabits(habitsData || [])
    setLogs(logsData || [])
    setTasks(tasksData || [])
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

  const handleAddTask = async (title: string, date: string) => {
    const { error } = await supabase.from("tasks").insert({
      user_id: user.id,
      title,
      date,
      completed: false,
    })

    if (!error) {
      loadData()
    }
  }

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    const { error } = await supabase.from("tasks").update({ completed }).eq("id", taskId)

    if (!error) {
      loadData()
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId)

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

      <div className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <Button
              variant={currentView === "overview" ? "default" : "ghost"}
              onClick={() => setCurrentView("overview")}
              className="gap-2"
            >
              <Home className="size-4" />
              Overview
            </Button>
            <Button
              variant={currentView === "daily" ? "default" : "ghost"}
              onClick={() => setCurrentView("daily")}
              className="gap-2"
            >
              <Calendar className="size-4" />
              Daily Focus
            </Button>
            <Button
              variant={currentView === "weekly" ? "default" : "ghost"}
              onClick={() => setCurrentView("weekly")}
              className="gap-2"
            >
              <BarChart3 className="size-4" />
              Weekly
            </Button>
            <Button
              variant={currentView === "badges" ? "default" : "ghost"}
              onClick={() => setCurrentView("badges")}
              className="gap-2"
            >
              <Award className="size-4" />
              Badges
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {currentView === "overview" && (
          <>
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

            <div onClick={() => setCurrentView("daily")} className="cursor-pointer">
              <KPICards habits={habits} logs={logs} />
            </div>

            <div className="mt-8">
              <ProgressCharts habits={habits} logs={logs} />
            </div>

            <div className="mt-8">
              <HabitList habits={habits} logs={logs} onLogStatus={handleLogStatus} onDeleteHabit={handleDeleteHabit} />
            </div>
          </>
        )}

        {currentView === "daily" && (
          <DailyFocusView
            habits={habits}
            logs={logs}
            tasks={tasks}
            selectedDate={selectedDate}
            onLogStatus={handleLogStatus}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onDateChange={setSelectedDate}
          />
        )}

        {currentView === "weekly" && <WeeklyView habits={habits} logs={logs} />}

        {currentView === "badges" && <BadgesView habits={habits} logs={logs} />}
      </main>

      <AddHabitDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddHabit={handleAddHabit} />
    </div>
  )
}
