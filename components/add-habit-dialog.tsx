"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Habit } from "@/lib/types"

interface AddHabitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddHabit: (habit: Omit<Habit, "id" | "user_id" | "created_at">) => void
}

const COLORS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Orange", value: "#f97316" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Red", value: "#ef4444" },
]

export function AddHabitDialog({ open, onOpenChange, onAddHabit }: AddHabitDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState(COLORS[0].value)
  const [goalType, setGoalType] = useState<"daily" | "weekly" | "custom">("daily")
  const [goalValue, setGoalValue] = useState("1")
  const [durationDays, setDurationDays] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const today = new Date()
    const endDate =
      goalType === "custom" && durationDays
        ? new Date(today.getTime() + (Number.parseInt(durationDays) - 1) * 24 * 60 * 60 * 1000)
        : null

    onAddHabit({
      name,
      description: description || null,
      color,
      goal_type: goalType,
      goal_value: Number.parseInt(goalValue),
      start_date: today.toISOString().split("T")[0],
      end_date: endDate ? endDate.toISOString().split("T")[0] : null,
      duration_days: goalType === "custom" ? Number.parseInt(durationDays) : null,
    })
    setName("")
    setDescription("")
    setColor(COLORS[0].value)
    setGoalType("daily")
    setGoalValue("1")
    setDurationDays("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
          <DialogDescription>Create a new habit to track your progress</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              placeholder="Exercise, Read, Meditate..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add details about your habit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`size-8 rounded-full transition-transform ${
                    color === c.value ? "scale-110 ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setColor(c.value)}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="goal-type">Goal Type</Label>
              <Select value={goalType} onValueChange={(v: "daily" | "weekly" | "custom") => setGoalType(v)}>
                <SelectTrigger id="goal-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {goalType === "custom" ? (
              <div className="space-y-2">
                <Label htmlFor="duration-days">Number of Days</Label>
                <Input
                  id="duration-days"
                  type="number"
                  min="1"
                  placeholder="e.g., 2 for exam prep"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="goal-value">Target</Label>
                <Input
                  id="goal-value"
                  type="number"
                  min="1"
                  value={goalValue}
                  onChange={(e) => setGoalValue(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
          {goalType === "custom" && durationDays && (
            <p className="text-sm text-muted-foreground">
              This habit will run for {durationDays} day{Number.parseInt(durationDays) !== 1 ? "s" : ""} starting today
            </p>
          )}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
