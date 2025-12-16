"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Habit, HabitLog } from "@/lib/types"
import { Award, Flame, Target, TrendingUp, Star, Trophy } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface BadgesViewProps {
  habits: Habit[]
  logs: HabitLog[]
}

interface BadgeData {
  id: string
  name: string
  description: string
  icon: LucideIcon
  unlocked: boolean
  progress?: string
}

export function BadgesView({ habits, logs }: BadgesViewProps) {
  // Calculate badge unlocks
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

  const hasCreatedFirstHabit = habits.length > 0
  const hasCompletedHabit = logs.some((log) => log.status === "completed")
  const currentStreak = calculateStreak()
  const has3DayStreak = currentStreak >= 3
  const has7DayStreak = currentStreak >= 7

  // Check for perfect week
  const checkPerfectWeek = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekLogs = logs.filter((log) => new Date(log.date) >= weekAgo)

    const dateGroups = weekLogs.reduce(
      (acc, log) => {
        if (!acc[log.date]) acc[log.date] = []
        acc[log.date].push(log)
        return acc
      },
      {} as Record<string, typeof logs>,
    )

    return Object.values(dateGroups).every((dayLogs) => {
      const completed = dayLogs.filter((log) => log.status === "completed").length
      const total = habits.length
      return total > 0 && completed === total
    })
  }

  const hasPerfectWeek = checkPerfectWeek()

  // Check monthly consistency (90%+)
  const checkMonthlyConsistency = () => {
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)
    const monthLogs = logs.filter((log) => new Date(log.date) >= monthAgo)
    const completed = monthLogs.filter((log) => log.status === "completed").length
    const total = habits.length * 30
    return total > 0 && completed / total >= 0.9
  }

  const hasMonthlyConsistency = checkMonthlyConsistency()

  const badges: BadgeData[] = [
    {
      id: "first-habit",
      name: "First Steps",
      description: "Create your first habit",
      icon: Target,
      unlocked: hasCreatedFirstHabit,
      progress: hasCreatedFirstHabit ? "Unlocked!" : "Create a habit to start",
    },
    {
      id: "first-completion",
      name: "Getting Started",
      description: "Complete your first habit",
      icon: Award,
      unlocked: hasCompletedHabit,
      progress: hasCompletedHabit ? "Unlocked!" : "Complete any habit once",
    },
    {
      id: "3-day-streak",
      name: "3-Day Streak",
      description: "Achieve a 3-day streak",
      icon: Flame,
      unlocked: has3DayStreak,
      progress: has3DayStreak ? "Unlocked!" : `${currentStreak}/3 days`,
    },
    {
      id: "7-day-streak",
      name: "Week Warrior",
      description: "Achieve a 7-day streak",
      icon: Trophy,
      unlocked: has7DayStreak,
      progress: has7DayStreak ? "Unlocked!" : `${currentStreak}/7 days`,
    },
    {
      id: "perfect-week",
      name: "Perfect Week",
      description: "Complete 100% of habits for a full week",
      icon: Star,
      unlocked: hasPerfectWeek,
      progress: hasPerfectWeek ? "Unlocked!" : "Complete all habits for 7 days",
    },
    {
      id: "habit-collector",
      name: "Habit Collector",
      description: "Create 5 or more habits",
      icon: TrendingUp,
      unlocked: habits.length >= 5,
      progress: habits.length >= 5 ? "Unlocked!" : `${habits.length}/5 habits`,
    },
  ]

  const unlockedBadges = badges.filter((b) => b.unlocked)
  const lockedBadges = badges.filter((b) => !b.unlocked)

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Your Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-3xl font-bold sm:text-4xl">{unlockedBadges.length}</p>
            <p className="text-xs text-muted-foreground sm:text-sm">of {badges.length} badges earned</p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">Earned Badges</h3>
        {unlockedBadges.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground sm:text-base">
              Complete habits to unlock badges!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {unlockedBadges.map((badge) => (
              <Card key={badge.id} className="border-primary transition-shadow hover:shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 rounded-full bg-primary p-3 sm:p-4">
                      <badge.icon className="size-6 text-primary-foreground sm:size-8" />
                    </div>
                    <h4 className="text-sm font-semibold sm:text-base">{badge.name}</h4>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{badge.description}</p>
                    <p className="mt-2 text-xs font-medium text-primary">{badge.progress}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">Locked Badges</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {lockedBadges.map((badge) => (
            <Card key={badge.id} className="opacity-60 transition-opacity hover:opacity-75">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 rounded-full bg-muted p-3 sm:p-4">
                    <badge.icon className="size-6 text-muted-foreground sm:size-8" />
                  </div>
                  <h4 className="text-sm font-semibold sm:text-base">{badge.name}</h4>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{badge.description}</p>
                  <p className="mt-2 text-xs font-medium">{badge.progress}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
