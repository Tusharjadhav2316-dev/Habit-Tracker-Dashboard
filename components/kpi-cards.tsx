import { Card, CardContent } from "@/components/ui/card"
import type { Habit, HabitLog } from "@/lib/types"
import { Target, TrendingUp, Calendar, Flame } from "lucide-react"

interface KPICardsProps {
  habits: Habit[]
  logs: HabitLog[]
}

export function KPICards({ habits, logs }: KPICardsProps) {
  const today = new Date().toISOString().split("T")[0]
  const todayLogs = logs.filter((log) => log.date === today)
  const completedToday = todayLogs.filter((log) => log.status === "completed").length
  const totalToday = habits.length
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0

  // Calculate streak
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

  const last30Days = logs.filter((log) => {
    const logDate = new Date(log.date)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return logDate >= thirtyDaysAgo
  })

  const completedLast30 = last30Days.filter((log) => log.status === "completed").length
  const totalLast30 = habits.length * 30
  const monthlyRate = totalLast30 > 0 ? Math.round((completedLast30 / totalLast30) * 100) : 0

  const kpis = [
    {
      label: "Today's Progress",
      value: `${completedToday}/${totalToday}`,
      subtext: `${completionRate}% complete`,
      icon: Target,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
    },
    {
      label: "Current Streak",
      value: `${currentStreak}`,
      subtext: currentStreak === 1 ? "day" : "days",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      label: "Monthly Rate",
      value: `${monthlyRate}%`,
      subtext: "Last 30 days",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Total Habits",
      value: `${habits.length}`,
      subtext: "Active",
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                <p className="mt-2 text-3xl font-bold">{kpi.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{kpi.subtext}</p>
              </div>
              <div className={`rounded-lg p-3 ${kpi.bgColor}`}>
                <kpi.icon className={`size-5 ${kpi.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
