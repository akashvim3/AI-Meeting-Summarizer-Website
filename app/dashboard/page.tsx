import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FileUpload } from "@/components/file-upload"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { RecentMeetings } from "@/components/recent-meetings"
import { QuickActions } from "@/components/quick-actions"

export default async function DashboardPage() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Get the user from the server
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome back, {user.user_metadata?.full_name || user.email}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Upload your meeting recordings or transcripts to get started with AI-powered summarization.
        </p>
      </div>

      <AnalyticsDashboard userId={user.id} />

      <QuickActions />

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Upload New Meeting</h2>
        <FileUpload />
      </div>

      <RecentMeetings userId={user.id} />
    </div>
  )
}
