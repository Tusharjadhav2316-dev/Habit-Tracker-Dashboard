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
          <p className="text-lg text-muted-foreground">No habits yet</p>
          <p className="text-sm text-muted-foreground">Add your first habit to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Today&apos;s Habits</h2>
      {habits.map((habit) => {
        const status = getStatusForToday(habit.id)
        const weekProgress = getWeekProgress(habit.id)

        return (
          <Card key={habit.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full" style={{ backgroundColor: habit.color }} />
                    <h3 className="text-lg font-semibold">{habit.name}</h3>
                  </div>
                  {habit.description && <p className="mt-1 text-sm text-muted-foreground">{habit.description}</p>}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Last 7 days:</span>
                    <div className="flex gap-1">
                      {weekProgress.map((s, i) => (
                        <div
                          key={i}
                          className={`size-6 rounded-sm ${
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
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant={status === "completed" ? "default" : "outline"}
                      onClick={() => onLogStatus(habit.id, today, "completed")}
                    >
                      <Check className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant={status === "skipped" ? "default" : "outline"}
                      onClick={() => onLogStatus(habit.id, today, "skipped")}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant={status === "missed" ? "default" : "outline"}
                      onClick={() => onLogStatus(habit.id, today, "missed")}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => onDeleteHabit(habit.id)}>
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
