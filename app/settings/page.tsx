import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsInterface } from "@/components/settings-interface"
import { Settings } from "lucide-react"

export default async function SettingsPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Settings & Preferences
        </h1>
        <p className="text-muted-foreground mt-2">Customize your AI Meeting Summarizer experience</p>
      </div>

      <SettingsInterface user={user} profile={profile} />
    </div>
  )
}
