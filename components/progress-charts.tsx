"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Habit, HabitLog } from "@/lib/types"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface ProgressChartsProps {
  habits: Habit[]
  logs: HabitLog[]
}

export function ProgressCharts({ habits, logs }: ProgressChartsProps) {
  // Monthly bar chart data
  const getLast30DaysData = () => {
    const data = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const dayLogs = logs.filter((log) => log.date === dateStr)
      const completed = dayLogs.filter((log) => log.status === "completed").length
      const total = habits.length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

      data.push({
        date: date.getDate(),
        percentage,
        completed,
        total,
      })
    }
    return data
  }

  const monthlyData = getLast30DaysData()

  // Heatmap data for consistency
  const getHeatmapData = () => {
    const data = []
    for (let i = 89; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const dayLogs = logs.filter((log) => log.date === dateStr)
      const completed = dayLogs.filter((log) => log.status === "completed").length

      data.push({
        date: dateStr,
        value: completed,
      })
    }
    return data
  }

  const heatmapData = getHeatmapData()

  const getColor = (percentage: number) => {
    if (percentage >= 80) return "hsl(142, 71%, 45%)" // Green
    if (percentage >= 60) return "hsl(47, 96%, 53%)" // Yellow
    if (percentage >= 40) return "hsl(25, 95%, 53%)" // Orange
    return "hsl(0, 84%, 60%)" // Red
  }

  const getHeatColor = (value: number) => {
    if (value === 0) return "hsl(var(--muted))"
    if (value >= 4) return "hsl(142, 71%, 35%)"
    if (value >= 3) return "hsl(142, 71%, 45%)"
    if (value >= 2) return "hsl(142, 71%, 60%)"
    return "hsl(142, 71%, 75%)"
  }

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Monthly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {habits.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No data yet. Add habits to see your progress!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <p className="text-xs font-medium sm:text-sm">
                            {data.completed}/{data.total} completed
                          </p>
                          <p className="text-xs text-muted-foreground sm:text-sm">{data.percentage}%</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.percentage)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">90-Day Consistency</CardTitle>
        </CardHeader>
        <CardContent>
          {habits.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No activity yet. Start tracking habits!
            </div>
          ) : (
            <>
              <div className="grid grid-cols-13 gap-0.5 sm:gap-1">
                {heatmapData.map((day, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-sm transition-colors hover:opacity-80"
                    style={{ backgroundColor: getHeatColor(day.value) }}
                    title={`${day.date}: ${day.value} habits completed`}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground sm:mt-4 sm:text-sm">
                <span>Less</span>
                <div className="flex gap-0.5 sm:gap-1">
                  {[0, 1, 2, 3, 4].map((val) => (
                    <div
                      key={val}
                      className="size-2.5 rounded-sm sm:size-3"
                      style={{ backgroundColor: getHeatColor(val) }}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
