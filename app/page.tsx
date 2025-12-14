import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Target, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">H</span>
            </div>
            <span className="text-xl font-semibold">Habit Tracker</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            Build Better Habits, Track Your Progress
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground">
            A beautiful and intuitive habit tracker that helps you stay consistent, visualize your progress, and achieve
            your goals one day at a time.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Get Started <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950">
                <Target className="size-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold">Daily Tracking</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Log your habits every day with a simple and intuitive interface
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
                <TrendingUp className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold">Visual Progress</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                See your consistency with beautiful charts and heatmaps
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950">
                <Calendar className="size-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold">Streak Tracking</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Build momentum and maintain your streaks to stay motivated
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
