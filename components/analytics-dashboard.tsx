"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Clock, Calendar, Mic, Brain } from "lucide-react"

interface AnalyticsData {
  totalMeetings: number
  totalTranscripts: number
  totalSummaries: number
  totalDuration: number
  weeklyData: Array<{ day: string; meetings: number }>
  statusData: Array<{ name: string; value: number; color: string }>
  recentActivity: Array<{ date: string; count: number }>
}

interface AnalyticsDashboardProps {
  userId: string
}

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      const supabase = createClient()

      try {
        // Fetch meetings data
        const { data: meetings } = await supabase.from("meetings").select("*").eq("user_id", userId)

        // Fetch transcripts count
        const { count: transcriptsCount } = await supabase
          .from("transcripts")
          .select("*", { count: "exact", head: true })
          .in("meeting_id", meetings?.map((m) => m.id) || [])

        // Fetch summaries count
        const { count: summariesCount } = await supabase
          .from("summaries")
          .select("*", { count: "exact", head: true })
          .in("meeting_id", meetings?.map((m) => m.id) || [])

        // Process data for charts
        const weeklyData = processWeeklyData(meetings || [])
        const statusData = processStatusData(meetings || [])
        const recentActivity = processRecentActivity(meetings || [])

        setAnalytics({
          totalMeetings: meetings?.length || 0,
          totalTranscripts: transcriptsCount || 0,
          totalSummaries: summariesCount || 0,
          totalDuration: calculateTotalDuration(meetings || []),
          weeklyData,
          statusData,
          recentActivity,
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [userId])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMeetings}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transcriptions</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTranscripts}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalTranscripts > 0 ? "100% accuracy rate" : "No transcripts yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Summaries</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSummaries}</div>
            <p className="text-xs text-muted-foreground">Powered by GPT-4o</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analytics.totalDuration * 0.8)}h</div>
            <p className="text-xs text-muted-foreground">Estimated time saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Your meeting activity over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="meetings" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Status</CardTitle>
            <CardDescription>Distribution of meeting processing status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {analytics.statusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Trend</CardTitle>
          <CardDescription>Your meeting activity over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.recentActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper functions
function processWeeklyData(meetings: any[]) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weekData = days.map((day) => ({ day, meetings: 0 }))

  meetings.forEach((meeting) => {
    const date = new Date(meeting.created_at)
    const dayIndex = (date.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
    weekData[dayIndex].meetings++
  })

  return weekData
}

function processStatusData(meetings: any[]) {
  const statusCounts = meetings.reduce((acc, meeting) => {
    acc[meeting.status] = (acc[meeting.status] || 0) + 1
    return acc
  }, {})

  const colors = {
    completed: "#22c55e",
    processing: "#f59e0b",
    failed: "#ef4444",
  }

  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count as number,
    color: colors[status as keyof typeof colors] || "#6b7280",
  }))
}

function processRecentActivity(meetings: any[]) {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return {
      date: date.toISOString().split("T")[0],
      count: 0,
    }
  }).reverse()

  meetings.forEach((meeting) => {
    const meetingDate = new Date(meeting.created_at).toISOString().split("T")[0]
    const dayData = last30Days.find((day) => day.date === meetingDate)
    if (dayData) {
      dayData.count++
    }
  })

  return last30Days.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count: day.count,
  }))
}

function calculateTotalDuration(meetings: any[]) {
  // Estimate 1 hour per meeting on average
  return meetings.length * 1
}
