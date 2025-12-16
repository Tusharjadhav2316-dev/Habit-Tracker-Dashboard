import { Flame, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StreakFeedbackProps {
  streak: number
}

export function StreakFeedback({ streak }: StreakFeedbackProps) {
  if (streak === 0) {
    return (
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          Start today to build your first streak!
        </AlertDescription>
      </Alert>
    )
  }

  if (streak >= 3) {
    return (
      <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <Flame className="size-4 text-orange-600 dark:text-orange-400" />
        <AlertDescription className="text-orange-800 dark:text-orange-200">
          Great consistency! Keep going - you're on a {streak} day streak!
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
