"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Habit, HabitLog } from "@/lib/types"
import { Check, X, Minus, Trash2 } from "lucide-react"

interface HabitListProps {
  habits: Habit[]
  logs: HabitLog[]
  onLogStatus: (habitId: string, date: string, status: "completed" | "missed" | "skipped") => void
  onDeleteHabit: (habitId: string) => void
}

export function HabitList({ habits, logs, onLogStatus, onDeleteHabit }: HabitListProps) {
  const today = new Date().toISOString().split("T")[0]

  const getStatusForToday = (habitId: string) => {
    const log = logs.find((l) => l.habit_id === habitId && l.date === today)
    return log?.status || null
  }

  const getWeekProgress = (habitId: string) => {
    const weekLogs = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const log = logs.find((l) => l.habit_id === habitId && l.date === dateStr)
      weekLogs.push(log?.status || null)
    }
    return weekLogs
  }

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-base font-medium text-muted-foreground sm:text-lg">No habits added yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add your first habit to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-lg font-semibold sm:text-xl">Today&apos;s Habits</h2>
      {habits.map((habit) => {
        const status = getStatusForToday(habit.id)
        const weekProgress = getWeekProgress(habit.id)

        return (
          <Card key={habit.id} className="transition-shadow hover:shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="size-3 shrink-0 rounded-full" style={{ backgroundColor: habit.color }} />
                    <h3 className="text-base font-semibold sm:text-lg">{habit.name}</h3>
                  </div>
                  {habit.description && (
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{habit.description}</p>
                  )}
                  <div className="mt-3 flex items-center gap-2 overflow-x-auto">
                    <span className="shrink-0 text-xs text-muted-foreground sm:text-sm">Last 7 days:</span>
                    <div className="flex gap-1">
                      {weekProgress.map((s, i) => (
                        <div
                          key={i}
                          className={`size-5 shrink-0 rounded-sm sm:size-6 ${
                            s === "completed"
                              ? "bg-green-500"
                              : s === "missed"
                                ? "bg-red-500"
                                : s === "skipped"
                                  ? "bg-yellow-500"
                                  : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 sm:items-center">
                  <div className="flex flex-1 gap-2 sm:flex-initial">
                    <Button
                      size="icon"
                      variant={status === "completed" ? "default" : "outline"}
                      onClick={() => onLogStatus(habit.id, today, "completed")}
                      className="h-11 w-11 transition-transform active:scale-95"
                    >
                      <Check className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant={status === "skipped" ? "default" : "outline"}
                      onClick={() => onLogStatus(habit.id, today, "skipped")}
                      className="h-11 w-11 transition-transform active:scale-95"
                    >
                      <Minus className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant={status === "missed" ? "default" : "outline"}
                      onClick={() => onLogStatus(habit.id, today, "missed")}
                      className="h-11 w-11 transition-transform active:scale-95"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDeleteHabit(habit.id)}
                    className="h-11 w-11 transition-transform active:scale-95"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
