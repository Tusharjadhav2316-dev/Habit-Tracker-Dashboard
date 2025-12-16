"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Habit, HabitLog } from "@/lib/types"
import { Check, X, Minus } from "lucide-react"

interface WeeklyViewProps {
  habits: Habit[]
  logs: HabitLog[]
}

export function WeeklyView({ habits, logs }: WeeklyViewProps) {
  const getWeekDays = () => {
    const days = []
    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)
      days.push(day)
    }
    return days
  }

  const weekDays = getWeekDays()

  const getDayCompletion = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    const dayLogs = logs.filter((log) => log.date === dateStr)
    const completed = dayLogs.filter((log) => log.status === "completed").length
    const total = habits.length
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const getHabitStatusForDate = (habitId: string, date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    const log = logs.find((l) => l.habit_id === habitId && l.date === dateStr)
    return log?.status || null
  }

  const weekCompletion = weekDays.reduce(
    (acc, day) => {
      const { completed, total } = getDayCompletion(day)
      return { completed: acc.completed + completed, total: acc.total + total }
    },
    { completed: 0, total: 0 },
  )

  const weekPercentage =
    weekCompletion.total > 0 ? Math.round((weekCompletion.completed / weekCompletion.total) * 100) : 0

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Week Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Week Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-center">
            <p className="text-3xl font-bold sm:text-4xl">{weekPercentage}%</p>
            <p className="text-xs text-muted-foreground sm:text-sm">Weekly Completion</p>
          </div>
        </CardContent>
      </Card>

      {/* Daily Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-7">
        {weekDays.map((day, index) => {
          const { completed, total, percentage } = getDayCompletion(day)
          const isToday = day.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]

          return (
            <Card key={index} className={isToday ? "border-primary" : ""}>
              <CardContent className="p-3 sm:p-4">
                <div className="text-center">
                  <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="text-base font-semibold sm:text-lg">{day.getDate()}</p>
                  <div className="relative mx-auto mt-2 size-16 sm:mt-3 sm:size-20">
                    <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray={`${percentage * 2.513} 251.3`}
                        className="text-primary transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold sm:text-sm">{percentage}%</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground sm:mt-2">
                    {completed}/{total}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Weekly Habit Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Weekly Habit Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          {habits.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No habits yet. Add one from the Overview!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium sm:px-4 sm:text-sm">Habit</th>
                    {weekDays.map((day, index) => (
                      <th key={index} className="px-1 py-2 text-center text-xs font-medium sm:px-2">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {habits.map((habit) => (
                    <tr key={habit.id} className="border-t">
                      <td className="px-2 py-2 sm:px-4 sm:py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2 shrink-0 rounded-full sm:size-3"
                            style={{ backgroundColor: habit.color }}
                          />
                          <span className="truncate text-xs sm:text-sm">{habit.name}</span>
                        </div>
                      </td>
                      {weekDays.map((day, index) => {
                        const status = getHabitStatusForDate(habit.id, day)
                        return (
                          <td key={index} className="px-1 py-2 text-center sm:px-2 sm:py-3">
                            {status === "completed" ? (
                              <div className="mx-auto flex size-5 items-center justify-center rounded-full bg-green-500 sm:size-6">
                                <Check className="size-3 text-white sm:size-4" />
                              </div>
                            ) : status === "skipped" ? (
                              <div className="mx-auto flex size-5 items-center justify-center rounded-full bg-yellow-500 sm:size-6">
                                <Minus className="size-3 text-white sm:size-4" />
                              </div>
                            ) : status === "missed" ? (
                              <div className="mx-auto flex size-5 items-center justify-center rounded-full bg-red-500 sm:size-6">
                                <X className="size-3 text-white sm:size-4" />
                              </div>
                            ) : (
                              <div className="mx-auto size-5 rounded-full bg-muted sm:size-6" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
