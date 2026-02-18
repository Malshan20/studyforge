"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import type { PomodoroSession } from "@/lib/types/study"

interface StudyHoursChartProps {
  sessions: PomodoroSession[]
}

export function StudyHoursChart({ sessions }: StudyHoursChartProps) {
  // Group sessions by day
  const today = new Date()
  const weekStart = startOfWeek(today)
  const weekEnd = endOfWeek(today)
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const chartData = days.map((day) => {
    const daySessions = sessions.filter((s) => {
      const sessionDate = new Date(s.completed_at!)
      return format(sessionDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    })

    const hours = daySessions.reduce((acc, s) => acc + s.duration_minutes, 0) / 60

    return {
      date: format(day, "EEE"),
      hours: Number(hours.toFixed(1)),
    }
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader>
          <CardTitle>Study Hours This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
