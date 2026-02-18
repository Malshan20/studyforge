"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { PomodoroSession, Task } from "@/lib/types/study"

interface SubjectBreakdownProps {
  sessions: PomodoroSession[]
  tasks: Task[]
  flashcards: any[]
}

export function SubjectBreakdown({ sessions, tasks, flashcards }: SubjectBreakdownProps) {
  // Aggregate time by subject from tasks and sessions
  const subjectTime: Record<string, number> = {}

  // Method 1: Get subjects from tasks
  tasks.forEach((task) => {
    if (task.subject) {
      const subject = task.subject
      const taskSessions = sessions.filter((s) => s.task_id === task.id)
      const minutes = taskSessions.reduce((acc, s) => acc + (s.duration_minutes || 25), 0)
      if (minutes > 0) {
        subjectTime[subject] = (subjectTime[subject] || 0) + minutes
      }
    }
  })

  // Method 2: If no data from tasks, aggregate all sessions as "General Study"
  if (Object.keys(subjectTime).length === 0 && sessions.length > 0) {
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration_minutes || 25), 0)
    subjectTime["General Study"] = totalMinutes
  }

  // Method 3: If still no data, show sample data from tasks by status
  if (Object.keys(subjectTime).length === 0 && tasks.length > 0) {
    const tasksBySubject: Record<string, number> = {}
    tasks.forEach((task) => {
      const subject = task.subject || "Other"
      tasksBySubject[subject] = (tasksBySubject[subject] || 0) + 1
    })
    // Convert task counts to time estimates (assume 1 hour per task)
    Object.entries(tasksBySubject).forEach(([subject, count]) => {
      subjectTime[subject] = count * 60
    })
  }

  const chartData = Object.entries(subjectTime)
    .map(([subject, minutes]) => ({
      name: subject,
      value: Number((minutes / 60).toFixed(1)),
      hours: Number((minutes / 60).toFixed(1)),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6) // Limit to top 6 subjects

  const COLORS = ["hsl(var(--primary))", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card>
        <CardHeader>
          <CardTitle>Subject Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p className="text-center">
                No subject data available yet.
                <br />
                <span className="text-sm">Complete Pomodoro sessions or add tasks with subjects to see your breakdown.</span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value} hours`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {chartData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-muted-foreground truncate">
                      {item.name}: <span className="font-medium text-foreground">{item.hours}h</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
