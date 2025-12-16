"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Habit, HabitLog, Task } from "@/lib/types"
import { Check, X, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react"

interface DailyFocusViewProps {
  habits: Habit[]
  logs: HabitLog[]
  tasks: Task[]
  selectedDate: string
  onLogStatus: (habitId: string, date: string, status: "completed" | "missed" | "skipped") => void
  onAddTask: (title: string, date: string) => void
  onToggleTask: (taskId: string, completed: boolean) => void
  onDeleteTask: (taskId: string) => void
  onDateChange: (date: string) => void
}

export function DailyFocusView({
  habits,
  logs,
  tasks,
  selectedDate,
  onLogStatus,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onDateChange,
}: DailyFocusViewProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [notes, setNotes] = useState("")

  const selectedDateObj = new Date(selectedDate)
  const dayLogs = logs.filter((log) => log.date === selectedDate)
  const dayTasks = tasks.filter((task) => task.date === selectedDate)

  const completedHabits = dayLogs.filter((log) => log.status === "completed").length
  const totalHabits = habits.length
  const completionPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0

  const completedTasks = dayTasks.filter((task) => task.completed).length
  const totalTasks = dayTasks.length

  const getHabitStatus = (habitId: string) => {
    const log = dayLogs.find((l) => l.habit_id === habitId)
    return log?.status || null
  }

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim(), selectedDate)
      setNewTaskTitle("")
    }
  }

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDateObj)
    newDate.setDate(newDate.getDate() + days)
    onDateChange(newDate.toISOString().split("T")[0])
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Date Navigation */}
      <Card>
        <CardContent className="flex items-center justify-between p-4 sm:p-6">
          <Button variant="outline" size="icon" onClick={() => changeDate(-1)} className="h-10 w-10 sm:h-11 sm:w-11">
            <ChevronLeft className="size-4" />
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-bold sm:text-2xl">
              {selectedDateObj.toLocaleDateString("en-US", {
                weekday: window.innerWidth >= 640 ? "long" : "short",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {selectedDate === new Date().toISOString().split("T")[0] ? "Today" : ""}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={() => changeDate(1)} className="h-10 w-10 sm:h-11 sm:w-11">
            <ChevronRight className="size-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Execution Progress Circle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Daily Execution</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative size-32 sm:size-40">
            <svg className="size-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${completionPercentage * 2.827} 282.7`}
                className="text-primary transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold sm:text-4xl">{completionPercentage}%</span>
              <span className="text-xs text-muted-foreground sm:text-sm">Complete</span>
            </div>
          </div>
          <div className="mt-4 flex gap-6 text-center sm:gap-8">
            <div>
              <p className="text-xl font-bold sm:text-2xl">{completedHabits}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Habits Done</p>
            </div>
            <div>
              <p className="text-xl font-bold sm:text-2xl">{completedTasks}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Tasks Done</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habits Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Today&apos;s Habits ({completedHabits}/{totalHabits})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          {habits.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No habits yet. Add one from the Overview!</p>
          ) : (
            habits.map((habit) => {
              const status = getHabitStatus(habit.id)
              return (
                <div
                  key={habit.id}
                  className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="size-3 shrink-0 rounded-full" style={{ backgroundColor: habit.color }} />
                    <span className={`text-sm sm:text-base ${status === "completed" ? "line-through opacity-50" : ""}`}>
                      {habit.name}
                    </span>
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant={status === "completed" ? "default" : "outline"}
                      onClick={() => onLogStatus(habit.id, selectedDate, "completed")}
                      className="h-9 flex-1 transition-transform active:scale-95 sm:h-10 sm:flex-initial"
                    >
                      <Check className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={status === "skipped" ? "default" : "outline"}
                      onClick={() => onLogStatus(habit.id, selectedDate, "skipped")}
                      className="h-9 flex-1 transition-transform active:scale-95 sm:h-10 sm:flex-initial"
                    >
                      <Minus className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={status === "missed" ? "default" : "outline"}
                      onClick={() => onLogStatus(habit.id, selectedDate, "missed")}
                      className="h-9 flex-1 transition-transform active:scale-95 sm:h-10 sm:flex-initial"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Tasks Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Today&apos;s Tasks ({completedTasks}/{totalTasks})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              className="text-sm sm:text-base"
            />
            <Button onClick={handleAddTask} className="h-10 w-10 shrink-0 sm:h-11 sm:w-11">
              <Plus className="size-4" />
            </Button>
          </div>
          {dayTasks.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No tasks yet. Add one above!</p>
          ) : (
            dayTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => onToggleTask(task.id, e.target.checked)}
                    className="size-4 shrink-0 cursor-pointer"
                  />
                  <span
                    className={`min-w-0 flex-1 break-words text-sm sm:text-base ${task.completed ? "line-through opacity-50" : ""}`}
                  >
                    {task.title}
                  </span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => onDeleteTask(task.id)} className="h-9 w-9 shrink-0">
                  <X className="size-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Daily Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write your thoughts, reflections, or plans..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="text-sm sm:text-base"
          />
        </CardContent>
      </Card>
    </div>
  )
}
