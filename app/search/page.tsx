import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SearchInterface } from "@/components/search-interface"
import { Search } from "lucide-react"

export default async function SearchPage() {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Search className="h-8 w-8" />
          Search & History
        </h1>
        <p className="text-muted-foreground mt-2">Search through your meeting transcripts, summaries, and history</p>
      </div>

      <SearchInterface userId={user.id} />
    </div>
  )
}
