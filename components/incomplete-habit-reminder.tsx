"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import type { Habit, HabitLog } from "@/lib/types"

interface IncompleteHabitReminderProps {
  habits: Habit[]
  logs: HabitLog[]
  onCompleteNow: () => void
}

export function IncompleteHabitReminder({ habits, logs, onCompleteNow }: IncompleteHabitReminderProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkReminder = () => {
      const today = new Date().toISOString().split("T")[0]
      const currentHour = new Date().getHours()

      // Check if it's past 9 PM (21:00)
      if (currentHour < 21) return

      // Check if already dismissed today
      const dismissedDate = localStorage.getItem("habit-reminder-dismissed")
      if (dismissedDate === today) return

      // Check for incomplete habits
      const todayLogs = logs.filter((log) => log.date === today)
      const completedCount = todayLogs.filter((log) => log.status === "completed").length
      const totalHabits = habits.length

      // Show reminder if there are incomplete habits
      if (totalHabits > 0 && completedCount < totalHabits) {
        setIsOpen(true)
      }
    }

    // Check on mount
    checkReminder()

    // Check every 30 minutes
    const interval = setInterval(checkReminder, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [habits, logs])

  const handleDismiss = () => {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem("habit-reminder-dismissed", today)
    setIsOpen(false)
  }

  const handleCompleteNow = () => {
    setIsOpen(false)
    onCompleteNow()
  }

  const today = new Date().toISOString().split("T")[0]
  const todayLogs = logs.filter((log) => log.date === today)
  const completedCount = todayLogs.filter((log) => log.status === "completed").length
  const totalHabits = habits.length
  const remainingHabits = totalHabits - completedCount

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
            <AlertCircle className="size-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <DialogTitle className="text-center">Don't Break Your Streak!</DialogTitle>
          <DialogDescription className="text-center">
            You still have {remainingHabits} {remainingHabits === 1 ? "habit" : "habits"} incomplete today. Complete
            them now to maintain your progress.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={handleCompleteNow} className="w-full">
            Complete Now
          </Button>
          <Button variant="outline" onClick={handleDismiss} className="w-full bg-transparent">
            Dismiss for Today
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
