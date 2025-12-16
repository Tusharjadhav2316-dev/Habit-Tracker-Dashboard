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
import { BadgesView } from "@/components/badges-view"
import { IncompleteHabitReminder } from "@/components/incomplete-habit-reminder"
import { StreakFeedback } from "@/components/streak-feedback"

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

  const calculateStreak = () => {
    const sortedDates = [...new Set(logs.map((log) => log.date))].sort().reverse()
    let streak = 0
    const today = new Date()

    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toISOString().split("T")[0]

      const dayLogs = logs.filter((log) => log.date === dateStr)
      const completed = dayLogs.filter((log) => log.status === "completed").length

      if (completed > 0) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const currentStreak = calculateStreak()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <IncompleteHabitReminder habits={habits} logs={logs} onCompleteNow={() => setCurrentView("daily")} />

      <DashboardHeader>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="size-5" />
        </Button>
      </DashboardHeader>

      <div className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="no-scrollbar flex gap-1 overflow-x-auto">
            <Button
              variant={currentView === "overview" ? "default" : "ghost"}
              onClick={() => setCurrentView("overview")}
              className="gap-2 whitespace-nowrap"
            >
              <Home className="size-4" />
              <span className="hidden sm:inline">Overview</span>
            </Button>
            <Button
              variant={currentView === "daily" ? "default" : "ghost"}
              onClick={() => setCurrentView("daily")}
              className="gap-2 whitespace-nowrap"
            >
              <Calendar className="size-4" />
              <span className="hidden sm:inline">Daily Focus</span>
            </Button>
            <Button
              variant={currentView === "weekly" ? "default" : "ghost"}
              onClick={() => setCurrentView("weekly")}
              className="gap-2 whitespace-nowrap"
            >
              <BarChart3 className="size-4" />
              <span className="hidden sm:inline">Weekly</span>
            </Button>
            <Button
              variant={currentView === "badges" ? "default" : "ghost"}
              onClick={() => setCurrentView("badges")}
              className="gap-2 whitespace-nowrap"
            >
              <Award className="size-4" />
              <span className="hidden sm:inline">Badges</span>
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {currentView === "overview" && (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">Your Habits</h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                  Track your daily progress and build consistency
                </p>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                <Plus className="mr-2 size-4" />
                Add Habit
              </Button>
            </div>

            <div className="mb-6">
              <StreakFeedback streak={currentStreak} />
            </div>

            <div onClick={() => setCurrentView("daily")} className="cursor-pointer">
              <KPICards habits={habits} logs={logs} />
            </div>

            <div className="mt-6 sm:mt-8">
              <ProgressCharts habits={habits} logs={logs} />
            </div>

            <div className="mt-6 sm:mt-8">
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
