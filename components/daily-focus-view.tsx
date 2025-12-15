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
    <div className="space-y-6">
      {/* Date Navigation */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <Button variant="outline" size="icon" onClick={() => changeDate(-1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {selectedDateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedDate === new Date().toISOString().split("T")[0] ? "Today" : ""}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={() => changeDate(1)}>
            <ChevronRight className="size-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Execution Progress Circle */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Execution</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="relative size-40">
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
              <span className="text-4xl font-bold">{completionPercentage}%</span>
              <span className="text-sm text-muted-foreground">Complete</span>
            </div>
          </div>
          <div className="mt-4 flex gap-8 text-center">
            <div>
              <p className="text-2xl font-bold">{completedHabits}</p>
              <p className="text-sm text-muted-foreground">Habits Done</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{completedTasks}</p>
              <p className="text-sm text-muted-foreground">Tasks Done</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habits Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>
            Today&apos;s Habits ({completedHabits}/{totalHabits})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {habits.map((habit) => {
            const status = getHabitStatus(habit.id)
            return (
              <div key={habit.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full" style={{ backgroundColor: habit.color }} />
                  <span className={status === "completed" ? "line-through opacity-50" : ""}>{habit.name}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={status === "completed" ? "default" : "outline"}
                    onClick={() => onLogStatus(habit.id, selectedDate, "completed")}
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={status === "skipped" ? "default" : "outline"}
                    onClick={() => onLogStatus(habit.id, selectedDate, "skipped")}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={status === "missed" ? "default" : "outline"}
                    onClick={() => onLogStatus(habit.id, selectedDate, "missed")}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Tasks Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>
            Today&apos;s Tasks ({completedTasks}/{totalTasks})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
            <Button onClick={handleAddTask}>
              <Plus className="size-4" />
            </Button>
          </div>
          {dayTasks.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No tasks yet. Add one above!</p>
          ) : (
            dayTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => onToggleTask(task.id, e.target.checked)}
                    className="size-4 cursor-pointer"
                  />
                  <span className={task.completed ? "line-through opacity-50" : ""}>{task.title}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => onDeleteTask(task.id)}>
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
          <CardTitle>Daily Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write your thoughts, reflections, or plans..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  )
}
