"use client"

import { Trophy, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Habit } from "@/lib/types"

interface BadgesViewProps {
  habits: Habit[]
  logs: any[] // you can strongly type this later
}

type Badge = {
  id: string
  title: string
  description: string
  earned: boolean
  icon: React.ReactNode
}

export default function BadgesView({ habits, logs }: BadgesViewProps) {
  // Example simple logic (can be improved later)
  const hasAnyHabit = habits.length > 0

  const badges: Badge[] = [
    {
      id: "first-habit",
      title: "First Step",
      description: "Create your first habit",
      earned: hasAnyHabit,
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
    },
    {
      id: "3-day-streak",
      title: "3-Day Streak",
      description: "Complete habits for 3 days in a row",
      earned: false,
      icon: <Lock className="h-5 w-5 text-muted-foreground" />,
    },
    {
      id: "7-day-streak",
      title: "7-Day Streak",
      description: "Complete habits for 7 days in a row",
      earned: false,
      icon: <Lock className="h-5 w-5 text-muted-foreground" />,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Badges & Rewards</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center ${
              badge.earned ? "bg-background" : "opacity-60"
            }`}
          >
            {badge.icon}
            <div className="font-medium">{badge.title}</div>
            <p className="text-sm text-muted-foreground">{badge.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
