"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, Trash2, Play } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { useStudyStore } from "@/lib/store/study-store"
import type { Task } from "@/lib/types/study"

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks: initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [filter, setFilter] = useState<"all" | "week" | "month">("week")
  const router = useRouter()
  const supabase = createBrowserClient()
  const { startPomodoro } = useStudyStore()

  const filteredTasks = tasks.filter((task) => {
    if (!task.due_date) return filter === "all"
    const dueDate = new Date(task.due_date)
    const now = new Date()

    if (filter === "week") {
      const weekFromNow = new Date()
      weekFromNow.setDate(weekFromNow.getDate() + 7)
      return dueDate <= weekFromNow
    } else if (filter === "month") {
      const monthFromNow = new Date()
      monthFromNow.setMonth(monthFromNow.getMonth() + 1)
      return dueDate <= monthFromNow
    }
    return true
  })

  const handleDelete = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId)

    if (error) {
      toast.error("Failed to delete task")
    } else {
      toast.success("Task deleted")
      setTasks(tasks.filter((t) => t.id !== taskId))
      router.refresh()
    }
  }

  const handleStartPomodoro = (taskId: string, taskTitle: string) => {
    startPomodoro(taskId)
    toast.success(`Started Pomodoro for: ${taskTitle}`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Task List
            </CardTitle>
            <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Tasks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No tasks found for this period</div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border-l-4 bg-card hover:bg-accent transition-colors ${getPriorityColor(task.priority)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground">{task.title}</h4>
                      {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {task.due_date && <span>Due: {format(new Date(task.due_date), "MMM d, yyyy")}</span>}
                        {task.subject && <span>{task.subject}</span>}
                        <span className="capitalize">{task.priority} priority</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartPomodoro(task.id, task.title)}
                        title="Start Pomodoro"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)} title="Delete task">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
